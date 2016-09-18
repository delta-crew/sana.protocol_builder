let Procedures = require('collections/procedures');

module.exports = Procedures.extend({
    url: '/api/procedures?public=true',

    constructor: function(models, options) {
        this.setAscOrder(false);
        this.setComparatorKey('fork_count');

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },
});
