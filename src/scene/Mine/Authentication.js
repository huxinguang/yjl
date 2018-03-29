/**
 * Created by huxinguang on 2017/7/3.
 */

'use strict';

import React, {PureComponent} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {CheckView, color, DetailCell, InputableCell, Separator, SpacingView} from '../../widget';
import {PropTypes} from 'prop-types';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import Toast from 'react-native-easy-toast';

class Authentication extends PureComponent {

    checkView: CheckView;
    realname: string;
    ownerName: string;
    ownerPhone: string;
    ownerIdcard: string;

    static navigationOptions = ({navigation}) => ({

        headerTitle: '业主身份认证',
        headerRight: (
            <Text/>
        ),
    });

    static propTypes = {
        navigation: PropTypes.object,
    };

    state: {
        roomAddress: string,
        roomId: string,
    };

    constructor(Props: Object) {
        super(Props);
        this.state = {
            roomAddress: ''
        };
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('RoomSelected', (address, roomId) => this._updateRoomInfo(address, roomId));
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    _updateRoomInfo(address, roomId) {
        this.setState({
            roomAddress: address,
            roomId: roomId
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <SpacingView style={{height: 35, backgroundColor: 'lightgray', justifyContent: 'center'}}
                    title='认证信息'
                    titleStyle={{marginLeft: 10, fontSize: 14, color: 'black'}}/>

                <DetailCell title='房间号'
                    subtitle={this.state.roomAddress}
                    onCellPressed={this.onCellPressed.bind(this)}/>
                <InputableCell title='真实姓名' placeholder='您的真实姓名' keyboardType='default'
                    onInput={this.onInputChanged.bind(this)}/>
                <SpacingView style={{height: 35, backgroundColor: 'lightgray', justifyContent: 'center'}}
                    title='业主信息'
                    titleStyle={{marginLeft: 10, fontSize: 14, color: 'black'}}/>
                <InputableCell title='业主姓名' placeholder='输入业主姓名' keyboardType='default'
                    onInput={this.onInputChanged.bind(this)}/>
                <Separator/>
                <InputableCell title='业主电话' placeholder='输入业主电话' keyboardType='numeric' maxLength={11}
                    onInput={this.onInputChanged.bind(this)}/>
                <Separator/>
                <InputableCell title='业主身份证号' placeholder='输入业主身份证号' keyboardType='default' maxLength={18}
                    onInput={this.onInputChanged.bind(this)}/>
                <Separator/>
                <Text style={{backgroundColor: 'white', padding: 10}}>{'ⓘ  至少补全 '}
                    <Text style={{fontSize: 16, color: 'chocolate', lineHeight: 22}}>{'业主电话或身份证号'}</Text>
                    <Text>{' 其中一种信息，用以验证。如已更换手机号，需前往物业服务中心更新信息。'}</Text>
                </Text>
                <SpacingView style={{height: 35, backgroundColor: 'lightgray', justifyContent: 'center'}}
                    title='选择身份'
                    titleStyle={{marginLeft: 10, fontSize: 14, color: 'black'}}/>
                <CheckView ref={(cv) => this.checkView = cv}/>
                <TouchableOpacity style={styles.confirm} onPress={() => {
                    this.onPressConfirm();
                }}>
                    <Text style={styles.confirmText}>{'确认'} </Text>
                </TouchableOpacity>
                <Toast ref='toast'
                    position='center'/>

            </ScrollView>
        );
    }

    onCellPressed() {
        this.props.navigation.navigate('ChooseRoomScene');
    }

    onPressConfirm() {

        if (this.state.roomAddress.length <= 0) {
            this.refs.toast.show('请选择房间号');
            return;
        }
        if (!(this.realname && this.realname.length > 0)) {
            this.refs.toast.show('请输入真实姓名');
            return;
        }
        if (!(this.ownerName && this.ownerName.length > 0)) {
            this.refs.toast.show('请输入业主姓名');
            return;
        }
        if (!(this.ownerPhone && this.ownerPhone.length > 0)) {
            this.refs.toast.show('请输入业主电话');
            return;
        }

        if (!(this.ownerIdcard && this.ownerIdcard.length > 0)) {
            this.refs.toast.show('请输入业主身份证号');
            return;
        }

        if (this.checkView.state.checkedIndex === 0) {
            this.refs.toast.show('请选择身份');
            return;
        }

        this.addAuthentication();

    }

    onPressCheck() {


    }

    onInputChanged(text, cell) {

        if (cell.props.title === '真实姓名') {
            this.realname = text;
        }
        else if (cell.props.title === '业主姓名') {
            this.ownerName = text;
        }
        else if (cell.props.title === '业主电话') {
            this.ownerPhone = text;
        }
        else {
            this.ownerIdcard = text;
        }

    }

    addAuthentication() {
        let _this = this;
        const paramMap = {
            'service': 'User.Room_add',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block,
            'room': _this.state.roomId,
            'title': _this.realname,
            'master': _this.ownerName,
            'idcard': _this.ownerIdcard,
            'phone': _this.ownerPhone,
            'attestation': _this.checkView.state.checkedIndex.toString()
        };
        get(paramMap, function (data) {
            _this.refs.toast.show(data.msg);
        });
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    confirm: {
        flex: 1,
        backgroundColor: 'red',
        height: 36,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        borderRadius: 18,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    confirmText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    }

});


export default Authentication;


