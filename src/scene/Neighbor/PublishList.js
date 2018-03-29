import React, {PureComponent} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {color} from '../../widget';
import {screen} from '../../common';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import {Heading1, Paragraph} from '../../widget/Text';

class PublishList extends PureComponent {

    state: {
        dataList: [],
        refreshing: boolean,
    };

    constructor(props: Object) {
        super(props);
        this.state = {dataList: [], refreshing: false};

        {
            (this: any).requestData = this.requestData.bind(this);
        }
    }

    componentDidMount() {
        this.requestData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            if (nextProps.isLoggedIn) {
                this.requestData();
            }
        }
    }

    keyExtractor(item: Object) {
        return item.id;
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.List_neighbor',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'type': _this.props.type,
            'page': 1,
            'num': 6,
            'pid': 0
        };
        get(paramMap, function (data) {
            let dataList = data.info;

            if (dataList) {
                _this.setState({
                    dataList: dataList,
                    refreshing: false
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    renderCell(info: Object) {
        return (
            <TouchableOpacity style={styles.cellContainer} onPress={() => this.props.navigation.navigate('PublishDetailScene', {id: info.item.id})}>
                <Image style={{width: 60, height: 60, borderWidth: screen.onePixel, borderColor: color.border}} source={require('../../img/logo_180x180.png')}/>
                <View style={{flex: 1, marginLeft: 8}}>
                    <Heading1 numberOfLines={0} style={{color: color.theme}}>{info.item.type_name}</Heading1>
                    <Paragraph numberOfLines={0} style={{color: color.theme, marginTop: 12}}>{info.item.title}</Paragraph>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Paragraph numberOfLines={0} style={{color: color.theme}}>{info.item.linkman}</Paragraph>
                    <Paragraph numberOfLines={0} style={{color: color.theme, marginTop: 12}}>{info.item.ctime}</Paragraph>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderCell.bind(this)}
                    // onEndReached={this.requestPersonData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    cellContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
});

export default PublishList;