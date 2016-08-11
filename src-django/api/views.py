from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from django.contrib.auth.models import User
from django.db.utils import DatabaseError
from django.db.models import Q
from postgres_copy import CopyMapping
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.cache import cache
from generator import ProtocolBuilder
from mailer import templater, tasks
from rest_hooks.models import Hook
import models
import json
import os
import serializer
import uuid


class ProcedureViewSet(viewsets.ModelViewSet):
    model = models.Procedure

    def get_queryset(self):
        user = self.request.user
        request_flag = 'public'
        if self.request.GET.get(request_flag) == 'true':
            return models.Procedure.objects.filter(is_public=True)
        return models.Procedure.objects.filter(owner=user)

    def get_serializer_class(self):
        request_flag = 'only_return_id'
        if self.request.GET.get(request_flag) == 'true':
            return serializer.ProcedureSerializer
        return serializer.ProcedureDetailSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @detail_route(methods=['get'])
    def generate(self, request, pk=None):
        try:
            protocol = ProtocolBuilder.generate(request.user, pk)
        except ValueError as e:
            return HttpResponseBadRequest(str(e))

        response = HttpResponse(protocol, content_type='application/xml')
        response['Content-Disposition'] = 'attachment; filename="procedure.xml"'

        return response

    @detail_route(methods=['POST'])
    def fork(self, request, pk=None):
        user = self.request.user
        original = models.Procedure.objects \
            .filter(Q(public=True) | Q(owner=user)) \
            .get(pk=pk)

        copy = models.Procedure()
        copy.owner = user
        copy.fork_of_id = original.pk
        copy.title = original.title
        copy.author = original.author
        if original.originator == None:
            copy.originator = original.owner
        else:
            copy.originator = original.originator
        copy.save()

        for page in original.pages.all():
            elements = page.elements.all()
            page.pk = None
            page.procedure = copy
            page.save()

            for element in elements:
                element.pk = None
                element.page = page
                element.save()

        serializer = self.get_serializer_class()
        serialized = serializer(copy)
        data = serialized.data

        return Response(data)


class UserViewSet(viewsets.ModelViewSet):
    model = User
    queryset = User.objects.all()
    serializer_class = serializer.UserSerializer
    allowed_changes = ['first_name', 'last_name', 'email', 'password']

    def json_msg(self, key, message):
        return json.dumps({key: [message]})

    def error_response(self, response_status, msg):
        return JsonResponse(
            status=response_status,
            data={
                'errors': [msg],
            })

    @list_route(methods=['patch'])
    def update_mds(self, request):
        if not request.body:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'There was nothing submitted')

        body = json.loads(request.body)
        user = User.objects.get(auth_token=body['auth'])

        # TODO can we not just listen to procedure.*?
        # May not be an option cause you are supposed to be able to unsubscribe
        # to each event individually...
        if 'mds_link' in body and body['mds_link']:
            Hook.objects.filter(user=user).delete()

            for event in ['procedure.added','procedure.changed','procedure.removed']:
                    hook = Hook(
                            user=user,
                            event=event,
                            target=body['mds_link'])
                    hook.save()

        user_details = {
            'id': user.pk,
            'is_superuser': user.is_superuser,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email,
        }

        return JsonResponse({'user': user_details})

    @list_route(methods=['patch'])
    def update_details(self, request):
        if not request.body:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'There was nothing submitted')

        body = json.loads(request.body)
        user = User.objects.get(auth_token=body['auth'])

        if 'current-password' not in body:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'No password provided')

        if not user.check_password(body['current-password']):
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                "The password provided isn't correct.")

        # Need to explicitly set password to have Django hash it
        if 'password' in body and body['password']:
            user.set_password(str(body['password']))
            body.pop('password', None)
            user.save()

        serializer = self.get_serializer(
            instance=user,
            data=body,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        user_details = {
            'id': user.pk,
            'is_superuser': user.is_superuser,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email,
        }

        return JsonResponse({'user': user_details})


class UserPasswordViewSet(viewsets.GenericViewSet):
    model = User
    queryset = User.objects.all()
    serializer_class = serializer.UserSerializer
    authentication_classes = (())
    permission_classes = (())
    PASSWORD_RESET_EXPIRY = 86400*2  # 2 days

    def error_response(self, response_status, msg):
        return JsonResponse(
            status=response_status,
            data={
                'errors': [msg],
            })

    @list_route(methods=['POST'])
    def reset_password(self, request):
        if not request.body:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'No body in request')

        body = json.loads(request.body)

        if ('email' not in body):
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'Email is missing!')

        try:
            user = User.objects.get(email=body['email'])
        except:
            return self.error_response(
                status.HTTP_404_NOT_FOUND,
                'No one by that email exists')

        token = PasswordResetTokenGenerator().make_token(user)
        url_base = "https://sanaprotocolbuilder.me/"
        url = "{base}/resetpassword/{token}".format(base=url_base, token=token)

        env = templater.get_environment('api', 'templates')
        template = env.get_template('password_reset_template')
        email = template.render(first_name=user.first_name, link=url)

        tasks.send_email.delay(user.email, 'Reset Your Password', email)

        cache.set(token, user.email, self.PASSWORD_RESET_EXPIRY)
        if cache.get(token) == user.email:
            return HttpResponse(status=status.HTTP_201_CREATED)
        else:
            return self.error_response(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                'Something went wrong, please try again')

    @list_route(methods=['POST'])
    def reset_password_complete(self, request):
        if not request.body:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST, '')

        body = json.loads(request.body)

        if 'new_password' not in body:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'New password is missing')
        elif 'password_confirmation' not in body:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'Password confirmation is missing')
        elif body['new_password'] != body['password_confirmation']:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                "The passwords don't match!")

        reset_token = body['reset_token']

        email = cache.get(reset_token)

        try:
            user = User.objects.get(email=email)
        except:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'Invalid or expired token!')

        if user is not None:
            user.set_password(body['new_password'])
            user.save()
            cache.delete(reset_token)
            return HttpResponse(status=status.HTTP_200_OK)
        else:
            return self.error_response(
                status.HTTP_400_BAD_REQUEST,
                'The email token has expired. Please reset your password again')


