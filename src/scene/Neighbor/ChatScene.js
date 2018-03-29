import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ChatList from './ChatList';
import {color, icon} from '../../widget';
import {get} from '../../api';
import {GlobalValue} from '../../Global';

class ChatScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>聊聊</Text>
        ),
        headerRight: (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                <TouchableOpacity onPress={() => navigation.navigate('AddChatScene', {})}>
                    <Text style={{margin: 8, color: 'white', fontSize: 20, fontFamily: 'iconfont'}}>{icon('icon_add')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ChatSearchScene', {})}>
                    <Text style={{color: 'white', fontSize: 20, fontFamily: 'iconfont'}}>{icon('icon_search')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MyChatScene', {})}>
                    <Text style={{margin: 8, color: 'white', fontSize: 20, fontFamily: 'iconfont'}}>{icon('icon_chatbubble')}</Text>
                </TouchableOpacity>
            </View>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

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
            } else {
                this.props.navigation.navigate('Login', {});
            }
        }
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.Get_chat_option',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag
        };
        get(paramMap, function (data) {
            let dataList = data.info;

            if (dataList) {
                // dataList.splice(0, 0, ['0', '全部']);
                dataList.unshift(['0', '全部']);
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

    render() {
        if (this.state.dataList.length === 0) {
            return null;
        }
        return (
            <ScrollableTabView
                style={styles.container}
                tabBarBackgroundColor='white'
                tabBarActiveTextColor='#FE566D'
                tabBarInactiveTextColor='#555555'
                tabBarTextStyle={styles.tabBarText}
                tabBarUnderlineStyle={styles.tabBarUnderline}
                renderTabBar={() => <ScrollableTabBar style={styles.tabBar}/>}>
                {this.state.dataList.map((item) => (
                    <ChatList
                        tabLabel={item[1]}
                        key={item[0]}
                        {...this.props}
                        type={item[0]}
                    />
                ))}
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    tabBar: {},
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

export default connect(select)(ChatScene);