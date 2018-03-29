/**
 * Created by kunpan on 2017/8/15.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View,TouchableWithoutFeedback} from 'react-native';
import {color} from '../../../widget';
import {screen} from '../../../common';
import ChatListContentView from './ChatListContentView';
import ChatPersionHeadView from './ChatPersionHeadView';
import ChatWBToolsView from './ChatWBToolsView';
import SpacingView from '../../../widget/SpacingView';

export default class ChatWBContentView extends PureComponent
{
    static propTypes = {
        info : React.PropTypes.object,
        didSelectContentView : React.PropTypes.func,
        isChatDetail : React.PropTypes.bool,     /// < default false
        isShowToolsBarView : React.PropTypes.bool,  /// < 是否显示底部的toolsBar default : true
    };

    static defaultProps = {
        isChatDetail : false,
        isShowToolsBarView : true,
    };

    render()
    {
        let toolsView = this.props.isShowToolsBarView === true ?
            <ChatWBToolsView >
            </ChatWBToolsView> :
            <View style = {{flex : 0}}/>

        let contentView = this.props.isChatDetail === true ?
            <View style = {[styles.constainer]}>
                <ChatPersionHeadView
                    style={{backgroundColor : 'red'}}
                    headUrlStr={this.props.info.item.facelink}
                    userNameStr={this.props.info.item.author}
                    publicTimeStr = {this.props.info.item.add_time}
                    type={this.props.info.item.type_name}
                >
                </ChatPersionHeadView>

                <ChatListContentView
                    info={this.props.info}
                    isShowBigImage={this.props.isChatDetail}
                >
                </ChatListContentView>

                {/*<ChatWBToolsView >*/}
                {/*</ChatWBToolsView>*/}
                {toolsView}

                <SpacingView style={{backgroundColor: color.background, height: 2}}/>

            </View> :
            <View style = {styles.constainer}>
                <TouchableOpacity
                    onPress = {() => {
                        this.props.didSelectContentView && this.props.didSelectContentView();
                    }}
                >
                    <ChatPersionHeadView
                        headUrlStr={this.props.info.item.facelink}
                        userNameStr={this.props.info.item.author}
                        publicTimeStr = {this.props.info.item.add_time}
                        type={this.props.info.item.type_name}
                    >
                    </ChatPersionHeadView>

                    <ChatListContentView
                        info={this.props.info}
                        isShowBigImage={this.props.isChatDetail}
                    >
                    </ChatListContentView>
                </TouchableOpacity>

                {/*<ChatWBToolsView >*/}
                {/*</ChatWBToolsView>*/}
                {toolsView}

                <SpacingView style={{backgroundColor: color.background, height: 2}}/>

            </View>;

        return(
            <View style = {styles.constainer}>
                {/*<TouchableOpacity*/}
                {/*onPress = {() => {*/}
                {/*this.props.didSelectContentView && this.props.didSelectContentView();*/}
                {/*}}*/}
                {/*>*/}
                {/*<ChatPersionHeadView*/}
                {/*headUrlStr={this.props.info.item.facelink}*/}
                {/*userNameStr={this.props.info.item.author}*/}
                {/*publicTimeStr = {this.props.info.item.add_time}*/}
                {/*type={this.props.info.item.type_name}*/}
                {/*>*/}
                {/*</ChatPersionHeadView>*/}

                {/*<ChatListContentView*/}
                {/*info={this.props.info}*/}
                {/*isShowBigImage={true}*/}
                {/*>*/}
                {/*</ChatListContentView>*/}
                {/*</TouchableOpacity>*/}

                {/*<ChatWBToolsView >*/}
                {/*</ChatWBToolsView>*/}

                {/*<SpacingView style={{backgroundColor: color.background, height: 2}}/>*/}

                {contentView}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    constainer:{
        flexDirection : 'column',
        backgroundColor : 'white',
        // borderBottomWidth : screen.onePixel,
        // borderColor : color.border,
    },
    cellContainer: {
        flexDirection: 'row',
        // padding: 10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
});
