/*
const App                       = require('utils/sanaAppInstance');
const Helpers                   = require('utils/helpers');
const SettingsLayoutView        = require('views/settings/settingsLayoutView');
const AccountSettingsView       = require('views/settings/accountSettingsView');
const MdsSettingsView           = require('views/settings/mdsSettingsView');


module.exports = Marionette.Controller.extend({

    routeIndex: function() {
        Helpers.navigateToDefaultLoggedOut();
    },

    routeAccountSettings: function() {
        Helpers.arrivedOnView('Account Settings');

        let settingsLayoutView = new SettingsLayoutView();
        App().RootView.switchMainView(SettingsLayoutView);
        settingsLayoutView.showChildView('settingsFormArea', new AccountSettingsView());
    },

    routeMdsSettings: function() {
        Helpers.arrivedOnView('Account Settings');

        let settingsLayoutView = new SettingsLayoutView();
        App().RootView.switchMainView(SettingsLayoutView);
        settingsLayoutView.showChildView('settingsFormArea', new MdsSettingsView());
    },

});
*/
