/**
 * Created by Administrator on 2017/6/22.
 */

'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {color, icon} from '../../widget';
import {GlobalValue} from '../../Global';

class PropertyScene extends Component {

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
        wybx: string,
        wyts: string,
        shjf: string,
        tzgg: string,
        kdds: string,
        ycfw: string
    };

    constructor(props) {
        super(props);
        this.state = {
            wybx: '0',
            wyts: '2',
            shjf: '3',
            tzgg: '4',
            kdds: '5',
            ycfw: '6'
        };

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    <TouchableOpacity
                        style={[styles.bigModule, {backgroundColor: '#32cd32'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('wuyebaoxiu');
                        }}>
                        <Text style={styles.icon}> {icon('wywx')}</Text>
                        <View style={[styles.badge, {opacity: this.state.wybx === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.wybx}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'物业报修'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.smallModule, {backgroundColor: '#4682b4'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('wuyetousu');
                        }}>
                        <Text style={styles.icon}> {icon('phone')}</Text>
                        <View style={[styles.badge, {opacity: this.state.wyts === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.wyts}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'物业投诉'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.smallModule, {backgroundColor: '#ffa500'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('shenghuojiaofei');
                        }}>
                        <Text style={styles.icon}> {icon('shjf')}</Text>
                        <View style={[styles.badge, {opacity: this.state.shjf === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.shjf}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'生活缴费'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.right}>
                    <TouchableOpacity
                        style={[styles.smallModule, {backgroundColor: '#48d1cc'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('tongzhigonggao');
                        }}>
                        <Text style={styles.icon}> {icon('phone')}</Text>
                        <View style={[styles.badge, {opacity: this.state.tzgg === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.tzgg}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'通知公告'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.smallModule, {backgroundColor: '#00bfff'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('kuaididaishou');
                        }}>
                        <Text style={styles.icon}> {icon('kdcx')}</Text>
                        <View style={[styles.badge, {opacity: this.state.kdds === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.kdds}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'快递代收'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bigModule, {backgroundColor: '#f4a460'}]}
                        activeOpacity={0.8}
                        onPress={() => {
                            this.onPressButton('youchangfuwu');
                        }}>
                        <Text style={styles.icon}> {icon('ycfw')}</Text>
                        <View style={[styles.badge, {opacity: this.state.ycfw === '0' ? 0 : 1}]}>
                            <Text style={styles.badgeText}>{this.state.ycfw}
                            </Text>
                        </View>
                        <Text style={styles.title}>{'有偿服务'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onPressButton(moduleName: string) {
        if (!this.props.isLoggedIn) {
            this.props.navigation.navigate('LoginScene', {});
            return;
        } else if (GlobalValue.userInfo.attestation === 0) {
            alert('还未认证！');
        }

        if (moduleName === 'wuyebaoxiu') {
            this.setState({wybx: '0'});
            this.props.navigation.navigate('PropertyService', {});
        }
        else if (moduleName === 'wuyetousu') {
            this.setState({wyts: '0'});
            this.props.navigation.navigate('ComplaintsList', {});
        }
        else if (moduleName === 'shenghuojiaofei') {
            this.setState({shjf: '0'});
            this.props.navigation.navigate('NewLifePayScene', {});
        }
        else if (moduleName === 'tongzhigonggao') {
            this.setState({tzgg: '0'});
            this.props.navigation.navigate('NoticeListScene', {});
        }
        else if (moduleName === 'kuaididaishou') {
            this.setState({kdds: '0'});
            this.props.navigation.navigate('ExpressListScene', {});
        }
        else {
            this.setState({ycfw: '0'});
            this.props.navigation.navigate('PaidService', {});
        }

        // switch (moduleName) {
        //     case 'wuyebaoxiu': {
        //         this.setState({wybx: '0'});
        //     }
        //     case 'wuyetousu': {
        //         this.setState({wyts: '0'});
        //     }
        //     case 'shenghuojiaofei':{
        //         this.setState({shjf: '0'});
        //     }
        //     case 'tongzhigonggao': {
        //         this.setState({tzgg: '0'});
        //     }
        //     case 'kuaididaishou': {
        //         this.setState({kdds: '0'});
        //     }
        //     case 'youchangfuwu':{
        //         this.setState({ycfw: '0'});
        //     }
        //     default : break;
        // }
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    left: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 15
    },
    right: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 15,
        marginRight: 15,
        marginBottom: 15
    },
    bigModule: {
        flex: 2,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',

    },
    smallModule: {
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',

    },
    icon: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'iconfont'
    },
    title: {
        fontSize: 15,
        color: 'white',
        marginTop: -5
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
        top: -45,
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
export default connect(select)(PropertyScene);