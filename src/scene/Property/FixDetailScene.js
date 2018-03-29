import React, {PureComponent} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, Text, TouchableOpacity, View,Modal} from 'react-native';
import PropTypes from 'prop-types';
import {color} from '../../widget/index';
import {Separator, StarScore, UninputableCell,ImagesView} from '../../widget';
import {screen} from '../../common';
import {GlobalValue} from '../../Global';
import {get,HOST} from '../../api';
import icon from '../../widget/IconFont';
import Toast from 'react-native-easy-toast';
import ImageViewer from 'react-native-image-zoom-viewer';


class FixDetailScene extends PureComponent {

    toast: Toast;

    static navigationOptions = ({navigation}) => ({
        headerTitle: '报修详情',
        headerRight: (
            <Text/>
        ),
    });

    props: {
        navigation: PropTypes.object
    };

    state: {
        fixInfo: Object,
        modalVisible: boolean,
        imageIndex: number
    };

    componentDidMount() {
        this._requestFixInfo();
    }

    constructor(props) {
        super(props);
        this.state = {
            fixInfo: {},
            modalVisible: false,
            imageIndex: 0
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1, backgroundColor: color.background}}>
                    <View style={styles.topView}>
                        <Text style={styles.fixNum}>{'报修单号  ' + this.state.fixInfo.field1}</Text>
                        <Text style={{
                            flex: 1,
                            fontSize: 14,
                            color: this._getColorWithStatus(this.state.fixInfo.field17),
                            textAlign: 'right',
                            marginRight: 10
                        }}>{this.state.fixInfo.field17}</Text>
                    </View>

                    <View style={[styles.timeContainer, {paddingTop: 10}]}>
                        <Text style={[styles.timeIcon, {color: color.theme}]}>{icon('iconTime')}</Text>
                        <Text style={styles.timeText}>{' 报修时间:  ' + this.state.fixInfo.field7}</Text>
                    </View>

                    {this.state.fixInfo.field17 === '已取消' ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'lightsteelblue'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 取消时间:  ' + this.state.fixInfo.field19}</Text>
                        </View> : null
                    }

                    {(this.state.fixInfo.field17 === '已派工' || this.state.fixInfo.field17 === '已处理' || this.state.fixInfo.field17 === '已评价') ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'limegreen'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 派工时间:  ' + this.state.fixInfo.field27}</Text>
                        </View> : null
                    }

