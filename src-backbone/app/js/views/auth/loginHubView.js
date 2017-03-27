let App = require('utils/sanaAppInstance');
let Config = require('utils/config');
let LoginView = require('views/auth/loginView');


module.exports = LoginView.extend({
    behaviors: {
        AuthFormBehavior: {
            onAuthenticate: function (formData, serverErrorHandler, networkErrorHandler) {
                App().session.login(
                    formData, serverErrorHandler, networkErrorHandler, Config.HUB_URL);
            },
        }
    },
});
