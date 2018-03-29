/**
 * Created by kunpan on 2017/8/9.
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
import LiftPayCell from './LiftPayCell';
import api from '../../api';

export default class New_PaymentRecordScene extends PureComponent
{
    static navigationOptions = () => ({
        headerTitle : (
            <Text style={BaseStyleConfig.baseNaviTitleStyle}>
                {GlobalTitle.lifePayNaviRightTitle}
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
        };

        this.requestData = this.requestData.bind(this);

        this.requestData();
    }

    render()
    {
        return(
            <ListView
                style = {styles.constainer}
                enableEmptySections = {true}
                dataSource = {this.state.dataSource}
                renderRow ={(rowData) =>
                    <LiftPayCell
                        titleString= {rowData.title}
                        cellType={1}
                        timeString = {rowData.time}
                        payTimeString = {this.selectCellType === 0 ? '': rowData.payTime}
                        didSelectCellItem={(cellType,isSelect,payId) => {
                            // alert('cellType = ' + cellType + 'isSelect = ' + isSelect);
                            alert('do nothing!!!');
                        }}
                    />
                }
            />
        );
    }

    /*网络请求接口区*/
    async requestData()
    {
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
                        time : info.name,
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
        catch (error)
        {
            alert(error);
        }

    }
}

const styles = StyleSheet.create({
    constainer :{
        backgroundColor:'white',
        flexDirection : 'column',
        flex : 1,
    },
});