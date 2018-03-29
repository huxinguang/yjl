/**
 * Created by kunpan on 2017/8/1.
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
} from 'react-native';

import {screen} from '../../common/index';
import {SpacingView} from '../../widget';
import BaseFloatView from './BaseFloatView';

// 默认每行的height
let rowHeight = 40;
// 默认分隔符的height
let spaceViewHeight = 5;

type Props = {
    /*定义属性*/
    Title : string;         /// < title为nil的时候不显示
    cancelButtonTitle : string;  /// < 取消按钮的title    default '取消'
    otherButtonTitles : Array;   /// < 显示功能菜单 数组中的顺序就是显示的顺序
    didSelectClickButtonIndex?:(index : number) => void;   /// < 点击的index
    didSelectClickCancelButton?:() => void;     /// < 点击cancel、mask事件

    isShowCancelView : boolean;  /// < 支持是否显示cancelView default : true

    /*扩展支持外部定义childrenView*/
    isShowChildrenView : boolean;   /// < 支持外部配置显示的试图、配合hideActonSheet同时使用 default : false (note: =true didSelectClickButtonIndex 失效)
    children?: any;

};

export default class BaseActionSheetView extends PureComponent
{
    props : Props;
    maskView : BaseFloatView;

    static defaultProps = {
        isShowCancelView : true,
        isShowChildrenView : false,
        otherButtonTitles : [],
    };

    constructor(props : Props)
    {
        super(props);
        this.state = {};

        this._didSelectCancelClick = this._didSelectCancelClick.bind(this);
        this._didSelectContentView = this._didSelectContentView.bind(this);
        this._didSelectMaskView    = this._didSelectMaskView.bind(this);
        global.hideActionSheetView = this.hideActionSheetView.bind(this);
    }

    render()
    {
        let titleView = this.props.isShowChildrenView === false && this.props.Title.length > 0 ?
            <View>
                <View style = {styles.textViewStyle}>
                    <Text style={[styles.titleTextStyle,{textAlign: 'center'}]} onPress={() => {
                    // DO NOThing!
                    }}>
                        {this.props.Title}
                    </Text>
                </View>
                <SpacingView style={{width : screen.width, height : 2, backgroundColor : '#e4e4e4'}} />
            </View>
            :
            <View style = {{flex : 0}} />;

        var contentArray = [];
        for (var i = 0;i < this.props.otherButtonTitles.length; i++)
        {
            contentArray.push(
                <View key = {i}>
                    <View style = {styles.textViewStyle} >
                        <Text
                            style={[styles.otherTextStyle, {textAlign: 'center'}]}
                            onPress={
                                () => {
                                    this._didSelectContentView({i});
                                }
                            }
                        >
                            {this.props.otherButtonTitles[i]}
                        </Text>
                    </View>
                    <SpacingView style={{width : screen.width, height : 2, backgroundColor : '#e4e4e4'}} />
                </View>
            );
        }

        let cancelButtonView = this.props.isShowChildrenView === false && this.props.isShowCancelView === true ?
            <View style = {{flexDirection : 'column'}}>
                <SpacingView style={{ width : screen.width, height : spaceViewHeight, backgroundColor : '#e4e4e4'}} />
                <View style = {styles.textViewStyle}>
                    <Text style={[styles.otherTextStyle, {textAlign: 'center', backgroundColor: 'white'}]} onPress={
                        () => {
                            this._didSelectCancelClick();
                        }
                    }>
                        {(this.props.cancelButtonTitle.length > 0 ? this.props.cancelButtonTitle : '取消')}
                    </Text>
                </View>
            </View>
            :
            <View style = {{flex : 0}}/>;

        let contentView =
            <View style = {{flexDirection : 'column'}}>
                {titleView}
                {this.props.otherButtonTitles.map((title, i) => (
                    <View key = {i}>
                        <View style = {[styles.textViewStyle]} >
                            <Text
                                style={[styles.otherTextStyle, {textAlign: 'center',backgroundColor : 'white'}]}
                                onPress={
                                    () => {
                                        this._didSelectContentView(i);
                                    }
                                }
                            >
                                {this.props.otherButtonTitles[i]}
                            </Text>
                        </View>
                        <SpacingView style={{width : screen.width, height : 2, backgroundColor : '#e4e4e4'}} />
                    </View>
                ))}
                {cancelButtonView}
            </View>;

        let showContentView = this.props.isShowChildrenView === true ? this._rednerChildrenView() : contentView;

        return (
            <BaseFloatView
                ref = {(floatView) => this.maskView = floatView}
                modalVisible={true}
                onSelectMaskView = {() =>{
                    this._didSelectMaskView();
                }}
                style= {styles.constainer}
                innerContainerJustifyContent = {'flex-end'}
                subViewPadding = {0}
            >
                {/*{titleView}*/}
                {/*{this.props.otherButtonTitles.map((title, i) => (*/}
                {/*<View key = {i}>*/}
                {/*<View style = {[styles.textViewStyle]} >*/}
                {/*<Text*/}
                {/*style={[styles.otherTextStyle, {textAlign: 'center',backgroundColor : 'white'}]}*/}
                {/*onPress={*/}
                {/*() => {*/}
                {/*this._didSelectContentView(i);*/}
                {/*}*/}
                {/*}*/}
                {/*>*/}
                {/*{this.props.otherButtonTitles[i]}*/}
                {/*</Text>*/}
                {/*</View>*/}
                {/*<SpacingView style={{width : screen.width, height : 2, backgroundColor : '#e4e4e4'}} />*/}
                {/*</View>*/}
                {/*))}*/}
                {/*<SpacingView style={{ width : screen.width, height : spaceViewHeight, backgroundColor : '#e4e4e4'}} />*/}
                {/*{cancelButtonView}*/}

                {showContentView}
            </BaseFloatView>
        );
    }

