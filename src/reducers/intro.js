'use strict';

import {APP_INTRO} from '../actions/actions';

export type State = {
    launched:boolean;
};

const initialState = {
    launched: false
};

function intro(state: State = initialState, action: Action) : State {
    switch (action.type){
        case APP_INTRO:
            return {launched: true};
        default:
            return state;
    }
}

module.exports = intro;