/**
 * Created by Administrator on 2017/7/4.
 */
import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {PropTypes} from 'prop-types';
import {color, EmptyRefreshView} from '../../widget';
import {Heading1, Paragraph} from '../../widget/Text';
import {get} from '../../api';

import {screen} from '../../common';

class AreaSelection extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>选择小区</Text>
        ),
        headerRight: (
            <View/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    static propTypes = {
        navigation: PropTypes.object
    };

    state: {
        dataList: Array<Object>,
        refreshing: boolean,
    };

    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
            refreshing: false,
        };

        (this: any).requestData = this.requestData.bind(this);
        (this: any).renderCell = this.renderCell.bind(this);
        (this: any).onCellSelected = this.onCellSelected.bind(this);
    }

    componentDidMount(): void {
        this.requestData();
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}
                    ListEmptyComponent={this.renderEmptyView()}
                    renderItem={this.renderCell}/>
            </View>
        );
    }

    requestData() {
        this.setState({refreshing: true});
        this.requestArea();
    }

    requestArea() {
        let _this = this;
        const paramMap = {'service': 'User.Get_block_conf', 'time': (new Date()).valueOf()};
        // const paramMap = {'service': 'Testconfig.Get_block_conf', 'time': (new Date()).valueOf()};

        get(paramMap, function (data) {
            let dataList = data.info.map(
                (info) => {
                    return {
                        id: info.id,
                        address: info.address,
                        block: info.block
                    };
                }
            );
            _this.setState({
                dataList: dataList,
                refreshing: false,
            });
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    renderEmptyView() {
        return (
            <EmptyRefreshView style={{height: screen.height / 3}} text={'暂无小区信息'} onRefresh={this.onRefreshClick}/>
        );
    }

    onRefreshClick() {
        alert('刷新');
    }

    renderCell(info: Object) {
        return (
            <TouchableOpacity style={{backgroundColor: color.background, borderBottomWidth: screen.onePixel, borderColor: color.border, padding: 10,}} onPress={() => {
                this.onCellSelected && this.onCellSelected(info.item);
            }}>
                <Heading1>{info.item.block}</Heading1>
                <Paragraph numberOfLines={0} style={{marginTop: 8}}>{'地址：' + info.item.address}</Paragraph>
            </TouchableOpacity>
        );
    }

    onCellSelected(info: Object) {
        if (this.props.navigation.state.params.getBlock) {
            //回调传值给上个页面
            this.props.navigation.state.params.getBlock(info);
        }
        const backAction = NavigationActions.back({
            // key: 'Login'
        });
        this.props.navigation.dispatch(backAction);
    }

    keyExtractor(item: Object, index: number) {
        return item.id;
    }

    forgotPassword() {
        alert('forgotPassword');
    }

    register() {
        alert('register');
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
});

export default AreaSelection;