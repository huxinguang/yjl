
/*
 * action types
 */
export const APP_INTRO = 'APP_INTRO';//引导图
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';



/*
 * action creators
 * action的type参数（固定参数，必须有）用于标识需要被执行的action的类型以便reducers识别，type通常为一个字符串常量。参见https://redux.js.org/basics/actions
 */

export function appIntro() {
    return {type:APP_INTRO};
}

export function login(payload:{ id: string; name: string;}) {
    return {type:LOG_IN,payload};
}

export function logout() {
    return {type:LOG_OUT};
}

