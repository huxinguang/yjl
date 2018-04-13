//import liraries
import React, {PureComponent} from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {Heading1, Paragraph} from '../../widget/Text';
import screen from '../../common/screen';
import {color, DetailCell, SpacingView} from '../../widget';
import {GlobalValue} from '../../Global';
import {get, HOST} from '../../api';
import {loggedOut} from '../../actions/actions';
import PropTypes from 'prop-types';

// create a component
class MineScene extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>我</Text>
        ),
        headerStyle: {backgroundColor: color.theme},
    });

    state: {
        refreshing: boolean,
        userInfo: Object
    };

    defaultUserInfo = {
        nickname: '未登录',
        facelink: '',
        quan_num: '',
        score: ''
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            refreshing: false,
            userInfo: this.defaultUserInfo
        };
    }

    componentWillMount() {
        // alert('componentWillMount');
    }

    componentDidMount() {
        // alert('componentDidMount');
        this.onHeaderRefresh();
    }

    componentWillReceiveProps(nextProps) {
        // alert('componentWillReceiveProps');
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            if (nextProps.isLoggedIn) {
                this.onHeaderRefresh();
            } else {
                this.props.navigation.navigate('LoginScene', {});
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // alert('componentWillUpdate');
    }

    componentDidUpdate(preProps, preState) {
        // alert('componentDidUpdate');
    }

    componentWillUnmount() {
        // alert('componentWillUnmount');
    }

    onHeaderRefresh() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'User.My_index',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block
        };
        get(paramMap, function (data) {
            let userInfo = data.info;
            if (userInfo) {
                _this.setState({
                    userInfo: userInfo,
                    refreshing: false
                });
            }
        }, function (error) {
            console.log('data is error' + error);
        });
    }

    renderCells() {
        let cells = [];
        let dataList = this.getDataList();
        dataList[0][0].subtitle = this.state.userInfo.quan_num;
        dataList[0][1].subtitle = this.state.userInfo.score;
        for (let i = 0; i < dataList.length; i++) {
            let sublist = dataList[i];
            for (let j = 0; j < sublist.length; j++) {
                let data = sublist[j];
                let cell = <DetailCell image={data.image} title={data.title} subtitle={data.subtitle} key={data.title} onCellPressed={this.onCellPressed.bind(this)}/>;
                cells.push(cell);
            }
            cells.push(<SpacingView style={{height: 6, backgroundColor: color.background}} key={i}/>);
        }

        return (
            <View style={{flex: 1}}>
                {cells}
            </View>
        );
    }

    renderHeader() {
        return (
            <TouchableOpacity style={styles.userContainer} onPress={() => {
                this.onInfoPressed();
            }}>
                <Image style={styles.avatar} source={{uri: HOST + this.state.userInfo.facelink}}/>
                <View>
                    <View style={{flexDirection: 'row'}}>
                        <Heading1 style={{color: 'white'}}>{this.state.userInfo.nickname}</Heading1>
                        <Image style={{marginLeft: 4}} source={require('../../img/Mine/beauty_technician_v15.png')}/>
                    </View>
                    <Paragraph style={{color: 'white', marginTop: 4}}>个人信息 &gt;</Paragraph>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        let logoutBtn = this.props.isLoggedIn &&
            <TouchableOpacity style={styles.logout} onPress={() => {this.logout && this.logout()}}>
                <Text style={{color: 'white', fontSize: 14}}>退出登录</Text>
            </TouchableOpacity>;
        return (
            <View style={{flex: 1, backgroundColor: color.background}}>
                <View style={{
                    position: 'absolute',
                    width: screen.width,
                    height: screen.height / 2,
                    backgroundColor: color.theme
                }}/>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            style={{backgroundColor: color.theme}}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onHeaderRefresh()}
                            tintColor='gray'
                        />
                    }>
                    {this.renderHeader()}
                    <SpacingView style={{height: 6, backgroundColor: color.background}}/>
                    {this.renderCells()}
                    {logoutBtn}
                </ScrollView>
            </View>
        );
    }

    getDataList() {
        return (
            [
                [
                    {title: '我的优惠券', subtitle: '3', image: require('../../img/Mine/icon_mine_wallet.png')},
                    {title: '我的积分', subtitle: '1000', image: require('../../img/Mine/icon_mine_balance.png')},
                    {title: '我的收藏', image: require('../../img/Mine/icon_mine_collection.png')},
                    {title: '我的发布', image: require('../../img/Mine/icon_mine_member.png')}
                ],
                [
                    {title: '切换小区', image: require('../../img/Mine/icon_mine_friends.png')},
                    {title: '业主身份认证', image: require('../../img/Mine/icon_mine_aboutmeituan.png')},
                    {title: '物业服务', image: require('../../img/Mine/icon_mine_comment.png')},
                ],
                [
                    {title: '设置', image: require('../../img/Mine/icon_mine_aboutmeituan.png')},
                    {title: '联系我们', image: require('../../img/Mine/icon_mine_customerService.png')}
                ]
            ]
        );
    }

    isLogin() {
        if (!this.props.isLoggedIn) {
            this.props.navigation.navigate('LoginScene', {});
            return false;
        }
        return true;
    }

    onInfoPressed() {
        if (this.isLogin()) {
            this.props.navigation.navigate('MyCenter', {});
        }
    }

    onCellPressed(cellTitle: string) {
        // alert(cellTitle);
        if (cellTitle === '我的优惠券' && this.isLogin()) {
            this.props.navigation.navigate('MyDiscount');
        } else if (cellTitle === '我的积分' && this.isLogin()) {
            alert('我的积分' + this.state.userInfo.score);
        } else if (cellTitle === '我的收藏' && this.isLogin()) {
            this.props.navigation.navigate('MyFavorite');
        } else if (cellTitle === '我的发布' && this.isLogin()) {
            this.props.navigation.navigate('MyPublish');
        } else if (cellTitle === '切换小区') {
            this.props.navigation.navigate('AreaSelection', {
                getBlock(item) {
                    // _this.bid = item.id;
                    // _this.block = item.block;
                    // _this.setState({uiUpdate: !_this.state.uiUpdate});
                }
            });
        } else if (cellTitle === '业主身份认证' && this.isLogin()) {
            this.props.navigation.navigate('Authentication');
        } else if (cellTitle === '物业服务' && this.isLogin()) {
            if (GlobalValue.userInfo.attestation === 0) {
                alert('还未认证！');
                return;
            }
            this.props.navigation.navigate('MyProperty');
        } else if (cellTitle === '设置' && this.isLogin()) {
            this.props.navigation.navigate('SettingScene');
        } else if (cellTitle === '联系我们') {
            this.props.navigation.navigate('AboutScene');
        }
    }

    logout() {
        this.setState({userInfo: this.defaultUserInfo});
        this.props.dispatch(loggedOut());
        this.props.navigation.navigate('Home', {});
    }

}

// define your styles
const styles = StyleSheet.create({
    icon: {
        width: 27,
        height: 27,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: color.theme,
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#51D3C6'
    },
    logout: {
        height: 40,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ED6D00',
        borderRadius: 25,
    }
});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

//make this component available to the app
// export default connect(select)(MineScene);
module.exports = connect(select)(MineScene);
