'use strict';

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {autoRehydrate, persistStore} from 'redux-persist';
import {createLogger} from 'redux-logger';

let promise = require('./promise');
let array = require('./array');
// let analytics = require('./analytics');
let reducers = require('../reducers');

let {AsyncStorage} = require('react-native');

let isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

let logger = createLogger({
    predicate: (getState, action) => isDebuggingInChrome,
    collapsed: true,
    duration: true,
});

let createAppStore = applyMiddleware(thunk, promise, array, logger)(createStore);

function configureStore(onComplete: ?() => void) {
    // TODO(frantic): reconsider usage of redux-persist, maybe add cache breaker
    const store = autoRehydrate()(createAppStore)(reducers);
    persistStore(store, {storage: AsyncStorage}, onComplete);
    if (isDebuggingInChrome) {
        window.store = store;
    }
    return store;
}

module.exports = configureStore;
