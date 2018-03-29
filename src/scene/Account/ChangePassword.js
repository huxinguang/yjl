/**
 * Created by Administrator on 2017/7/4.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {color, EditText} from '../../widget/';
import {get} from '../../api';
import StorageUtil from '../../common/StorageUtil';
import {GlobalKey} from '../../Global';

class ChangePassword extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>修改密码</Text>
        ),
        headerRight: (
            <View/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    static propTypes = {
        navigation: PropTypes.object
    };

    oldPassword: string;
    newPassword: string;
    confirmPassword: string;

    constructor(props) {
        super(props);

        this.state = {};

        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        (this: any).changePwd = this.changePwd.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{height: 150, backgroundColor: 'white'}}>
                    <EditText iconLeft={'password'} inlineImagePadding={8} underlineColorAndroid='transparent' style={styles.textinput} defaultValue={this.username}
                        placeholder='您的原密码' onChangeText={(text) => {
                            this.oldPassword = text;
                        }}/>
                    <View style={styles.dividerview}>
                        <Text style={styles.divider}/>
                    </View>
                    <EditText iconLeft={'password'} inlineImagePadding={8} underlineColorAndroid='transparent' style={styles.textinput} defaultValue={this.password}
                        placeholder='您的新密码(6-16位字符)' secureTextEntry={true} onChangeText={(text) => {
                            this.newPassword = text;
                        }}/>
                    <View style={styles.dividerview}>
                        <Text style={styles.divider}/>
                    </View>
                    <EditText iconLeft={'password'} inlineImagePadding={8} underlineColorAndroid='transparent' style={styles.textinput} defaultValue={this.password}
                        placeholder='确认新密码(6-16位字符)' secureTextEntry={true} onChangeText={(text) => {
                            this.confirmPassword = text;
                        }}/>
                </View>
                <TouchableOpacity style={styles.buttonview} onPress={() => {
                    this.changePwd && this.changePwd();
                }}>
                    <Text style={styles.commitText}>提 交</Text>
                </TouchableOpacity>
            </View>
        );
    }

    changePwd() {
        if (!this.checkInput()) {
            return;
        }
        let _this = this;
        const paramMap = {'service': 'User.Edit_password', 'time': (new Date()).valueOf(), 'old_password': this.oldPassword, 'password': this.newPassword};
        get(paramMap, function (data) {
            if (data.msg) {
                alert(data.msg);
            }
            StorageUtil.storageSave(GlobalKey.USER_PWD, _this.newPassword);

            const backAction = NavigationActions.back({
                // key: 'Login'
            });
            _this.props.navigation.dispatch(backAction);
        }, function (error) {
            console.log('data is error' + error);
        });
    }

    checkInput() {
        if (this.oldPassword === '') {
            alert('请输入原密码');
            return false;
        }
        if (this.newPassword === '') {
            alert('请输入新密码');
            return false;
        }
        if (this.confirmPassword === '') {
            alert('请确认新密码');
            return false;
        }
        if (this.newPassword !== this.confirmPassword) {
            alert('两次输入新密码不一致');
            return false;
        }
        return true;
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
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
    buttonview: {
        backgroundColor: '#1DBAF1',
        margin: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commitText: {
        fontSize: 17,
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
    },
});

export default ChangePassword;