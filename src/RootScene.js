/**
 * Created by Administrator on 2017/6/22.
 */
//import liraries
import React, {PureComponent} from 'react';
import {StatusBar} from 'react-native';
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import color from './widget/color';
import TabBarIconFontItem from './widget/TabBarIconFontItem';
import StorageUtil from './common/StorageUtil';
import HomeScene from './scene/Home/HomeScene';
import PropertyScene from './scene/Property/PropertyScene';
import NearbyScene from './scene/LifeCircle/LifeCircleScene';
import NeighborScene from './scene/Neighbor/NeighborScene';
import MineScene from './scene/Mine/MineScene';
import LoginScene from './scene/Account/LoginScene';
import ChangePassword from './scene/Account/ChangePassword';
import AreaSelection from './scene/Account/AreaSelection';
import PropertyService from './scene/Property/PropertyService';
import PhoneBook from './scene/Neighbor/PhoneBook';
import ExpressListScene from './scene/Property/ExpressListScene';
import NoticeListScene from './scene/Property/NoticeListScene';
import NoticeDetailScene from './scene/Property/NoticeDetailScene';
import WebScene from './widget/WebScene';
import GroupPurchaseScene from './scene/GroupPurchase/GroupPurchaseScene';
import Authentication from './scene/Mine/Authentication';
import MyDiscountScene from './scene/MyDiscount/MyDiscountScene';
import NewLifePayScene from './scene/LifePays/NewLifePays';
import ChooseRoomScene from './scene/Mine/ChooseRoomScene';
import AddFixScene from './scene/Property/AddFixScene';
import TestActionSheetScene from './scene/LifePays/NewLifePay_ActionSheet';
import ComplaintsList from './scene/Property/ComplaintsList';
import PaidService from './scene/Property/PaidService';
import ChatScene from './scene/Neighbor/ChatScene';
import PublishScene from './scene/Neighbor/PublishScene';
import MyCenter from './scene/Mine/MyCenter';
import MyFavorite from './scene/Mine/MyFavorite';
import MyPublish from './scene/Mine/MyPublish';
import MyProperty from './scene/Mine/MyProperty';
import SettingScene from './scene/Mine/SettingScene';
import TreatyScene from './scene/Mine/TreatyScene';
import AboutScene from './scene/Mine/AboutScene';
import MyChatScene from './scene/Neighbor/MyChatScene';
import ChatSearchScene from './scene/Neighbor/ChatSearchScene';
import PublishSearchScene from './scene/Neighbor/PublishSearchScene';
import ChooseServiceScene from './scene/Property/ChooseServiceScene';
import AddPaidService from './scene/Property/AddPaidService';
import AddComplaintScene from './scene/Property/AddComplaintScene';
import New_LiftPayScene from './scene/LifePays/New_LiftPayScene';
import New_PropertyPay from './scene/LifePays/New_PropertyPay';
import New_ElectricScene from './scene/LifePays/New_ElectricScene';
import New_WaterScene from './scene/LifePays/New_WaterScene';
import New_PaymentRecordScene from './scene/LifePays/New_PaymentRecordScene';
import PublishDetailScene from './scene/Neighbor/PublishDetailScene';
import AddPublishScene from './scene/Neighbor/AddPublishScene';
import AddChatScene from './scene/Neighbor/AddChatScene';
import SuccessScene from './scene/Property/SuccessScene';
import ScoreScene from './scene/Property/ScoreScene';
import FixDetailScene from './scene/Property/FixDetailScene';
import ComplaintDetailScene from './scene/Property/ComplaintDetailScene';
import ServiceDetailScene from './scene/Property/ServiceDetailScene';
import ChatDetailScene from './scene/Neighbor/ChatDetailScene';
import system from './common/system';
import GuideViewPager from './GuideViewPager';
import {connect} from 'react-redux';
import {appIntro} from './actions/actions';

const lightContentScenes = ['Home', 'Mine'];

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

// create a component
class RootScene extends PureComponent {

    isFisrtLaunch: boolean;

    state:{
        hideGuide:boolean
    };

    constructor() {
        super();

        StatusBar.setBarStyle('light-content');
        // 试图渲染完成 加载组件单例
        // 初始化storage 并设置全局变量
        // global为系统自带，使用时无需import任何内容
        global.storage = StorageUtil.shareStroageUtilInstan();

        this.loadStorage();


    }

    getLaunchInfoFromStorage (){
        let _this = this;
        return new Promise ((resolve,reject) =>{
            StorageUtil.selectObject('AppIsFirstLaunch', function (data) {
                if (data) {
                    _this.isFisrtLaunch = data['AppIsFirstLaunch'];
                }else {
                    _this.isFisrtLaunch = true;
                }
            });
        });

    }

    async loadStorage(){
        try {
            const result = await this.getLaunchInfoFromStorage();
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    componentDidMount(): void {

    }


    render() {
        let everLaunched = this.props.isLaunched;//不能在return中直接判断this.props.isLaunched的值。
        return (
            (system.isAndroid == true && everLaunched == false ) ? <GuideViewPager onStartBtnClicked={this._startYJL.bind(this)}/>:
                <Navigator
                    onNavigationStateChange={
                        (prevState, currentState) => {
                            const currentScene = getCurrentRouteName(currentState);
                            const previousScene = getCurrentRouteName(prevState);
                            if (previousScene !== currentScene) {
                                if (lightContentScenes.indexOf(currentScene) >= 0) {
                                    StatusBar.setBarStyle('light-content');
                                } else {
                                    StatusBar.setBarStyle('dark-content');
                                }
                            }
                        }
                    }
                />

        );
    }

    _startYJL(){
        this.props.dispatch(appIntro());//会改变store中的launched状态，并触发render()方法重新渲染视图
    }
}

const Tab = TabNavigator(
    {
        Home: {
            screen: HomeScene,
            navigationOptions: () => ({
                tabBarLabel: '首页',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarIconFontItem
                        tintColor={tintColor}
                        focused={focused}
                        normalIcon={'icon_home'}
                        selectedIcon={'icon_home'}
                    />
                )
            }),
        },
        Property: {
            screen: PropertyScene,
            navigationOptions: () => ({
                tabBarLabel: '物业',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarIconFontItem
                        tintColor={tintColor}
                        focused={focused}
                        normalIcon={'icon_property'}
                        selectedIcon={'icon_property'}
                    />
                )
            }),
        },
        Nearby: {
            screen: NearbyScene,
            navigationOptions: () => ({
                tabBarLabel: '生活圈',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarIconFontItem
                        tintColor={tintColor}
                        focused={focused}
                        normalIcon={'icon_life'}
                        selectedIcon={'icon_life'}
                    />
                )
            }),
        },

