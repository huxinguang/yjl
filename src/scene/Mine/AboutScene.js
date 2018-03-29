import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import color from '../../widget/color';
import icon from '../../widget/IconFont';
import screen from '../../common/screen';
import TouchLinking from '../../widget/TouchLinking';

class AboutScene extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>联系我们</Text>
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
                <Image style={{width: screen.width, height: 260}} resizeMode='stretch' source={require('../../img/desc_banner.png')}/>
                <TouchLinking style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}} url={'tel:' + '010-57529827'}>
                    <Text style={{fontSize: 20, color: color.theme, fontFamily: 'iconfont'}}>{icon('phone')} <Text style={{fontSize: 16, color: 'grey'}}>客服电话</Text></Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}><Text style={{color: color.theme}}>010-57529827 </Text>{icon('arrow_right')}
                    </Text>
                </TouchLinking>
                <View style={{height: 0.5, backgroundColor: 'lightgrey'}}/>
                <TouchLinking style={{height: 50, marginLeft: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center',}} url={'tel:' + '010-57529827'}>
                    <Text style={{fontSize: 20, color: color.theme, fontFamily: 'iconfont'}}>{icon('phone')} <Text style={{fontSize: 16, color: 'grey'}}>商家合作电话</Text></Text>
                    <Text style={{flex: 1, textAlign: 'right', fontFamily: 'iconfont'}}><Text style={{color: color.theme}}>010-57529827 </Text>{icon('arrow_right')}</Text>
                </TouchLinking>
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

export default AboutScene;