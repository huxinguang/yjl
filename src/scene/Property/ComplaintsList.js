import React, {PureComponent} from 'react';
import {DeviceEventEmitter, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {color, icon, Separator, StarScore} from '../../widget';
import {screen} from '../../common';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import PropTypes from 'prop-types';

class ComplaintsList extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>我的投诉</Text>
        ),
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('AddComplaintScene', {})}>
                <Text style={{margin: 10, color: 'white', fontSize: 22, fontFamily: 'iconfont'}}>{icon('phone')}</Text>
            </TouchableOpacity>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    props: {
        navigation: PropTypes.object
    };

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
        this.subscription = DeviceEventEmitter.addListener('CommentComplaintSuccess', () => this.requestData());
        this.subscription = DeviceEventEmitter.addListener('CancelComplaintSuccess', () => this.requestData());
        this.subscription = DeviceEventEmitter.addListener('AddComplaintSuccess', () => this.requestData());
        this.requestData();
    }

    componentWillUnmount() {
        this.subscription.remove();
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

    keyExtractor(item: Object) {
        return item.bid;
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Complaint_list',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block,
            'type': 1,
            'page': 1,
            'limit': 5
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
            <TouchableOpacity style={styles.cellContainer} onPress={() => {
                this.props.navigation.navigate('ComplaintDetailScene', {bidString: info.item.bid});
            }}>
                <View style={styles.topSubcontainer}>
                    <Text style={styles.leftText}>投诉单号</Text>
                    <Text style={styles.centerText}>{info.item.field1}</Text>
                    <Text
                        style={[styles.rightText, {color: this._getColorWithStatus(info.item.field17)}]}>{info.item.field17}</Text>
                </View>
                <Text style={styles.complaintContent}>{info.item.field6}</Text>
                <View style={styles.bottomSubcontainer}>
                    <Text style={styles.leftText}>投诉时间</Text>
                    <Text style={[styles.centerText, {color: '#999999'}]}>{info.item.field7}</Text>
                    <View style={{flex: 1}}/>
                    {info.item.field17 === '已处理' ? this._renderScoreBtn(info.item.bid) : null}
                    {(info.item.field17 === '已评价' || info.item.field17 === '已回访') ? this._renderScore(info.item.field11) : null}
                </View>
            </TouchableOpacity>
        );
    }

    _renderScore(score) {
        return <StarScore originalScore={parseInt(score)}
            style={{height: 16, width: 95, marginRight: 10}}
            starStyle={{marginLeft: 5, fontSize: 14}}
            scoreAble={false}/>;
    }

    _renderScoreBtn(bid: string) {
        return <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('ScoreScene', {bidString: bid, type: 'Complaint'});
        }}>
            <View style={styles.scoreBtn}>
                <Text style={{color: 'white', fontSize: 12, textAlign: 'center'}}>去评价</Text>
            </View>
        </TouchableOpacity>;
    }

    renderEmptyView() {
        return (
            <View style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cccccc'}}>
                <Text style={{fontSize: 16, color: '#333333'}}>列表为空</Text>
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
                    renderItem={this.renderCell.bind(this)}
                    ListEmptyComponent={this.renderEmptyView}
                    // onEndReached={this.requestPersonData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}
                    ItemSeparatorComponent={this._separator}/>

            </View>
        );
    }

    _separator() {
        return <Separator/>;
    }

    _getColorWithStatus(status: string) {

        switch (status) {
        case '待处理':
            return 'red';
        case '已派工':
            return color.theme;
        case '已处理':
            return 'black';
        case '已评价':
            return 'green';
        case '已回访':
            return 'green';
        case '已取消':
            return 'darkgray';
        default:
            return 'black';
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    // cellContainer: {
    //     flexDirection: 'row',
    //     padding: 10,
    //     borderBottomWidth: screen.onePixel,
    //     borderColor: color.border,
    //     backgroundColor: 'white',
    // },

    cellContainer: {
        flex: 1,
        height: 75,
        backgroundColor: 'white',
        paddingTop: 8,
        paddingBottom: 8
    },
    topSubcontainer: {
        flexDirection: 'row',
        height: 15,
        width: screen.width,
        alignItems: 'center',
    },
    bottomSubcontainer: {
        flexDirection: 'row',
        height: 15,
        width: screen.width,
        alignItems: 'center',
    },
    leftText: {
        fontSize: 14,
        color: '#999999',
        marginLeft: 10
    },
    complaintContent: {
        fontSize: 14,
        color: color.theme,
        width: screen.width - 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 7,
        marginBottom: 7,
    },
    centerText: {
        fontSize: 14,
        marginLeft: 15,
        marginRight: 10
    },
    rightText: {
        flex: 1,
        fontSize: 14,
        width: 60,
        marginRight: 10,
        textAlign: 'right',
    },
    scoreBtn: {
        width: 45,
        height: 18,
        backgroundColor: 'gold',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    }

});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

export default connect(select)(ComplaintsList);