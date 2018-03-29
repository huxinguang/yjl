import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import color from '../../widget/color';
import {GlobalValue} from '../../Global';
import {get, HOST} from '../../api';

class MyCenter extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>个人中心</Text>
        ),
        headerRight: (
            <Text/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    state: {
        userInfo: Object
    };

    nickName: string;
    remark: string;

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }

    componentDidMount() {
        this.requestData();
    }

    requestData() {
        let _this = this;
        const paramMap = {
            'service': 'User.Get_user_info',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag
        };
        get(paramMap, function (data) {
            let userInfo = data.info;
            if (userInfo) {
                _this.nickName = userInfo.nickname;
                _this.remark = userInfo.remark;
                _this.setState({
                    userInfo: userInfo
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    submitData() {
        if (!this.nickName && this.nickName.length === 0) {
            alert('请输入昵称');
            return;
        }
        let _this = this;
        const paramMap = {
            'service': 'User.Edit_user',
            'time': (new Date()).valueOf(),
            'nickname': this.nickName,
            'remark': this.remark
        };
        get(paramMap, function (data) {
            alert(data.msg);
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{justifyContent: 'center', alignItems: 'center', margin: 10}}>
                    <Image style={styles.avatar} source={{uri: HOST + this.state.userInfo.facelink}}/>
                    <Text style={{marginTop: 5}}>{this.state.userInfo.attestation}</Text>
                </View>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <View style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}>
                    <Text>手机号</Text>
                    <Text style={{flex: 1, textAlign: 'right'}}>{this.state.userInfo.uname}</Text>
                </View>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <View style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}>
                    <Text>姓名</Text>
                    <Text style={{flex: 1, textAlign: 'right'}}>{this.state.userInfo.title}</Text>
                </View>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <View style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}>
                    <Text>昵称</Text>
                    <TextInput style={{flex: 1, textAlign: 'right'}} underlineColorAndroid='transparent' placeholder='请输入昵称' defaultValue={this.state.userInfo.nickname}
                               onChangeText={(text) => {
                                   this.nickName = text;
                               }}/>
                </View>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <View style={{height: 100, margin: 10, marginRight: 10}}>
                    <Text>个性签名</Text>
                    <TextInput style={{marginLeft: 10}} underlineColorAndroid='transparent' numberOfLines={4} placeholder='请输入个性签名' defaultValue={this.state.userInfo.remark}
                               onChangeText={(text) => {
                                   this.remark = text;
                               }}/>
                </View>
                <TouchableOpacity style={styles.submit} onPress={() => this.submitData()}>
                    <Text style={{color: 'white', fontSize: 14}}>提交</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'gray'
    },
    submit: {
        height: 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ED6D00',
        borderRadius: 25,
    }
});

export default MyCenter;