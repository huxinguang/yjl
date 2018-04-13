/**
 * Created by Administrator on 2017/7/4.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {CheckBox, color, EditText, icon} from '../../widget/';
import {get} from '../../api';
import StorageUtil from '../../common/StorageUtil';
import {GlobalKey, GlobalValue} from '../../Global';

class Login extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>登录</Text>
        ),
        headerRight: (
            <View/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    static propTypes = {
        navigation: PropTypes.object
    };

    state: { uiUpdate: boolean };

    username: string;
    password: string;
    bid: string;
    block: string;
    autoLogin: boolean;

    constructor(props) {
        super(props);

        this.state = {};

        this.username = '';
        this.password = '';
        this.bid = '';
        this.autoLogin = false;

        (this: any).login = this.login.bind(this);
        (this: any).forgotPassword = this.forgotPassword.bind(this);
        (this: any).register = this.register.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        let _this = this;
        StorageUtil.selectObjectForKey([GlobalKey.AUTO_LOGIN, GlobalKey.BLOCK_ID, GlobalKey.BLOCK_NAME, GlobalKey.USER_ACCOUNT, GlobalKey.USER_PWD], function (dict) {
            _this.autoLogin = dict[GlobalKey.AUTO_LOGIN];
            _this.bid = dict[GlobalKey.BLOCK_ID];
            _this.block = dict[GlobalKey.BLOCK_NAME];
            // 得到UserName
            _this.username = dict[GlobalKey.USER_ACCOUNT];
            _this.password = dict[GlobalKey.USER_PWD];
            // 刷新
            _this.setState({uiUpdate: !_this.state.uiUpdate});
        });

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: 'white'}} onPress={() => {
                    let _this = this;
                    this.props.navigation.navigate('AreaSelection', {
                        getBlock(item) {
                            _this.bid = item.id;
                            _this.block = item.block;
                            _this.setState({uiUpdate: !_this.state.uiUpdate});
                        }
                    });
                }}>
                    <Text style={{fontSize: 16, marginLeft: 10}}>选择小区</Text>
                    <View style={{flex: 1}}/>
                    <Text style={{fontSize: 16}}>{this.block}</Text>
                    <Text style={{marginLeft: 10, marginRight: 10, fontSize: 16, fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>

                <View style={styles.inputview}>
                    <EditText iconLeft={'phone'} inlineImagePadding={8} underlineColorAndroid='transparent' style={styles.textinput} defaultValue={this.username}
                        placeholder='输入手机号' onChangeText={(text) => {
                            this.username = text;
                        }}/>
                    <View style={styles.dividerview}>
                        <Text style={styles.divider}/>
                    </View>
                    <EditText iconLeft={'password'} inlineImagePadding={8} underlineColorAndroid='transparent' style={styles.textinput} defaultValue={this.password}
                        placeholder='密码(6-16位字符)' secureTextEntry={true} onChangeText={(text) => {
                            this.password = text;
                        }}/>
                </View>
                <CheckBox style={{marginTop: 10, paddingLeft: 10}} title='自动登录' checkedUri={require('../../img/Mine/checked.png')}
                    uncheckedUri={require( '../../img/Mine/unchecked.png')} checked={this.autoLogin} onPress={(isChecked) => {
                        StorageUtil.storageSave('autoLogin', isChecked);
                    }}/>
                <View>
                    <TouchableOpacity style={styles.buttonview} onPress={() => {
                        this.login && this.login();
                    }}>
                        <Text style={styles.logintext}>登 录</Text>
                    </TouchableOpacity>
                    <View style={styles.bottombtnsview}>
                        <TouchableOpacity style={styles.bottomleftbtnview} onPress={() => {
                            this.forgotPassword && this.forgotPassword();
                        }}>
                            <Text style={styles.bottombtn}>忘记密码？</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomrightbtnview} onPress={() => {
                            this.register && this.register();
                        }}>
                            <Text style={styles.bottombtn}>立即注册&gt;</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    login() {
        if (!this.checkInput()) {
            return;
        }
        let _this = this;
        const paramMap = {'service': 'User.Login', 'time': (new Date()).valueOf(), 'uname': this.username, 'password': this.password, 'bid': this.bid};
        get(paramMap, function (data) {
            let userInfo = data.info;
            let block_info = data.block_info;
            GlobalValue.userInfo = userInfo;
            GlobalValue.blockInfo = block_info;
            StorageUtil.storageSave(GlobalKey.USER_INFO, userInfo);
            StorageUtil.storageSave(GlobalKey.BLOCK_INFO, block_info);
            StorageUtil.storageSave(GlobalKey.USER_ID, userInfo.uid);
            StorageUtil.storageSave(GlobalKey.USER_TOKEN, userInfo.token);
            StorageUtil.storageSave(GlobalKey.USER_ACCOUNT, _this.username);
            StorageUtil.storageSave(GlobalKey.USER_PWD, _this.password);
            StorageUtil.storageSave(GlobalKey.BLOCK_ID, block_info.id);
            StorageUtil.storageSave(GlobalKey.BLOCK_NAME, block_info.block);
            StorageUtil.storageSave(GlobalKey.BLOCK_TAG, block_info.tag);
            StorageUtil.storageSave(GlobalKey.BLOCK_MALL, block_info.mall);
            StorageUtil.storageSave(GlobalKey.BLOCK_WORK_TIME, block_info.work_time);
            GlobalValue.userId = userInfo.uid;
            GlobalValue.userToken = userInfo.token;
            GlobalValue.block = block_info.tag;
            GlobalValue.blockId = block_info.id;

            //redux中action的type参数（固定参数，必须有）用于标识需要被执行的action的类型以便reducers识别，type通常为一个字符串常量。参见https://redux.js.org/basics/actions
            const action = {
                type: 'LOGGED_IN',
                payload: {
                    id: userInfo.uid,
                    name: _this.username,
                    sharedSchedule: 0,
                },
            };

            //为什么要这样写 => in a connected component you usually don’t have access to the store itself, but get either dispatch() or specific action creators injected as props
            _this.props.dispatch(action);

            const backAction = NavigationActions.back({
                // key: 'Login'
            });
            _this.props.navigation.dispatch(backAction);
        }, function (error) {
            console.log('data is error' + error);
        });
    }

    checkInput() {
        if (this.bid === '') {
            alert('请先选择小区');
            return false;
        }
        if (this.username === '') {
            alert('请输入手机号');
            return false;
        }
        if (this.password === '') {
            alert('请输入密码');
            return false;
        }
        return true;
    }

    forgotPassword() {
        alert('forgotPassword');
    }

    register() {
        alert('register');
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    header: {
        height: 50,
        backgroundColor: '#12B7F5',
        justifyContent: 'center',
    },
    headtitle: {
        alignSelf: 'center',
        fontSize: 20,
        color: '#ffffff',
    },
    avatarview: {
        height: 150,
        backgroundColor: '#ECEDF1',
        justifyContent: 'center',
    },
    avatarimage: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    marginTopview: {
        height: 15,
        backgroundColor: '#F7F7F9'
    },
    inputview: {
        height: 100,
        marginTop: 10,
        backgroundColor: 'white'
    },
    textinput: {
        flex: 1,
        fontSize: 16,
    },
    dividerview: {
        flexDirection: 'row',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ECEDF1'
    },
    bottomview: {
        backgroundColor: '#ECEDF1',
        flex: 1,
    },
    buttonview: {
        backgroundColor: '#1DBAF1',
        margin: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logintext: {
        fontSize: 17,
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
    },
    emptyview: {
        flex: 1,
    },
    bottombtnsview: {
        flexDirection: 'row',
    },
    bottomleftbtnview: {
        flex: 1,
        paddingLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    bottomrightbtnview: {
        flex: 1,
        paddingRight: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    bottombtn: {
        fontSize: 15,
        color: '#1DBAF1',
    }
});

//connect函数是由react-redux提供的。使用它可以包装普通的展示组件，然后返回一个容器组件。
//connect它是一个柯里化函数，意思是先接受两个参数（数据绑定mapStateToProps和事件绑定mapDispatchToProps），再接受一个参数（将要绑定的组件本身）
module.exports = connect()(Login);