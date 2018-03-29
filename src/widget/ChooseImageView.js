import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {screen} from '../common';


class ChooseImageView extends PureComponent {
    static propTypes = {
        onPressAdd: PropTypes.func,
        onPressImage: PropTypes.func,
    };

    state: {
        selectedImagesSource: Array,
        editing: boolean
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedImagesSource: [],
            editing: false
        };
    }

    render() {

        return (
            <View style={styles.bigContainer}>
                <Text style={{fontSize: 15, marginLeft: 10, marginTop: 5}}>{'可拍摄或选择最多4张照片'}</Text>
                <View style={styles.container}>
                    <View style={styles.subContainer1}>
                        {
                            this.state.selectedImagesSource.length >= 0 ? <TouchableOpacity onPress={() => {
                                this.state.selectedImagesSource.length === 0 ? (this.props.onPressAdd && this.props.onPressAdd(this)) : (this.props.onPressImage && this.props.onPressImage(this));
                            }}>
                                <Image style={styles.image}
                                    source={this.state.selectedImagesSource.length === 0 ? require('../img/Mine/add_img_n.png')  : this.state.selectedImagesSource[0]}
                                    resizeMode={Image.resizeMode.cover}/>
                            </TouchableOpacity> : null
                        }
                        {
                            (this.state.editing === true && this.state.selectedImagesSource.length >= 1) ?
                                <TouchableOpacity onPress={() => {
                                    this._deleteImage(0);
                                }}>
                                    <Image style={styles.deleteImage} source={require( '../img/Mine/delete.png')}
                                        resizeMode={Image.resizeMode.cover}/>
                                </TouchableOpacity> : null
                        }

                    </View>
                    <View style={styles.subContainer2}>
                        {
                            this.state.selectedImagesSource.length >= 1 ? <TouchableOpacity onPress={() => {
                                this.state.selectedImagesSource.length === 1 ? (this.props.onPressAdd && this.props.onPressAdd(this)) : (this.props.onPressImage && this.props.onPressImage(this));
                            }}>
                                <Image style={styles.image}
                                    source={this.state.selectedImagesSource.length === 1 ? require('../img/Mine/add_img_n.png'): this.state.selectedImagesSource[1]}
                                    resizeMode={Image.resizeMode.cover}/>
                            </TouchableOpacity> : null
                        }
                        {
                            (this.state.editing === true && this.state.selectedImagesSource.length >= 2) ?
                                <TouchableOpacity onPress={() => {
                                    this._deleteImage(1);
                                }}>
                                    <Image style={styles.deleteImage} source={require( '../img/Mine/delete.png')}
                                        resizeMode={Image.resizeMode.cover}/>
                                </TouchableOpacity> : null
                        }
                    </View>
                    <View style={styles.subContainer3}>
                        {
                            this.state.selectedImagesSource.length >= 2 ? <TouchableOpacity onPress={() => {
                                this.state.selectedImagesSource.length === 2 ? (this.props.onPressAdd && this.props.onPressAdd(this)) : (this.props.onPressImage && this.props.onPressImage(this));
                            }}>
                                <Image style={styles.image}
                                    source={this.state.selectedImagesSource.length === 2 ? require('../img/Mine/add_img_n.png') : this.state.selectedImagesSource[2]}
                                    resizeMode={Image.resizeMode.cover}/>
                            </TouchableOpacity> : null
                        }
                        {
                            (this.state.editing === true && this.state.selectedImagesSource.length >= 3) ?
                                <TouchableOpacity onPress={() => {
                                    this._deleteImage(2);
                                }}>
                                    <Image style={styles.deleteImage} source={require( '../img/Mine/delete.png')} resizeMode={Image.resizeMode.cover}/>
                                </TouchableOpacity> : null
                        }
                    </View>
                    <View style={styles.subContainer4}>
                        {
                            this.state.selectedImagesSource.length >= 3 ? <TouchableOpacity onPress={() => {
                                this.state.selectedImagesSource.length === 3 ? (this.props.onPressAdd && this.props.onPressAdd(this)) : (this.props.onPressImage && this.props.onPressImage(this));
                            }}>
                                <Image style={styles.image}
                                    source={this.state.selectedImagesSource.length === 3 ? require('../img/Mine/add_img_n.png') : this.state.selectedImagesSource[3]}
                                    resizeMode={Image.resizeMode.cover}/>
                            </TouchableOpacity> : null
                        }
                        {
                            (this.state.editing === true && this.state.selectedImagesSource.length === 4) ?
                                <TouchableOpacity onPress={() => {
                                    this._deleteImage(3);
                                }}>
                                    <Image style={styles.deleteImage} source={require( '../img/Mine/delete.png')} resizeMode={Image.resizeMode.cover}/>
                                </TouchableOpacity> : null
                        }
                    </View>
                </View>
            </View>
        );
    }

    _deleteImage(atIndex) {
        let sources = [];
        for (let i = 0; i < this.state.selectedImagesSource.length; i++) {
            sources.push(this.state.selectedImagesSource[i]);
        }
        sources.splice(atIndex, 1);
        this.setState({
            selectedImagesSource: sources
        });

    }


}

export default ChooseImageView;

const styles = StyleSheet.create({

    bigContainer: {
        width: screen.width,
        height: 140,
        backgroundColor: 'white'
    },
    container: {
        flexDirection: 'row',
        width: screen.width,
        height: 100,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 5,
    },
    subContainer1: {
        width: 60,
        height: 100,
        marginTop: 10
    },
    subContainer2: {
        width: 60,
        height: 100,
        marginTop: 10,
        marginLeft: (screen.width - 15 * 2 - 60 * 4) / 3,
    },
    subContainer3: {
        width: 60,
        height: 100,
        marginTop: 10,
        marginLeft: (screen.width - 15 * 2 - 60 * 4) / 3,
    },
    subContainer4: {
        width: 60,
        height: 100,
        marginTop: 10,
        marginLeft: (screen.width - 15 * 2 - 60 * 4) / 3,

    },
    addImage: {
        width: 60,
        height: 60,
    },
    image: {
        width: 60,
        height: 60
    },
    deleteImage: {
        width: 20,
        height: 20,
        marginLeft: (60 - 20) / 2,
        marginTop: (40 - 20) / 2
    }


});