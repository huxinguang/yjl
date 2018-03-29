import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {color} from '../../widget';
import {screen} from '../../common';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import {Heading1, Paragraph} from '../../widget/Text';
// 测试能否显示出来emji图片
import ChatWBContentView from  './ChatView/ChatWBContentView';
import ChatListContentView from './ChatView/ChatListContentView';

class ChatList extends PureComponent {

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
        this.renderCell = this.renderCell.bind(this);
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
            'service': 'Neighbor.List_chat',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'type': _this.props.type,
            'page': 1,
            'num': 4,
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

// <TouchableOpacity style={styles.cellContainer}>
// {/*<Heading1 style={{flex: 1}}>{info.item.title}</Heading1>*/}
// {/*<Paragraph numberOfLines={0} style={{color: color.theme, marginTop: 12}}>{info.item.author}</Paragraph>*/}
// {/*<ChatListContentView info = {info}>*/}
// {/*</ChatListContentView>*/}
// <ChatWBContentView info={info}>
// </ChatWBContentView>
// </TouchableOpacity>

    renderCell(info: Object) {
        return (
            <View style = {styles.cellContainer}>
                <ChatWBContentView
                    info={info}
                    didSelectContentView={() => {
                        this.props.navigation.navigate('ChatDetailScene',{info : info});
                    }}
                >
                </ChatWBContentView>
            </View>
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
                    renderItem={this.renderCell}
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
        // padding: 10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
});

export default ChatList;