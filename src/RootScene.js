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
// import NearbyScene from './scene/Nearby/NearbyScene';
import NeighborScene from './scene/Neighbor/NeighborScene';
import MineScene from './scene/Mine/MineScene';
import Login from './scene/Account/Login';
import ChangePassword from './scene/Account/ChangePassword';
import AreaSelection from './scene/Account/AreaSelection';

import PropertyService from './scene/Property/PropertyService';
import PhoneBook from './scene/Neighbor/PhoneBook';
import ExpressListScene from './scene/Property/ExpressListScene';
import NoticeListScene from './scene/Property/NoticeListScene';
import NoticeDetailScene from './scene/Property/NoticeDetailScene';
/*注册push界面*/
import WebScene from './widget/WebScene';
import GroupPurchaseScene from './scene/GroupPurchase/GroupPurchaseScene';
import Authentication from './scene/Mine/Authentication';
import MyDiscountScene from './scene/MyDiscount/MyDiscountScene';
// import NewLifePayScene from './scene/LifePay/NewLifePayScene';
import NewLifePayScene from './scene/LifePays/NewLifePays';
import ChooseRoomScene from './scene/Mine/ChooseRoomScene';
import AddFixScene from './scene/Property/AddFixScene';
// 注册使用BaseActionSheet界面
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
    constructor() {
        super();

        StatusBar.setBarStyle('light-content');
        // 试图渲染完成 加载组件单例
        // 初始化storange 并设置全局变量
        global.storage = StorageUtil.shareStroageUtilInstan();
    }

    componentDidMount(): void {

    }


    render() {
        return (
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
        Login: {screen: Login},
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
        ChatDetailScene : {screen : ChatDetailScene},
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
//make this component available to the app
export default RootScene;
