/**
 * Created by kunpan on 2017/8/15.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, View,Text} from 'react-native';
import icon from '../../../widget/IconFont';
import PropTypes from 'prop-types';

type Props = {
    itemType : PropTypes.number,      /// < 进来的类型是那个  0 : 点赞 1: 表示回复 default : 0
    isLikeSelect : PropTypes.boolean, /// < 是否点赞被点击   (note： 前提itemType = 0)
    showTotalNumber : PropTypes.number,   /// < 显示的个数
    didSelectToolsBarItem?: (itemType : number) => void;  /// < 点击 toolBarItem
};

export default class ChatWBToolsBarItemView extends PureComponent
{
    props : Props;

    static defaulProps = {
        itemType : 0,
        showTotalNumber : 0,
    };

    constructor(props : Props)
    {
        super(props);
        this.state = {
            isLikeSelect : this.props.isLikeSelect,  /// < 是否点击了
        };
    }

    render()
    {
        let likeView = this.props.itemType === 0 && this.state.isLikeSelect === true ?
            <View style = {styles.textViewStyle}>
                <Text style={styles.textStyle} onPress={() => {
                    if(this.state.isLikeSelect === true)
                    {
                        // TO DO : toast!!!
                    }

                }}>{icon('icontycheckmarkoutline') + ' 赞(' + this.props.showTotalNumber + ')'}</Text>
            </View>:
            <View style = {styles.textViewStyle}>
                <Text style={styles.textStyle} onPress={() => {
                    this.setState({isLikeSelect: true});
                    this.props.didSelectToolsBarItem && this.props.didSelectToolsBarItem(this.props.itemType);

                }}>{icon('icontycircleoutline') + ' 赞(' + this.props.showTotalNumber + ')'}</Text>
            </View>;

        let commentView =
            <View style = {styles.textViewStyle}>
                <Text style={styles.textStyle} onPress={() => {
                    this.props.didSelectToolsBarItem && this.props.didSelectToolsBarItem(this.props.itemType);
                }}>{icon('icontycircleoutline') + ' 回复(' + this.props.showTotalNumber + ')'}</Text>
            </View>;

        let itemView = this.props.itemType === 0 ? likeView : commentView;

        return(
            <View style = {styles.constainer}>
                {itemView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    constainer : {
        backgroundColor : 'white',
        flexDirection : 'row',
    },
    textViewStyle : {
        alignItems : 'center',
        justifyContent : 'center',
        flexDirection : 'row',
        backgroundColor : 'white',
    },
    textStyle : {
        fontSize: 16,
        fontFamily: 'iconfont',
        backgroundColor : 'white',
        textAlign : 'center',
    },
});