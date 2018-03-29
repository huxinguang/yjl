/**
 * Created by Administrator on 2017/6/26.
 */
import React, {PureComponent} from 'react';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {PropTypes} from 'prop-types';
import Swiper from 'react-native-swiper';
import {screen} from '../../common';
import {HOST} from '../../api';

const styles = {
    wrapper: {},

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },

    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },

    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },

    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    image: {
        width: screen.width,
        height: screen.height,
        flex: 1
    }
};

class HomeBanner extends PureComponent {

    static propTypes = {
        bannerInfos: PropTypes.array,
        onBannerSelected: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            swiperShow: Platform.select({
                ios: true,
                android: false,
            }),
        };
    }

    componentWillReceiveProps(props) {
        if (props.bannerInfos && props.bannerInfos.length > 0) {
            this.setState({
                swiperShow: true
            });
        }
    }

    render() {
        let items = this.props.bannerInfos.map(
            (info) => (
                <TouchableOpacity key={info.title} style={styles.slide} onPress={() => {
                    this.props.onBannerSelected && this.props.onBannerSelected(info);
                }}>
                    <Image resizeMode='stretch' style={styles.image} source={{uri: HOST + info.pic}}/>
                </TouchableOpacity>
            )
        );

        if (this.state.swiperShow) {
            return (
                <View>
                    <Swiper style={styles.wrapper} height={screen.width * 0.523} horizontal={true} autoplay
                        paginationStyle={{bottom: 10}}
                        dot={<View
                            style={{
                                backgroundColor: 'rgba(0,0,0,.1)',
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                marginLeft: 3,
                                marginRight: 3,
                                marginTop: 3,
                                marginBottom: 3,
                            }}/>}
                        activeDot={<View
                            style={{
                                backgroundColor: 'white',
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                marginLeft: 3,
                                marginRight: 3,
                                marginTop: 3,
                                marginBottom: 3,
                            }}/>}>
                        {items}
                    </Swiper>
                </View>
            );
        } else {
            return (
                <View style={{height: screen.width * 0.523}}>
                    {items[0]}
                    {/*<Image resizeMode='stretch' style={styles.image} source={require('../../img/desc_banner.png')}/>*/}
                </View>
            );
        }
    }
}

export default HomeBanner;