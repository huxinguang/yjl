//import liraries
import React, {PureComponent} from 'react';
import {DeviceEventEmitter, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {color, icon, SegmentedControl, Separator, StarScore, ViewPager} from '../../widget';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import {screen} from '../../common';

// create a component
class PropertyService extends PureComponent {

    personListView: FlatList;
    publicListView: FlatList;

    props: {
        navigation: PropTypes.object
    };

    state: {
        serviceType: number,
        personRefreshing: boolean,
        publicRefreshing: boolean,
        personList: Array<Object>,
        publicList: Array<Object>
    };

    person_page_index = 1;//页号
    public_page_index = 1;//页号

    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <SegmentedControl values={['我的报修', '公共报修']} style={{alignSelf: 'center', width: 250}} onChange={(i) => {
                navigation.state.params.segmentedPress && navigation.state.params.segmentedPress(i);
            }} selectedIndex={
                navigation.state.params.selectedIndex && navigation.state.params.selectedIndex
            }/>
        ),
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('AddFixScene', {})}>
                <Text style={{margin: 10, color: 'white', fontSize: 22, fontFamily: 'iconfont'}}>{icon('phone')}</Text>
            </TouchableOpacity>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    constructor(props: Object) {
        super(props);

        this.state = {
            serviceType: 0,
            personRefreshing: false,
            publicRefreshing: false,
            personList: [],
            publicList: []
        };

        {
            (this: any).segmentedPress = this.segmentedPress.bind(this);
        }
        {
            (this: any).requestPersonData = this.requestPersonData.bind(this);
        }
        {
            (this: any).requestPubicData = this.requestPubicData.bind(this);
        }
        {
            (this: any).requestPerson = this.requestPerson.bind(this);
        }
        {
            (this: any).requestPubic = this.requestPubic.bind(this);
        }
        {
            (this: any)._refresh = this._refresh.bind(this);
        }
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('CommentFixSuccess', () => this._refresh());
        this.subscription = DeviceEventEmitter.addListener('CancelFixSuccess', () => this._refresh());
        this.subscription = DeviceEventEmitter.addListener('AddFixSuccess', () => this._refresh());

        this.props.navigation.setParams({
            segmentedPress: this.segmentedPress,
            selectedIndex: 0
        });

        this.requestPerson();
        this.requestPubic();
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            if (nextProps.isLoggedIn) {
                this.requestPerson();
                this.requestPubic();
            } else {
                this.props.navigation.navigate('LoginScene', {});
            }
        }
    }

    render() {
        return (
            <ViewPager style={styles.container} count={2} selectedIndex={this.state.serviceType}
                onSelectedIndexChange={this.segmentedPress}>
                <FlatList
                    ref={(e) => this.personListView = e}
                    data={this.state.personList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestPerson}
                    refreshing={this.state.personRefreshing}
                    renderItem={this.renderCell.bind(this)}
                    ListEmptyComponent={this.renderEmptyView()}
                    // onEndReached={this.requestPersonData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}
                    ItemSeparatorComponent={this._separator}
                    // onPressItem = {this.onPressItem.bind(this)}

                />
                <FlatList
                    ref={(e) => this.publicListView = e}
                    data={this.state.publicList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestPubic}
                    refreshing={this.state.publicRefreshing}
                    renderItem={this.renderCell.bind(this)}
                    ListEmptyComponent={this.renderEmptyView()}
                    // onEndReached={this.requestPubicData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}
                    ItemSeparatorComponent={this._separator}

                />
            </ViewPager>
        );
    }

    _separator() {
        return <Separator/>;
    }

    segmentedPress(index: number) {
        this.setState({
            serviceType: index
        });
        this.props.navigation.setParams({selectedIndex: index});
    }

    keyExtractor(item: Object, index: number) {
        return item.bid;
    }

    _refresh() {
        this.requestPerson();
        this.requestPubic();
    }

    requestPerson() {
        this.setState({personRefreshing: true});
        this.requestPersonData(1);
    }

    requestPubic() {
        this.setState({publicRefreshing: true});
        this.requestPubicData(1);
    }

    requestPersonData(page: number) {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Esfix_list',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block,
            'type': 1,
            'page': page,
            'limit': 10
        };
        get(paramMap, function (data) {
            let dataList = data.info.map(
                (info) => {
                    return {
                        bid: info.bid,
                        field1: info.field1,
                        field2: info.field2,
                        field4: info.field4,
                        field7: info.field7,
                        field11: info.field11,
                        field17: info.field17
                    };
                }
            );
            if (dataList) {
                _this.setState({
                    personList: dataList,
                    personRefreshing: false
                });
                _this.person_page_index++;
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({personRefreshing: false});
        });
    }

    requestPubicData(page: number) {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Esfix_list',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block,
            'type': 2,
            'page': page,
            'limit': 10
        };
        get(paramMap, function (data) {
            let dataList = data.info.map(
                (info) => {
                    return {
                        bid: info.bid,
                        field1: info.field1,
                        field2: info.field2,
                        field4: info.field4,
                        field7: info.field7,
                        field11: info.field11,
                        field17: info.field17
                    };
                }
            );

            if (dataList) {
                _this.setState({
                    publicList: dataList,
                    publicRefreshing: false
                });
                _this.public_page_index++;
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({publicRefreshing: false});
        });
    }

    renderCell(info: Object) {
        return (
            <TouchableOpacity style={styles.cellContainer} onPress={() => {
                this.props.navigation.navigate('FixDetailScene', {bidString: info.item.bid});
            }}>
                <View style={styles.topSubcontainer}>
                    <Text style={styles.leftText}>报修单号</Text>
                    <Text style={styles.centerText}>{info.item.field1}</Text>
                    <Text
                        style={[styles.rightText, {color: this._getColorWithStatus(info.item.field17)}]}>{info.item.field17}</Text>
                </View>
                <Text style={styles.fixContent} numberOfLines={1}>{info.item.field4}</Text>
                <View style={styles.bottomSubcontainer}>
                    <Text style={styles.leftText}>报修时间</Text>
                    <Text style={[styles.centerText, {color: '#999999'}]}>{info.item.field7}</Text>
                    <View style={{flex: 1}}/>
                    {info.item.field17 === '已处理' ? this._renderScoreBtn(info.item.bid) : null}
                    {(info.item.field17 === '已评价' || info.item.field17 === '已回访') ? this._renderScore(info.item.field11) : null}
                </View>
            </TouchableOpacity>

        );
    }

    renderEmptyView() {
        return (
            <View style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cccccc'}}>
                <Text style={{fontSize: 16, color: '#333333'}}>列表为空</Text>
            </View>
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
            this.props.navigation.navigate('ScoreScene', {bidString: bid, type: 'Fix'});
        }}>
            <View style={styles.scoreBtn}>
                <Text style={{color: 'white', fontSize: 12, textAlign: 'center'}}>去评价</Text>
            </View>
        </TouchableOpacity>;
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

    _onCommentSuccess() {
        alert('评论成功');
    }


}

// define your styles
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: color.background,
    },
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
    fixContent: {
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

//make this component available to the app
export default connect(select)(PropertyService);
