//import liraries
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

import color from './color';

// create a component
class SpacingView extends PureComponent {

    static propTypes = {
        style: PropTypes.object,
        icon_uri: PropTypes.number,
        iconStyle: PropTypes.object,
        title: PropTypes.string,
        titleStyle: PropTypes.object
    };

    render() {
        let iconImage = this.props.icon_uri && this.props.iconStyle &&
            <Image style={this.props.iconStyle} source={this.props.icon_uri}/>;

        let titleText = this.props.title && this.props.titleStyle &&
            <Text style={this.props.titleStyle}>{this.props.title}</Text>;

        return (
            <View style={ [styles.container, this.props.style]}>
                {iconImage}
                {titleText}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        height: 6,
        backgroundColor: color.background,
    },
});

//make this component available to the app
export default SpacingView;
