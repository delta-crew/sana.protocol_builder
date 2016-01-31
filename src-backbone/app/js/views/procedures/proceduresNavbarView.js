const EventKeys = require('utils/eventKeys');


module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/proceduresNavbarView'),

    tagName: 'div',

    className: 'container-fluid spb-container',

    onShow: function() {
        const welcomeMessage = 'Welcome Trinovantes'; // TODO fetch username from server

        // Do this after View is shown so that rootLayoutView can find
        // p.navbar-text inside this View
        this.triggerMethod(EventKeys.UPDATE_NAVBAR_TEXT, welcomeMessage);
    },

});
