'use strict';

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {autoRehydrate, persistStore} from 'redux-persist';
import {createLogger} from 'redux-logger';

let reducers = require('../reducers');
let {AsyncStorage} = require('react-native');

// let createAppStore = applyMiddleware(thunk, promise, array, logger)(createStore);
let createAppStore = applyMiddleware(thunk)(createStore);//第一个括号里的参数表示中间件（可以有多个中间件）

function configureStore(onComplete: ?() => void) {
    // TODO(frantic): reconsider usage of redux-persist, maybe add cache breaker
    const store = autoRehydrate()(createAppStore)(reducers);
    persistStore(store, {storage: AsyncStorage}, onComplete);
    return store;
}

module.exports = configureStore;