        Neighbor: {
            screen: NeighborScene,
            navigationOptions: () => ({
                tabBarLabel: '邻居',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarIconFontItem
                        tintColor={tintColor}
                        focused={focused}
                        normalIcon={'icon_neighbor'}
                        selectedIcon={'icon_neighbor'}
                    />
                )
            }),
        },

        Mine: {
            screen: MineScene,
            navigationOptions: () => ({
                tabBarLabel: '我',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarIconFontItem
                        tintColor={tintColor}
                        focused={focused}
                        normalIcon={'icon_mine'}
                        selectedIcon={'icon_mine'}
                    />
                )
            }),
        },
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        lazy: true,
        tabBarOptions: {
            activeTintColor: color.theme,
            inactiveTintColor: '#979797',
            style: {backgroundColor: '#ffffff'},
        },
    }
);

const Navigator = StackNavigator(
    {
        Tab: {screen: Tab},
        Home: {screen: HomeScene},
        LoginScene: {screen: LoginScene},
        ChangePassword: {screen: ChangePassword},
        AreaSelection: {screen: AreaSelection},
        Web: {screen: WebScene},
        GroupPurchase: {screen: GroupPurchaseScene},
        PropertyService: {screen: PropertyService},
        PhoneBook: {screen: PhoneBook},
        ExpressListScene: {screen: ExpressListScene},
        ComplaintsList: {screen: ComplaintsList},
        PaidService: {screen: PaidService},
        NoticeListScene: {screen: NoticeListScene},
        NoticeDetailScene: {screen: NoticeDetailScene},
        ChatScene: {screen: ChatScene},
        MyChatScene: {screen: MyChatScene},
        ChatSearchScene: {screen: ChatSearchScene},
        PublishScene: {screen: PublishScene},
        PublishDetailScene: {screen: PublishDetailScene},
        PublishSearchScene: {screen: PublishSearchScene},
        MyCenter: {screen: MyCenter},
        MyFavorite: {screen: MyFavorite},
        MyPublish: {screen: MyPublish},
        MyProperty: {screen: MyProperty},
        SettingScene: {screen: SettingScene},
        TreatyScene: {screen: TreatyScene},
        AboutScene: {screen: AboutScene},
        Authentication: {screen: Authentication},
        MyDiscount: {screen: MyDiscountScene},
        NewLifePayScene: {screen: NewLifePayScene},
        ChooseRoomScene: {screen: ChooseRoomScene},
        AddFixScene: {screen: AddFixScene},
        TestActionSheetScene: {screen: TestActionSheetScene},
        AddPaidService: {screen: AddPaidService},
        ChooseServiceScene: {screen: ChooseServiceScene},
        AddComplaintScene: {screen: AddComplaintScene},
        New_LiftPayScene: {screen: New_LiftPayScene},
        New_PropertyPay: {screen: New_PropertyPay},
        New_ElectricScene: {screen: New_ElectricScene},
        New_WaterScene: {screen: New_WaterScene},
        New_PaymentRecordScene: {screen: New_PaymentRecordScene},
        AddPublishScene: {screen: AddPublishScene},
        AddChatScene: {screen: AddChatScene},
        SuccessScene: {screen: SuccessScene},
        ScoreScene: {screen: ScoreScene},
        FixDetailScene: {screen: FixDetailScene},
        ComplaintDetailScene: {screen: ComplaintDetailScene},
        ServiceDetailScene: {screen: ServiceDetailScene},
        ChatDetailScene: {screen: ChatDetailScene},
    },
    {
        navigationOptions: {
            headerStyle: {backgroundColor: color.theme},
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: 'normal',
                color: 'white',
                alignSelf: 'center'
            },
            headerBackTitle: null,
            headerTintColor: 'white',
            showIcon: true,
            cardStack: {
                gesturesEnabled: true
            },
        },
        mode: 'card',
        headerMode: 'float',
        transitionConfig: (() => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal // android's config about jump to next page
        })),
        onTransitionStart: () => {
        },
        onTransitionEnd: () => {
        }
    }
);


/*
* The mapStateToProps function's first argument is the entire Redux store’s state and it returns an object to be passed as props.
* mapStateToProps函数名、参数名可以自定义
* */
function mapStateToProps(state) {
    return {
        isLaunched: state.intro.launched
    };
}

/*
* 官方文档： https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
* connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])  关于connect函数说明详见
* 参数带中括号表示可选参数
* 参数1.The results of mapStateToProps must be a plain object, which will be merged into the component’s props. If you don't want to subscribe to store updates, pass null or undefined in place of [mapStateToProps].
* 参数2.If you do not supply your own mapDispatchToProps function or object full of action creators, the default mapDispatchToProps implementation just injects dispatch into your component’s props
* */

export default connect(mapStateToProps)(RootScene);
