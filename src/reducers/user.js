'use strict';

import type {Action} from '../actions/types';

export type State = {
  isLoggedIn: boolean;
  hasSkippedLogin: boolean;
  sharedSchedule: ?boolean;
  id: ?string;
  name: ?string;
};

const initialState = {
    isLoggedIn: false,
    hasSkippedLogin: false,
    sharedSchedule: null,
    id: null,
    name: null,
};

/*
* reducer是一个匹配函数，action的发送是全局的：所有的reducer都可以捕捉到并匹配与自己相关与否，
* 相关就拿走action中的要素进行逻辑处理，修改store中的状态，不相关就不对state做处理原样返回。
*
* 即接收 previousState 和 action 两个参数，根据 action 中携带的信息对 previousState 做出相应的处理，并返回一个新的 state。
* */
function user(state: State = initialState, action: Action) : State {
    if (action.type === 'LOGGED_IN') {
        let {id, name, sharedSchedule} = action.payload;
        if (sharedSchedule === undefined) {
            sharedSchedule = null;
        }
        return {
            isLoggedIn: true,
            hasSkippedLogin: false,
            sharedSchedule,
            id,
            name,
        };
    }
    if (action.type === 'SKIPPED_LOGIN') {
        return {
            isLoggedIn: false,
            hasSkippedLogin: true,
            sharedSchedule: null,
            id: null,
            name: null,
        };
    }
    if (action.type === 'LOGGED_OUT') {
        return initialState;
    }
    if (action.type === 'SET_SHARING') {
        return {
            ...state,
            sharedSchedule: action.enabled,
        };
    }
    if (action.type === 'RESET_NUXES') {
        return {...state, sharedSchedule: null};
    }
    return state;
}

module.exports = user;
