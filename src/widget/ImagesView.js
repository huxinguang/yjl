import React, {PureComponent} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {screen} from '../common';
import {HOST} from '../api';

class ImagesView extends PureComponent {
    static propTypes = {
        sources: PropTypes.array.isRequired,
        onPressImage: PropTypes.func.isRequired,
    };

    state: {
        images: Array,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.sources !== this.props.sources) {
            this.setState({
                sources: nextProps.sources
            });
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            images: this.props.sources,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {this._renderImagesView()}
            </View>
        );
    }

    _renderImagesView() {
        return this.state.images.map((source,index) =>(//JSON.parse(this.state.images)
            <TouchableOpacity
                key={index}
                onPress={() => {
                    this.props.onPressImage && this.props.onPressImage(index);
                }}>
                <Image style={[styles.image, {marginLeft: (index === 0 ? 0 : (screen.width - 10 * 2 - 60 * 4) / 3)}]}
                    source={{uri: HOST + source}}
                />
            </TouchableOpacity>
        ));
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: screen.width,
        height: 70,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        paddingBottom: 10
    },
    image: {
        width: 60,
        height: 60
    }
});

export default ImagesView;