//import liraries
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

// create a component
class Button extends PureComponent {

    static propTypes = {
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        style: PropTypes.object,
        containerStyle: PropTypes.object,
        title: PropTypes.string,
        activeOpacity: PropTypes.number
    };

    static defaultProps = {
        onPress: () => {
        },
        disabled: false,
        activeOpacity: 0.8
    };

    render() {
        let {onPress, disabled, style, containerStyle, title, activeOpacity} = this.props;
        return (
            <TouchableOpacity
                style={[styles.container, containerStyle]}
                onPress={onPress}
                disabled={disabled}
                activeOpacity={activeOpacity}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
export default Button;