let InfoController = require('controllers/infoController');


module.exports = Marionette.AppRouter.extend({
  
    constructor : function (options) {
        this.controller = new InfoController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'terms'   : 'routeTermsOfService',
        'privacy' : 'routePrivacyPolicy',
        'credits' : 'routeCredits',
    },

});
