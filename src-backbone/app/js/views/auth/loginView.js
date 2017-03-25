let App = require('utils/sanaAppInstance');


module.exports = Marionette.ItemView.extend({

    template: require('templates/auth/loginView'),

    behaviors: {
        AuthFormBehavior: {
            onAuthenticate: function (formData, serverErrorHandler, networkErrorHandler) {
                App().session.login(formData, serverErrorHandler, networkErrorHandler);
            },
        }
    },

    ui: {
        rememberMeCheckbox: 'input#remember-me',
    },

    events: {
        'change @ui.rememberMeCheckbox': '_onRememberChanged',
    },

    templateHelpers: function() {
        return {
            remember: function() {
                return App().storage.isPersistent;
            }
        };
    },

    _onRememberChanged: function() {
        let remember = this.ui.rememberMeCheckbox.is(':checked');
        if (remember) {
            App().storage.changeExpiryTime(Infinity);
        } else {
            App().storage.changeExpiryTime(0);
        }
    },

});
