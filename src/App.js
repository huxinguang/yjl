'use strict';

import React from 'react';
import RootScene from './RootScene';

import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import SplashScreen from 'rn-splash-screen';
import system from './common/system';

class App extends React.Component {
    state: {
        isLoading: boolean;
        store: any;
    };

    constructor() {
        super();
        this.state = {
            isLoading: true,
            store: configureStore(() => this.setState({isLoading: false})),
        };
    }

    componentDidMount(){
        //隐藏闪屏页,闪屏页用的是第三方库，rn-splash-screen
        setTimeout(() => {
            SplashScreen.hide();
        }, 2000);
    }

    render() {
        if (this.state.isLoading) {
            return null;
        }
        global.store = this.state.store;
        return (
            <Provider store={this.state.store}>
                <RootScene/>
            </Provider>
        );
    }
}

global.LOG = (...args) => {
    console.log('/------------------------------\\');
    console.log(...args);
    console.log('\\------------------------------/');
    return args[args.length - 1];
};

module.exports = App;
