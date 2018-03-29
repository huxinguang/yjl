import React, {PureComponent} from 'react';

import {
    DatePickerAndroid,
    DeviceEventEmitter,
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TimePickerAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import {
    AnimatedDatePickerIOS,
    ChooseImageView,
    color,
    DetailCell,
    icon,
    InputableCell,
    SegmentedControl,
    Separator,
    ViewPager
} from '../../widget';
import Toast from 'react-native-easy-toast';
import {screen} from '../../common';
import ImagePicker from 'react-native-image-crop-picker';
import {GlobalValue} from '../../Global';
import {get, post} from '../../api';
import {filterEmoji, trimAllSpace} from '../../common/tool';
import ActionSheet from 'react-native-actionsheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';


class AddFixScene extends PureComponent {
    inhouseCIView: ChooseImageView;
    publicCIView: ChooseImageView;
    inhouseAddressCell: DetailCell;
    publicAddressCell: DetailCell;
    inhouseLinkmanCell: InputableCell;
    inhouseLinkman: string;
    publicLinkmanCell: InputableCell;
    publicLinkman: string;
    inhousePhoneCell: InputableCell;
    inhousePhone: string;
    publicPhoneCell: InputableCell;
    publicPhone: string;
    inhouseFixCell: InputableCell;
    inhouseFix: string;
    publicFixCell: InputableCell;
    publicFix: string;
    inhouseSupplementary: string;
    publicSupplementary: string;
    datePickerIOS: AnimatedDatePickerIOS;
    timePickerIOS: AnimatedDatePickerIOS;
    currentCIView: ChooseImageView;
    actionSheet: ActionSheet;
    toast: Toast;
    inhouseSupplementaryTextInput: TextInput;
    publicSupplementaryTextInput: TextInput;


    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <SegmentedControl values={['室内报修', '公共报修']} style={{alignSelf: 'center', width: 250}} onChange={(i) => {
                navigation.state.params.segmentedPress && navigation.state.params.segmentedPress(i);
            }} selectedIndex={
                navigation.state.params.selectedIndex
            }/>
        ),
        headerRight: (
            <TouchableOpacity>
                <Text style={{margin: 10, color: 'white', fontSize: 16, fontFamily: 'iconfont'}}>{icon('phone')}</Text>
            </TouchableOpacity>
        ),
    });


    props: {
        navigation: PropTypes.object
    };

    state: {
        serviceType: number,
        date: Date,
        time: Date,
        address: string,
    };

    componentDidMount() {
        this.props.navigation.setParams({
            segmentedPress: this.segmentedPress,
            selectedIndex: 0,
        });

        this._requestAddress();
    }

    componentWillUnmount() {
        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            console.log(e);
        });
    }


    segmentedPress(index: number) {
        this.setState({
            serviceType: index,
        });
        this.props.navigation.setParams({selectedIndex: index});
    }

    _showIOSDatePicker() {
        this.datePickerIOS.show();
    }

    _showIOSTimePicker() {
        this.timePickerIOS.show();
    }

    async _showAndroidDatePicker() {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day,月份是从0开始算的。
                this.setState({date: new Date(year, month, day)});
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    async _showAndroidTimePicker() {
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: true,
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的时分两个参数：hour (0-23), minute (0-59)
                this.setState({time: new Date(hour, minute)});
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    }

    constructor(props: Object) {
        super(props);
        this.state = {
            serviceType: 0,
            date: new Date(),
            time: new Date(),
            address: '',

        };

        this.inhouseLinkman = '';
        this.publicLinkman = '';
        this.inhousePhone = '';
        this.publicPhone = '';
        this.inhouseFix = '';
        this.publicFix = '';
        this.inhouseSupplementary = '';
        this.publicSupplementary = '';

        {
            (this: any).segmentedPress = this.segmentedPress.bind(this);
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ViewPager style={styles.container} count={2} selectedIndex={this.state.serviceType}
                    onSelectedIndexChange={this.segmentedPress}>

                    <View style={styles.container}>
                        <KeyboardAwareScrollView style={{flex: 1, backgroundColor: color.background}}
                            getTextInputRefs={() => {
                                return [this.inhouseSupplementaryTextInput];
                            }}>
                            <DetailCell ref={(ac) => this.addressCell = ac}
                                title='地 址'
                                subtitle={this.state.address}
                                onCellPressed={this.onCellPressed.bind(this)}/>
                            <InputableCell ref={(lc) => this.inhouseLinkmanCell = lc}
                                title='联 系 人'
                                placeholder={GlobalValue.userInfo.title}
                                placeholderTextColor='#999999'
                                keyboardType='default'
                                onInput={(text) => {
                                    this.inhouseLinkman = text;
                                }}/>
                            <Separator/>
                            <InputableCell ref={(pc) => this.inhousePhoneCell = pc}
                                title='联系电话'
                                placeholder={GlobalValue.userInfo.uname}
                                placeholderTextColor='#999999'
                                keyboardType='numeric'
                                maxLength={11}
                                onInput={(text) => {
                                    this.inhousePhone = text;
                                }}/>
                            <Separator/>
                            <InputableCell ref={(fc) => this.inhouseFixCell = fc}
                                title='修 什 么'
                                placeholder='请填写维修内容'
                                placeholderTextColor='#999999'
                                keyboardType='default'
                                onInput={(text) => {
                                    this.inhouseFix = text;
                                }}/>
                            <Separator/>
                            <TouchableOpacity
                                onPress={Platform.OS === 'android' ? this._showAndroidDatePicker.bind(this) : this._showIOSDatePicker.bind(this)}>
                                <View style={styles.dateItem}>
                                    <Text style={styles.dateTitle}>上门日期</Text>
                                    <View style={{flex: 1}}/>
                                    <Text style={styles.dateSubtitle}>{this.state.date.pattern('yyyy-MM-dd')}</Text>
                                    <Image style={styles.arrow} source={require('../../img/Public/cell_arrow.png')}/>
                                </View>
                                <Separator/>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.timeItem}
                                onPress={Platform.OS === 'android' ? this._showAndroidTimePicker.bind(this) : this._showIOSTimePicker.bind(this)}>
                                <View style={{height: 22, flexDirection: 'row'}}>
                                    <Text>{'上门时间'}</Text>
                                    <Text style={styles.dateStr}>{this.state.time.pattern('HH:mm')}</Text>
                                    <Image style={styles.arrow} source={require('../../img/Public/cell_arrow.png')}/>
                                </View>
                                <Text style={styles.timeTip}>{'工作时间9:00-10:00、1:00-5:30，紧急情况请呼叫物业电话'}</Text>
                            </TouchableOpacity>

                            <Separator/>
                            <View style={styles.supplementaryContainer}>
                                <Text style={{marginRight: 10, fontSize: 14}}>{'补充说明'}</Text>
                                <TextInput style={styles.supplementary}
                                    ref={(r) => {
                                        this.inhouseSupplementaryTextInput = r;
                                    }}
                                    placeholder={'补充说明，方便服务人员了解情况'}
                                    placeholderTextColor='#999999'
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    numberOfLines={4}
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={(text) => {
                                        this.inhouseSupplementary = text;
                                    }}/>
                            </View>
                            <Separator/>
                            <ChooseImageView ref={(civ) => this.inhouseCIView = civ}
                                onPressAdd={this.onPressInHouseAdd.bind(this)}
                                onPressImage={this.onPressImage.bind(this)} selectedImages={Array()}/>

                        </KeyboardAwareScrollView>
                        <TouchableOpacity style={styles.confirm} onPress={() => {
                            this.onPressConfirm(1);
                        }}>
                            <Text style={styles.confirmText}>{'确认'} </Text>
                        </TouchableOpacity>
                        <AnimatedDatePickerIOS ref={(dpi) => this.datePickerIOS = dpi} originalDate={this.state.date}
                            dateMode='date' onOKPress={this._onDatePickerOk.bind(this)}/>
                        <AnimatedDatePickerIOS ref={(tpi) => this.timePickerIOS = tpi} originalDate={this.state.time}
                            dateMode='time' onOKPress={this._onTimePickerOk.bind(this)}/>

                    </View>

                    <View style={{flex: 1}}>
                        <KeyboardAwareScrollView style={styles.container} getTextInputRefs={() => {
                            return [this.publicSupplementaryTextInput];
                        }}>
                            <DetailCell ref={(ac) => this.addressCell = ac}
                                title='地 址'
                                subtitle={this.state.address}
                                onCellPressed={this.onCellPressed.bind(this)}/>
                            <InputableCell ref={(lc) => this.publicLinkmanCell = lc}
                                title='联 系 人'
                                placeholder={GlobalValue.userInfo.title}
                                placeholderTextColor='#999999'
                                keyboardType='default'
                                onInput={(text) => {
                                    this.publicLinkman = text;
                                }}/>
                            <Separator/>
                            <InputableCell ref={(pc) => this.publicPhoneCell = pc}
                                title='联系电话'
                                placeholder={GlobalValue.userInfo.uname}
                                placeholderTextColor='#999999'
                                keyboardType='numeric'
                                maxLength={11}
                                onInput={(text) => {
                                    this.publicPhone = text;
                                }}/>
                            <Separator/>
                            <InputableCell ref={(fc) => this.publicFixCell = fc}
                                title='修 什 么'
                                placeholder='请填写维修内容'
                                placeholderTextColor='#999999'
                                keyboardType='default'
                                onInput={(text) => {
                                    this.publicFix = text;
                                }}/>
                            <Separator/>

                            <View style={styles.supplementaryContainer}>
                                <Text style={{marginRight: 10, fontSize: 14}}>{'补充说明'}</Text>
                                <TextInput style={styles.supplementary}
                                    ref={(r) => {
                                        this.publicSupplementaryTextInput = r;
                                    }}
                                    placeholder={'补充说明，方便服务人员了解情况'}
                                    placeholderTextColor='#999999'
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    numberOfLines={4}
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={(text) => {
                                        this.publicSupplementary = text;
                                    }}/>
                            </View>
                            <Separator/>
                            <ChooseImageView ref={(civ) => this.publicCIView = civ}
                                onPressAdd={this.onPressPublicAdd.bind(this)}
                                onPressImage={this.onPressImage.bind(this)} selectedImages={Array()}/>

                        </KeyboardAwareScrollView>
                        <TouchableOpacity style={styles.confirm} onPress={() => {
                            this.onPressConfirm(2);
                        }}>
                            <Text style={styles.confirmText}>{'确认'} </Text>
                        </TouchableOpacity>

                    </View>
                </ViewPager>
                <ActionSheet
                    ref={ac => this.actionSheet = ac}
                    title={'请选择照片来源'}
                    options={['取消', '拍照', '从相册中选择']}
                    cancelButtonIndex={0}
                    onPress={this._handleActionSheetPress.bind(this)}
                />
                <Toast ref={(t) => this.toast = t}
                    position='center'/>

            </View>


        );
    }

    _onDatePickerOk(selectedDate) {
        this.setState({
            date: selectedDate
        });
    }

    _onTimePickerOk(selectedTime) {
        this.setState({
            time: selectedTime
        });
    }

    _handleActionSheetPress(i) {
        if (i === 1) {
            this.selectImage('camera');
        } else if (i === 2) {
            this.selectImage('album');
        } else {
            //do nothing
        }
    }

    onCellPressed() {
        this.toast.show('xxxxx');
    }

    selectImage(where) {

        if (where === 'camera') {

            ImagePicker.openCamera({
                mediaType: 'photo',
                loadingLabelText: '正在处理图片...',
                compressImageQuality: 0.2
            }).then(image => {

                let sources = [];
                for (let i = 0; i < this.currentCIView.state.selectedImagesSource.length; i++) {
                    sources.push(this.currentCIView.state.selectedImagesSource[i]);
                }
                let source = {uri: image.path};
                sources.push(source);
                this.currentCIView.setState({
                    selectedImagesSource: sources,
                });
            });

        } else {

            ImagePicker.openPicker({
                multiple: true,
                maxFiles: 4 - this.currentCIView.state.selectedImagesSource.length,
                showsSelectedCount: true,
                mediaType: 'photo',
                loadingLabelText: '正在处理图片...',
                smartAlbums: ['UserLibrary', 'PhotoStream', 'Bursts'],//Bursts: 连拍
                compressImageQuality: 0.2
            }).then(images => {

                let sources = [];
                for (let i = 0; i < this.currentCIView.state.selectedImagesSource.length; i++) {
                    sources.push(this.currentCIView.state.selectedImagesSource[i]);
                }
                for (let j = 0; j < images.length; j++) {
                    let source = {uri: images[j].path};
                    sources.push(source);
                }
                this.currentCIView.setState({
                    selectedImagesSource: sources,
                });
            });
        }

    }

    onPressInHouseAdd() {
        this.currentCIView = this.inhouseCIView;
        this.inhouseCIView.setState({
            editing: false
        });
        this.actionSheet.show();

    }

    onPressPublicAdd() {
        this.currentCIView = this.publicCIView;
        this.publicCIView.setState({
            editing: false
        });
        this.actionSheet.show();
    }

    onPressImage(chooseImageView) {
        chooseImageView.setState({
            editing: !chooseImageView.state.editing
        });
    }

    onPressConfirm(fixType) {

        // 过滤emoj
        // "期望上门时间要在2小时之后"
        // "期望上门时间要在7天之内"
        // 上门时间默认

        if (fixType === 1) {

            if (this.inhouseLinkman.length > 0 && trimAllSpace(this.inhouseLinkman).length === 0) {
                this.toast.show('请填写联系人');
                return;
            }

            if (this.inhousePhone.length > 0 && trimAllSpace(this.inhousePhone).length === 0) {
                this.toast.show('请填写联系电话');
                return;
            }

            if (trimAllSpace(this.inhouseFix).length === 0) {
                this.toast.show('请填写维修内容');
                return;
            }

        } else {
            if (this.publicFix.trim().length === 0) {
                this.toast.show('请填写维修内容');
                return;
            }
        }

        let _this = this;
        var paramMap = {
            'service': 'Esfixs.Esfix_add',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'block_id': GlobalValue.blockInfo.id,
            'uid': GlobalValue.userInfo.uid,
            'type': fixType.toString(),//1室内报修，2公共报修
            'address': _this.addressCell.props.subtitle,
            'linkman': fixType === 1 ? (_this.inhouseLinkman.length > 0 ? filterEmoji(_this.inhouseLinkman) : _this.inhouseLinkmanCell.props.placeholder) : (_this.publicLinkman.length > 0 ? filterEmoji(_this.publicLinkman) : _this.publicLinkmanCell.props.placeholder),
            'phone': fixType === 1 ? (_this.inhousePhone.length > 0 ? _this.inhousePhone : _this.inhousePhoneCell.props.placeholder) : (_this.publicPhone.length > 0 ? _this.publicPhone : _this.publicPhoneCell.props.placeholder),
            'title': fixType === 1 ? (_this.inhouseFix.length > 0 ? filterEmoji(_this.inhouseFix) : _this.inhouseFixCell.props.placeholder) : (_this.publicFix.length > 0 ? filterEmoji(_this.publicFix) : _this.publicFixCell.props.placeholder),
            'serve_time': _this.state.date.pattern('yyyy/MM/dd') + ' ' + _this.state.time.pattern('HH:mm'),
            'content': fixType === 1 ? filterEmoji(_this.inhouseSupplementary) : filterEmoji(_this.publicSupplementary)
        };

        let sources = (fixType === 1 ? this.inhouseCIView.state.selectedImagesSource : this.publicCIView.state.selectedImagesSource);

        for (var i = 0; i < sources.length; i++) {
            let file = {
                uri: sources[i],
                type: 'multipart/form-data',
                name: (i.toString() + '.jpg')
            };
            paramMap['file' + i.toString()] = file;
        }

        post(paramMap, function (data) {
            if (data.code === 0) {
                DeviceEventEmitter.emit('AddFixSuccess');
                _this.props.navigation.goBack();
                // _this.props.navigation.navigate('SuccessScene', {title:'确认报修单'});
            } else {
                _this.toast.show(data.msg);
            }
        });

    }

    _requestAddress() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Choose_address',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag
        };
        get(paramMap, function (data) {
            _this.setState({
                address: data.info[0]
            });
        });
    }


}

