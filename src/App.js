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
            /*
            * Provider是一个react-redux的一个组件，可以作为顶层app的分发点,它只需要store属性就可以了。
            * 它会将state分发给所有被connect的组件（不管它在哪里，被嵌套多少层），思想是：顶层分发状态，让React组件被动地渲染
            * */
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
