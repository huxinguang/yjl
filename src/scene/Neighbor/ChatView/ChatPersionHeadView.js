/**
 * Created by kunpan on 2017/8/14.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View,Text,Image} from 'react-native';
import {color} from '../../../widget';
import {screen} from '../../../common';
import ImageCarousel from 'react-native-image-carousel';

// 图像宽高
let headImageSize = 40;

let subViewLeftMarger = 10;
let titleLeftMarger = 5;
let subViewTopMarger = 10;
let timeTopMarger = 10;

type Props = {
    headUrlStr : React.PropTypes.string,
    userNameStr : React.PropTypes.string,
    publicTimeStr : React.PropTypes.string,
    type : React.PropTypes.string,
};

export default class ChatPersionHeadView extends PureComponent
{
    props : Props;
    imageCarousel : ImageCarousel;

    static defaultProps = {
        headUrlStr : '',
        userNameStr : '',
        publicTimeStr : '',
        type : '子女教育',
    };

    constructor(props : Props)
    {
        super(props);
        this.state = {

        };

    }

    render()
    {
        return(
            <View style = {styles.constainer}>
                <View style = {[styles.contentViewStyle,{flexDirection : 'row',backgroundColor : 'white'}]}>
                    <ImageCarousel
                        renderContent={this.renderImage}
                    >
                        <Image style = {styles.headImageStyle} source={{uri : this.props.headUrlStr.length > 0 ? this.props.headUrlStr : 'https://www.baidu.com/img/bd_logo1.png'}}>
                        </Image>
                    </ImageCarousel>
                    <View style = {styles.leftTextViewStyle}>
                        <Text style={styles.titleStyle}>{this.props.userNameStr}</Text>
                        <Text style={styles.timeTextStyle}>{this.props.publicTimeStr}</Text>
                    </View>
                </View>
                <View style = {styles.typeViewStyle}>
                    <Text style={styles.typeStyle}>{this.props.type}</Text>
                </View>
            </View>
        );
    }

    /*内部接口区*/
    renderImage = () =>
        <Image
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            source={{uri: this.props.headUrlStr}}
        />;
}

const styles = StyleSheet.create({
    constainer : {
        backgroundColor : 'white',
        borderBottomWidth: screen.onePixel,
        borderColor : color.border,
        flexDirection : 'row',
        // flex: 1,
        width: screen.width,
    },
    contentViewStyle : {
        paddingTop : subViewTopMarger,
        paddingBottom : subViewTopMarger,
        marginLeft : subViewLeftMarger,
        marginRight : subViewLeftMarger,
    },
    headImageStyle : {
        borderRadius : headImageSize/2,
        width : headImageSize,
        height : headImageSize,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'white',
    },
    leftTextViewStyle : {
        flexDirection : 'column',
        marginLeft : titleLeftMarger,
        backgroundColor : 'white',
        alignItems : 'flex-start',
    },
    titleStyle : {
        fontSize : 14,
        color : '#999999',
        marginBottom : timeTopMarger,
    },
    timeStyle : {
        fontSize : 12,
        color : '#999999',
        marginBottom : 0,
    },
    typeViewStyle : {
        flex : 1,
        alignItems : 'flex-end',
        backgroundColor : 'white',
        paddingTop : subViewTopMarger,
        marginRight : subViewLeftMarger,
    },
    typeStyle : {
        fontSize : 13,
        color : 'blue',
        marginTop : 0,
    },
});
