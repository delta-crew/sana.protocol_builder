module.exports = {

    DEBUG: <%= DEBUG %>,

    INPUT_DELAY_BEFORE_SAVE: 500, // in milliseconds

    SITE_TITLE: 'Sana Protocol Builder',

    APP_NAMESPACE: 'spb',

    SANA_NAMESPACE: 'sana',

    API_BASE: '<%= API_BASE %>',

    COOKIE_DOMAIN: '<%= COOKIE_DOMAIN %>',

    HUB_URL: '<%= HUB_URL %>',

    HUB_API_URL: '<%= HUB_API_URL %>',

    LOCALES_SUPPORTED: [
        {
            code: 'en',
            name: 'English',
        },
        // {
        //     code: 'fr',
        //     name: 'Français',
        // }
    ],

    DEFAULT_LOCALE: 'en',

    NON_AUTH_PAGES: [
        'login',
        'signup',
        'terms',
        'privacy',
        'credits',
        'resetpassword',
        'resetpasswordcomplete',
    ],

    ELEMENT_TYPES: [
        'DATE',
        'ENTRY',
        'SELECT',
        'MULTI_SELECT',
        'RADIO',
        'PICTURE',
        'PLUGIN',
        'ENTRY_PLUGIN',
    ],

    CHOICE_ELEMENT_TYPES: [
        'SELECT',
        'MULTI_SELECT',
        'RADIO',
    ],

    PLUGIN_ELEMENT_TYPES: [
        'PLUGIN',
        'ENTRY_PLUGIN',
    ],

    MAX_CONDITIONAL_DEPTH: 3, // i.e. max number of logical connective nesting

};
