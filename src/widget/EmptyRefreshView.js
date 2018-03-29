/**
 * Created by Administrator on 2017/6/28.
 */
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PropTypes} from 'prop-types';
import color from './color';
import {screen} from '../common/';

class EmptyRefreshView extends PureComponent {

    static propTypes = {
        style: PropTypes.object,
        text: PropTypes.string,
        onRefresh: PropTypes.func
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <Image style={{width: 40, height: 40}} source={{uri: '../img/Mine/icon_user_avatar_anonymous@2x.png'}}/>
                <Text style={{marginVertical: 10}}> {this.props.text}</Text>
                <TouchableOpacity style={styles.refreshBtn} onPress={() => {
                    this.props.onRefresh();
                }}>
                    <Text style={{color: 'white'}}> 点击刷新</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.background
    },
    refreshBtn: {
        width: screen.width / 3.3,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: 'darkgray'
    }
});

export default EmptyRefreshView;
