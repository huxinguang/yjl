//import liraries
import React, {PureComponent} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {PropTypes} from 'prop-types';
import {Heading1, Paragraph} from '../../widget/Text';
import {screen} from '../../common';
import {color} from '../../widget';

// create a component
class GroupPurchaseCell extends PureComponent {

    static propTypes = {
        info: PropTypes.object,
        onPress: PropTypes.func
    };

    render() {
        let {info} = this.props;
        let imageUrl = info.imageUrl.replace('w.h', '160.0');
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.onPress(info)}>
                <Image source={{uri: imageUrl}} style={styles.icon}/>
                <View style={styles.rightContainer}>
                    <Heading1>{info.title}</Heading1>
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <Heading1 style={styles.price}>{info.price}元代金券</Heading1>
                    </View>
                    <Paragraph numberOfLines={0} style={{marginTop: 8}}>{info.subtitle}</Paragraph>
                </View>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    rightContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 10,
    },
    price: {
        color: color.theme
    }
});

//make this component available to the app
export default GroupPurchaseCell;