    /*外部接口区*/
    hideActionSheetView()
    {
        if(this.props.didSelectClickCancelButton && this.props.didSelectClickCancelButton())
        {
            this.props.didSelectClickCancelButton();
        }
        this.maskView.hideFloatViewVisible(false);
    }

    /*内部接口区*/
    // 点击cancel
    _didSelectCancelClick()
    {
        this.maskView.hideFloatViewVisible(false);

    }
    // 点击maskView
    _didSelectMaskView()
    {
        if(this.props.didSelectClickCancelButton)
        {
            // 外面可以修改状态
            this.props.didSelectClickCancelButton();
        }
    }

    // 点击内容列表
    _didSelectContentView(index : number)
    {
        if(this.props.didSelectClickButtonIndex)
        {
            this.props.didSelectClickButtonIndex(index);
        }
        // 点击功能菜单完毕之后隐藏maskView 防止外面在调用改方法 隐藏操作在这做了！！！
        this.maskView.hideFloatViewVisible(false);
    }

    // isShowChildrenView === true 这获取显示的contentView
    _rednerChildrenView()
    {
        return React.Children.map(this.props.children, (child, i) => (
            <View key={'r_' + i}>
                {child}
            </View>
        ));
    }
}

const styles = StyleSheet.create({
    constainer : {
        backgroundColor : 'white',
        flexDirection : 'column',
        justifyContent: 'flex-end',
    },
    titleStyle : {
        alignItems : 'center',
        justifyContent : 'center',
    },
    titleTextStyle : {
        textAlign : 'center',
        fontSize : 14,
        color : '#999999',
        // height: rowHeight,
    },
    otherTextStyle : {
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
    },
    textViewStyle : {
        height : rowHeight,
        // alignItems: 'center',
        justifyContent : 'center',
        backgroundColor : 'white',
    },
    separatorStyle : {
        width : screen.width,
        height : spaceViewHeight,
        color : '#e4e4e4',
    },
});