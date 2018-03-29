import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import color from '../../widget/color';
import {icon} from '../../widget';
import {GlobalValue} from '../../Global';
import {get} from '../../api';
import {Heading2} from '../../widget/Text';
import SpacingView from '../../widget/SpacingView';
import TouchLinking from '../../widget/TouchLinking';

class PublishDetailScene extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>发布详情</Text>
        ),
        headerRight: (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                <TouchableOpacity onPress={() => navigation.state.params.favorite && navigation.state.params.favorite()}>
                    <Text style={{margin: 8, color: 'white', fontSize: 18, fontFamily: 'iconfont'}}>{icon(navigation.state.params.star || 'star_empty')}</Text>
                </TouchableOpacity>
            </View>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    state: {
        detailInfo: Object,
        refreshing: boolean
    };

    constructor(props) {
        super(props);
        this.state = {
            detailInfo: {},
            refreshing: false
        };
        (this: any).requestData = this.requestData.bind(this);
        (this: any).favorite = this.favorite.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({
            favorite: this.favorite
        });
        this.requestData();
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.Neighbor_details',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'id': this.props.navigation.state.params.id
        };
        get(paramMap, function (data) {
            let detailInfo = data.info;
            if (detailInfo) {
                _this.setState({
                    detailInfo: detailInfo[0],
                    refreshing: false
                });
                let star = detailInfo.status === 1 ? star = 'star_full' : star = 'star_empty';
                _this.props.navigation.setParams({
                    star: star
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    favorite() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'User.Favorite',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'fid': this.props.navigation.state.params.id,
            'type': 5
        };
        get(paramMap, function (data) {
            alert(data.msg);
            let star = data.status === 1 ? star = 'star_full' : star = 'star_empty';
            _this.props.navigation.setParams({
                star: star
            });
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    render() {
        if (!this.state.detailInfo.title) {
            return null;
        }
        return (
            <View style={styles.container}>
                <Heading2 style={{padding: 10, lineHeight: 25, fontSize: 16, backgroundColor: 'white'}}>{this.state.detailInfo.title + '\n'}
                    <Text style={{fontSize: 16, color: '#818181'}}>发布时间：
                        <Heading2 style={{fontSize: 16}}>{this.state.detailInfo.ctime}</Heading2>
                    </Text>
                </Heading2>
                <SpacingView/>
                <Text style={{padding: 10, lineHeight: 25, fontSize: 16, color: '#818181', backgroundColor: 'white'}}>类别&nbsp;&nbsp;&nbsp;&nbsp;
                    <Heading2 style={{fontSize: 16}}>{this.state.detailInfo.type_name}</Heading2>
                </Text>
                <SpacingView/>
                <Text style={{padding: 10, lineHeight: 25, fontSize: 16, color: '#818181', backgroundColor: 'white'}}>发布内容{'\n'}
                    <Heading2 style={{fontSize: 16}}>{this.state.detailInfo.content}</Heading2>
                </Text>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <TouchLinking style={{flexDirection: 'row'}} url={'tel:' + this.state.detailInfo.telphone}>
                        <View style={{flex: 1, justifyContent: 'center', height: 50, backgroundColor: '#69B0F7'}}>
                            <Text style={{marginLeft: 10, color: 'white', fontSize: 16}}>联系人：{this.state.detailInfo.linkman}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', width: 100, height: 50, backgroundColor: '#ED6D00'}}>
                            <Text style={{fontSize: 22, color: 'white', fontFamily: 'iconfont'}}>{icon('lxwy')}</Text>
                        </View>
                    </TouchLinking>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
});

export default PublishDetailScene;