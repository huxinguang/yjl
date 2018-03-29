import React, {PureComponent} from 'react';
import {
    DatePickerAndroid,
    DatePickerIOS,
    DeviceEventEmitter,
    Image,
    Keyboard,
    Modal,
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
import {ChooseImageView, color, DetailCell, InputableCell, Separator,AnimatedDatePickerIOS} from '../../widget';
import Toast from 'react-native-easy-toast';
import {screen} from '../../common';
import ImagePicker from 'react-native-image-crop-picker';
import {GlobalValue} from '../../Global';
import {get} from '../../api';
import ActionSheet from 'react-native-actionsheet';


class AddPaidService extends PureComponent {
    ciView: ChooseImageView;
    linkmanCell: InputableCell;
    linkman: string;
    phoneCell: InputableCell;
    phone: string;
    supplementary: string;
    datePickerIOS: AnimatedDatePickerIOS;
    timePickerIOS: AnimatedDatePickerIOS;
    actionSheet: ActionSheet;

    static navigationOptions = ({navigation}) => ({
        headerTitle: '有偿服务',
        headerRight: (
            <Text/>
        ),
    });

    static propTypes = {
        navigation: PropTypes.object,
    };


    state: {
        animationType: string,
        dateModalVisible: boolean,
        timeModalVisible: boolean,
        date: Date,
        time: Date,
        timeZoneOffsetInHours: number,
        address: string,
        services: Array,
    };

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('ServiceSelected', (services) => this._updateServiceInfo(services));
        this._requestAddress();
    }

    componentWillUnmount() {
        this.subscription.remove();
        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            console.log(e);
        });
    }

    _showIOSDatePicker(){
        this.datePickerIOS.show();
    }

    _showIOSTimePicker(){
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

    onDateChange(date) {
        this.setState({date: date});
    }

    onTimeChange(time) {
        this.setState({time: time});
    }

    constructor(props: Object) {
        super(props);
        this.state = {
            animationType: 'none',
            dateModalVisible: false,
            timeModalVisible: false,
            date: new Date(),
            time: new Date(),
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
            address: '',
            services: []
        };

        this.linkman = '';
        this.phone = '';
        this.fix = '';
        this.supplementary = '';

    }

    render() {

        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1, backgroundColor: color.background}}>
                    <DetailCell ref={(ac) => this.addressCell = ac}
                        title='地 址'
                        subtitle={this.state.address}
                        onCellPressed={this.onCellPressed.bind(this)}/>
                    <InputableCell ref={(lc) => this.linkmanCell = lc}
                        title='联 系 人'
                        placeholder={GlobalValue.userInfo.title}
                        placeholderTextColor='#999999'
                        keyboardType='default'
                        onInput={(text) => {
                            this.linkman = text;
                        }}/>
                    <Separator/>
                    <InputableCell ref={(pc) => this.phoneCell = pc}
                        title='联系电话'
                        placeholder={GlobalValue.userInfo.uname}
                        placeholderTextColor='#999999'
                        keyboardType='numeric'
                        maxLength={11}
                        onInput={(text) => {
                            this.phone = text;
                        }}/>
                    <Separator/>
                    {this._renderServiceCell()}

                    <TouchableOpacity onPress={Platform.OS === 'android' ? this._showAndroidDatePicker.bind(this) : this._showIOSDatePicker.bind(this)}>
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
                            placeholder={'补充说明，方便服务人员了解情况'}
                            placeholderTextColor='#999999'
                            multiline={true}
                            underlineColorAndroid='transparent'
                            numberOfLines={4}
                            onSubmitEditing={Keyboard.dismiss}
                            onChangeText={(text) => {
                                this.supplementary = text;
                            }}/>
                    </View>
                    <Separator/>
                    <ChooseImageView ref={(civ) => this.ciView = civ} onPressAdd={this.onPressAdd.bind(this)}
                        onPressImage={this.onPressImage.bind(this)} selectedImages={Array()}/>

                </ScrollView>
                <TouchableOpacity style={styles.confirm} onPress={() => {
                    this.onPressConfirm();
                }}>
                    <Text style={styles.confirmText}>{'提交'} </Text>
                </TouchableOpacity>
                <AnimatedDatePickerIOS ref={(dpi) => this.datePickerIOS = dpi} originalDate={this.state.date} dateMode='date' onOKPress={this._onDatePickerOk.bind(this)}/>
                <AnimatedDatePickerIOS ref={(tpi) => this.timePickerIOS = tpi} originalDate={this.state.time} dateMode='time' onOKPress={this._onTimePickerOk.bind(this)}/>
                <ActionSheet
                    ref={ac => this.actionSheet = ac}
                    title={'请选择照片来源'}
                    options={[ '取消', '拍照', '从相册中选择']}
                    cancelButtonIndex={0}
                    onPress={this._handleActionSheetPress.bind(this)}
                />
                <Toast ref='toast' position='center'/>


            </View>
        );
    }

    _renderServiceCell() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ChooseServiceScene', {services: this.state.services});
            }}>
                <View style={styles.serviceContainer}>
                    <Text style={styles.serviceTitle}>预约服务</Text>
                    <ScrollView style={styles.serviceScrolView}
                        horizontal={true}
                    >
                        {this._renderServices()}
                    </ScrollView>
                    <Image style={styles.arrow} source={require('../../img/Public/cell_arrow.png')}/>
                </View>

                <Separator/>
            </TouchableOpacity>
        );
    }

    _renderServices() {
        let services = [];
        for (var i = 0; i < this.state.services.length; i++) {
            let service = this.state.services[i];
            let serviceItem = (
                <Text style={{marginLeft: 5, fontSize: 14, color: '#999999'}}
                    key={i}
                >{service.name}
                    <Text style={{fontSize: 14, color: 'darkorange', lineHeight: 22}}>{service.price}</Text>
                </Text>
            );
            services.push(serviceItem);
        }
        return services;
    }

    _updateServiceInfo(services) {
        this.setState({
            services: services
        });
    }

    _onDatePickerOk(selectedDate){
        this.setState({
            date:selectedDate
        });
    }

    _onTimePickerOk(selectedTime){
        this.setState({
            time:selectedTime
        });
    }

    _handleActionSheetPress(i){
        if (i === 1){
            this.selectImage('camera');
        }else if (i === 2){
            this.selectImage('album');
        }else {
            //do nothing
        }
    }

    onCellPressed(cellTitle) {
        alert('xxxx');
    }

    selectImage(where) {

        if (where === 'camera') {

            ImagePicker.openCamera({
                mediaType: 'photo',
                loadingLabelText: '正在处理图片...',
                compressImageQuality: 0.2
            }).then(image => {

                let sources = [];
                for (let i = 0; i < this.ciView.state.selectedImagesSource.length; i++) {
                    sources.push(this.ciView.state.selectedImagesSource[i]);
                }
                let source = {uri: image.path};
                sources.push(source);
                this.ciView.setState({
                    selectedImagesSource: sources,
                });
            });

        } else {

            ImagePicker.openPicker({
                multiple: true,
                maxFiles: 4 - this.ciView.state.selectedImagesSource.length,
                showsSelectedCount: true,
                mediaType: 'photo',
                loadingLabelText: '正在处理图片...',
                smartAlbums: ['UserLibrary', 'PhotoStream', 'Bursts'],//Bursts: 连拍
                compressImageQuality: 0.2
            }).then(images => {

                let sources = [];
                for (let i = 0; i < this.ciView.state.selectedImagesSource.length; i++) {
                    sources.push(this.ciView.state.selectedImagesSource[i]);
                }
                for (let j = 0; j < images.length; j++) {
                    let source = {uri: images[j].path};
                    sources.push(source);
                }
                this.ciView.setState({
                    selectedImagesSource: sources,
                });
            });
        }

    }

    onPressAdd() {
        this.ciView.setState({
            editing: false
        });
        this.actionSheet.show();
    }

    onPressImage(chooseImageView) {
        chooseImageView.setState({
            editing: !chooseImageView.state.editing
        });
    }


    onPressConfirm() {

        // 过滤emoj
        // "期望上门时间要在2小时之后"
        // "期望上门时间要在7天之内"
        // 上门时间默认
        //
        // if (this.linkman.length > 0 && trimAllSpace(this.linkman).length === 0) {
        //     alert('请填写联系人');
        //     return;
        // }
        //
        // if (this.phone.length > 0 && trimAllSpace(this.phone).length === 0) {
        //     alert('请填写联系电话');
        //     return;
        // }
        //
        // let _this = this;
        // var paramMap = {
        //     'service': 'Esfixs.Paid_add',
        //     'time': (new Date()).valueOf(),
        //     'tag': GlobalValue.blockInfo.tag,
        //     'block_id': GlobalValue.blockInfo.id,
        //     'uid': GlobalValue.userInfo.uid,
        //     'address': _this.addressCell.props.subtitle,
        //     'linkman': (_this.linkman.length > 0 ? filterEmoji(_this.linkman) : _this.linkmanCell.props.placeholder),
        //     'phone': (_this.phone.length > 0 ? _this.phone : _this.phoneCell.props.placeholder),
        //     'serve_time': '2017/8/10 17:20',
        //     'content': filterEmoji(_this.supplementary)
        // };
        //
        //
        // for (var i = 0; i < this.ciView.state.selectedImagesSource.length; i++) {
        //     let file = {
        //         uri: this.ciView.state.selectedImagesSource[i],
        //         type: 'multipart/form-data',
        //         name: (i.toString() + '.jpg')
        //     };
        //     paramMap['file' + i.toString()] = file;
        // }
        //
        // post(paramMap, function (data) {
        //     // _this.refs.toast.show(data.msg);
        //     // alert(data.msg);
        //
        //
        // });

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

AddPaidService.defaultProps = {
    date: new Date(),
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
};

export default AddPaidService;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    dateItem: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white'
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
        height: 60,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 0,
        backgroundColor: 'white'
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
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        backgroundColor: 'white'
    },
    supplementary: {
        flex: 1,
        fontSize: 14,
        margin: 0,
        color: '#999999',
        padding: 0,
        textAlignVertical: 'top',
    },
    blurView: {
        flex: 1,
        flexDirection: 'column-reverse',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
    serviceContainer: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white'
    },
    serviceScrolView: {
        flex: 1,
        flexDirection: 'row-reverse'
    },
    serviceTitle: {
        fontSize: 14,
        color: 'black',
        width: 60,
        textAlign: 'left',
        justifyContent: 'center',
    },
    serviceText: {
        flex: 1,
        backgroundColor: 'red',
        height: 44
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
        'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时
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
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};




