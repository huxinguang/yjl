/**
 * Created by huxinguang on 2017/7/4.
 */

import React, {PureComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

class UninputableCell extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        subtitle: PropTypes.string
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.subtitle}>{this.props.subtitle}</Text>
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
        width: 90,
        textAlign: 'left',
        justifyContent: 'center',

    },
    subtitle: {
        flex: 1,
        textAlign: 'right',
        marginRight: 10,
        fontSize: 14,
        color: '#999999'
    }

});

export default UninputableCell;


