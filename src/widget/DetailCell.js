//import liraries
import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {icon} from '../widget';
import {Paragraph} from './Text';
import Separator from './Separator';

// create a component
class DetailCell extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        image: PropTypes.number,
        subtitle: PropTypes.string,
        style: PropTypes.object,
        onCellPressed: PropTypes.func,
    };

    render() {
        let leftIcon = this.props.image && <Image style={styles.icon} source={this.props.image}/>;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    this.props.onCellPressed && this.props.onCellPressed(this.props.title);
                }}>
                    <View style={[styles.content, this.props.style]}>
                        {leftIcon}
                        <Text style={styles.title}>{this.props.title}</Text>
                        <View style={{flex: 1, backgroundColor: 'blue'}}/>
                        <Paragraph style={{color: '#999999'}}>{this.props.subtitle}</Paragraph>
                        <Text style={styles.arrow}>{icon('arrow_right')}</Text>
                    </View>

                    <Separator/>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    content: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    title: {
        fontSize: 14,
        color: 'black',
        width: 110,
        textAlign: 'left',
        justifyContent: 'center',
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 10
    },
    arrow: {
        fontSize: 14,
        fontFamily: 'iconfont',
        color: '#bbbbbb'
    }
});

//make this component available to the app
export default DetailCell;
