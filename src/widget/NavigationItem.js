//import liraries
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

// create a component
class NavigationItem extends PureComponent {

    static propTypes = {
        icon_uri: PropTypes.number,//可选
        title: PropTypes.string,//可选
        style: PropTypes.any,//必选
        onPress: PropTypes.func
    };

    render() {
        let icon = this.props.icon_uri && this.props.style &&
            <Image style={this.props.style} source={this.props.icon_uri}/>;

        let title = this.props.title && this.props.style &&
            <Text style={this.props.style}>{this.props.title}</Text>;
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                {icon}
                {title}
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // icon: {
    //     width: 27,
    //     height: 27,
    //     margin: 8,
    // },
    // title: {
    //     fontSize: 15,
    //     color: '#333333',
    //     margin: 8,
    // }
});

//make this component available to the app
export default NavigationItem;
