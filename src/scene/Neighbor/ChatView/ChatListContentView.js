/**
 * Created by kunpan on 2017/8/14.
 */
import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View,Text,Image,TextInput} from 'react-native';
import {color} from '../../../widget';
import {screen} from '../../../common';
import {get,utf16toEntities,HTMLDecode,CStr,HOST} from '../../../api';
import {GlobalValue} from '../../../Global';
import {Heading1, Paragraph} from '../../../widget/Text';
var emoji = require('node-emoji');
import ImageCarousel from 'react-native-image-carousel';
import PropTypes from 'prop-types';

// 左边距
let leftMarger   = 10;
// 上边距
let topMarger    = 10;
// 距离图片下边距
let imageTopMarger = 10;
// 图片大小
let imageSize = 60;
// 图片之间的space
let imagePaddingSpace = 15;

type Props = {
    // 数据源
    info : PropTypes.object,
    // 是否可以点击图片查看大图页
    isShowBigImage : PropTypes.boolean,   /// < default false
};

export default class ChatListContentView extends PureComponent
{
    imageCarousel : ImageCarousel;
    props : Props;
    tmpImageArray : [];

    static defaultProps = {
        info : {},
        isShowBigImage : false,
    };

    constructor(props : Props)
    {
        super(props);
        this.state = {

        };

        this.tmpImageArray = [];
    }

    render()
    {
        let {info} = this.props;
        let emojiContentString = HTMLDecode(String(info.item.title).replace(/(^\s+)|(\s+$)/g,''));//utf16toEntities(info.item.title)
        // let imagePathArray = info.item.image_Path;
        let textView =
            <View style = {styles.textViewStyle}>
                {/*<Text style={styles.textStyle} numberOfLines={0}>&#x1F600; &#128512;&nbsp; &#x1F472;  {'xxxxxx  &#x1F600;'}</Text>*/}
                {/*<Text style={styles.textStyle}>{String.raw('&#x1F600;')}</Text>*/}
                <Text style={styles.textStyle}>{emojiContentString}</Text>
            </View>;

        let imagePathString = CStr(info.item.img_path);
        var imagePathArray = [];
        if(imagePathString.length > 0)
        {
            imagePathArray = JSON.parse(imagePathString);
            // this.tmpImageArray.push(imagePathArray);
            this.tmpImageArray.push(...imagePathArray);
        }

        let showSmallView = this.props.isShowBigImage === true ?    //imagePathArray && Array.isArray(imagePathArray) && imagePathArray.length > 0 &&
        <View style={styles.imageViewStyle}>
            <ImageCarousel
                renderContent={this.renderImage}
            >
                {
                    imagePathArray.map((title,i) =>(
                        <View
                            key = {i}
                            // style = {[styles.imageViewStyle]}
                        >
                            <Image style={[styles.imageStyle,{marginLeft: i === 0 ? 0 : imagePaddingSpace}]} source={{uri : title.length > 0 ?HOST +  title : 'https://www.baidu.com/img/bd_logo1.png'}}>
                            </Image>
                        </View>
                    ))}
            </ImageCarousel>
        </View> :
            <View style={styles.imageViewStyle}>
                {
                    imagePathArray.map((title,i) =>(
                        <View
                            key = {i}
                            // style = {[styles.imageViewStyle]}
                        >
                            <Image style={[styles.imageStyle,{marginLeft: i === 0 ? 0 : imagePaddingSpace}]} source={{uri : title.length > 0 ?HOST +  title : 'https://www.baidu.com/img/bd_logo1.png'}}>
                            </Image>
                        </View>
                    ))
                }
            </View>;

        // let imageView = imagePathArray && Array.isArray(imagePathArray) && imagePathArray.length > 0 ?
        //     <View style={styles.imageViewStyle}>
        //         {
        //             imagePathArray.map((title,i) =>(
        //                 <View
        //                     key = {i}
        //                     // style = {[styles.imageViewStyle]}
        //                 >
        //                     <Image style={[styles.imageStyle,{marginLeft: i === 0 ? 0 : imagePaddingSpace}]} source={{uri : title.length > 0 ?HOST +  title : 'https://www.baidu.com/img/bd_logo1.png'}}>
        //                     </Image>
        //                 </View>
        //             ))
        //         }
        //     </View> :
        //     <View style = {{flex : 0}}/>;
        let imageView = imagePathArray && Array.isArray(imagePathArray) && imagePathArray.length > 0 ?
            showSmallView : <View style = {{flex : 0}}/>;

        return (
            <View style = {styles.constainer}>
                {textView}
                {imageView}
            </View>
        );
    }

    /*内部接口区*/
    renderImage = (idx: number) =>
        <Image
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            source={{uri: HOST + this.tmpImageArray[idx]}}
        />;
}


const styles = StyleSheet.create({
    constainer : {
        backgroundColor : 'white',
        paddingTop : topMarger,
        paddingBottom : topMarger,
        paddingLeft : leftMarger,
        paddingRight  : leftMarger,
        // alignItems : 'center',
        justifyContent : 'center',
        borderColor : color.border,
        borderBottomWidth : screen.onePixel,
    },
    textViewStyle : {
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    textStyle : {
        fontSize : 14,
        color : '#999999',
        textAlign : 'left',
    },
    imageViewStyle : {
        backgroundColor : 'white',
        flexDirection : 'row',
        marginTop : imageTopMarger,
        height : imageSize,
    },
    imageStyle : {
        width : imageSize,
        height: imageSize,
        backgroundColor : 'white',
        // marginLeft :imagePaddingSpace,
    },
});
