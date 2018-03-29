/**
 * Created by huxinguang on 2017/7/6.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {screen} from '../../common';
import PropTypes from 'prop-types';

class ListItem extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        bgColor: PropTypes.string,
        onPress: PropTypes.func,
        isSelected: PropTypes.bool,
        index: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.isSelected
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            selected: nextProps.isSelected
        });
    }

    render() {

        let titleColor = this.state.selected === false ? 'dimgray' : 'darkorange';
        let bottomLineColor = this.state.selected === false ? this.props.bgColor : 'darkorange';

        return (
            <TouchableOpacity style={[styles.container, {backgroundColor: this.props.bgColor}]}
                              onPress={() => {
                                  this.props.onPress && this.props.onPress(this.props.index);
                                  this.setState({selected: true});
                              }}>
                <View style={styles.view}>
                    <Text style={[styles.title, {color: titleColor}]}>{this.props.title}</Text>
                </View>
                <View style={[styles.bottomLine, {backgroundColor: bottomLineColor}]}/>
            </TouchableOpacity>
        );

    }


}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 45
    },
    view: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    title: {
        fontSize: 13,
        textAlign: 'center',
        color: 'dimgray',
    },
    bottomLine: {
        backgroundColor: 'gold',
        height: screen.onePixel,
        marginLeft: 10,
        marginRight: 10,
    }

});

export default ListItem;