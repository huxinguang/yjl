/**
 * Created by huxinguang on 2017/7/4.
 */

import React, {PureComponent} from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

class InputableCell extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        placeholder: PropTypes.string,
        keyboardType: PropTypes.string,
        maxLength: PropTypes.number,
        onInput: PropTypes.func,
        placeholderTextColor: PropTypes.string,
    };

    constructor(Props) {
        super(Props);
    }

    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
                <TextInput style={styles.input}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                    keyboardType={this.props.keyboardType}
                    maxLength={this.props.maxLength}
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => {
                        this.props.onInput && this.props.onInput(text, this);
                    }}
                />
            </View>
        );
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginLeft: 10,
        fontSize: 14,
        color: 'black',
        width: 120,
        textAlign: 'left',
        justifyContent: 'center',

    },
    input: {
        flex: 1,
        width: 100,
        textAlign: 'right',
        marginRight: 10,
        fontSize: 14,
        color: '#999999'
    }

});

export default InputableCell;


