let App = require('utils/sanaAppInstance');


module.exports = Marionette.ItemView.extend({
    template: require('templates/settings/mdsSettingsView'),

    ui: {
        form: 'form'
    },

    events: {
        'submit': 'onSubmit'
    },

    initialize: function() {
        this.model = App().session.user;
    },

    onSubmit: function(event) {
        event.preventDefault();

        let self = this;
        let $form = this.ui.form;

        App().session.user.updateMds($form.serializeArray());
    },

});
