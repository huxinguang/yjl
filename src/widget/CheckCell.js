/**
 * Created by huxinguang on 2017/7/5.
 */

'use strict';

import React, {PureComponent} from 'react';
import {Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

class CheckCell extends PureComponent {

    static propTypes = {
        onPressCheck: PropTypes.func,
        title: PropTypes.string,
        icon: PropTypes.number
    };

    constructor(Props) {
        super(Props);
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress = {() => {this.props.onPressCheck && this.props.onPressCheck(this)}}>
                <Image style={styles.image} source={this.props.icon}/>
                <Text style={styles.title}>{this.props.title}</Text>
            </TouchableOpacity>

        );
    }


}

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image:{
        width: 22,
        height: 22,
        marginLeft: 10,
        marginRight: 6
    },
    title: {
        fontSize: 14,
        flex: 1
    }

});


export default  CheckCell;