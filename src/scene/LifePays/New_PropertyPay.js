/**
 * Created by kunpan on 2017/8/7.
 */
import React, {PureComponent} from 'react';
import {StyleSheet,
    Text,
    View,
    ListView,
} from 'react-native';

import {color,SpacingView} from '../../widget/index';
import {GlobalTitle} from '../../Global';
import BaseStyleConfig from '../../config/BaseStyleConfig';
import ImageAndTitleCell from './ImageAndTitleCell';
import LiftPayScrollView from './LiftPayScrollView';
import LiftPayCell from './LiftPayCell';
import api from '../../api';
import {get} from '../../api';
import {GlobalValue} from '../../Global';


export default class New_PropertyPay extends PureComponent
{

    selectDict : {};        /// < 获取点击电费的item选项

    static navigationOptions = () => ({
        headerTitle : (
            <Text style={BaseStyleConfig.baseNaviTitleStyle}>
                {GlobalTitle.lifeTitle}
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
            // 修改显示的账单的钱数
            allTotalCount : 0,
            //
            addressArray : [],
        };

        this.selectDict = {};

        this.requestData = this.requestData.bind(this);
        this._reloadPriceViewWithTotalPrice = this._reloadPriceViewWithTotalPrice.bind(this);
        this._didSelectCellClick = this._didSelectCellClick.bind(this);
        this._requestGetAddress = this._requestGetAddress.bind(this);

        this._requestGetAddress();
    }

    render()
    {
        let bottomView =
            <View style = {{backgroundColor:'white',flexDirection : 'column',flex : 0.15}}>
                <View style = {{backgroundColor : 'orange',flex : 2.5,justifyContent:'center'}}>
                    <Text style={{textAlign: 'center',fontSize : 15,color:'#f5f5f5'}}>
                        {'已选账单费用合计: ' + this.state.allTotalCount + '元'}
                    </Text>
                </View>
                <View style = {{backgroundColor : 'blue',flex : 3,justifyContent:'center'}}>
                    <Text style={{textAlign: 'center',fontSize : 15,color:'white'}} onPress={() =>{

                    }}>
                        {'支 付'}
                    </Text>
                </View>
            </View> ;

        let titleString = GlobalValue.userInfo && GlobalValue.userInfo.title;
        let substring = GlobalValue.userInfo && GlobalValue.userInfo.uname;

        return(
            <View style = {styles.container}>
                <ImageAndTitleCell titleString = {titleString} //'血刃'
                    substring = {substring}//'1897025643'
                    // desString= '燕郊天洋城4代二期30号楼1单元901室x'
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

                <LiftPayScrollView ref={(view) => this.contentView = view} style={{flex: 1}} count={1} selectIndex={0} bounces={true} onSelectIndexChange={(index)=>{
                }}>
                    <ListView
                        // style = {{flex : 1}}
                        enableEmptySections = {true}
                        dataSource = {this.state.dataSource}
                        renderRow ={(rowData) =>
                            <LiftPayCell
                                titleString= {rowData.title}
                                cellType={0}
                                timeString = {rowData.timeString}
                                payTimeString = {this.selectCellType === 0 ? '': rowData.payTime}
                                id = {rowData.id}
                                didSelectCellItem={(cellType,isSelect,payId) => {
                                    // alert('cellType = ' + cellType + 'isSelect = ' + isSelect);
                                    this._didSelectCellClick && this._didSelectCellClick(payId,rowData.title,isSelect);
                                }}
                            />
                        }
                    />

                </LiftPayScrollView>


                {bottomView}
            </View>
        );
    }

    /*内部接口区*/
    // 代缴费中点击cell时间处理
    _didSelectCellClick(id : number,price : number,isSelect : boolean)
    {

        if(isSelect === true)
        {
            if(id >= 0 && price >= 0)
            {
                this.selectDict[id] = price;
            }
        }else
        {
            this.selectDict[id] = 0;
        }

        // 计算整体的priceDict总和
        var totalPrice = 0;
        for(var key in this.selectDict)
        {
            let keyPrice = this.selectDict[key];
            if(keyPrice > 0)
            {
                totalPrice += keyPrice;
            }
        }

        this._reloadPriceViewWithTotalPrice(totalPrice);
    }

    // 修改价格显示view
    _reloadPriceViewWithTotalPrice(totalPrice)
    {
        this.setState({
            // isReloadForDidSelectItem : !this.state.isReloadForDidSelectItem,
            allTotalCount : totalPrice,
        });
    }

    /*网络请求接口区*/

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
                    // 请求list data
                    _this.requestData(data.info && data.info[0],1,);
                }
            }

        },function (error) {
            alert('_requestGetAddress fail error =' + error);
        });
    }
    /*获取代缴电费列表数据*/
    requestData(address : string,page : number)
    {
        // let new_AddressString = (address.length > 0 ? address : '');
        // try {
        //     let response = await fetch(api.recommend);
        //     let json = await
        //         response.json();
        //     let dataList = json.data.map(
        //         (info) => {
        //             return {
        //                 id: info.id,
        //                 title: info.price,  //info.mname
        //                 timeString: `[${info.range}]${info.title}`,
        //                 payTime: info.mname,    //info.price
        //                 time : info.name,
        //             };
        //         }
        //     );
        //
        //     dataList.sort(() => {
        //         return 0.5 - Math.random();
        //     });
        //
        //     // 刷新数据
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(dataList)
        //     });
        // }
        // catch (error)
        // {
        //     alert(error);
        // }

        let paramMap = {
            'service' : 'Esfixs.Pay_list',
            'time' : (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo && GlobalValue.blockInfo.tag,
            'address' : address, //'燕郊天洋城4代二期19号楼1单元1205室'
            'type' : '1',
            'page' : page,
            'limit' : '10',
        };
        let _this = this;
        get(paramMap,function (data) {
            if(data.code === 0)
            {
                let dataList = data.info.map(
                    (dataInfo) => {
                        return{
                            id :    dataInfo.bid,
                            title:  dataInfo.field4,
                            timeString : dataInfo.field5,
                        };
                    }
                );
                if(dataList.length > 0)
                {
                    // 刷新数据
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(dataList)
                    });
                }

            }
        },function (error) {
            alert('request Propertypay list error = ' + error);
        });

    }
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        flex : 1,
    },
});