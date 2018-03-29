//import liraries
import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {PropTypes} from 'prop-types';
import {screen} from '../../common';
import {color, MenuButton, PageControl} from '../../widget';

// create a component
class HomeMenuView extends PureComponent {

    static propTypes = {
        menuInfos: PropTypes.array,
        onMenuSelected: PropTypes.func,
    };

    state: {
        currentPage: number
    };

    constructor(props: Object) {
        super(props);

        this.state = {
            currentPage: 0
        };
    }

    render() {
        let menuItems = this.props.menuInfos.map(
            (info, i) => (
                <MenuButton
                    key={info.title}
                    title={info.title}
                    icon={info.icon}
                    iconColor={info.iconColor}
                    backgroundColor={info.backgroundColor}
                    borderRadius={info.borderRadius}
                    onPress={() => {
                        this.props.onMenuSelected && this.props.onMenuSelected(i);
                    }}/>
            )
        );

        let pageItemNum = 8;
        let menuViews = [];
        let pageCount = Math.ceil(menuItems.length / pageItemNum);
        for (let i = 0; i < pageCount; i++) {
            let length = menuItems.length < (i * pageItemNum) ? menuItems.length - (i * pageItemNum) : pageItemNum;
            let items = menuItems.slice(i * pageItemNum, i * pageItemNum + length);

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
                    onScroll={(e) => this.onScroll(e)}>
                    <View style={styles.menuContainer}>
                        {menuViews}
                    </View>
                </ScrollView>


                <PageControl
                    style={styles.pageControl}
                    numberOfPages={pageCount}
                    currentPage={this.state.currentPage}
                    hidesForSinglePage
                    pageIndicatorTintColor='gray'
                    currentPageIndicatorTintColor={color.theme}
                    indicatorSize={{width: 8, height: 8}}/>
            </View>

        );
    }

    onScroll(e: any) {
        let x = e.nativeEvent.contentOffset.x;
        let currentPage = Math.round(x / screen.width);

        console.log('onScroll  ' + e.nativeEvent.contentOffset.x + '  page ' + currentPage + '  current ' + this.state.currentPage);
        if (this.state.currentPage !== currentPage) {
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

//make this component available to the app
export default HomeMenuView;
