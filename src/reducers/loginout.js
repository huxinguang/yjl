'use strict';

import {LOGGED_IN,LOGGED_OUT} from '../actions/actions';

export type State = {
  isLoggedIn: boolean;
  hasSkippedLogin: boolean;
  id: ?string;
  name: ?string;
};

const initialState = {
    isLoggedIn: false,
    hasSkippedLogin: false,
    id: null,
    name: null,
};

/*
* reducer是一个匹配函数，action的发送是全局的：所有的reducer都可以捕捉到并匹配与自己相关与否， 相关就拿走action中的要素进行逻辑处理，修改store中的状态，不相关就不对state做处理原样返回。
* 即接收 previousState 和 action 两个参数，根据 action 中携带的信息对 previousState 做出相应的处理，并返回一个新的 state。
* */
function loginout(state: State = initialState, action: Action) : State {
    switch (action.type){
        case LOGGED_IN:
            return {
                isLoggedIn: true,
                hasSkippedLogin: false,
                id:action.payload.id,
                name:action.payload.name
            };
        case LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
}

module.exports = loginout;
