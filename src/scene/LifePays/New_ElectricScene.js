/**
 * Created by kunpan on 2017/8/8.
 */
import React, {PureComponent} from 'react';
import {StyleSheet,
    Text,
    View,
    ListView,
    ScrollView,
    TextInput,
} from 'react-native';

import {color,SpacingView} from '../../widget/index';
import {GlobalTitle} from '../../Global';
import BaseStyleConfig from '../../config/BaseStyleConfig';
import ImageAndTitleCell from './ImageAndTitleCell';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import New_ShowElectricView from './New_ShowElectricView';

let textInputHeight = 30;

export default class New_ElectricScene extends PureComponent
{

    showElectriView : New_ShowElectricView;
    // 点击选择address
    selectAddress : string;

    static navigationOptions = () => ({
        headerTitle : (
            <Text style={BaseStyleConfig.baseNaviTitleStyle}>
                {GlobalTitle.lifePayElectricTitle}
            </Text>
        ),
        headerStyle: {backgroundColor: color.theme},
    });

    constructor(props)
    {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged : (r1,r2) => r1 != r2
        });
        this.state = {
            dataSource : ds.cloneWithRows([]),
            // 是否点击刷新试图
            isReloadForDidSelectItem : false,
            //
            addressArray : [],
            // remainNumber
            remainNumber : 0,
            // updateTime
            updateTime : '',
        };

        this.selectAddress = '';

        this._requestGetAddress = this._requestGetAddress.bind(this);
        this._requesElectricNumber = this._requesElectricNumber.bind(this);
        this._requestElecricRemainNumber = this._requestElecricRemainNumber.bind(this);
        // 对象初始化的时候请求用户地址信息
        this._requestGetAddress();

    }

    render() {
        let bottomView =
            <View style={{backgroundColor: 'white', flexDirection: 'column', flex: 0.15 * 3 /5.5}}>
                <View style={{backgroundColor: 'blue',flex : 1, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 15, color: 'white'}} onPress={() => {
                    }}>
                        {'支 付'}
                    </Text>
                </View>
            </View>;

        let titleString = GlobalValue.userInfo && GlobalValue.userInfo.title;
        let substring = GlobalValue.userInfo && GlobalValue.userInfo.uname;

        return (
            <View style = {styles.container}>
                <ScrollView
                    style = {styles.container}
                    pagingEnabled={true}
                    bounces={true}
                    scrollsToTop={false}
                    scrollEventThrottle={100}
                    removeClippedSubviews={true}
                    automaticallyAdjustContentInsets={false}
                    directionalLockEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <ImageAndTitleCell titleString = {titleString}
                        substring = {substring}
                        desString = {this.state.addressArray.length > 0 ? this.state.addressArray[0]: '该用户下没有地址'}
                        isShowLeftIcon= {true}
                        isShowRightIcon={true}
                        source={'gps'}
                        selectOnPress={() =>
                            this._selectUserInfo && this._selectUserInfo()
                        }
                    >
                    </ImageAndTitleCell>

                    <SpacingView style={{backgroundColor: color.background,height: 2}} />

                    <SpacingView style={{backgroundColor: '#f5f',height: 10}} />

                    <New_ShowElectricView
                        ref = {(view) => this.showElectriView = view}
                        onSelectElectBtnClick = {() => {
                            if(this.selectAddress.length > 0)
                            {
                                this._requesElectricNumber(this.selectAddress);
                            }
                        }}
                        remainNumber = {this.state.remainNumber}
                        updateTime = {this.state.updateTime}
                    >
                    </New_ShowElectricView>

                    <SpacingView style={{backgroundColor: '#f5f',height: 10}} />

                    <View style = {{marginLeft: 20,marginRight: 20,borderRadius : 5,borderColor : 'black',backgroundColor :'white',alignItems : 'center',justifyContent : 'center'}}>
                        <TextInput style = {styles.textInputStyle} placeholder = {'缴费金额0.01~500(¥)'} >
                        </TextInput>
                    </View>

                </ScrollView>

                {bottomView}
            </View>
        );

    }

    /*获取该用户下address*/
    _requestGetAddress()
    {
        let paramsMap = {
            'service' : 'Esfixs.Choose_address',
            'time' : (new Date().valueOf()),
            'tag' : GlobalValue.blockInfo && GlobalValue.blockInfo.tag,};
        let _this = this;
        get(paramsMap,function (data) {
            if(data.code === 0)
            {
                if (data.info)
                {
                    // 刷新界面
                    _this.setState({
                        addressArray: data.info,
                    });
                    // // 请求list data
                    // _this.requestData(data.info && data.info[0],1,);
                    _this._requestElecricRemainNumber(data.info && data.info[0]);
                    _this.selectAddress = data.info && data.info[0];
                }
            }

        },function (error) {
            alert('_requestGetAddress fail error =' + error);
        });
    }
    /*拉去用户电费信息 --- 发送指令集 让后台去更新电费最新数据*/
    _requestElecricRemainNumber(address : string)
    {
        let paramsMap = {
            'service' : 'Lifepay.Residual',
            'time' : (new Date().valueOf()),
            'tag' : GlobalValue.blockInfo && GlobalValue.blockInfo.tag,'address' : address,};
        let _this = this;
        get(paramsMap,function (data) {
            if(data.code === 0)
            {
                _this.setState({
                    remainNumber : parseInt(data.info.residual),
                    updateTime : data.info.update_time,
                });
            }
        },function (error) {
            alert('_requesElectricNumber error = ' + error);
        });
    }

    /*发送查询指令集 后台会返回一个字段is_lock来去判断用户支付的操作功能*/
    _requesElectricNumber(address : string)
    {
        let paramsMap = {
            'service' : 'Lifepay.Elecinfor',
            'time' : (new Date().valueOf()),
            'tag' : GlobalValue.blockInfo && GlobalValue.blockInfo.tag,'address' : address,};
        let _this = this;
        get(paramsMap,function (data) {
            if(data.code === 0)
            {
                _this.setState({
                    isReloadForDidSelectItem : !_this.state.isReloadForDidSelectItem,
                });
                _this.showElectriView.resetShowElectriView();
                alert('余额查询中，请于20分钟之后再进入此页面查看','温馨提示');
            }

        },function (error) {
            alert('_requesElectricNumber error = ' + error);
        });
    }
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        flex : 1,
    },
    textInputStyle : {
        color : 'orange',
        fontSize: 16,
        textAlign: 'center',
        height : textInputHeight,
        margin : 10,
    },
});