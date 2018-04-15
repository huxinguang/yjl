//import liraries
import React, {PureComponent} from 'react';
import {FlatList, Image, Linking, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View,Alert,NativeAppEventEmitter,TouchableHighlight,ScrollView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';

import {Heading1, Heading2, Paragraph} from '../../widget/Text';
import {color, EmptyRefreshView, icon, SpacingView} from '../../widget';

import {screen} from '../../common';
import {get} from '../../api';
import Config from '../../config/Config';

import HomeBanner from './HomeBanner';
import HomeMenuView from './HomeMenuView';
import {GlobalKey, GlobalValue} from '../../Global';
import StorageUtil from '../../common/StorageUtil';
import system from '../../common/system';
import JPushModule from 'jpush-react-native';

const receiveCustomMsgEvent = 'receivePushMsg';
const receiveNotificationEvent = 'receiveNotification';
const openNotificationEvent = 'openNotification';
const getRegistrationIdEvent = 'getRegistrationId';
const openNotificationLaunchAppEvent = 'openNotificationLaunchApp';

// create a component
class HomeScene extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params && navigation.state.params.title,
        headerLeft: (
            <Text/>
        ),
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('NoticeListScene', {})}>
                <Text style={{margin: 10, color: 'white', fontSize: 22, fontFamily: 'iconfont'}}>{icon('phone')}</Text>
            </TouchableOpacity>
        ),
    });

    static propTypes = {
        navigation: PropTypes.object
    };

    state: {
        banners: Array<Object>,
        dataList: Array<Object>,
        refreshing: boolean,
    };

    constructor(props: Object) {
        super(props);

        this.state = {
            banners: [],
            dataList: [],
            refreshing: false,
        };

        {
            (this: any).requestData = this.requestData.bind(this);
        }
        {
            (this: any).loadBanner = this.loadBanner.bind(this);
        }
        {
            (this: any).renderCell = this.renderCell.bind(this);
        }
        {
            (this: any).onCellSelected = this.onCellSelected.bind(this);
        }
        {
            (this: any).keyExtractor = this.keyExtractor.bind(this);
        }
        {
            (this: any).renderHeader = this.renderHeader.bind(this);
        }
        {
            (this: any).onGridSelected = this.onGridSelected.bind(this);
        }
        this.onMenuSelected = this.onMenuSelected.bind(this);
        this.renderFootView = this.renderFootView.bind(this);


        // this.state = {
        //     bg: '#ffffff',
        //     appkey: 'AppKey',
        //     imei: 'IMEI',
        //     package: 'PackageName',
        //     deviceId: 'DeviceId',
        //     version: 'Version',
        //     pushMsg: 'PushMessage',
        //     registrationId: 'registrationId',
        // };

        this.jumpSetActivity = this.jumpSetActivity.bind(this);
        this.onInitPress = this.onInitPress.bind(this);
        this.onStopPress = this.onStopPress.bind(this);
        this.onResumePress = this.onResumePress.bind(this);
        this.onGetRegistrationIdPress = this.onGetRegistrationIdPress.bind(this);
        this.jumpSecondActivity = this.jumpSecondActivity.bind(this);
    }

    componentWillMount(){
        //订阅消息通知
        var { NativeAppEventEmitter } = require('react-native');
        let _this = this;

        // if (system.isIOS){
        //     NativeAppEventEmitter.addListener(
        //         'receiveNotification',
        //         (notification) => {
        //             Alert.alert(JSON.stringify(notification));
        //         }
        //     );
        //
        //     //ios10后才有点击通知的回调(app处于后台时)
        //     NativeAppEventEmitter.addListener(
        //         'openNotification',
        //         (notification) => {
        //             Alert.alert(JSON.stringify(notification));
        //         }
        //     );
        //     //JPush 提供应用内消息，用户可以发送应用内消息给应用，如果手机应用在前台就会收到这个消息，否则存为离线消息
        //     NativeAppEventEmitter.addListener(
        //         'networkDidReceiveMessage',
        //         (message) => {
        //             Alert.alert('应用内消息');
        //         }
        //     );
        // }


    }

    componentDidMount() {
        let _this = this;
        StorageUtil.selectObjectForKey([GlobalKey.USER_INFO, GlobalKey.BLOCK_INFO, GlobalKey.USER_ID, GlobalKey.USER_TOKEN, GlobalKey.BLOCK_ID, GlobalKey.BLOCK_TAG], function (dict) {
            GlobalValue.userInfo = dict[GlobalKey.USER_INFO];
            GlobalValue.blockInfo = dict[GlobalKey.BLOCK_INFO];
            GlobalValue.userId = dict[GlobalKey.USER_ID];
            GlobalValue.userToken = dict[GlobalKey.USER_TOKEN];
            GlobalValue.blockId = dict[GlobalKey.BLOCK_ID];
            GlobalValue.block = dict[GlobalKey.BLOCK_TAG];
            _this.props.navigation.setParams({
                title: GlobalValue.blockInfo.block
            });
            _this.requestData();
        });

        if(system.isAndroid){
            JPushModule.getInfo((map) => {
                this.setState({
                    appkey: map.myAppKey,
                    imei: map.myImei,
                    package: map.myPackageName,
                    deviceId: map.myDeviceId,
                    version: map.myVersion
                });
            });

            JPushModule.notifyJSDidLoad((resultCode) => {
                if (resultCode === 0) {}
            });

            JPushModule.addReceiveCustomMsgListener((map) => {
                this.setState({
                    pushMsg: map.message
                });
                console.log('extras: ' + map.extras);
            });

            JPushModule.addGetRegistrationIdListener((registrationId) => {
                console.log('Device register succeed, registrationId ' + registrationId);
            });

        }else {
            //ios only,应用没有启动,收到推送并且点击推送
            JPushModule.addOpenNotificationLaunchAppListener((notification) =>{
                // Alert.alert(JSON.stringify(notification));
                this.jumpSecondActivity();
            });
        }

        // ios9+ ~ ios10  或 android 应用在前台,收到推送
        JPushModule.addReceiveNotificationListener((map) => {
            console.log('alertContent: ' + map.alertContent);
            console.log('extras: ' + map.extras);
            // var extra = JSON.parse(map.extras);
            // console.log(extra.key + ": " + extra.value);
            Alert.alert('前台收到通知');
        });

        // ios10+ android 应用在前台,收到推送并且点击推送
        JPushModule.addReceiveOpenNotificationListener((map) => {
            console.log('Opening notification!');
            console.log('map.extra: ' + map.extras);
            this.jumpSecondActivity();
            // JPushModule.jumpToPushActivity("SecondActivity");//android only

            // JPushModule.jumpToPushActivityWithParams('NoticeDetailScene', {id: 1});//android only
        });

    }


    jumpSetActivity() {
        this.props.navigation.navigate('Setting');
    }

    jumpSecondActivity() {
        this.props.navigation.navigate('NoticeDetailScene', {id: 1});
    }

    onInitPress() {
        JPushModule.initPush();//android only
    }

    onStopPress() {
        JPushModule.stopPush();//android only
        console.log('Stop push press');
    }

    onResumePress() {
        JPushModule.resumePush();//android only
        console.log('Resume push press');
    }

    onGetRegistrationIdPress() {
        //android only
        JPushModule.getRegistrationID((registrationId) => {
            this.setState({
                registrationId: registrationId
            });
        });
    }

    componentWillUnmount() {

        JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);// ios android
        JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);// ios android

        if (system.isAndroid){
            JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);//android only
            JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);//android only
            JPushModule.clearAllNotifications();//android only
        }else {
            // NativeAppEventEmitter.removeAllListeners(['receiveNotification','openNotification','networkDidReceiveMessage']);
            //ios only
            JPushModule.removeOpenNotificationLaunchAppEventListener(openNotificationLaunchAppEvent);
        }

    }

    requestData() {
        this.setState({refreshing: true});
        this.loadBanner();
        this.requestRecommend();
        this.upgrade();
    }

    upgrade() {
        const paramMap = {'service': 'My.Versions', 'time': (new Date()).valueOf()};
        get(paramMap, function (data) {
            if (0 === data.code) {
                if (data.info) {
                    if (system.isAndroid) {
                        if (data.info.android.latest_version > DeviceInfo.getVersion()) {
                            // alert(data.info.android.latest_version + ' ' + data.info.android.download_url);
                        } else {
                            // alert('已经是最新版本');
                        }
                    } else {
                        if (data.info.ios.latest_version > DeviceInfo.getVersion()) {
                            // alert(data.info.ios.latest_version + ' ' + data.info.ios.download_url);
                        } else {
                            // alert('已经是最新版本');
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

    loadBanner() {
        let _this = this;
        const paramMap = {'service': 'Home.Get_ad', 'time': (new Date()).valueOf(), 'type': 1, 'block': GlobalValue.blockId || '2'};
        get(paramMap, function (data) {
            if (0 === data.code) {
                if (data.info) {
                    _this.setState({
                        banners: data.info,
                    });
                }
            } else {
                ToastAndroid.show(data.msg, ToastAndroid.SHORT);
            }
        }, function (error) {
            console.log('data is error' + error);
        });
    }

    loadTelPhone() {
        const paramMap = {'service': 'Home.TelPhone', 'time': (new Date()).valueOf(), 'tag': GlobalValue.block};
        get(paramMap, function (data) {
            if (0 === data.code) {
                if (data.info) {
                    Linking.canOpenURL('tel:' + data.info.phone).then(supported => {
                        if (!supported) {
                            console.log('Can\'t handle url: ' + data.info.phone);
                        } else {
                            return Linking.openURL('tel:' + data.info.phone);
                        }
                    }).catch(err => console.error('An error occurred', err));
                }
            } else {
                ToastAndroid.show(data.msg, ToastAndroid.SHORT);
            }
        }, function (error) {
            console.log('data is error' + error);
        });
    }

    requestRecommend() {
        let _this = this;
        const paramMap = {'service': 'Shop.Home_quan_list', 'time': (new Date()).valueOf(), 'mall': 10};
        get(paramMap, function (data) {
            if (0 === data.code) {
                if (data.info) {
                    let dataList = data.info;
                    _this.setState({
                        dataList: dataList,
                        refreshing: false,
                    });
                }
            } else {
                ToastAndroid.show(data.msg, ToastAndroid.SHORT);
                _this.setState({
                    refreshing: false,
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    renderCell(info: Object) {
        let icon;
        if (parseInt(info.item.type) === 1) {
            icon = require('../../img/home_daijinquan.png');
        } else if (parseInt(info.item.type) === 2) {
            icon = require('../../img/home_dazhequan.png');
        } else {
            icon = require('../../img/home_huangouquan.png');
        }
        return (
            <TouchableOpacity style={styles.cellContainer} onPress={() => {
            }}>
                <Image source={icon} style={styles.icon}/>
                <View style={styles.rightContainer}>
                    <Heading2>{info.item.shop_name}</Heading2>
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <Heading2 style={styles.price}>{info.item.rule + info.item.unit + '【' + info.item.type_name + '】'}</Heading2>
                    </View>
                    <Paragraph numberOfLines={0} style={{marginTop: 8}}>{'有效期' + info.item.s_time + '至' + info.item.e_time}</Paragraph>
                </View>
            </TouchableOpacity>
        );
    }

    onCellSelected(info: Object) {
        StatusBar.setBarStyle('default', false);
        this.props.navigation.navigate('GroupPurchase', {info: info});
    }

    keyExtractor(item: Object, index: number) {
        return item.id;
    }

    renderHeader() {
        return (
            <View>

                <HomeBanner bannerInfos={this.state.banners} onBannerSelected={this.onBannerSelected}/>

                <SpacingView/>

                <View style={styles.recommendHeader}>
                    <Heading1>热门服务</Heading1>
                </View>

                <HomeMenuView menuInfos={Config.menuInfo} onMenuSelected={this.onMenuSelected}/>

                <SpacingView/>

                <View style={styles.recommendHeader}>
                    <Heading1>推荐优惠券</Heading1>
                </View>

            </View>
        );
    }

    renderFootView() {
        return (
            <View style={{height: 20, backgroundColor: color.background, marginTop: 5}}>
                <Text style={{alignItems: 'center', fontSize: 12, color: 'red', textAlign: 'center'}}>
                    已加载完成
                </Text>
            </View>
        );
    }

    renderEmptyView() {
        return (
            <EmptyRefreshView style={{height: screen.height / 3}} text={'暂无推荐优惠券'} onRefresh={this.onRefreshClick}/>
        );
    }

    onGridSelected(index: number) {
        let discount = this.state.discounts[index];

        if (discount.type === 1) {
            StatusBar.setBarStyle('default', false);

            let location = discount.tplurl.indexOf('http');
            let url = discount.tplurl.slice(location);
            this.props.navigation.navigate('Web', {url: url});
        }
    }

    onBannerSelected(banner: Object) {
        alert(banner.url);
    }

    onMenuSelected(index: number) {
        let scenes = ['PropertyService', 'NewLifePayScene', 'PaidService', 'ExpressListScene', '', '', 'MyDiscount', 'PhoneBook'];
        if (scenes[index] !== '') {
            if (!this.props.isLoggedIn) {
                this.props.navigation.navigate('LoginScene', {});
                return;
            }
            this.props.navigation.navigate(scenes[index], {});
        } else if (index === 4) {
            this.loadTelPhone();
        } else {
            alert(Config.menuInfo[index].title);
        }
    }

    onRefreshClick() {
        alert('刷新');
    }

    render() {
        return (

            <View style={styles.container}>
                <FlatList
                    data={this.state.dataList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}
                    ListHeaderComponent={this.renderHeader}
                    // ListFooterComponent={this.renderFootView}
                    ListEmptyComponent={this.renderEmptyView()}
                    renderItem={this.renderCell}
                    // 加载更多
                    onEndReachedThreshold={10}
                    // onEndReached={() => this.onFooterRefresh()}
                />
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    recommendHeader: {
        height: 40,
        justifyContent: 'center',
        borderWidth: screen.onePixel,
        borderColor: color.border,
        paddingVertical: 8,
        paddingLeft: 10,
        backgroundColor: 'white'
    },
    searchBar: {
        width: screen.width * 0.7,
        height: 30,
        borderRadius: 19,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    searchIcon: {
        width: 20,
        height: 20,
        margin: 5,
    },
    cellContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
    icon: {
        width: 70,
        height: 70,
        borderRadius: 5,
    },
    rightContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 10,
    },
    price: {
        color: color.theme
    }
});

/*
* The mapStateToProps function's first argument is the entire Redux store’s state and it returns an object to be passed as props.
* mapStateToProps函数名、参数名可以自定义
* */
function mapStateToProps(state) {
    return {
        isLoggedIn: state.user.isLoggedIn || state.user.hasSkippedLogin,
    };
}

export default connect(mapStateToProps)(HomeScene);