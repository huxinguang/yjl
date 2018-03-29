import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, DatePickerIOS, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import screen from '../common/screen';

const DURATION = 500;
const TRANSLATE_Y = 240;
const OVERLAY_OPACITY = 0.4;

class AnimatedDatePickerIOS extends Component {

    static propTypes = {
        originalDate: PropTypes.instanceOf(Date).isRequired,
        dateMode: PropTypes.string.isRequired,
        onOKPress: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            positionAnim: new Animated.Value(TRANSLATE_Y),
            opacityAnim: new Animated.Value(0),
            date: this.props.originalDate
        };
    }

    show() {
        this.setState({visible: true});
        this._showPicker();
    }

    hide() {

        this._hidePicker(() => {
            this.setState({visible: false});
        });
    }

    _cancel() {
        this.hide();
    }

    _showPicker() {
        Animated.parallel([
            Animated.timing(this.state.positionAnim, {
                toValue: 0,
                duration: DURATION,
            }),
            Animated.timing(this.state.opacityAnim, {
                toValue: OVERLAY_OPACITY,
                duration: 500,
            })

        ]).start();
    }

    _hidePicker(callback) {
        Animated.parallel([
            Animated.timing(this.state.positionAnim, {
                toValue: TRANSLATE_Y,
                duration: DURATION,
            }),
            Animated.timing(this.state.opacityAnim, {
                toValue: 0,
                duration: DURATION,
            })

        ]).start(callback || function () {
        });

    }

    render() {
        const {visible, positionAnim, opacityAnim} = this.state;
        return (
            <Modal
                visible={visible}
                transparent={true}
                animationType="none"
                onRequestClose={this._cancel}
            >
                <TouchableOpacity style={styles.overlay} activeOpacity={1}
                                  onPress={() => {
                                      this._cancel();
                                  }}>
                    <Animated.View style={[styles.blurView, {opacity: opacityAnim}]}/>
                    <Animated.View
                        style={[styles.pickerContainer, {height: TRANSLATE_Y, transform: [{translateY: positionAnim}]}]}
                    >
                        {this._renderTopButtons()}
                        {this._renderPicker()}

                    </Animated.View>
                </TouchableOpacity>

            </Modal>
        );
    }

    _renderTopButtons() {
        return (
            <View style={styles.buttonContainer}>
                <Text style={styles.cancelButton} onPress={() => {
                    this._cancel();
                }}>{'取消'}</Text>
                <View style={styles.separator}/>
                <Text style={styles.okButton} onPress={() => {
                    this.props.onOKPress(this.state.date);
                    this._cancel();
                }}>{'确定'} </Text>
            </View>
        );
    }

    _renderPicker() {
        return (
            <DatePickerIOS date={this.state.date}
                           mode={this.props.dateMode}
                           minimumDate={new Date()}
                           timeZoneOffsetInMinutes={8 * 60}
                           onDateChange={(date) => {
                               this.setState({
                                   date: date
                               });
                           }}
                           style={styles.datePicker}
            />
        );
    }
}

export default AnimatedDatePickerIOS;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'column-reverse',
    },
    blurView: {
        flex: 1,
        width: screen.width,
        height: screen.height,
        position: 'absolute',
        backgroundColor: 'black',
    },
    pickerContainer: {
        height: 240,
        width: screen.width,
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

});
