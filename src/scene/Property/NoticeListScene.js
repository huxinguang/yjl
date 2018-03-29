import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../../widget';
import {screen} from '../../common';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import {Heading2, Paragraph} from '../../widget/Text';

class NoticeListScene extends PureComponent {
    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>通知公告</Text>
        ),
        headerRight: (
            <Text/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    state: {
        expressList: [],
        refreshing: boolean,
    };

    constructor(props: Object) {
        super(props);
        this.state = {expressList: [], refreshing: false};

        {
            (this: any).requestData = this.requestData.bind(this);
        }
    }

    componentDidMount() {
        this.requestData();
    }

    keyExtractor(item: Object) {
        return item.nid;
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Notice_list',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block,
            'page': 1,
            'num': 5
        };
        get(paramMap, function (data) {
            let dataList = data.info;

            if (dataList) {
                _this.setState({
                    expressList: dataList,
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
            <TouchableOpacity style={styles.cellContainer} onPress={() => this.props.navigation.navigate('NoticeDetailScene', {id: info.item.nid})}>
                <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: 'red'}}/>
                <Heading2 style={{flex: 1, marginLeft: 5}}>{info.item.title}</Heading2>
                <Paragraph numberOfLines={0} style={{}}>{info.item.pub_time}</Paragraph>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.expressList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderCell.bind(this)}
                    // onEndReached={this.requestPersonData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}
                />
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
        height: 50,
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
});

export default NoticeListScene;