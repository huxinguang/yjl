import React, {PureComponent} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, Text, TouchableOpacity, View,Modal,Animated} from 'react-native';
import PropTypes from 'prop-types';
import {color, Separator, StarScore, UninputableCell, ImagesView} from '../../widget';
import {screen} from '../../common';
import {GlobalValue} from '../../Global';
import {get, HOST} from '../../api';
import icon from '../../widget/IconFont';
import Toast from 'react-native-easy-toast';
import ImageViewer from 'react-native-image-zoom-viewer';

class ComplaintDetailScene extends PureComponent {

    toast: Toast;

    static navigationOptions = ({navigation}) => ({
        headerTitle: '投诉详情',
        headerRight: (
            <Text/>
        ),
    });

    props: {
        navigation: PropTypes.object
    };

    state: {
        complaintInfo: Object,
        modalVisible: boolean,
        imageIndex: number
    };

    componentDidMount() {
        this._requestComplaintInfo();
    }

    constructor(props) {
        super(props);
        this.state = {
            complaintInfo: {},
            modalVisible: false,
            imageIndex: 0
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1, backgroundColor: color.background}}>
                    <View style={styles.topView}>
                        <Text style={styles.fixNum}>{'投诉单号  ' + this.state.complaintInfo.field1}</Text>
                        <Text style={{
                            flex: 1,
                            fontSize: 14,
                            color: this._getColorWithStatus(this.state.complaintInfo.field17),
                            textAlign: 'right',
                            marginRight: 10
                        }}>{this.state.complaintInfo.field17}</Text>
                    </View>

                    <View style={[styles.timeContainer, {paddingTop: 10}]}>
                        <Text style={[styles.timeIcon, {color: color.theme}]}>{icon('iconTime')}</Text>
                        <Text style={styles.timeText}>{' 投诉时间:  ' + this.state.complaintInfo.field7}</Text>
                    </View>

                    {this.state.complaintInfo.field17 === '已取消' ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'lightsteelblue'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 取消时间:  ' + this.state.complaintInfo.field19}</Text>
                        </View> : null
                    }

                    {(this.state.complaintInfo.field17 === '已处理' || this.state.complaintInfo.field17 === '已评价') ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'green'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 处理时间:  ' + this.state.complaintInfo.field9}</Text>
                        </View> : null
                    }
                    <Separator/>
                    <UninputableCell title='投诉内容' subtitle={this.state.complaintInfo.field4}/>
                    {this.state.complaintInfo.field18 ? <ImagesView sources={JSON.parse(this.state.complaintInfo.field18)}
                        onPressImage={this._onPressImage.bind(this)}/> : null}
                    {this.state.complaintInfo.field18 ?
                        <Modal visible={this.state.modalVisible} transparent={true}>
                            <ImageViewer imageUrls={this._getJointImageUrls()} index={this.state.imageIndex} onClick={() => {
                                this.setState({modalVisible: false});
                            }}/>
                        </Modal> : null
                    }

                    <Separator/>
                    <UninputableCell title='联  系  人' subtitle={this.state.complaintInfo.field22}/>
                    <UninputableCell title='电       话' subtitle={this.state.complaintInfo.field23}/>
                    <UninputableCell title='维修地址' subtitle={this.state.complaintInfo.field24}/>
                    {this.state.complaintInfo.field17 === '已评价' ? <Separator/> : null}
                    {this.state.complaintInfo.field17 === '已评价' ?
                        <View style={[styles.supplementaryContainer]}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'评       价'}</Text>
                            <Text
                                style={[styles.supplementary, {textAlign: 'right'}]}>{this.state.complaintInfo.field16}</Text>
                        </View> : null
                    }
                    {this.state.complaintInfo.field17 === '已评价' ? <Separator/> : null}
                    {
                        this.state.complaintInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>满 意 度</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.complaintInfo.field11)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }

                    {
                        this.state.complaintInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>服务态度</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.complaintInfo.field12)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }

                    {
                        this.state.complaintInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>服务质量</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.complaintInfo.field13)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }
                    {
                        this.state.complaintInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>及 时 性</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.complaintInfo.field14)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }
                    {
                        this.state.complaintInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>现场卫生处理</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.complaintInfo.field15)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }

                </ScrollView>
                {this.state.complaintInfo.field17 === '待处理' ? this._renderBottomBtn() : null}
                <Toast ref={(t) => this.toast = t}
                    position='center'/>
            </View>
        );
    }

    _getJointImageUrls(){
        var urls = [];
        let paths = JSON.parse(this.state.complaintInfo.field18);
        for (var i=0; i < paths.length; i++){
            let jointUrl = HOST + paths[i].replace('thumb_','');
            let source = {url:jointUrl};
            urls.push(source);
        }
        return urls;
    }

    _renderBottomBtn() {
        return <TouchableOpacity style={styles.confirm} onPress={() => {
            this._onPressConfirm();
        }}>
            <Text style={styles.confirmText}>{'取消投诉'} </Text>
        </TouchableOpacity>;
    }

    _onPressImage(atIndex) {
        this.setState({
            modalVisible: true,
            imageIndex: atIndex
        });
    }

    _onPressConfirm() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Complaint_cancel',
            'tag': GlobalValue.block,
            'bid': _this.props.navigation.state.params.bidString
        };
        get(paramMap, function (data) {
            if (data.code === 0) {
                DeviceEventEmitter.emit('CancelComplaintSuccess');
                _this.props.navigation.goBack();
            } else {
                this.toast.show('取消投诉失败');
            }
        });
    }

    _requestComplaintInfo() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Complaint_info',
            'tag': GlobalValue.block,
            'bid': _this.props.navigation.state.params.bidString
        };
        get(paramMap, function (data) {

            if (data.info) {
                _this.setState({
                    complaintInfo: data.info
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

export default ComplaintDetailScene;

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
    fixNum: {
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