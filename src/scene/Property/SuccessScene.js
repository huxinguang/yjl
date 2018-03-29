import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../../widget/index';
import {screen} from '../../common';
import icon from '../../widget/IconFont';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';

class SuccessScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params && navigation.state.params.title,
        headerRight: (
            <Text/>
        ),
    });

    props: {
        navigation: PropTypes.object
    };

    render() {

        var title1 = '';
        var title2 = '';
        var title3 = '';
        switch (this.props.navigation.state.params.title){
        case '确认报修单':
            title1 = '您的报修单已经提交成功';
            title2 = '请耐心等待物业工作人员维修';
            title3 = '查看报修单';
            break;
        case '确认投诉':
            title1 = '您的投诉已经提交成功';
            title2 = '请耐心等待工作人员解决';
            title3 = '查看投诉';
            break;
        case '确认服务':
            title1 = '您的服务订单已经提交成功';
            title2 = '请耐心等待工作人员前来服务';
            title3 = '查看服务';
            break;
        default:
            break;

        }

        return (
            <ScrollView style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.icon}>
                        {icon('iconSuccess')}
                    </Text>
                    <Text style={styles.text}>{ title1 }</Text>
                    <Text style={styles.text}>{title2}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, {backgroundColor: 'gold'}]}
                            onPress={this._onPressLeft.bind(this)}>
                            <Text style={[styles.buttonText]}>{title3}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this._onPressRight.bind(this)}>
                            <Text style={styles.buttonText}>返回首页</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        );
    }

    _onPressLeft() {
        this.props.navigation.dispatch(resetToList);
    }

    _onPressRight() {
        this.props.navigation.dispatch(resetToRoot);
    }

}

export default SuccessScene;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
    },
    subContainer: {
        width: screen.width,
        height: 300,
        backgroundColor: color.background,
    },
    icon: {
        marginTop: 30,
        width: screen.width,
        height: 55,
        fontFamily: 'iconfont',
        fontSize: 55,
        color: 'darkorange',
        textAlign: 'center'
    },
    text: {
        width: screen.width,
        height: 20,
        marginTop: 10,
        fontSize: 14,
        color: '#999999',
        textAlign: 'center'
    },
    buttonContainer: {
        width: screen.width,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: (screen.width - 20 * 4) / 2,
        height: 40,
        backgroundColor: color.theme,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    }

});

const resetToList = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'PropertyService', params:{selectedIndex:0}})
    ]
});

const resetToRoot = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Home'})
    ]
});