                    {(this.state.fixInfo.field17 === '已处理' || this.state.fixInfo.field17 === '已评价') ?
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeIcon, {color: 'green'}]}>{icon('iconTime')}</Text>
                            <Text style={styles.timeText}>{' 处理时间:  ' + this.state.fixInfo.field9}</Text>
                        </View> : null
                    }

                    <Separator/>

                    <UninputableCell title='修  什  么' subtitle={this.state.fixInfo.field4}/>
                    <Separator/>
                    <UninputableCell title='期望上门时间' subtitle={this.state.fixInfo.field5}/>
                    <Separator/>
                    {this.state.fixInfo.field6 ?
                        <View style={styles.supplementaryContainer}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'补充说明'}</Text>
                            <Text style={styles.supplementary}>{this.state.fixInfo.field6}</Text>
                        </View> : null
                    }

                    {this.state.fixInfo.field18 ? <ImagesView sources={JSON.parse(this.state.fixInfo.field18)}
                        onPressImage={this._onPressImage.bind(this)}/> : null}
                    {this.state.fixInfo.field18 ?
                        <Modal visible={this.state.modalVisible} transparent={true}>
                            <ImageViewer imageUrls={this._getJointImageUrls()} index={this.state.imageIndex} onClick={() => {
                                this.setState({modalVisible: false});
                            }}/>
                        </Modal> : null
                    }

                    {this.state.fixInfo.field6 ? <Separator/> : null}

                    <UninputableCell title='联  系  人' subtitle={this.state.fixInfo.field22}/>
                    <UninputableCell title='电       话' subtitle={this.state.fixInfo.field23}/>
                    <UninputableCell title='维修地址' subtitle={this.state.fixInfo.field24}/>
                    {this.state.fixInfo.field28 ? <Separator/> : null}
                    {this.state.fixInfo.field28 ?
                        <View style={[styles.supplementaryContainer, {height: 60}]}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'处理备注'}</Text>
                            <Text
                                style={[styles.supplementary, {textAlign: 'right'}]}>{this.state.fixInfo.field28}</Text>
                        </View> : null
                    }
                    {this.state.fixInfo.field25 ? <Separator/> : null}
                    {this.state.fixInfo.field25 ?
                        <UninputableCell title='处理情况' subtitle={this.state.fixInfo.field25}/> : null}
                    {this.state.fixInfo.field26 ? <Separator/> : null}
                    {this.state.fixInfo.field26 ?
                        <View style={[styles.supplementaryContainer, {height: 60}]}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'备       注'}</Text>
                            <Text
                                style={[styles.supplementary, {textAlign: 'right'}]}>{this.state.fixInfo.field26}</Text>
                        </View> : null
                    }

                    {this.state.fixInfo.field17 === '已评价' ? <Separator/> : null}
                    {this.state.fixInfo.field17 === '已评价' ?
                        <View style={[styles.supplementaryContainer]}>
                            <Text style={{marginRight: 10, fontSize: 14}}>{'评       价'}</Text>
                            <Text
                                style={[styles.supplementary, {textAlign: 'right'}]}>{this.state.fixInfo.field16}</Text>
                        </View> : null
                    }
                    {this.state.fixInfo.field17 === '已评价' ? <Separator/> : null}
                    {
                        this.state.fixInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>满 意 度</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.fixInfo.field11)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }

                    {
                        this.state.fixInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>服务态度</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.fixInfo.field12)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }

                    {
                        this.state.fixInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>服务质量</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.fixInfo.field13)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }
                    {
                        this.state.fixInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>及 时 性</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.fixInfo.field14)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }
                    {
                        this.state.fixInfo.field17 === '已评价' ?
                            <View style={styles.scoreContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>现场卫生处理</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <StarScore originalScore={parseInt(this.state.fixInfo.field15)}
                                    style={{height: 16, width: 95, marginRight: 10}}
                                    starStyle={{marginLeft: 5, fontSize: 14}}
                                    scoreAble={false}/>
                            </View> : null
                    }


                </ScrollView>
                {this.state.fixInfo.field17 === '待处理' ? this._renderBottomBtn() : null}
                <Toast ref={(t) => this.toast = t}
                    position='center'/>
            </View>
        );
    }

    _getJointImageUrls(){
        var urls = [];
        let paths = JSON.parse(this.state.fixInfo.field18);
        for (var i=0; i < paths.length; i++){
            let jointUrl = HOST + paths[i].replace('thumb_','');
            let source = {url:jointUrl};
            urls.push(source);
        }
        return urls;
    }

    _onPressImage(atIndex) {
        this.setState({
            modalVisible: true,
            imageIndex: atIndex
        });
    }

    _renderBottomBtn() {
        return <TouchableOpacity style={styles.confirm} onPress={() => {
            this._onPressConfirm();
        }}>
            <Text style={styles.confirmText}>{'取消报修'} </Text>
        </TouchableOpacity>;
    }

    _onPressConfirm() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Esfix_cancel',
            'tag': GlobalValue.block,
            'bid': _this.props.navigation.state.params.bidString
        };
        get(paramMap, function (data) {
            if (data.code === 0) {
                DeviceEventEmitter.emit('CancelFixSuccess');
                _this.props.navigation.goBack();
            } else {
                this.toast.show('取消报修失败');
            }
        });
    }

    _requestFixInfo() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Esfix_info',
            'tag': GlobalValue.block,
            'bid': _this.props.navigation.state.params.bidString
        };
        get(paramMap, function (data) {

            if (data.info) {
                _this.setState({
                    fixInfo: data.info
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

export default FixDetailScene;

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