import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color, EditText} from '../../widget';
import {screen} from '../../common';
import {get} from '../../api';
import {GlobalKey, GlobalValue} from '../../Global';
import {Heading1, Paragraph} from '../../widget/Text';
import StorageUtil from '../../common/StorageUtil';

class PublishSearchScene extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <View style={styles.searchBar}>
                <EditText underlineColorAndroid='transparent' style={styles.editText} placeholder='请输入关键字' defaultValue={navigation.state.params.keyWord} onChangeText={(text) => {
                    navigation.state.params.onKeywordChange && navigation.state.params.onKeywordChange(text);
                }}/>
            </View>
        ),
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.onSearchPress && navigation.state.params.onSearchPress()}>
                <Text style={{margin: 10, color: 'white', fontSize: 16}}>搜索</Text>
            </TouchableOpacity>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    state: {
        historyList: [],
        dataList: [],
        refreshing: boolean,
    };

    historyList: [];
    keyWord: string;

    constructor(props: Object) {
        super(props);
        this.historyList = [];
        this.keyWord = '';
        this.state = {historyList: [], dataList: [], refreshing: false};

        {
            (this: any).requestData = this.requestData.bind(this);
        }
        {
            (this: any).onKeywordChange = this.onKeywordChange.bind(this);
        }
        {
            (this: any).onSearchPress = this.onSearchPress.bind(this);
        }
        {
            (this: any).renderHistoryCell = this.renderHistoryCell.bind(this);
        }
        {
            (this: any).renderFootView = this.renderFootView.bind(this);
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onKeywordChange: this.onKeywordChange,
            onSearchPress: this.onSearchPress
        });
        this.loadSearchHistory();
    }

    loadSearchHistory() {
        let _this = this;
        StorageUtil.selectObject(GlobalKey.PUBLISH_SEARCH, function (data) {
            if (data) {
                _this.historyList = data;
                _this.setState({historyList: JSON.parse(JSON.stringify(_this.historyList))});//这样写是为了深copy
            }
        });
    }

    onKeywordChange(text) {
        this.keyWord = text;
        if (!this.keyWord || this.keyWord === '') {
            this.setState({
                historyList: JSON.parse(JSON.stringify(this.historyList)),//这样写是为了深copy
                dataList: []
            });
        }
    }

    onSearchPress() {
        if (this.keyWord && this.keyWord !== '') {
            alert('正在搜索...需要加个菊花图');
            for (let i = 0; i < this.historyList.length; i++) {//判断是否已经在历史记录里
                if (this.keyWord === this.historyList[i]) {
                    this.historyList.splice(i, 1);//先删掉，后面好置前，也避免历史记录重复
                }
            }
            this.historyList.unshift(this.keyWord);
            if (this.historyList.length > 5) {
                this.historyList.splice(5, this.historyList.length - 5);
            }
            StorageUtil.storageSave(GlobalKey.PUBLISH_SEARCH, this.historyList);
            this.requestData();
        }
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.List_neighbor',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'type': 0,
            'page': 1,
            'num': 6,
            'pid': 0,
            'title': _this.keyWord
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

    historyKeyExtractor(item: Object) {
        return item;
    }

    keyExtractor(item: Object) {
        return item.id;
    }

    renderHistoryCell(info: Object) {
        return (
            <TouchableOpacity style={styles.cellContainer} onPress={() => {
                this.props.navigation.setParams({keyWord: info.item});
                this.keyWord = info.item;
                this.onSearchPress();
            }}>
                <Heading1 style={{flex: 1}}>{info.item}</Heading1>
            </TouchableOpacity>
        );
    }

    renderFootView() {
        if (this.state.historyList.length === 0) {
            return null;
        }
        return (
            <TouchableOpacity
                style={{padding: 10, borderBottomWidth: screen.onePixel, borderColor: color.border, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',}}
                onPress={() => {
                    this.historyList = [];
                    this.setState({historyList: []});
                    StorageUtil.storageSave(GlobalKey.PUBLISH_SEARCH, this.historyList);
                }}>
                <Text style={{fontSize: 16}}>清除历史记录</Text>
            </TouchableOpacity>
        );
    }

    renderCell(info: Object) {
        return (
            <TouchableOpacity style={styles.cellContainer}>
                <Heading1 style={{flex: 1}}>{info.item.title}</Heading1>
                <Paragraph numberOfLines={0} style={{color: color.theme, marginTop: 12}}>{info.item.owner}</Paragraph>
            </TouchableOpacity>
        );
    }

    render() {
        let historyList =
            <FlatList
                data={this.state.historyList}
                keyExtractor={this.historyKeyExtractor}
                renderItem={this.renderHistoryCell}
                ListFooterComponent={this.renderFootView}/>;
        let searchList =
            <FlatList
                data={this.state.dataList}
                keyExtractor={this.keyExtractor}
                onRefresh={this.requestData}
                refreshing={this.state.refreshing}
                renderItem={this.renderCell}
                // onEndReached={this.requestPersonData(this.person_page_index)}
                // 加载更多
                onEndReachedThreshold={10}/>;
        let listView = this.state.dataList && this.state.dataList.length > 0 ? searchList : historyList;

        return (
            <View style={styles.container}>
                {listView}
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
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
    searchBar: {
        width: screen.width * 0.65,
        height: 40,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
        alignSelf: 'center',
    },
    editText: {
        flex: 1,
        fontSize: 16,
        backgroundColor: '#eeeeee',
    }
});

export default PublishSearchScene;