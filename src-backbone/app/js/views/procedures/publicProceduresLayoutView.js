let PublicProcedures = require('collections/publicProcedures');

let ProceduresLayoutView = require('views/procedures/proceduresLayoutView');
let PublicProceduresCollectionView = require('views/procedures/publicProceduresCollectionView');

module.exports = ProceduresLayoutView.extend({
    collectionView: PublicProceduresCollectionView,

    template: require('templates/procedures/publicProceduresLayoutView'),

    initialize: function() {
        this.procedures = new PublicProcedures();
    },
});
