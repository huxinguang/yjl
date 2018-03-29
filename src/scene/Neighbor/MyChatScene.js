import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import {color} from '../../widget';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import {Heading1, Paragraph} from '../../widget/Text';
import screen from '../../common/screen';

class MyChatScene extends PureComponent {
    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>我的聊聊</Text>
        ),
        headerRight: (
            <Text/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    tabLabel: [];

    state: {
        participantDataList: [],
        publishDataList: [],
        participantRefreshing: boolean,
        publishRefreshing: boolean,
    };

    constructor(props: Object) {
        super(props);
        this.tabLabel = ['我参与的', '我发布的'];
        this.state = {participantDataList: [], publishDataList: [], participantRefreshing: false, publishRefreshing: false};

        {
            (this: any).requestParticipantData = this.requestParticipantData.bind(this);
        }
        {
            (this: any).requestPublishData = this.requestPublishData.bind(this);
        }
    }

    componentDidMount() {
        this.requestParticipantData();
        this.requestPublishData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            if (nextProps.isLoggedIn) {
                this.requestParticipantData();
                this.requestPublishData();
            } else {
                this.props.navigation.navigate('Login', {});
            }
        }
    }

    requestParticipantData() {
        this.setState({participantRefreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.Get_partake',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag
        };
        get(paramMap, function (data) {
            let dataList = data.info;
            if (dataList) {
                _this.setState({
                    participantDataList: dataList,
                    participantRefreshing: false
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({participantRefreshing: false});
        });
    }

    requestPublishData() {
        this.setState({publishRefreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.Get_release',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag
        };
        get(paramMap, function (data) {
            let dataList = data.info;
            if (dataList) {
                _this.setState({
                    publishDataList: dataList,
                    publishRefreshing: false
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({publishRefreshing: false});
        });
    }

    keyExtractor(item: Object, index: number) {
        return item.id;
    }

    renderCell(info: Object) {
        return (
            <TouchableOpacity style={styles.cellContainer} onPress={() => {
            }}>
                <Heading1>{info.item.title}</Heading1>

                <Paragraph numberOfLines={0} style={{marginTop: 8}}>{info.item.author}</Paragraph>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <ScrollableTabView
                style={styles.container}
                tabBarBackgroundColor='white'
                tabBarActiveTextColor='#FE566D'
                tabBarInactiveTextColor='#555555'
                tabBarTextStyle={styles.tabBarText}
                tabBarUnderlineStyle={styles.tabBarUnderline}
                renderTabBar={() => <DefaultTabBar style={styles.tabBar}/>}>
                <FlatList
                    tabLabel={this.tabLabel[0]}
                    key={this.tabLabel[0]}
                    data={this.state.participantDataList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestParticipantData}
                    refreshing={this.state.participantRefreshing}
                    renderItem={this.renderCell}
                    // onEndReached={this.requestPersonData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}/>
                <FlatList
                    tabLabel={this.tabLabel[1]}
                    key={this.tabLabel[1]}
                    data={this.state.publishDataList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestPublishData}
                    refreshing={this.state.publishRefreshing}
                    renderItem={this.renderCell}
                    // onEndReached={this.requestPubicData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}/>
            </ScrollableTabView>
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
    tabBar: {

    },
    tabBarText: {
        color: color.theme,
        fontSize: 14,
        marginTop: 10,
    },
    tabBarUnderline: {
        backgroundColor: color.theme
    },
});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

export default connect(select)(MyChatScene);