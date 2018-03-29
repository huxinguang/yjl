//import liraries
import React, {PureComponent} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import {Heading2} from '../../widget/Text';
import {screen} from '../../common';

// create a component
class HomeMenuItem extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        icon: PropTypes.number,
        onPress: PropTypes.func
    };

    render() {
        return (
            <TouchableOpacity style={styles.container}
                onPress={this.props.onPress}>
                <Image source={this.props.icon} resizeMode='contain' style={styles.icon}/>
                <Heading2>
                    {this.props.title}
                </Heading2>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: screen.width / 4,
        height: screen.width / 4,
    },
    icon: {
        width: screen.width / 9,
        height: screen.width / 9,
        margin: 5,
    }
});

//make this component available to the app
export default HomeMenuItem;
