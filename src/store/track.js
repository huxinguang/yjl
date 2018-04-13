'use strict';

const Parse = require('parse/react-native');
const {AppEventsLogger} = require('react-native-fbsdk');

import type {Action} from '../actions/types';

function track(action: Action): void {
    switch (action.type) {
    case 'LOGGED_IN':
        AppEventsLogger.logEvent('Login', 1, {source: action.source || ''});
        break;

    case 'LOGGED_OUT':
        AppEventsLogger.logEvent('Logout', 1);
        break;

    case 'SKIPPED_LOGIN':
        AppEventsLogger.logEvent('Skip login', 1);
        break;

    case 'TURNED_ON_PUSH_NOTIFICATIONS':
        AppEventsLogger.logEvent('Enabled Push', 1);
        break;

    case 'SKIPPED_PUSH_NOTIFICATIONS':
        AppEventsLogger.logEvent('Disabled Push', 1);
        break;
    }

}

module.exports = track;
