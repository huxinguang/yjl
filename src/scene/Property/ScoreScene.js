import React, {PureComponent} from 'react';
import {
    DeviceEventEmitter,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {color, StarScore} from '../../widget/index';
import {screen} from '../../common';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import PropTypes from 'prop-types';
import {filterEmoji} from '../../common/tool';
import Toast from 'react-native-easy-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

class ScoreScene extends PureComponent {

    supplementary: string;
    satisfaction: StarScore;
    attitude: StarScore;
    quality: StarScore;
    timeliness: StarScore;
    sanitation: StarScore;
    toast: Toast;
    commentTextInput: TextInput;

    static navigationOptions = ({navigation}) => ({
        headerTitle: '评价',
        headerRight: (
            <Text/>
        ),
    });

    props: {
        navigation: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.supplementary = '';
    }


    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView style={styles.scrollView} getTextInputRefs={() =>{return [this.commentTextInput];}}>
                    <View style={styles.subContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>满 意 度</Text>
                        </View>
                        <StarScore ref={(ss) => this.satisfaction = ss}
                            originalScore={0}
                            style={{width: 185, height: 30, marginLeft: 25}}
                            starStyle={{fontSize: 25, marginLeft: 10}}
                            scoreAble={true}/>
                    </View>

                    <View style={styles.subContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>服 务 态 度</Text>
                        </View>
                        <StarScore ref={(as) => this.attitude = as}
                            originalScore={0}
                            style={{width: 185, height: 30, marginLeft: 25}}
                            starStyle={{fontSize: 25, marginLeft: 10}}
                            scoreAble={true}/>
                    </View>

                    <View style={styles.subContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>服 务 质 量</Text>
                        </View>
                        <StarScore ref={(qs) => this.quality = qs}
                            originalScore={0}
                            style={{width: 185, height: 30, marginLeft: 25}}
                            starStyle={{fontSize: 25, marginLeft: 10}}
                            scoreAble={true}/>
                    </View>

                    <View style={styles.subContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>及 时 性</Text>
                        </View>
                        <StarScore ref={(ts) => this.timeliness = ts}
                            originalScore={0}
                            style={{width: 185, height: 30, marginLeft: 25}}
                            starStyle={{fontSize: 25, marginLeft: 10}}
                            scoreAble={true}/>
                    </View>

                    <View style={styles.subContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>现场卫生处理</Text>
                        </View>
                        <StarScore ref={(ss) => this.sanitation = ss}
                            originalScore={0}
                            style={{width: 185, height: 30, marginLeft: 25}}
                            starStyle={{fontSize: 25, marginLeft: 10}}
                            scoreAble={true}/>
                    </View>

                    <TextInput style={styles.supplementary}
                        ref={(ci) => {this.commentTextInput = ci;}}
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

                </KeyboardAwareScrollView>
                <TouchableOpacity style={styles.confirm} onPress={() => {
                    this._onPressConfirm();
                }}>
                    <Text style={styles.confirmText}>{'提交'} </Text>
                </TouchableOpacity>

                <Toast ref={(t) => this.toast = t}
                    position='center'/>
            </View>
        );
    }

    _onPressConfirm() {

        if (this.satisfaction.state.currentScore === 0) {
            // this.toast.show('请');
        }
        var service = '';
        var event = '';
        switch (this.props.navigation.state.params.type) {
        case 'Fix':
            service = 'Esfixs.Esfix_Comment';
            event = 'CommentFixSuccess';
            break;
        case 'Complaint':
            service = 'Esfixs.Complaint_Comment';
            event = 'CommentComplaintSuccess';
            break;
        case 'PaidService':
            service = 'Esfixs.Paid_Comment';
            event = 'CommentServiceSuccess';
            break;
        default:
            break;
        }

        let _this = this;
        const paramMap = {
            'service': service,
            'tag': GlobalValue.block,
            'bid': _this.props.navigation.state.params.bidString,
            'field11': _this.satisfaction.state.currentScore,
            'field12': _this.attitude.state.currentScore,
            'field13': _this.quality.state.currentScore,
            'field14': _this.timeliness.state.currentScore,
            'field15': _this.sanitation.state.currentScore,
            'field16': filterEmoji(_this.supplementary)
        };
        get(paramMap, function (data) {
            if (data.code === 0) {
                DeviceEventEmitter.emit(event);
                _this.props.navigation.goBack();
            }
        });
    }

}

export default ScoreScene;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
    },
    scrollView: {
        flex: 1,
        backgroundColor: color.background
    },
    subContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        height: 30,
        width: screen.width

    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: 90,
        marginLeft: 30
    },
    title: {
        fontSize: 14,
        width: 90
    },
    supplementary: {
        width: screen.width - 20 * 2,
        height: 170,
        fontSize: 14,
        margin: 0,
        color: '#999999',
        padding: 10,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        marginTop: 20,
        marginLeft: 20
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

});