export default AddFixScene;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
    },
    dateItem: {
        backgroundColor: 'white',
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    dateTitle: {
        fontSize: 14,
        color: 'black',
        width: 110,
        textAlign: 'left',
        justifyContent: 'center',
    },
    dateSubtitle: {
        color: '#999999',
        fontSize: 14
    },
    timeItem: {
        backgroundColor: 'white',
        height: 60,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 0
    },
    confirm: {
        backgroundColor: 'red',
        height: 40,
        marginBottom: 0,
        justifyContent: 'center',
    },
    confirmText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    arrow: {
        width: 14,
        height: 14,
        marginLeft: 5,
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
        height: 100,
        textAlignVertical: 'top',
    },
    blurView: {
        flex: 1,
        flexDirection: 'column-reverse',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    datePicker: {
        height: 200,
        width: screen.width,
        backgroundColor: 'white'
    },
    buttonContainer: {
        flexDirection: 'row',
        height: 40,
        width: screen.width,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelButton: {
        marginLeft: 5,
        height: 30,
        width: 45,
        fontSize: 17,
        textAlign: 'center',
    },
    separator: {
        flex: 1
    },
    okButton: {
        marginRight: 5,
        height: 30,
        width: 45,
        fontSize: 17,
        color: 'rgba(41, 147, 252, 1)',
        textAlign: 'center'
    },
    timeTip: {
        height: 15,
        fontSize: 12,
        marginTop: 5,
        color: 'darkorange',
    },
    dateStr: {
        flex: 1,
        textAlign: 'right',
        color: '#999999'
    }
});


Date.prototype.pattern = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        'H+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        'S': this.getMilliseconds() //毫秒
    };
    var week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};




