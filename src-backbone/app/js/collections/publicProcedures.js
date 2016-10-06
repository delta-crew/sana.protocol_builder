let Procedures = require('collections/procedures');

module.exports = Procedures.extend({

    constructor: function(models, options) {
        this.setAscOrder(false);
        this.setComparatorKey('fork_count');
        this.limit = 10;
        this.url = '/api/procedures?public=true&limit=' + this.limit;

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },
});
