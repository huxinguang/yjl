/**
 * Created by kunpan on 2017/7/7.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {ListView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {color, NavigationItem} from '../../widget/index';
import {color, SpacingView} from '../../widget/index';
import {GlobalTitle} from '../../Global';
import ImageAndTitleCell from './ImageAndTitleCell';
import LiftPaySegmentView from './LiftPaySegmentView';
import LiftPayCell from './LiftPayCell';
import api from '../../api';
import LiftPayScrollView from './LiftPayScrollView';
import BaseFloatView from './BaseFloatView';
import BaseActionSheetView from './BaseActionSheetView';

type Props = {
    // count : number;         // 显示的个数
    selectIndex: number;   // 选中的下标
    // style?: any;
    // onSelectIndexChange?: (index : number) => void;     // scrollViewDidEndScroll 回调
    // children?: any;         // subView
    bounces?: boolean;      // 是否有分页

};

class NewLifePayScene extends PureComponent {
    selectCellType: number;
    props: Props;
    // segmentView
    topSegmentView: LiftPaySegmentView;
    // scrollView
    contentView: LiftPayScrollView;
    // floatView
    floatView: BaseFloatView;
    // 存储点击cell数据map ---> key : id values price
    selectDict: {};

    static navigationOptions = ({navigation}) => ({
        headerTitle: GlobalTitle.lifeTitle,
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('New_LiftPayScene', {})}>
                <Text style={{margin: 10, color: 'white', fontSize: 16}}>{GlobalTitle.lifeNaviRightTitle}</Text>
            </TouchableOpacity>
        )
    });

    static defaultProps = {
        selectIndex: 0,
        allTotalCount: 0,
    };

    constructor(props: Props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            // 点击切换页卡。获取当前是那个页卡
            onSelectIndex: this.props.selectIndex,
            // 是否点击刷新试图
            isReloadForDidSelectItem: false,
            // 修改显示的账单的钱数
            allTotalCount: 0,
            // 是否显示floatView
            isShowFloatView: false,
        };

        this.selectDict = {};

        this._selectUserInfo = this._selectUserInfo.bind(this);
        this._selectSegmentView = this._selectSegmentView.bind(this);
        this.requestData = this.requestData.bind(this);
        this._scrollViewDidEndScroll = this._scrollViewDidEndScroll.bind(this);
        this._reloadPriceViewWithTotalPrice = this._reloadPriceViewWithTotalPrice.bind(this);
        this._didSelectCellClick = this._didSelectCellClick.bind(this);
    }

    componentDidMount() {
        this.requestData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            if (nextProps.isLoggedIn) {
                this.requestData();
            } else {
                this.props.navigation.navigate('Login', {});
            }
        }
    }

    render() {
        let bottomView = this.state.onSelectIndex === 0 ?
            <View style={{backgroundColor: 'white', flexDirection: 'column', flex: 0.15}}>
                <View style={{backgroundColor: 'orange', flex: 2.5, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 15, color: '#f5f5f5'}}>
                        {'已选账单费用合计: ' + this.state.allTotalCount + '元'}
                    </Text>
                </View>
                <View style={{backgroundColor: 'blue', flex: 3, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 15, color: 'white'}} onPress={() => {

                    }}>
                        {'支 付'}
                    </Text>
                </View>
            </View> :
            <View style={{flex: 0}}/>;

        let floatView = this.state.isShowFloatView === true ?
            <BaseFloatView
                ref={(floatView) => this.floatView = floatView}
                modalVisible={true}
                onSelectMaskView={() => {
                    this._selectUserInfo();
                }}
                // innerContainerJustifyContent = {'center'}
            >
                <View style={styles.floatViewContainerStyle}>
                    <Text style={styles.floatViewTitleStyle}>
                        {'选择地址'}
                    </Text>
                    <SpacingView style={{backgroundColor: 'red', height: 3, marginTop: 5}}/>
                    <Text style={styles.floatViewContentTextStyle} onPress={() => {
                        // alert ('点击燕郊天洋城4代二期address！！！');
                        this.floatView.hideFloatViewVisible(false);
                    }}>
                        {'燕郊天洋城4代二期30号楼1单元901室x'}
                    </Text>
                </View>
            </BaseFloatView> :
            <View style={{flex: 0}}/>;

        let actionSheetView = this.state.isShowFloatView === true ?
            <BaseActionSheetView
                ref={(floatView) => this.actionSheetView = floatView}
                Title={''}
                cancelButtonTitle={'暂时取消'}
                otherButtonTitles={['编辑', '删除']}
                didSelectClickCancelButton={() => {
                    this._selectUserInfo();
                }}
                didSelectClickButtonIndex={(index) => {
                    // this.actionSheetView.hideActionSheetView();
                    this._reloadPriceViewWithTotalPrice(index);
                }}
            >
            </BaseActionSheetView> :
            <View style={{flex: 0}}/>;


        return (
            <View style={styles.constainer}>
                <ImageAndTitleCell titleString='血刃'
                    substring='1897025643'
                    desString='燕郊天洋城4代二期30号楼1单元901室x'
                    isShowLeftIcon={true}
                    isShowRightIcon={true}
                    source={'gps'}
                    selectOnPress={() =>
                        this._selectUserInfo && this._selectUserInfo()
                    }>
                </ImageAndTitleCell>

                <SpacingView style={{backgroundColor: color.background, height: 2}}/>

                <LiftPaySegmentView style={styles.segementViewStyle} ref={(e) => this.topSegmentView = e} onSelectedIndexChange={(selectIndex) => {
                    this._selectSegmentView(selectIndex);
                }}>
                </LiftPaySegmentView>
                {/*x================end==============x*/}

                <LiftPayScrollView ref={(view) => this.contentView = view} style={{flex: 1}} count={2} selectIndex={this.props.selectIndex} bounces={true}
                    onSelectIndexChange={(index) => {
                        this._scrollViewDidEndScroll(index);
                    }}>
                    <ListView
                        // style = {{flex : 1}}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) =>
                            <LiftPayCell
                                titleString={rowData.title}
                                cellType={0}
                                timeString={rowData.time}
                                payTimeString={this.selectCellType === 0 ? '' : rowData.payTime}
                                id={rowData.id}
                                didSelectCellItem={(cellType, isSelect, payId) => {
                                    // alert('cellType = ' + cellType + 'isSelect = ' + isSelect);
                                    this._didSelectCellClick && this._didSelectCellClick(payId, rowData.title, isSelect);
                                }}
                            />
                        }
                    />

                    <ListView
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) =>
                            <LiftPayCell
                                titleString={rowData.title}
                                cellType={1}
                                timeString={rowData.time}
                                payTimeString={this.selectCellType === 0 ? '' : rowData.payTime}
                                didSelectCellItem={(cellType, isSelect, payId) => {
                                    // alert('cellType = ' + cellType + 'isSelect = ' + isSelect);
                                    alert('do nothing!!!');
                                }}
                            />
                        }
                    />

                </LiftPayScrollView>

                {/*支付View 占用1/5空间*/}
                {bottomView}

                {/*floatView*/}
                {floatView}

                {/*<View style = {{flex : 1,alignItems: 'center',justifyContent:'center'}}>*/}
                {/*<ScrollView*/}
                {/*ref={(e) => this.scrollView = e}*/}
                {/*contentOffset={{*/}
                {/*x: 0,//this.state.width * this.state.initialSelectedIndex,*/}
                {/*y: 0,*/}
                {/*}}*/}
                {/*style={[styles.scrollViewStyle,{backgroundColor : 'red'}]}*/}
                {/*horizontal={true}*/}
                {/*pagingEnabled={true}*/}
                {/*bounces={true}*/}
                {/*scrollsToTop={false}*/}
                {/*onScroll={this.handleHorizontalScroll}*/}
                {/*scrollEventThrottle={100}*/}
                {/*removeClippedSubviews={true}*/}
                {/*automaticallyAdjustContentInsets={false}*/}
                {/*directionalLockEnabled={true}*/}
                {/*showsHorizontalScrollIndicator={false}*/}
                {/*showsVerticalScrollIndicator={false}*/}
                {/*onLayout={this.adjustCardSize}*/}
                {/*>*/}
                {/*<ListView*/}
                {/*dataSource = {this.state.dataSource}*/}
                {/*renderRow ={(rowData) =>*/}
                {/*<LiftPayCell*/}
                {/*titleString= {rowData.title}*/}
                {/*cellType = {this.selectCellType}*/}
                {/*timeString = {rowData.time}*/}
                {/*payTimeString = {this.selectCellType === 0 ? '': rowData.payTime}*/}
                {/*didSelectCellItem={(cellType,isSelect,payId) => {*/}
                {/*alert('cellType = ' + cellType + "isSelect = " + isSelect);*/}
                {/*}}*/}
                {/*/>*/}
                {/*}*/}
                {/*/>*/}
                {/*</ScrollView>*/}
                {/*</View>*/}


            </View>
        );
    }

    /*内部接口区*/
    _selectUserInfo() {
        // alert('xxxxx');
        this.setState({
            isShowFloatView: !this.state.isShowFloatView,
        });

    }

    _selectSegmentView(index) {
        // alert(index);
        this.selectCellType = index;
        if (this.state.onSelectIndex !== index) {
            this.setState({
                onSelectIndex: index,
            });
        }

        this.contentView.goToPage(index);
    }

    _scrollViewDidEndScroll(index) {
        // this._selectSegmentView(index);
        // 刷新segementView试图         ----- > 没有刷新成功!!!!! warning
        // this.topSegmentView.state.selectIndex = index;
        this.selectCellType = index;
        if (this.state.onSelectIndex !== index) {
            this.setState({
                onSelectIndex: index,
            });
        }
        this.topSegmentView.resetSegmentIndex(index);
    }

    segmentedPress(index: number) {
        alert('scrollView to index ' + index);
    }

    // 代缴费中点击cell时间处理
    _didSelectCellClick(id: number, price: number, isSelect: boolean) {

        if (isSelect === true) {
            if (id >= 0 && price >= 0) {
                this.selectDict[id] = price;
            }
        } else {
            this.selectDict[id] = 0;
        }

        // 计算整体的priceDict总和
        var totalPrice = 0;
        for (var key in this.selectDict) {
            let keyPrice = this.selectDict[key];
            if (keyPrice > 0) {
                totalPrice += keyPrice;
            }
        }

        this._reloadPriceViewWithTotalPrice(totalPrice);

    }

    // 修改价格显示view
    _reloadPriceViewWithTotalPrice(totalPrice) {
        this.setState({
            // isReloadForDidSelectItem : !this.state.isReloadForDidSelectItem,
            allTotalCount: totalPrice,
        });
    }

    /*网络请求接口区*/
    async requestData() {
        try {
            let response = await fetch(api.recommend);
            let json = await
                response.json();
            let dataList = json.data.map(
                (info) => {
                    return {
                        id: info.id,
                        title: info.price,  //info.mname
                        timeString: `[${info.range}]${info.title}`,
                        payTime: info.mname,    //info.price
                        time: info.name,
                    };
                }
            );

            dataList.sort(() => {
                return 0.5 - Math.random();
            });

            // 刷新数据
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(dataList)
            });
        }
        catch (error) {
            alert(error);
        }

    }
}

const styles = StyleSheet.create({

    constainer: {
        // backgroundColor:color.background,
        flexDirection: 'column',
        flex: 1,
    },
    scrollViewStyle: {
        // width:screen.width,
        // height : 200,
        backgroundColor: 'white',
        // marginTop : 200,
    },
    segementViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatViewContainerStyle: {
        borderRadius: 5,
        alignItems: 'flex-start',
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: 10,
    },
    floatViewTitleStyle: {
        fontSize: 14,
        color: '#18B7FF',
        textAlign: 'left',
        paddingBottom: 3,
    },
    floatViewContentTextStyle: {
        fontSize: 13,
        color: 'black',
        textAlign: 'left'
    },
});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

//make this component available to the app
export default connect(select)(NewLifePayScene);