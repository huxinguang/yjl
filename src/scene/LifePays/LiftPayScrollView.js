/**
 * Created by kunpan on 2017/7/26.
 */
import React, {PureComponent} from 'react';
import {ScrollView,Image,StyleSheet, Text, TouchableOpacity,View,TouchableWithoutFeedback,Platform} from 'react-native';
import {screen} from '../../common/index';
import icon from '../../widget/IconFont';
import {NavigationScreenProp as boolean} from '../../../node_modules/react-navigation/lib-rn/TypeDefinition';

type Props = {
    count : number;         // 显示的个数
    selectIndex : number;   // 选中的下标
    style?: any;
    onSelectIndexChange?: (index : number) => void;     // scrollViewDidEndScroll 回调
    children?: any;         // subView
    bounces?: boolean;      // 是否有分页
};

type State = {
    width : number;
    height : number;
    selectedIndex: number;
    initialSelectedIndex: number;
    scrollingTo: ?number;

};

export default class LiftPayScrollView extends PureComponent {
    props: Props;
    scrollView: ScrollView;

    static defaultProps = {
        count : 1,
        selectIndex : 0,
        bounces : true,
    };
    constructor(props: Props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            selectedIndex: this.props.selectIndex,
            initialSelectedIndex: this.props.selectIndex,
            scrollingTo: null,
        };
        (this: any).handleHorizontalScroll = this.handleHorizontalScroll.bind(this);
        (this: any)._scrollViewOnLayout = this._scrollViewOnLayout.bind(this);
        global.goToPage = this.goToPage.bind(this);
    }

    render(){
        return this._renderScrollView();
    }

    /*外部接口区*/
    goToPage(index : number)
    {
        if(index < 0 || index > this.props.count)
        {
            return;
        }

        this.setState({
            // 异步修改state中国selectIndex
            selectIndex : index,
            scrollingTo: null
        });

        this.scrollView.scrollTo({
            x: index * this.state.width,
            animated: true,
        });
    }

    /*内部接口区*/
    _renderScrollView()
    {
        return(
            <ScrollView
                ref = {(e) => this.scrollView = e}
                contentoffset={{
                    x : screen.width * this.state.initialSelectedIndex,
                    y : 0,
                }}
                style={[styles.scrollViewStyle,this.props.style]}
                horizontal={true}
                pagingEnabled={true}
                bounces={this.props.bounces}
                scrollsToTop={false}
                onScroll={this.handleHorizontalScroll}
                scrollEventThrottle={100}
                removeClippedSubviews={true}
                automaticallyAdjustContentInsets={false}
                directionalLockEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onLayout={this._scrollViewOnLayout}
                // scrollEnabled={false}
            >
                {this.renderContent()}
            </ScrollView>
        );
    }

    // 获取scrollView width 、height
    _scrollViewOnLayout(e : any)
    {
        this.setState({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        });
    }

    // scrollViewDidScroll
    handleHorizontalScroll(e: any)
    {
        let selectIndex = e.nativeEvent.position;
        if(selectIndex === undefined)
        {
            selectIndex = Math.round(
                e.nativeEvent.contentOffset.x / this.state.width,
            );
        }
        if (selectIndex < 0 || selectIndex > this.props.count) {
            return;
        }
        if (this.state.scrollingTo !== null && this.state.scrollingTo !== selectIndex) {
            return;
        }
        if (this.state.selectIndex !== selectIndex || this.state.scrollingTo !== null) {
            this.setState({
                // 异步修改state中国selectIndex
                selectIndex : selectIndex,
                scrollingTo: null
            });
            this.props.onSelectIndexChange && this.props.onSelectIndexChange(selectIndex);
        }
    }

    renderContent(): Array<ReactElement> {
        let {width, height} = this.state;
        let style = Platform.OS === 'ios' && styles.card;
        return React.Children.map(this.props.children, (child, i) => (
            <View style={[style, {width, height}]} key={'r_' + i}>
                {child}
            </View>
        ));
    }
}


const styles = StyleSheet.create({
    container : {
        backgroundColor : 'blue',
    },
    scrollViewStyle : {
        width:screen.width,
        backgroundColor : 'white',
        // height : 200,
        flex : 1,
    },
    card: {
        backgroundColor: 'transparent',
    }
});


