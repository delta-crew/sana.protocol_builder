let App = require('utils/sanaAppInstance');
let ProceduresItemView = require('views/procedures/proceduresItemView');

module.exports = ProceduresItemView.extend({
    template: require('templates/procedures/publicProceduresItemView'),

    events: {
        'click a.download': '_onDownloadProcedure',
        'click a.save': '_onSaveProcedure',
    },

    _onSaveProcedure: function(event) {
        this.model.fork()
            .done(function(data, status, jqXHR) {
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'Your new procedure is on the My Procedures page',
                    alertType: 'success',
                });
                console.log("Fork successful");
            })
            .fail(function(jqXHR, status, error) {
                App().RootView.showNotification('Failed to fork the procedure!');
                console.log("Fork failed");
            });
    }
});
