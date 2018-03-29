/**
 * Created by Administrator on 2017/6/26.
 */
import React, {PureComponent} from 'react';
import {FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';
import {screen} from '../../common';
import api, {get, HOST} from '../../api';
// 是否还需要导入heading 定义renderHeader中显示title
import GroupPurchaseCell from '../GroupPurchase/GroupPurchaseCell';
import ListHotShopView from './LifeHotShopView';
import ListCircleMenuView from './LifeCircleMenuView';
import {color, EmptyRefreshView, SpacingView} from '../../widget';
import HomeBanner from '../Home/HomeBanner';
import {GlobalValue} from '../../Global';
import config from '../../config/Config';

export default class LifeCircleScene extends PureComponent {
    // 配置navigation
    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <Text style={styles.naviTitleStyle}>
                {GlobalValue.blockInfo && GlobalValue.blockInfo.block}
            </Text>
        ),

        headerStyle: {backgroundColor: color.theme},
    });

    // 声明属性
    state: {
        dataList: Array<Object>,
        discounts: Array<Object>,
        bannerInfos: Array<Object>,

    };

    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            discounts: [],
            bannerInfos: [],
        };
        {
            (this: any).requestHotShopRequest = this.requestHotShopRequest.bind(this);
        }
        {
            (this: any).requestListRequest = this.requestListRequest.bind(this);
        }
        {
            (this: any).renderHeader = this.renderHeader.bind(this);
        }
        {
            (this: any)._requestData = this._requestData.bind(this);
        }
        this.onGridSelected = this.onGridSelected.bind(this);
        this._defaultErrorView = this._defaultErrorView.bind(this);
    }

    // 试图将要出现的时候
    componentDidMount() {
        // 开始网络请求 在该方法中使用是es7语法开始请求
        this._requestData();
    }

    // 请求数据
    _requestData() {
        this.requestListRequest();
        this.requestHotShopRequest();
        this.loadBanner();
    }

    loadBanner() {
        let _this = this;
        const paramMap = {'service': 'Home.Get_ad', 'time': (new Date()).valueOf(), 'type': 2, 'block': GlobalValue.blockId || '2'};
        get(paramMap, function (data) {
            if (0 === data.code) {
                if (data.info) {
                    _this.setState({
                        bannerInfos: data.info,
                    });
                }
            } else {
                ToastAndroid.show(data.msg, ToastAndroid.SHORT);
            }
        }, function (error) {
            console.log('data is error' + error);
        });
    }

    // 请求hotShop接口
    async requestListRequest() {
        try {
            let response = await fetch(api.recommend);
            let json = await response.json();
            let dataList = json.data.map(
                (info) => {
                    return {
                        key: info.id,
                        id: info.id,
                        imageUrl: info.squareimgurl,
                        title: info.mname,
                        subtitle: `[${info.range}]${info.title}`,
                        price: info.price
                    };
                }
            );

            this.setState({
                dataList: dataList,
            });
        } catch (error) {
            alert(error);
            // TO DO:
        }
    }

    requestHotShopRequest() {

        let _this = this;
        const pop_shopParamMap = {'service': 'Shop.Pop_shop_list', 'mall': GlobalValue.blockInfo && GlobalValue.blockInfo.mall}; // 商圈要是没有这默认显示 10 朝阳商圈
        get(pop_shopParamMap, function (data) {
            var dataList;
            if (data.info) {
                dataList = data.info.map(
                    (info) => {
                        return {
                            imageurl: HOST + info.pic,
                            title: info.title,
                            id: info.d,
                        }
                    });
            }
            _this.setState({
                discounts: dataList,
            });

        }, function (error) {
            console.log(error);
            alert('pop_shopList Request error !!!');
        });
    }

    renderCell(info: Object) {
        return (
            <GroupPurchaseCell
                info={info.item}
                onPress={this.onCellSelected}
            />
        );
    }

    renderHeader() {
        return (
            <View>
                {/*<Image source={require('../../img/desc_banner.png')} style={{width: screen.width, height: 200}}/>*/}

                <HomeBanner bannerInfos={this.state.bannerInfos} onBannerSelected={this.onBannerSelected}/>
                <SpacingView style={{height: 6, backgroundColor: color.background}}/>

                {/*<View style={{*/}
                {/*width: screen.width, height: 40, backgroundColor: 'white', justifyContent: 'center',*/}
                {/*}}>*/}
                {/*<Text*/}
                {/*style={{*/}
                {/*marginLeft: 10,*/}
                {/*backgroundColor: 'white',*/}
                {/*fontSize: 16,*/}
                {/*color: 'black',*/}
                {/*}}>热门店铺</Text>*/}
                {/*</View>*/}

                {/*<View style={{width: screen.width, height: 0.5, backgroundColor: 'lightgray'}}/>*/}

                <ListCircleMenuView menuInfos={config.LifeMenuInfo} onMenuSelected={this.onMenuSelected}/>

                <SpacingView/>

                <View style={{
                    width: screen.width, height: 40, backgroundColor: 'white', justifyContent: 'center',
                }}>
                    <Text
                        style={{
                            marginLeft: 10,
                            backgroundColor: 'white',
                            fontSize: 16,
                            color: 'black',
                        }}>热门店铺</Text>
                </View>

                <View style={{width: screen.width, height: 0.5, backgroundColor: 'lightgray'}}/>

                <ListHotShopView infos={this.state.discounts} onGridSelected={(this.onGridSelected)}/>
                {/*<HomeGridView infos={this.state.discounts} onGridSelected={(this.onGridSelected)}/>*/}

                <SpacingView/>

                {/*<View style={styles.recommendHeader}>*/}
                <View>
                    {/*<Heading2>猜你喜欢</Heading2>*/}
                    <View style={{
                        width: screen.width, height: 40, backgroundColor: 'white', justifyContent: 'center',
                    }}>
                        <Text
                            style={{
                                marginLeft: 10,
                                backgroundColor: 'white',
                                fontSize: 16,
                                color: 'black',
                            }}>热门商品</Text>
                    </View>
                </View>
                <View style={{width: screen.width, height: 0.5, backgroundColor: 'lightgray'}}/>

            </View>
        );
    }

    // 点击hotShopView
    onGridSelected(index: number) {
        let discount = this.state.discounts[index];

        if (discount.type === 1) {
            StatusBar.setBarStyle('default', false);

            let location = discount.tplurl.indexOf('http');
            let url = discount.tplurl.slice(location);
            this.props.navigation.navigate('Web', {url: url});
        }
    }

    // 点击menuView
    onMenuSelected(index: number) {
        alert(index);
    }

    // bannder did select
    onBannerSelected(bannerItem: Object) {
        alert(bannerItem.title);
    }

    // error界面
    _defaultErrorView() {
        return (<EmptyRefreshView style={{height: screen.height / 3}} text={'暂无热门商品'} onRefresh={this.onRefreshClick}/>);
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
                    ListEmptyComponent={this._defaultErrorView}
                    renderItem={this.renderCell}
                />
            </View>
        );
    }

}

// style
const styles = StyleSheet.create({
    constainer: {
        // backgroundColor : "white",
        flex: 1,
        backgroundColor: color.background,
    },

    naviTitleStyle: {
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        color: 'white'
    },
    recommendHeader: {
        height: 35,
        justifyContent: 'center',
        borderWidth: screen.onePixel,
        borderColor: color.border,
        paddingVertical: 8,
        paddingLeft: 20,
        backgroundColor: 'white'
    },
});