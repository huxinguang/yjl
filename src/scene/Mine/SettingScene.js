import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import color from '../../widget/color';
import icon from '../../widget/IconFont';
import {get} from '../../api';
import system from '../../common/system';

class SettingScene extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>设置</Text>
        ),
        headerRight: (
            <Text/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.requestData();
    }

    requestData() {

    }

    submitData() {

    }

    upgrade() {
        const paramMap = {'service': 'My.Versions', 'time': (new Date()).valueOf()};
        get(paramMap, function (data) {
            if (0 === data.code) {
                if (data.info) {
                    if (system.isAndroid) {
                        if (data.info.android.latest_version > DeviceInfo.getVersion()) {
                            alert(data.info.android.latest_version + ' ' + data.info.android.download_url);
                        } else {
                            alert('已经是最新版本');
                        }
                    } else {
                        if (data.info.ios.latest_version > DeviceInfo.getVersion()) {
                            alert(data.info.ios.latest_version + ' ' + data.info.ios.download_url);
                        } else {
                            alert('已经是最新版本');
                        }
                    }
                }
            } else {
                ToastAndroid.show(data.msg, ToastAndroid.SHORT);
            }
        }, function (error) {
            console.log('data is error' + error);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('ChangePassword', {})}>
                    <Text>修改密码</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.upgrade()}>
                    <Text>版本升级</Text>
                    <Text style={{flex: 1, textAlign: 'right'}}>{DeviceInfo.getVersion()}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('TreatyScene')}>
                    <Text>用户协议</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    }
});

export default SettingScene;