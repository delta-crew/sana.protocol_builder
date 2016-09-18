let Procedure = require('models/procedure');


module.exports = Backbone.Collection.extend({

    model: Procedure,

    url: '/api/procedures?only_return_id=true',

    constructor: function(models, options) {
        this.setAscOrder(false);
        this.setComparatorKey('last_modified');

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    setComparatorKey: function(key) {
        console.info('Procedure Comparator Key: ' + key);
        this._comparatorKey = key;
    },

    setAscOrder: function(isAsc) {
        console.info('Procedure Sort Asc: ' + isAsc);
        this._isAsc = isAsc;
    },

    getComparatorKey: function() {
        return this._comparatorKey;
    },

    getOrderName: function() {
        return (this._isAsc ? 'asc' : 'desc');
    },

    getOrderSymbol: function() {
        return (this._isAsc ? '' : '-');
    },

});
