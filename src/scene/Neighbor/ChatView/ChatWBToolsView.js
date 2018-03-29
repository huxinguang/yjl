/**
 * Created by kunpan on 2017/8/15.
 */
import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View,Text,Image,TextInput} from 'react-native';
import {color} from '../../../widget';
import {screen} from '../../../common';
import {get,utf16toEntities,HTMLDecode,CStr,HOST} from '../../../api';
import {GlobalValue} from '../../../Global';
import {Heading1, Paragraph} from '../../../widget/Text';

import ChatWBToolsBarItemView from './ChatWBToolsBarItemView';

// type Props = {
//     itemType : React.PropTypes.number,      /// < 进来的类型是那个  0 : 点赞 1: 表示回复 default : 0
//     isLikeSelect : React.PropTypes.boolean, /// < 是否点赞被点击   (note： 前提itemType = 0)
//     showTotalNumber : React.PropTypes.number,   /// < 显示的个数
//     didSelectToolsBarItem?: (itemType : number) => void;  /// < 点击 toolBarItem
// };

let paddingMarger = 10;

type Props = {
    isLikeSelect : React.PropTypes.boolean, /// < 是否点赞被点击   (note： 前提itemType = 0)
    didSelectToolsBarItem?: (itemType : number) => void;  /// < 点击 toolBarItem
};

export default class ChatWBToolsView extends PureComponent {
    // static propTypes = {
    //     // ...ChatWBToolsBarItemView.props,
    // };

    props : Props;

    static defaultProps = {

    };

    constructor(props:Props)
    {
        super(props);
    }

    render()
    {
        let itemView =
            <View style = {[styles.itemViewStyle,{backgroundColor : 'white'}]}>
                <View style = {{ alignItems : 'center',width : screen.width/2}}>
                    <ChatWBToolsBarItemView
                        style={{flex : 1}}
                        itemType={0}
                        isLikeSelect={false}
                        showTotalNumber={1}
                    >
                    </ChatWBToolsBarItemView>
                </View>
                <View style = {{ alignItems : 'center',width : screen.width/2}}>
                    <ChatWBToolsBarItemView
                        style={{flex : 1}}
                        itemType={1}
                        showTotalNumber={0}
                    >
                    </ChatWBToolsBarItemView>
                </View>
            </View>;
        return(
            <View style = {styles.constainer}>
                {itemView}
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    constainer : {
        backgroundColor : 'white',
        flexDirection : 'row',
    },
    itemViewStyle : {
        paddingTop : paddingMarger,
        paddingBottom : paddingMarger,
        // alignItems : 'center',
        // justifyContent : 'center',
        flexDirection : 'row',
        // flex : 1,
    },

});