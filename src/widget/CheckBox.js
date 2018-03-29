/**
 * Created by huxinguang on 2017/7/6.
 */
'use strict';

import React, {PureComponent} from 'react';
import {Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

class CheckBox extends PureComponent {

    static propTypes = {
        style: PropTypes.object,
        onPress: PropTypes.func.isRequired,
        title: PropTypes.string,
        titleStyle: PropTypes.object,
        checkedUri: PropTypes.number.isRequired,
        uncheckedUri: PropTypes.number.isRequired,
        iconStyle: PropTypes.object,
        checked: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            isChecked: props.checked
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.state.isChecked) {
            this.setState({isChecked: nextProps.checked});
        }
    }

    render() {

        let iconUri = this.state.isChecked === false ? this.props.uncheckedUri : this.props.checkedUri;

        return (
            <TouchableOpacity
                style={[styles.container, this.props.style]}
                onPress={() => {
                    this.props.onPress && this.props.onPress(!this.state.isChecked);
                    this.setState({isChecked: !this.state.isChecked});
                }}>
                <Image style={[styles.image, this.props.iconStyle]} source={iconUri}/>
                <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
            </TouchableOpacity>

        );
    }

}

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'transparent',
        height: 22,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        resizeMode: 'stretch',
        width: 18,
        height: 18
    },
    title: {
        flex: 1,
        fontSize: 14,
        color: 'gray',
        marginLeft: 5
    }

});


export default CheckBox;