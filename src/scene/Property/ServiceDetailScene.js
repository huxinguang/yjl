import React, {PureComponent} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {color} from '../../widget/index';
import {Separator, StarScore, UninputableCell} from '../../widget';
import {screen} from '../../common';
import {GlobalValue} from '../../Global';
import {get} from '../../api';
import icon from '../../widget/IconFont';
import Toast from 'react-native-easy-toast';

class ServiceDetailScene extends PureComponent {

    toast: Toast;

    static navigationOptions = ({navigation}) => ({
        headerTitle: '订单详情',
        headerRight: (
            <Text/>
        ),
    });

    props: {
        navigation: PropTypes.object
    };

    state: {
        serviceInfo: Object
    };

    componentDidMount() {
        this._requestServiceInfo();
    }

    constructor(props) {
        super(props);
        this.state = {
            serviceInfo: {}
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1, backgroundColor: color.background}}>
                    <View style={styles.topView}>
                        <Text style={styles.serviceNum}>{'服务单号  ' + this.state.serviceInfo.field1}</Text>
                        <Text style={{
                            flex: 1,
                            fontSize: 14,
                            color: this._getColorWithStatus(this.state.serviceInfo.field17),
                            textAlign: 'right',
                            marginRight: 10
                        }}>{this.state.serviceInfo.field17}</Text>
                    </View>

                    <View style={[styles.timeContainer, {paddingTop: 10}]}>
                        <Text style={[styles.timeIcon, {color: color.theme}]}>{icon('iconTime')}</Text>
                        <Text style={styles.timeText}>{' 提交时间:  ' + this.state.serviceInfo.field7}</Text>
                    </View>

                    {this.state.serviceInfo.field17 === '已取消' ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'lightsteelblue'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 取消时间:  ' + this.state.serviceInfo.field19}</Text>
                        </View> : null
                    }

                    {(this.state.serviceInfo.field17 === '已派工' || this.state.serviceInfo.field17 === '已处理' || this.state.serviceInfo.field17 === '已评价') ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'limegreen'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 派工时间:  ' + this.state.serviceInfo.field27}</Text>
                        </View> : null
                    }

                    {(this.state.serviceInfo.field17 === '已处理' || this.state.serviceInfo.field17 === '已评价') ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'green'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 处理时间:  ' + this.state.serviceInfo.field9}</Text>
                        </View> : null
                    }

                    <Separator/>

                    <UninputableCell title='预约服务' subtitle={'xxxx'}/>
                    <Separator/>
                    <UninputableCell title='总    价' subtitle={'4111'}/>
                    <Separator/>
                    <UninputableCell title='期望上门时间' subtitle={this.state.serviceInfo.field5}/>
                    <Separator/>
                    {this.state.serviceInfo.field6 ?
                        <View style={styles.supplementaryContainer}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'补充说明'}</Text>
                            <Text style={styles.supplementary}>{this.state.serviceInfo.field6}</Text>
                        </View> : null
                    }
                    {this.state.serviceInfo.field6 ? <Separator/> : null}

                    <UninputableCell title='联  系  人' subtitle={this.state.serviceInfo.field22}/>
                    <UninputableCell title='电       话' subtitle={this.state.serviceInfo.field23}/>
                    <UninputableCell title='维修地址' subtitle={this.state.serviceInfo.field24}/>
                    {this.state.serviceInfo.field28 ? <Separator/> : null}
                    {this.state.serviceInfo.field28 ?
                        <View style={[styles.supplementaryContainer, {height: 60}]}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'处理备注'}</Text>
                            <Text
                                style={[styles.supplementary, {textAlign: 'right'}]}>{this.state.serviceInfo.field28}</Text>
                        </View> : null
                    }
                    {this.state.serviceInfo.field25 ? <Separator/> : null}
                    {this.state.serviceInfo.field25 ?
                        <UninputableCell title='处理情况' subtitle={this.state.serviceInfo.field25}/> : null}
                    {this.state.serviceInfo.field26 ? <Separator/> : null}
                    {this.state.serviceInfo.field26 ?
                        <View style={[styles.supplementaryContainer, {height: 60}]}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'备       注'}</Text>
                            <Text
                                style={[styles.supplementary, {textAlign: 'right'}]}>{this.state.serviceInfo.field26}</Text>
                        </View> : null
                    }

                    {this.state.serviceInfo.field17 === '已评价' ? <Separator/> : null}
                    {this.state.serviceInfo.field17 === '已评价' ?
                        <View style={[styles.supplementaryContainer]}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'评       价'}</Text>
                            <Text
                                style={[styles.supplementary, {textAlign: 'right'}]}>{this.state.serviceInfo.field16}</Text>
                        </View> : null
                    }
                    {this.state.serviceInfo.field17 === '已评价' ? <Separator/> : null}
                    {
                        this.state.serviceInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>满 意 度</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.serviceInfo.field11)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }

                    {
                        this.state.serviceInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>服务态度</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.serviceInfo.field12)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }

                    {
                        this.state.serviceInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>服务质量</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.serviceInfo.field13)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }
                    {
                        this.state.serviceInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>及 时 性</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.serviceInfo.field14)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }
                    {
                        this.state.serviceInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>现场卫生处理</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.serviceInfo.field15)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }


                </ScrollView>
                {this.state.serviceInfo.field17 === '待处理' ? this._renderBottomBtn() : null}
                <Toast ref={(t) => this.toast = t}
                    position='center'/>
            </View>
        );
    }

    _renderBottomBtn() {
        return <TouchableOpacity style={styles.confirm} onPress={() => {
            this._onPressConfirm();
        }}>
            <Text style={styles.confirmText}>{'取消服务'} </Text>
        </TouchableOpacity>;
    }

    _onPressConfirm() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Paid_cancel',
            'tag': GlobalValue.block,
            'bid': _this.props.navigation.state.params.bidString
        };
        get(paramMap, function (data) {
            if (data.code === 0) {
                DeviceEventEmitter.emit('CancelServiceSuccess');
                _this.props.navigation.goBack();
            } else {
                this.toast.show('取消服务失败');
            }
        });
    }

    _requestServiceInfo() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Paid_info',
            'tag': GlobalValue.block,
            'bid': _this.props.navigation.state.params.bidString
        };
        get(paramMap, function (data) {

            if (data.info) {
                _this.setState({
                    serviceInfo: data.info
                });
            }

        });
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

export default ServiceDetailScene;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
    },
    topView: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingTop: 10
    },
    serviceNum: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    timeIcon: {
        fontFamily: 'iconfont',
        fontSize: 18,
        marginLeft: 9,
        textAlignVertical: 'center',
    },
    timeText: {
        flex: 1,
        fontSize: 13,
        color: '#999999'
    },
    confirm: {
        backgroundColor: color.theme,
        height: 40,
        marginBottom: 0,
        justifyContent: 'center',
    },
    confirmText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    supplementaryContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },
    supplementary: {
        flex: 1,
        fontSize: 14,
        margin: 0,
        color: '#999999',
        padding: 0,
        textAlignVertical: 'top',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        width: screen.width,
        backgroundColor: 'white'
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: 90,
        marginLeft: 10
    },
    title: {
        fontSize: 14,
        width: 90
    },

});