let ProceduresCollectionView = require('./proceduresCollectionView');
let PublicProceduresItemView = require('./publicProceduresItemView');

module.exports = ProceduresCollectionView.extend({
    childView: PublicProceduresItemView,
});
