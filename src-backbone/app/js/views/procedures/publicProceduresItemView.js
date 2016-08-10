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
                console.log("Fork successful");
            })
            .fail(function(jqXHR, status, error) {
                console.log("Fork failed");
            });
    }
});
