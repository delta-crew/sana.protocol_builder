let Config = require('utils/config');
let Procedure = require('models/procedure');


module.exports = Backbone.Collection.extend({

    model: Procedure,

    url: function() {
        return this.url;
    },

    constructor: function(models, options) {
        this.setAscOrder(false);
        this.setComparatorKey('last_modified');
        this.limit = 10;
        this.next = null;
        this.prev = null;
        this.total = 0;
        this.url = '/api/procedures?only_return_id=true&limit=' + this.limit;

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    parse: function(resp) {
        this.next = resp.next;
        this.prev = resp.previous;
        this.total = resp.count;
        return resp.results;
    },

    nextPage: function() {
        if (this.next !== null) {
            this.url = this.next.replace(Config.API_BASE, '');
        }
    },

    previousPage: function() {
        if (this.prev !== null) {
            this.url = this.prev.replace(Config.API_BASE, '');
        }
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