class PageViewSet(viewsets.ModelViewSet):
    serializer_class = serializer.PageSerializer
    model = models.Page

    def get_queryset(self):
        user = self.request.user
        return models.Page.objects.filter(procedure__owner_id__exact=user.id)

    @list_route(methods=['PATCH'])
    def partial_bulk_update(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if not request.body:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(
            instance=queryset,
            data=json.loads(request.body),
            many=True,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ElementViewSet(viewsets.ModelViewSet):
    model = models.Element
    serializer_class = serializer.ElementSerializer

    def get_queryset(self):
        user = self.request.user
        return models.Element.objects.filter(page__procedure__owner_id__exact=user.id)


class ConceptViewSet(viewsets.ModelViewSet):
    CSV_COLUMN_MAPPING = {
        "created": "created",
        "last_modified": "modified",
        "uuid": "uuid",
        "name": "name",
        "display_name": "display_name",
        "description": "description",
        "data_type": "datatype",
        "mime_type": "mimetype",
        "constraint": "constraint"
    }

    model = models.Concept
    queryset = models.Concept.objects.all()
    serializer_class = serializer.ConceptSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('display_name', 'name')

    @list_route(methods=['POST'])
    def import_csv(self, request):
        if 'csv' not in request.FILES:
            return JsonResponse(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'success': False,
                    'errors': ["Missing 'csv' parameter"]
                }
            )

        csv = request.FILES['csv']

        file_path = "/tmp/{0}.csv".format(str(uuid.uuid4()))

        with open(file_path, 'wb+') as destination:
            for chunk in csv.chunks():
                destination.write(chunk)

        try:
            copy_mapping = CopyMapping(
                models.Concept,
                file_path,
                ConceptViewSet.CSV_COLUMN_MAPPING
            )
            copy_mapping.save()
        except (ValueError, DatabaseError):
            expected_columns = ', '.join(ConceptViewSet.CSV_COLUMN_MAPPING.keys())
            return JsonResponse(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'success': False,
                    'errors': ['CSV import error. Expected columns are {0}'.format(expected_columns)]
                }
            )
        finally:
            os.remove(file_path)

        return JsonResponse({
            'success': True,
        })


class ShowIfViewSet(viewsets.ModelViewSet):
    model = models.ShowIf
    serializer_class = serializer.ShowIfSerializer

    def get_queryset(self):
        user = self.request.user
        return models.ShowIf.objects.filter(page__procedure__owner_id__exact=user.id)
