import React, {PureComponent} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import screen from './common/screen';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';

class GuideViewPager extends PureComponent {

    static propTypes = {
        onStartBtnClicked: PropTypes.func
    };

    constructor() {
        super();

    }

    render() {
        return (
            <Swiper style={styles.container}
                horizontal={true}
                autoplay={false}
                loop={false}
                paginationStyle={styles.pagination}
                dot={<View style={styles.dot}/>}
                activeDot={<View style={styles.activeDot}/>}>
                <View style={styles.image1}/>
                <View style={styles.image2}/>
                <View style={styles.image3}>
                    <Text style={styles.text} onPress={() => {
                        this.props.onStartBtnClicked && this.props.onStartBtnClicked();
                    }}>
                        {'start app'}
                    </Text>
                </View>
            </Swiper>

        );
    }

}

export default GuideViewPager;

const styles = StyleSheet.create({
    container: {},
    image1: {
        flex: 1,
        backgroundColor: '#82D900',
        width: screen.width,
        height: screen.height
    },
    image2: {
        flex: 1,
        backgroundColor: '#FF44FF',
        width: screen.width,
        height: screen.height
    },
    image3: {
        flex: 1,
        backgroundColor: '#FF5809',
        width: screen.width,
        height: screen.height
    },
    text: {
        fontSize: 20,
        color: 'white',
        marginTop: 300,
        marginLeft: 200

    },
    dot: {
        backgroundColor: 'rgba(0,0,0,.1)',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    activeDot: {
        backgroundColor: 'white',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    pagination: {
        bottom: 50
    }


});