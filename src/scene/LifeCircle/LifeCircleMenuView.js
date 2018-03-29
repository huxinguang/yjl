/**
 * Created by kunpan on 2017/6/27.
 */
import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {screen} from '../../common';
import HomeMenuItem from './LifeCircleMenuItem';

// build LifeMenuView component
export default class LifeMenuView extends PureComponent {
    // 声明属性
    state: {};

    // 初始化属性
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 渲染试图
    render() {
        // 声明props属性
        let {menuInfos, onMenuSelected} = this.props;
        let menuItems = menuInfos.map(
            (info, i) => (
                <HomeMenuItem
                    // 声明id
                    key={info.title}
                    title={info.title}
                    icon={info.icon}
                    onPress={() => {
                        onMenuSelected && onMenuSelected(i);
                    }}
                />
            )
        );
        // 声明menuView 容器
        let menuViews = [];

        let pageCount = Math.ceil(menuItems.length / 5);
        pageCount = 1;

        for (let i = 0; i < pageCount; i++) {
            let length = 5;//menuItems.length < (i * 10) ? menuItems.length - (i * 10) : 10
            let items = menuItems.slice(i * 5, i * 5 + length);

            let menuView = (
                <View style={styles.itemsView} key={i}>
                    {items}
                </View>
            );
            menuViews.push(menuView);
        }


        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={(e) => this.onScroll(e)}
                >
                    <View style={styles.menuContainer}>
                        {menuViews}
                    </View>
                </ScrollView>

            </View>
        );
    }

    onScroll(e: any) {
        let x = e.nativeEvent.contentOffset.x;
        let currentPage = Math.round(x / screen.width);

        console.log('onScroll  ' + e.nativeEvent.contentOffset.x + '  page ' + currentPage + '  current ' + this.state.currentPage);
        if (this.state.currentPage != currentPage) {
            this.setState({
                currentPage: currentPage
            });
        }
    }

}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    contentContainer: {},
    menuContainer: {
        flexDirection: 'row',
    },
    itemsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: screen.width,
    },
    pageControl: {
        margin: 10,
    }
});
