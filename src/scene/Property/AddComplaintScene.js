import React, {PureComponent} from 'react';
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    DeviceEventEmitter
} from 'react-native';
import PropTypes from 'prop-types';
import {color} from '../../widget/index';
import {ChooseImageView, DetailCell, InputableCell, Separator} from '../../widget';
import Toast from 'react-native-easy-toast';
import {screen} from '../../common';
import ImagePicker from 'react-native-image-crop-picker';
import {GlobalValue} from '../../Global';
import {get, post} from '../../api';
import {filterEmoji, trimAllSpace} from '../../common/tool';
import ActionSheet from 'react-native-actionsheet';
// import {Loading,EasyLoading} from 'react-native-easy-loading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';


class AddComplaintScene extends PureComponent {
    ciView: ChooseImageView;
    linkmanCell: InputableCell;
    linkman: string;
    phoneCell: InputableCell;
    phone: string;
    supplementary: string;
    actionSheet: ActionSheet;
    toast: Toast;
    supplementaryTextInput:TextInput;

    static navigationOptions = ({navigation}) => ({
        headerTitle: '投诉',
        headerRight: (
            <Text/>
        ),
    });

    static propTypes = {
        navigation: PropTypes.object,
    };


    state: {
        address: string,
    };

    componentDidMount() {
        this._requestAddress();
    }

    componentWillUnmount() {
        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            console.log(e);
        });
    }


    constructor(props: Object) {
        super(props);
        this.state = {
            address: '',
        };

        this.linkman = '';
        this.phone = '';
        this.fix = '';
        this.supplementary = '';

    }

    render() {

        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView style={{flex: 1, backgroundColor: color.background}} getTextInputRefs={() => {
                    return [this.supplementaryTextInput];
                }}>
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
                    <TextInput style={styles.supplementary}
                        ref={(r) => {
                            this.supplementaryTextInput = r;
                        }}
                        placeholder={'对于我们的服务您还有哪些意见或建议？'}
                        placeholderTextColor='#999999'
                        multiline={true}
                        underlineColorAndroid='transparent'
                        numberOfLines={10}
                        onSubmitEditing={Keyboard.dismiss}
                        onChangeText={(text) => {
                            this.supplementary = text;
                        }}

                    />

                    <Separator/>
                    <ChooseImageView ref={(civ) => this.ciView = civ} onPressAdd={this.onPressAdd.bind(this)}
                        onPressImage={this.onPressImage.bind(this)} selectedImages={Array()}/>

                </KeyboardAwareScrollView>
                <TouchableOpacity style={styles.confirm} onPress={() => {
                    this.onPressConfirm();
                }}>
                    <Text style={styles.confirmText}>{'提交'} </Text>
                </TouchableOpacity>
                <ActionSheet
                    ref={ac => this.actionSheet = ac}
                    title={'请选择照片来源'}
                    options={[ '取消', '拍照', '从相册中选择']}
                    cancelButtonIndex={0}
                    onPress={this._handleActionSheetPress.bind(this)}
                />

                <Toast ref={(t) => this.toast = t}
                    position='center'/>
                {/*<Loading type={'type'} loadingStyle={{ backgroundColor: '#f007' }} />*/}
            </View>
        );
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

    onCellPressed() {

        this.toast.show('xxxx');
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
        // 上门时间默认报修当日下午1：00

        if (this.linkman.length > 0 && trimAllSpace(this.linkman).length === 0) {
            this.toast.show('请填写联系人');
            return;
        }

        if (this.phone.length > 0 && trimAllSpace(this.phone).length === 0) {
            this.toast.show('请填写联系电话');
            return;
        }

        // EasyLoading.show('Loading...', 3000, 'type');

        let _this = this;
        var paramMap = {
            'service': 'Esfixs.Complaint_add',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'block_id': GlobalValue.blockInfo.id,
            'uid': GlobalValue.userInfo.uid,
            'address': _this.addressCell.props.subtitle,
            'linkman': (_this.linkman.length > 0 ? filterEmoji(_this.linkman) : _this.linkmanCell.props.placeholder),
            'phone': (_this.phone.length > 0 ? _this.phone : _this.phoneCell.props.placeholder),
            'content': filterEmoji(_this.supplementary)
        };

        for (var i = 0; i < this.ciView.state.selectedImagesSource.length; i++) {
            let file = {
                uri: this.ciView.state.selectedImagesSource[i],
                type: 'multipart/form-data',
                name: (i.toString() + '.jpg')
            };
            paramMap['file' + i.toString()] = file;
        }

        post(paramMap, function (data) {
            if (data.code === 0){
                // EasyLoading.dismis('投诉成功');
                DeviceEventEmitter.emit('AddComplaintSuccess');
                _this.props.navigation.goBack();
            }else {
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

export default AddComplaintScene;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    supplementary: {
        width: screen.width,
        height: 170,
        fontSize: 14,
        margin: 0,
        color: '#999999',
        padding: 15,
        textAlignVertical: 'top',
        backgroundColor: 'white'
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
    }

});





