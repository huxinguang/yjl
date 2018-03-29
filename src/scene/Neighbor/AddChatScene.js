import React, {PureComponent} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import PropTypes from 'prop-types';
import {color} from '../../widget/index';
import {ChooseImageView, DetailCell, InputableCell, Separator} from '../../widget';
import Toast from 'react-native-easy-toast';
import {screen} from '../../common';
import ImagePicker from 'react-native-image-crop-picker';
import {GlobalValue} from '../../Global';
import {get} from '../../api';


class AddPublishScene extends PureComponent {
    ciView: ChooseImageView;
    linkmanCell: InputableCell;
    linkman: string;
    phoneCell: InputableCell;
    phone: string;
    supplementary: string;

    static navigationOptions = ({navigation}) => ({
        headerTitle: '聊聊发布',
        headerRight: (
            <Text/>
        )
    });

    static propTypes = {
        navigation: PropTypes.object,
    };

    state: {
        address: string
    };

    componentWillUnmount() {
        ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
        }).catch(e => {
            console.log(e);
        });
    }

    componentDidMount() {
        // this._requestClass();
    }

    constructor(props: Object) {
        super(props);
        this.state = {
            address: ''
        };
        this.linkman = '';
        this.phone = '';
        this.supplementary = '';

    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1, backgroundColor: color.background}}>
                    <DetailCell ref={(ac) => this.addressCell = ac}
                        title='选择分类'
                        subtitle={this.state.address}
                        onCellPressed={this.onCellPressed.bind(this)}/>
                    <TextInput style={styles.supplementary}
                        placeholder={'说点什么吧，200字以内~'}
                        placeholderTextColor='#999999'
                        multiline={true}
                        underlineColorAndroid='transparent'
                        numberOfLines={4}
                        onSubmitEditing={Keyboard.dismiss}
                        onChangeText={(text) => {
                            this.supplementary = text;
                        }}

                    />
                    <Separator/>
                    <ChooseImageView ref={(civ) => this.ciView = civ} onPressAdd={this.onPressAdd.bind(this)}
                        onPressImage={this.onPressImage.bind(this)} selectedImages={Array()}/>

                </ScrollView>
                <TouchableOpacity style={styles.confirm} onPress={() => {
                    this.onPressConfirm();
                }}>
                    <Text style={styles.confirmText}>{'发布'} </Text>
                </TouchableOpacity>
                <Toast ref='toast'
                    position='center'/>
            </View>
        );
    }

    onCellPressed(cellTitle) {
        alert('xxxx');
    }

    onPressAdd(chooseImageView) {
        chooseImageView.setState({
            editing: false
        });

        ImagePicker.openPicker({
            multiple: true,
            maxFiles: 4 - chooseImageView.state.selectedImagesSource.length,
            showsSelectedCount: true,
            mediaType: 'photo',
            loadingLabelText: '正在处理图片...',
            smartAlbums: ['UserLibrary', 'PhotoStream', 'Bursts'],//Bursts: 连拍
            compressImageQuality: 0.1
        }).then(images => {
            let sources = [];
            for (let i = 0; i < chooseImageView.state.selectedImagesSource.length; i++) {
                sources.push(chooseImageView.state.selectedImagesSource[i]);
            }
            for (let j = 0; j < images.length; j++) {
                let source = {uri: images[j].path};
                sources.push(source);
            }
            chooseImageView.setState({
                selectedImagesSource: sources,
            });
        });
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

    _requestClass() {
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

export default AddPublishScene;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        fontSize: 14,
        height: 120,
        width: screen.width,
        color: '#999999',
        padding: 10,
        textAlignVertical: 'top',
        backgroundColor: 'white'
    },

});






