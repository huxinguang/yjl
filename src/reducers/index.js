'use strict';

let {combineReducers} = require('redux');

module.exports = combineReducers({
    user: require('./loginout'),
});
