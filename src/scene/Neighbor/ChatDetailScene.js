/**
 * Created by kunpan on 2017/8/16.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, View,Text,ScrollView,FlatList,TouchableOpacity} from 'react-native';
import {color} from '../../widget';
import ImageCarousel from 'react-native-image-carousel';
import {screen} from '../../common/index';
import {GlobalValue} from '../../Global';
import {get} from '../../api';

import ChatWBContentView from './ChatView/ChatWBContentView';
import ChatListContentView from './ChatView/ChatListContentView';
import ChatPersionHeadView from './ChatView/ChatPersionHeadView';
import ChatWBToolsView from './ChatView/ChatWBToolsView';
import SpacingView from '../../widget/SpacingView';

export default class ChatDetailScene extends PureComponent
{
    imageCarousel : ImageCarousel;
    flatList : FlatList;

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>聊聊详情</Text>
        ),

        headerStyle: {backgroundColor: color.theme}
    });

    constructor(props)
    {
        super(props);
        this.state = {
            dataList: [],
            refreshing: false,
            width: 0,
            height: 0,
            isScrollEnd : true,
        };
        this.renderCell = this.renderCell.bind(this);
        this.requestData = this.requestData.bind(this);
        this._scrollViewOnLayout = this._scrollViewOnLayout.bind(this);
        this.handleHorizontalScroll = this.handleHorizontalScroll.bind(this);
    }

    componentDidMount()
    {
        this.requestData();
    }

    render()
    {
        let info = this.props.navigation.state.params.info;

        return(
            <View style = {{flexDirection : 'column',flex: 1}}>
                <View style = {styles.scrollViewStyle}>
                    <ChatPersionHeadView
                        headUrlStr={info.item.facelink}
                        userNameStr={info.item.author}
                        publicTimeStr = {info.item.add_time}
                        type={info.item.type_name}
                    >
                    </ChatPersionHeadView>

                    <ChatListContentView
                        info={info}
                        isShowBigImage={true}
                    >
                    </ChatListContentView>

                    <ChatWBToolsView >
                    </ChatWBToolsView>

                    <SpacingView style={{backgroundColor: color.background, height: 2}}/>

                </View>

                <View style = {{backgroundColor : 'white',flex : 1}}>

                    <ScrollView
                        style={{flexDirection : 'column'}}
                        horizontal={false}
                        pagingEnabled={true}
                        bounces={false}
                        scrollsToTop={false}
                        scrollEnabled={this.state.isScrollEnd}
                        scrollEventThrottle={100}
                        removeClippedSubviews={true}
                        automaticallyAdjustContentInsets={false}
                        directionalLockEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        onScroll={this.handleHorizontalScroll}
                        onLayout={this._scrollViewOnLayout}

                    >
                        <View style = {{flexDirection : 'column'}}>
                            <FlatList
                                style = {{flex : 1}}
                                ref = {(fView) => this.flatList = fView}
                                data={this.state.dataList}
                                keyExtractor={this.keyExtractor}
                                onRefresh={this.requestData}
                                refreshing={this.state.refreshing}
                                renderItem={this.renderCell}
                                ///}/ onEndReached={this.requestPersonData(this.person_page_index)}
                                ///}/ 加载更多
                                onEndReachedThreshold={10}
                            />
                        </View>

                        <View style={{backgroundColor: 'white', flexDirection: 'column', flex: 0.15}}>
                            <View style={{backgroundColor: 'orange', flex: 2.5, justifyContent: 'center'}}>
                                <Text style={{textAlign: 'center', fontSize: 15, color: '#f5f5f5'}}>
                                    {'已选账单费用合计: ' + this.state.allTotalCount + '元'}
                                </Text>
                            </View>
                            <View style={{backgroundColor: 'blue', flex: 3, justifyContent: 'center'}}>
                                <Text style={{textAlign: 'center', fontSize: 15, color: 'white'}} onPress={() => {

                                }}>
                                    {'支 付'}
                                </Text>
                            </View>
                        </View>

                    </ScrollView>

                </View>


            </View>
        );
    }

    /*内部接口区*/
    renderCell(info: Object) {
        return (
            <View style = {styles.cellContainer}>
                <ChatWBContentView
                    info={info}
                    isShowToolsBarView={false}
                >
                </ChatWBContentView>
            </View>
        );
    }

    keyExtractor(item: Object) {
        return item.id;
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.List_chat',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag,
            'type': _this.props.type,
            'page': 1,
            'num': 4,
            'pid': 0
        };
        get(paramMap, function (data) {
            let dataList = data.info;
            dataList.sort(() => {
                return 0.1 - Math.random()
            })

            if (dataList) {
                _this.setState({
                    dataList: dataList,
                    refreshing: false
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    scrollToPage()
    {
        this.flatList.scrollToEnd();
    }

    // scrollViewDidScroll
    handleHorizontalScroll(e: any)
    {
        let selectIndex = e.nativeEvent.position;
        if(selectIndex === undefined)
        {
            selectIndex = Math.round(
                e.nativeEvent.contentOffset.y / this.state.height,
            );
        }

        if(e.nativeEvent.contentOffset.y === 0 || e.nativeEvent.contentOffset.y < 0)
        {
            // e.nativeEvent.scrollEnabled = false;
            this.setState({
                isScrollEnd : false,
            });
        }else
        {
            // e.nativeEvent.scrollEnabled = true;
            this.setState({
                isScrollEnd : true,
            });
        }
        // if (selectIndex < 0 || selectIndex > this.props.count) {
        //     return;
        // }
        // if (this.state.scrollingTo !== null && this.state.scrollingTo !== selectIndex) {
        //     return;
        // }
        // if (this.state.selectIndex !== selectIndex || this.state.scrollingTo !== null) {
        //     this.setState({
        //         // 异步修改state中国selectIndex
        //         selectIndex : selectIndex,
        //         scrollingTo: null
        //     });
        //     // this.props.onSelectIndexChange && this.props.onSelectIndexChange(selectIndex);
        // }
    }

    // 获取scrollView width 、height
    _scrollViewOnLayout(e : any)
    {
        this.setState({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        });
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems : 'center',
        flexDirection : 'column',

    },
    scrollViewStyle : {
        width : screen.width,
        backgroundColor : 'orange',
        flexDirection : 'column',
    },
});



{/*<ScrollView*/}
{/*ref = {(e) => this.scrollView = e}*/}
{/*contentoffset={{*/}
{/*x : 0,*/}
{/*y : 0,*/}
{/*}}*/}
{/*style={[styles.scrollViewStyle]}*/}
{/*horizontal={true}*/}
{/*pagingEnabled={true}*/}
{/*bounces={false}*/}
{/*scrollsToTop={false}*/}
{/*scrollEnabled={false}*/}
{/*scrollEventThrottle={100}*/}
{/*removeClippedSubviews={true}*/}
{/*automaticallyAdjustContentInsets={false}*/}
{/*directionalLockEnabled={true}*/}
{/*showsHorizontalScrollIndicator={false}*/}
{/*showsVerticalScrollIndicator={false}*/}
{/*>*/}
{/*<View style = {{flexDirection : 'column',flex : 1}}>*/}
{/*<ChatWBContentView*/}
{/*info={info}*/}
{/*isChatDetail={true}*/}
{/*>*/}
{/*</ChatWBContentView>*/}

{/*<ScrollView*/}
{/*style={[styles.scrollViewStyle]}*/}
{/*horizontal={true}*/}
{/*pagingEnabled={true}*/}
{/*bounces={false}*/}
{/*scrollsToTop={false}*/}
{/*scrollEnabled={false}*/}
{/*scrollEventThrottle={100}*/}
{/*removeClippedSubviews={true}*/}
{/*automaticallyAdjustContentInsets={false}*/}
{/*directionalLockEnabled={true}*/}
{/*showsHorizontalScrollIndicator={false}*/}
{/*showsVerticalScrollIndicator={false}*/}
{/*>*/}
{/*<View style = {{flexDirection : 'column'}}>*/}
{/*<FlatList*/}
{/*style = {{flex : 1}}*/}
{/*ref = {(fView) => this.flatList = fView}*/}
{/*data={this.state.dataList}*/}
{/*keyExtractor={this.keyExtractor}*/}
{/*onRefresh={this.requestData}*/}
{/*refreshing={this.state.refreshing}*/}
{/*renderItem={this.renderCell}*/}
{/*!// onEndReached={this.requestPersonData(this.person_page_index)}*/}
{/*!// 加载更多*/}
{/*onEndReachedThreshold={10}*/}
{/*!/>*/}

{/*<View style={{backgroundColor: 'white', flexDirection: 'column', flex: 0.15}}>*/}
{/*<View style={{backgroundColor: 'orange', flex: 2.5, justifyContent: 'center'}}>*/}
{/*<Text style={{textAlign: 'center', fontSize: 15, color: '#f5f5f5'}}>*/}
{/*{'已选账单费用合计: ' + this.state.allTotalCount + '元'}*/}
{/*</Text>*/}
{/*</View>*/}
{/*<View style={{backgroundColor: 'blue', flex: 3, justifyContent: 'center'}}>*/}
{/*<Text style={{textAlign: 'center', fontSize: 15, color: 'white'}} onPress={() => {*/}

{/*}}>*/}
{/*{'支 付'}*/}
{/*</Text>*/}
{/*</View>*/}
{/*</View>*/}

{/*</View>*/}

{/*</ScrollView>*/}

{/*</View>*/}

{/*</ScrollView>;*/}


{/*<ScrollView*/}
    {/*style={[styles.scrollViewStyle,{flex : 1}]}*/}
    {/*horizontal={true}*/}
    {/*pagingEnabled={true}*/}
    {/*bounces={false}*/}
    {/*scrollsToTop={false}*/}
    {/*scrollEnabled={false}*/}
    {/*scrollEventThrottle={100}*/}
    {/*removeClippedSubviews={true}*/}
    {/*automaticallyAdjustContentInsets={false}*/}
    {/*directionalLockEnabled={true}*/}
    {/*showsHorizontalScrollIndicator={false}*/}
    {/*showsVerticalScrollIndicator={false}*/}
{/*>*/}
    {/*<View style = {{flexDirection : 'column'}}>*/}
        {/*<FlatList*/}
            {/*style = {{flex : 1}}*/}
            {/*ref = {(fView) => this.flatList = fView}*/}
            {/*data={this.state.dataList}*/}
            {/*keyExtractor={this.keyExtractor}*/}
            {/*onRefresh={this.requestData}*/}
            {/*refreshing={this.state.refreshing}*/}
            {/*renderItem={this.renderCell}*/}
            {/*///}/ onEndReached={this.requestPersonData(this.person_page_index)}*/}
            {/*///}/ 加载更多*/}
            {/*onEndReachedThreshold={10}*/}
        {/*/>*/}

        {/*<View style={{backgroundColor: 'white', flexDirection: 'column', flex: 0.15}}>*/}
            {/*<View style={{backgroundColor: 'orange', flex: 2.5, justifyContent: 'center'}}>*/}
                {/*<Text style={{textAlign: 'center', fontSize: 15, color: '#f5f5f5'}}>*/}
                    {/*{'已选账单费用合计: ' + this.state.allTotalCount + '元'}*/}
                {/*</Text>*/}
            {/*</View>*/}
            {/*<View style={{backgroundColor: 'blue', flex: 3, justifyContent: 'center'}}>*/}
                {/*<Text style={{textAlign: 'center', fontSize: 15, color: 'white'}} onPress={() => {*/}

                {/*}}>*/}
                    {/*{'支 付'}*/}
                {/*</Text>*/}
            {/*</View>*/}
        {/*</View>*/}

    {/*</View>*/}

{/*</ScrollView>*/}
