
/*
 * action types
 */
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';


/*
 * action creators
 */
export function loggedIn(payload:{ id: string; name: string;}) {
    return {type:LOGGED_IN,payload};
}

export function loggedOut() {
    return {type:LOGGED_OUT};
}

