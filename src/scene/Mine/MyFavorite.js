import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import color from '../../widget/color';
import icon from '../../widget/IconFont';

class MyFavorite extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>我的收藏</Text>
        ),
        headerRight: (
            <Text/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.requestData();
    }

    requestData() {

    }

    submitData() {

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('MyCenter')}>
                    <Text>我收藏的商家</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('MyCenter')}>
                    <Text>我收藏的商品</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('MyCenter')}>
                    <Text>我收藏的房屋</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('PublishScene')}>
                    <Text>我收藏的邻居发布</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    }
});

export default MyFavorite;