/**
 * Created by kunpan on 2017/7/4.
 */
import React, {PureComponent} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Heading1, Paragraph} from '../../widget/Text';
import {screen} from '../../common';
import {color} from '../../widget';

// 0: 代金券 1：打折券 2： 换购券
let UnValidImageUrl = [require('../../img/daijinquan1.png'),require('../../img/dazhequan1.png'),require('../../img/huangouquan1.png')];
//未使用
let ValidImageUrl = [require('../../img/home_daijinquan.png'),require('../../img/home_dazhequan.png'),require('../../img/home_huangouquan.png')];


export default class MyDiscountCell extends PureComponent
{
    static propTypes = {
        info : React.PropTypes.object,
        onPress : React.PropTypes.func,
        cellType : React.PropTypes.number,      /// < type : 1 代金券 type : 2 打折券 type : 3 换购券
        currentIndex : React.PropTypes.number,  /// < currentIndex <= 1  优惠券未为使用  else 这使用
    };

    static defaultProps = {
        info: null,
        cellType:0,
    };

    constructor(props)
    {
        super(props);
        this.state = {

        };
    }

    /*渲染试图区*/
    render()
    {
        // let {info,cellType} = this.props;
        let imageUrl = this.props.info.imageUrl.replace('w.h', '160.0');
        return(
            <TouchableOpacity style = {styles.container}
                              onPress = {() => this.props.onPress()}
            >
                {/*<Image style={[styles.icon,{backgroundColor : 'black'}]} source={{uri : imageUrl}}>*/}
                    {/*{this.renderCell(this.props.cellType,imageUrl)}*/}
                {/*</Image>*/}
                {this.renderCell(this.props.cellType,imageUrl)}

                <View style={styles.rightContainer}>
                    <Heading1>{this.props.info.title}</Heading1>

                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <Heading1 style={styles.price}>{this.props.info.price}元</Heading1>
                    </View>
                    <Paragraph numberOfLines={0} style={{marginTop: 8}}>{this.props.info.subtitle}</Paragraph>

                </View>

            </TouchableOpacity>
        );
    }

    renderCell(type,imageUrl)
    {
        let cellView = null;
        let arrayIndex = type - 1;
        if(type === 1)      // 代金券
        {
            // cellView = <Image style={[styles.logoIcon,{backgroundColor : '#FE566D'}]} />
            cellView = <Image style={[styles.icon,{backgroundColor : 'white'}]} source={(this.props.currentIndex === 0 ? ValidImageUrl[arrayIndex] : UnValidImageUrl[arrayIndex])}/>
        }else if(type === 2)    /// 打折券
        {
            // cellView =  <Image style={[styles.logoIcon,{backgroundColor : 'blue'}]} />
            cellView = <Image style={[styles.icon,{backgroundColor : 'white'}]} source={(this.props.currentIndex === 0 ? ValidImageUrl[arrayIndex] : UnValidImageUrl[arrayIndex])}/>
        }else if(type === 3)   /// 换购券
        {
            // cellView = <Image style={[styles.logoIcon,{backgroundColor : '#e4e4e4'}]} />
            cellView = <Image style={[styles.icon,{backgroundColor : 'white'}]} source={(this.props.currentIndex === 0 ? ValidImageUrl[arrayIndex] : UnValidImageUrl[arrayIndex])}/>
        }
        return cellView;
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection : 'row',
        padding : 15,
        borderBottomWidth : screen.onePixel,
        borderColor : color.border,
        backgroundColor : 'white',
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent:'flex-end',
    },
    logoIcon : {
        padding : 10,
        width:10,
        height:10,
        borderColor:color.background,
        borderRadius : 5,
    },
    rightContainer : {
        flex : 1,
        marginLeft : 10,
        flexWrap : 'wrap',
        marginRight : 20,
    },
    price: {
        color: color.theme
    }
});

