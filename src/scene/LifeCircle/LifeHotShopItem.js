/**
 * Created by kunpan on 2017/6/27.
 */
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {screen} from '../../common';

export default class LifeHotShopItem extends PureComponent {
    render() {
        let info = this.props.info;
        // title、icon  (info中的属性一定是返回的数据个数)
        let title = info.title;
        let imageUrl = info.imageurl.replace('w.h', '50.0','40.0');

        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <View>
                    <Image style={styles.icon} source={{uri: imageUrl.length > 0 ? imageUrl : 'https://www.baidu.com/img/bd_logo1.png'}}/>

                    <Text style={styles.textStyle} numberOfLines={1}>
                        {info.title}
                    </Text>
                </View>


            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // marginTop : 10,
        // paddingLeft : 20,
        // paddingRight : 20,
        width: (screen.width) * 0.25,
        height: 90,
        backgroundColor: "white",
        // paddingTop : 5,
    },
    textStyle: {
        fontSize: 13,
        color: "gray",
        height: 20,
        textAlign: "center",
        marginTop: 5,
    },
    icon: {
        width: (screen.width) * 0.25,//60,
        height: 60,
        backgroundColor: '#e4e4e4'
    },
});