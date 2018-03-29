//import liraries
import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, WebView} from 'react-native';
import color from '../../widget/color';

// create a component
class TreatyScene extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>用户协议</Text>
        ),
        headerRight: (
            <Text/>
        ),
        headerStyle: {backgroundColor: color.theme},
        cardStack: {
            gesturesEnabled: true
        },
        headerMode: 'screen',
    });

    state: {
        detailInfo: Object,
        refreshing: boolean,
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            detailInfo: {},
            refreshing: false
        };
        (this: any).requestData = this.requestData.bind(this);
    }

    componentDidMount() {

    }

    requestData() {

    }

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={require('./declarations.html')}
                    onLoadEnd={(e) => this.onLoadEnd(e)}
                    scalesPageToFit={true}/>
            </View>
        );
    }

    onLoadEnd(e: any) {

    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    webView: {
        flex: 1,
        backgroundColor: 'white',
    }
});

//make this component available to the app
export default TreatyScene;
