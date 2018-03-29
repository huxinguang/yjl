/**
 * Created by kunpan on 2017/7/4.
 */
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, RefreshControl, ListView, ActivityIndicator, TouchableOpacity } from 'react-native';
import RefreshState from '../../widget/RefreshState';

export default class MyDiscountRefreshListView extends PureComponent
{
    static propTypes = {
        onHeadRefresh : React.PropTypes.func,
        onFootGetMore : React.PropTypes.func,
    };

    static defaultProps = {
        // getMore state 显示title
        getMoreRefreshText : '数据加载中……',
        getMoreFailText : '点击重新加载',
        getMoreNoMoreText : '已加载全部数据',
    };

    constructor(props)
    {
        super(props);

        this.state = {
            // refresh、getMore state
            isHeadRefreshState : RefreshState.Idle,
            isFootRefreshState : RefreshState.Idle,
        };

    }

    /*外部接口区*/
    startHeadRefresh()
    {
        // 修改headState
        this.setState({
            isHeadRefreshState: RefreshState.Refreshing,
        });

        // 判断当前props是否有这个属性、方法调用
        this.props.onHeadRefresh && this.props.onHeadRefresh();
    }

    startFooterRefresh()
    {
        this.setState({
            isFootRefreshState:RefreshState.Refreshing,
        });

        this.props.onFootGetMore && this.props.onFootGetMore();
    }

    endRefresh(refreshState : RefreshState)
    {
        // 为了容错，当endRefresh传递.refreshing这return
        if(refreshState === RefreshState.Refreshing)
        {
            return;
        }

        // 当为footer 这判断显示的state
        let footerState = refreshState;
        if(this.props.dataSource.getRowCount() == 0)
        {
            footerState = RefreshState.Idle;
        }

        this.setState({
            isHeadRefreshState : RefreshState.Idle,
            isFootRefreshState : footerState,
        });
    }

    onHeadRefresh()
    {
        if(this.shouldStartHeadRefresh())
        {
            this.startHeadRefresh();
        }
    }

    onFootGetMore()
    {
        if(this.shouldStartFootRefresh())
        {
            this.startFooterRefresh();
        }
    }

    headerState() {
        return self.state.headerState;
    }

    footerState() {
        return self.state.footerState;
    }


    /*内部接口区*/
    // 判断当前状态能否刷新
    shouldStartHeadRefresh()
    {
        if(this.state.isHeadRefreshState === RefreshState.Refreshing || this.state.isFootRefreshState === RefreshState.Refreshing)
        {
            return false;
        }
        return true;
    }

    shouldStartFootRefresh()
    {
        if(this.state.isHeadRefreshState === RefreshState.Refreshing || this.state.isFootRefreshState === RefreshState.Refreshing )
        {
            return false;
        }

        if(this.state.isFootRefreshState === RefreshState.NoMoreData || this.state.isFootRefreshState === RefreshState.Failure)
        {
            return false;
        }
        return true;
    }

    renderFooter()
    {
        let footerView = null;
        switch (this.state.isFootRefreshState) {
            case RefreshState.Idle : {
                break;
            }
            case RefreshState.Failure : {
                footerView =
                    <TouchableOpacity style={styles.footerContainer}
                                      onPress={() => this.startFooterRefresh()}
                    >
                        <Text style={styles.footerText}>
                            {this.props.getMoreFailText}
                        </Text>

                    </TouchableOpacity>;
                break;
            }

            case  RefreshState.Refreshing : {
                footerView =
                    <TouchableOpacity style = {styles.footerContainer}
                                      onPress = {() => this.startFooterRefresh()}
                    >
                        <ActivityIndicator size = "small" color= "#888888"/>
                        <Text style = {styles.footerText}>
                            {this.props.getMoreRefreshText}
                        </Text>
                    </TouchableOpacity>
                break;
            }

            case RefreshState.NoMoreData :{
                footerView =
                    <View style = {styles.footerContainer}>
                        <Text style = {styles.footerText}>
                            {this.props.getMoreNoMoreText}
                        </Text>

                    </View>
                break;
            }
        }

        return footerView;
    }

    /*试图渲染*/
    render()
    {
        return(
            <ListView
                // 包含该对象中外面所有声明的props
                {...this.props}
                enableEmptySections
                refreshControl = {
                    <RefreshControl
                        refreshing={this.state.isHeadRefreshState == RefreshState.Refreshing}
                        onRefresh={() => this.onHeadRefresh()}
                        tintColor='gray'
                    />
                }
                // 判断当前footerState 显示状态
                renderFooter={() => this.renderFooter()}
                onEndReachedThreshold={10}
                onEndReached={() => this.onFootGetMore()}
            />
        );
    }

}

const styles = StyleSheet.create({
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    footerText: {
        fontSize: 14,
        color: '#555555'
    }
});


