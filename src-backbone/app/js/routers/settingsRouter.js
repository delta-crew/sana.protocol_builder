let SettingsController = require('controllers/settingsController');

module.exports = Marionette.AppRouter.extend({

    constructor : function (options) {
        this.controller = new SettingsController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'settings/account'     : 'routeAccountSettings',
        'settings/mds'         : 'routeMdsSettings',
    },

});
