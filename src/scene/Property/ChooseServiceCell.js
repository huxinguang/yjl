import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

class ChooseServiceCell extends PureComponent {
    static propTypes = {
        onPressCheck: PropTypes.func,
        service: PropTypes.string,
        price: PropTypes.string,
        index: PropTypes.number,
        isChecked: PropTypes.bool
    };

    state: {
        checked: boolean
    };

    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.isChecked
        };
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    this.props.onPressCheck && this.props.onPressCheck(this);
                }}>
                <Image style={styles.image} source={this.state.checked ? {uri: '../../img/Mine/checked@2x.png'} : {uri: '../../img/Mine/unchecked@2x.png'}}/>
                <Text style={styles.title}>{this.props.service}<Text style={{fontSize: 14, color: 'darkorange'}}>{this.props.price}</Text></Text>
            </TouchableOpacity>
        );

    }

}

export default ChooseServiceCell;

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
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