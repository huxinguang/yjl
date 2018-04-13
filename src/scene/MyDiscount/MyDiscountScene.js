/**
 * Created by kunpan on 2017/7/4.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, Text} from 'react-native';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import {color} from '../../widget';
import MyDiscountListScene from './MyDiscountListScene';

class MyDiscountScene extends PureComponent {
    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>我的优惠券</Text>
        ),
        headerRight: (
            <Text/>
        ),
        cardStack: {
            gesturesEnabled: true
        },
        headerMode: 'screen',
        headerStyle: {backgroundColor: color.theme},
    });

    static propTypes = {
        titles: PropTypes.array,
    };

    static defaultProps = {
        titles: ['未使用', '已使用', '已过期'],
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            if (nextProps.isLoggedIn) {
                this.forceUpdate();
            } else {
                this.props.navigation.navigate('LoginScene', {});
            }
        }
    }

    render() {
        return (
            <ScrollableTabView
                style={styles.container}
                tabBarBackgroundColor='white'
                tabBarActiveTextColor='#FE566D'
                tabBarInactiveTextColor='#555555'
                tabBarTextStyle={styles.tabBarText}
                tabBarUnderlineStyle={styles.tabBarUnderline}
                //renderTabBar={() => <DefaultTabBar style={styles.tabBar}/>}
            >
                {this.props.titles.map((title, i) => (
                    <MyDiscountListScene
                        tabLabel={this.props.titles[i]}
                        key={i}
                        // types={types[i]}
                        navigation={this.props.navigation}
                        currentIndex={i}
                    />
                ))}
            </ScrollableTabView>
        );
    }
}

// 样式
const styles = StyleSheet.create({
    naviTitleStyle: {
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        justifyContent: 'center',
    },
    tabBarText: {
        color: color.theme,
        fontSize: 14,
        marginTop: 10,
    },
    tabBarUnderline: {
        backgroundColor: color.theme
    },
});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

//make this component available to the app
export default connect(select)(MyDiscountScene);