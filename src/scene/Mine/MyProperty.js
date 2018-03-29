import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import color from '../../widget/color';
import icon from '../../widget/IconFont';

class MyProperty extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>物业服务</Text>
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
                    onPress={() => this.props.navigation.navigate('PropertyService', {})}>
                    <Text>我的报修单</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('PaidService')}>
                    <Text>我的服务单</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('ComplaintsList')}>
                    <Text>我的投诉单</Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}>{icon('arrow_right')}</Text>
                </TouchableOpacity>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchableOpacity style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}}
                    onPress={() => this.props.navigation.navigate('NewLifePayScene')}>
                    <Text>我的缴费单</Text>
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

export default MyProperty;