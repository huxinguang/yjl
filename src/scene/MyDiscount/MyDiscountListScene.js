/**
 * Created by kunpan on 2017/7/4.
 */
import React, {PureComponent} from 'react';
import {ListView, StyleSheet} from 'react-native';

import {RefreshState} from '../../widget';
import MyDiscountRefreshListView from './MyDiscountRefreshListView';
import {get} from '../../api';
import MyDiscountCell from './MyDiscountCell';
import PropTypes from 'prop-types';

/*
 该类是显示contentView 显示list、发送网络请求
 */

export default class MyDiscountListScene extends PureComponent {

    static propTypes = {
        currentIndex: PropTypes.number,
    };

    listView: MyDiscountRefreshListView;

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            // currentIndex : 0,       // default select index
        };
    }

    componentDidMount() {
        // 是否试图渲染完成之后 ---> 显示loadingRefresh在网络请求 显示数据
        this.listView.startHeadRefresh();
    }

    render() {
        return (
            <MyDiscountRefreshListView
                ref={(refreshView) => this.listView = refreshView}
                dataSource={this.state.dataSource}
                renderRow={(rowData) =>
                    <MyDiscountCell info={rowData}
                        onPress={() => {
                            this.props.navigation.navigate('GroupPurchase', {info: rowData});
                        }}
                        cellType={rowData.type}
                        currentIndex={this.props.currentIndex}
                    />
                }
                onHeadRefresh={() => this.requestData()}
                // onFootGetMore={() => this.requestGetMoreData()}
            />
        );
    }

    /*网络请求接口区*/
    requestData() {
        /*service=My.List_quan_unused*/
        let paramMap = null;
        if (this.props.currentIndex === 0) {
            // 为使用优惠券
            paramMap = {'service': 'My.List_quan_unused', 'time': (new Date()).valueOf(),};
        } else if (this.props.currentIndex === 1) {
            // 已使用优惠券
            paramMap = {'service': 'My.List_quan_used', 'time': (new Date()).valueOf(),};

        } else if (this.props.currentIndex === 2) {
            // 已过期优惠券
            paramMap = {'service': 'My.List_quan_overdue', 'time': (new Date()).valueOf(),};
        }
        let _this = this;
        get(paramMap, function (data) {
            let json = data;
            let dataList = json.info.map(
                (info) => {
                    return {
                        title: info.shop_name,
                        price: info.rule,
                        subtitle: `有效时间 ${info.s_time}至${info.e_time}\n(${info.remark})`,
                        type: parseInt(info.type),
                        imageUrl: '',
                    };
                }
            );
            // 刷新数据
            _this.setState({
                dataSource: _this.state.dataSource.cloneWithRows(dataList)
            });

            // 判断是否还有加载更多
            setTimeout(() => {
                _this.listView.endRefresh(RefreshState.NoMoreData);

            }, 500);
        }, function (error) {
            alert(error);
            _this.listView.endRefresh(RefreshState.Failure);
        });

        // try {
        //     // let response = await fetch(api.recommend);
        //     // let json = await response.json();
        //     // let dataList = json.data.map(
        //     //     (info) => {
        //     //         return{
        //     //             id: info.id,
        //     //             imageUrl: info.squareimgurl,
        //     //             title: info.mname,
        //     //             subtitle: `[${info.range}]${info.title}`,
        //     //             price: info.price,
        //     //             type : info.rating,
        //     //         }
        //     //     }
        //     // );
        //     //
        //     // dataList.sort(() => {
        //     //     return 0.5 - Math.random()
        //     // });
        //
        //     // 刷新数据
        //     this.setState({
        //         dataSource:this.state.dataSource.cloneWithRows(dataList)
        //     });
        //
        //     // 判断是否还有加载更多
        //     setTimeout(() => {
        //         /*
        //         let isHasGetMoreData = dataList.count < 30 ? false : true;
        //         if(isHasGetMoreData === true)
        //         {
        //             this.listView.endRefresh(RefreshState.Idle);
        //         }else
        //         {
        //             this.listView.endRefresh(RefreshState.NoMoreData);
        //         }
        //         */
        //         this.listView.endRefresh(RefreshState.NoMoreData);
        //
        //     }, 500);
        //
        // }catch (error){
        //     alert(error);
        //     this.listView.endRefresh(RefreshState.Failure);
        // }
    }

    /*内部接口区*/
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
