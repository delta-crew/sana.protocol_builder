let PublicProcedures = require('collections/publicProcedures');

let ProceduresLayoutView = require('views/procedures/proceduresLayoutView');
let PublicProceduresCollectionView = require('views/procedures/publicProceduresCollectionView');

module.exports = ProceduresLayoutView.extend({
    collectionView: PublicProceduresCollectionView,

    template: require('templates/procedures/publicProceduresLayoutView'),

    initialize: function() {
        this.procedures = new PublicProcedures();
    },

    events: {
        'keyup @ui.procedureFilterInput': '_filterProcedures',

        'click a#sort-by-title': '_changeSortKey',
        'click a#sort-by-author': '_changeSortKey',
        'click a#sort-by-last-modified': '_changeSortKey',
        'click a#sort-by-fork-count': '_changeSortKey',

        'click a#asc-order': '_changeSortOrder',
        'click a#desc-order': '_changeSortOrder',
    },
});
