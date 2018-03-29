/**
 * Created by Administrator on 2017/6/26.
 */

'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {color, icon} from '../../widget';
import {GlobalValue} from '../../Global';

class NeighborScene extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>{GlobalValue.blockInfo && GlobalValue.blockInfo.block}</Text>
        ),
        headerStyle: {backgroundColor: color.theme},
    });


    state: {
        pc: string,
        ll: string,
        ljfb: string,
        fwzj: string,
    };

    constructor(props) {
        super(props);
        this.state = {
            pc: '1',
            ll: '2',
            ljfb: '3',
            fwzj: '4'
        };

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <TouchableOpacity
                        style={[styles.bigModule, {backgroundColor: '#00bfff'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('pinche');
                        }}>
                        <Text style={styles.icon}> {icon('pinche')}</Text>
                        <View style={[styles.badge, {opacity: this.state.pc === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.pc}
                            </Text>
                        </View>
                        <Text style={styles.bigModuleTitle}>{'拼车'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bigModule, {backgroundColor: '#32cd32'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('liaoliao');
                        }}>
                        <Text style={styles.icon}> {icon('phone')}</Text>
                        <View style={[styles.badge, {opacity: this.state.ll === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.ll}
                            </Text>
                        </View>
                        <Text style={styles.bigModuleTitle}>{'聊聊'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.center}>
                    <TouchableOpacity
                        style={[styles.bigModule, {backgroundColor: '#f4a460'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('linjufabu');
                        }}>
                        <Text style={styles.icon}> {icon('phone')}</Text>
                        <View style={[styles.badge, {opacity: this.state.ljfb === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.ljfb}
                            </Text>
                        </View>
                        <Text style={styles.bigModuleTitle}>{'邻居发布'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bigModule, {backgroundColor: '#4682b4'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('fangwuzhongjie');
                        }}>
                        <Text style={styles.icon}> {icon('phone')}</Text>
                        <View style={[styles.badge, {opacity: this.state.fwzj === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.fwzj}
                            </Text>
                        </View>
                        <Text style={styles.bigModuleTitle}>{'房屋中介'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity
                        style={[styles.smallModule, {backgroundColor: '#00bfff'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('bianmindianhua');
                        }}>
                        <Text style={styles.icon}> {icon('bmdh')}</Text>
                        <Text style={styles.smallModuleTitle}>{'便民电话'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onPressButton(moduleName: string) {
        if (!this.props.isLoggedIn) {
            this.props.navigation.navigate('Login', {});
            return;
        } else if (GlobalValue.userInfo.attestation === 0) {
            alert('还未认证！');
        }
        if (moduleName === 'pinche') {
            this.setState({pc: '0'});
        }
        else if (moduleName === 'liaoliao') {
            this.setState({ll: '0'});
            this.props.navigation.navigate('ChatScene', {});
        }
        else if (moduleName === 'linjufabu') {
            this.setState({ljfb: '0'});
            this.props.navigation.navigate('PublishScene', {});
        }
        else if (moduleName === 'fangwuzhongjie') {
            this.setState({fwzj: '0'});
        } else {
            this.props.navigation.navigate('PhoneBook', {});
        }

    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    top: {
        flex: 3,
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15
    },
    center: {
        flex: 3,
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
    },
    bottom: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15
    },
    bigModule: {
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    smallModule: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    icon: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'iconfont'
    },
    bigModuleTitle: {
        fontSize: 15,
        color: 'white',
        marginTop: -5
    },
    smallModuleTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: 'white',
    },
    badge: {
        backgroundColor: 'red',
        height: 20,
        width: 25,
        overflow: 'hidden',
        borderRadius: 8,
        justifyContent: 'center',
        position: 'relative',
        left: 25,
        top: -45
    },
    badgeText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center',
    }

});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

//make this component available to the app
export default connect(select)(NeighborScene);