//import liraries
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PropTypes} from 'prop-types';
import {Heading2} from './Text';
import {screen} from '../common';
import icon from './IconFont';

// create a component
class MenuButton extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        icon: PropTypes.string,
        iconColor: PropTypes.string,
        backgroundColor: PropTypes.string,
        borderRadius: PropTypes.number,
        onPress: PropTypes.func
    };

    static defaultProps = {
        iconColor: 'white',
        backgroundColor: 'transparent',
        borderRadius: 10,
    };

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <View style={[styles.icon, {justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.backgroundColor, borderRadius: this.props.borderRadius}]}>
                    <Text style={{fontSize: 26, color: this.props.iconColor, fontFamily: 'iconfont'}}>{icon(this.props.icon)}</Text>
                </View>
                <Heading2>
                    {this.props.title}
                </Heading2>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: screen.width / 4,
        height: screen.width / 4,
    },
    icon: {
        width: screen.width / 9,
        height: screen.width / 9,
        margin: 5,
    }
});

//make this component available to the app
export default MenuButton;
