/**
 * Created by kunpan on 2017/8/10.
 */
import React, { PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Animated,
    Easing,
} from 'react-native';

import BaseFloatView from './BaseFloatView';
import {screen} from '../../common/index';

let defaultItemHeight = 30;
let defaultTitleHeight = 40;

type Props = {
    dataArray : React.PropTypes.array,      /// < 显示选择address的数据源
    titleString : React.PropTypes.string,   /// < 显示的title string

    subViewPadding : React.PropTypes.number,    /// <  默认的子试图距离left、rightmarge边距
    borderRadius : React.PropTypes.number,      /// < 是否圆角
    subViewLeftMarger : React.PropTypes.number, /// < 显示的text 距离左边剧多远 default 10

    didSelectClickMaskView : React.PropTypes.func,  /// < 点击mask事件
    didSelectItemView?:(index : number) => void,    /// < 点击item
};

export default class New_AnimationChoseAddress extends PureComponent
{
    maskView : BaseFloatView;
    props : Props;

    static defaultProps = {
        dataArray : [],
        titleString : '选择地址',
        subViewPadding : 40,
        borderRadius : 10,
        subViewLeftMarger : 10,
    };

    constructor(props : Props)
    {
        super(props);
        this.state = {
            offset : new Animated.Value(0),
        };

        this.in = this.in.bind(this);
        this.out = this.out.bind(this);
        this._didSelectContentView = this._didSelectContentView.bind(this);
        this.in();
    }

    render()
    {
        let contentView = this.props.dataArray &&
            <View>
                {this.props.dataArray.map((title, i) => (
                    <View key = {i}>
                        <TouchableHighlight style={styles.tipContentView} underlayColor='#f0f0f0' >
                            <Text style={styles.tipText} >{title}</Text>
                        </TouchableHighlight>
                        {/*<SpacingView style={{width : screen.width, height : 2, backgroundColor : '#e4e4e4'}} />*/}
                    </View>
                ))}
            </View>;

        let childrenView =
            <View>
                <View style={[styles.tipTitleView,{width : screen.width - 2 * this.props.subViewPadding,paddingLeft: this.props.subViewLeftMarger}]}>
                    <Text style={styles.tipTitleText}>{this.props.titleString}</Text>
                </View>

                {this.props.dataArray.map((title, i) => (
                    <View key = {i}>
                        <TouchableHighlight
                            style={[styles.tipContentView,{width : screen.width - 2 * this.props.subViewPadding - this.props.subViewLeftMarger,paddingLeft: this.props.subViewLeftMarger}]}
                            underlayColor='#f0f0f0'
                        >
                            <Text
                                style={styles.tipText} numberOfLines={1}
                                onPress={() => {
                                    this._didSelectContentView(i);
                                }}
                            >
                                {title}
                            </Text>
                        </TouchableHighlight>
                    </View>
                ))}
            </View>;

        return (
            <BaseFloatView
                ref={(floatView) => this.maskView = floatView}
                modalVisible={true}
                onSelectMaskView={() => {
                    this._didSelectMaskView();
                }}
                innerContainerJustifyContent = {'center'}
            >

                <Animated.View style={[styles.tip ,{height : defaultTitleHeight + this.props.dataArray.length * defaultItemHeight,borderRadius : this.props.borderRadius}, {transform: [{
                    translateY: this.state.offset.interpolate({
                        inputRange: [0, 1],
                        outputRange: [screen.height, 0]
                    }),
                }]
                }]}>
                    {childrenView}

                </Animated.View>


            </BaseFloatView>
        );
    }

    /*外部接口区*/
    // 在点击选中的时候回调隐藏功能

    /*内部接口区*/
    // 点击maskView
    _didSelectMaskView()
    {
        if(this.props.didSelectClickMaskView)
        {
            // 外面可以修改状态
            this.props.didSelectClickMaskView();
        }
    }

    // 点击内容列表
    _didSelectContentView(index : number)
    {
        if(this.props.didSelectItemView)
        {
            this.props.didSelectItemView(index);
        }
        // 点击功能菜单完毕之后隐藏maskView 防止外面在调用改方法 隐藏操作在这做了！！！
        this.maskView.hideFloatViewVisible(false);
    }

    //显示动画
    in() {
        // sequence parallel
        Animated.parallel([
            // Animated.timing(
            //     this.state.opacity,
            //     {
            //         easing: Easing.linear,
            //         duration: 500,
            //         toValue: 0.8,
            //     }
            // ),
            Animated.spring(
                this.state.offset,
                {
                    // easing: Easing.spring,//Easing.linear,
                    /*timing 线性动画的时候 要有一个animation duration*/
                    // duration: 500,
                    toValue: 1,
                    /*spring animation*/
                    friction: 8,        //摩擦力 （越小 振幅越大）
                    tension: 100,        //拉力
                }
            )
        ]).start();
    }

    //隐藏动画
    out(){
        Animated.sequence([
            // Animated.timing(
            //     this.state.opacity,
            //     {
            //         easing: Easing.linear,
            //         duration: 500,
            //         toValue: 0,
            //     }
            // ),
            Animated.timing(
                this.state.offset,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue: 0,
                }
            )
        ]).start();

        // 调用隐藏的方法
        setTimeout(() => {
            this.maskView.hideFloatViewVisible(false);
        },500);
    }
}

const styles = StyleSheet.create({
    constainer : {
        borderRadius: 5,
        alignItems: 'flex-start',
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: 10,
    },
    tipTitleView: {
        height:defaultTitleHeight,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    tipTitleText:{
        color:'#999999',
        fontSize:14,
    },
    tipContentView: {
        borderTopWidth:0.5,
        borderColor:'#f0f0f0',
        height:defaultItemHeight,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    tip: {
        // width:screen.width - 2 * 40,
        // left:10,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'space-between',
    },
    tipText:{
        fontSize:14,
        textAlign: 'left',
        backgroundColor : 'white',
    },
});