//import liraries
import React, {PureComponent} from 'react';
import {InteractionManager, StyleSheet, Text, View, WebView} from 'react-native';
import color from '../../widget/color';
import {get} from '../../api';
import {GlobalValue} from '../../Global';

// create a component
class NoticeDetailScene extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>{navigation.state.params.title}</Text>
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
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({title: '加载中'});
            this.requestData();
            // this.setState({source: {uri: this.props.navigation.state.params.url}});
        });
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Notice_info',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block,
            'id': this.props.navigation.state.params.id
        };
        get(paramMap, function (data) {
            let detailInfo = data.info;
            if (detailInfo) {
                _this.props.navigation.setParams({title: detailInfo.title});
                _this.setState({
                    detailInfo: detailInfo,
                    refreshing: false
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    render() {
        if (!this.state.detailInfo.content) {
            return null;
        }
        return (
            <View style={styles.container}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{html: this.state.detailInfo.content}}
                    onLoadEnd={(e) => this.onLoadEnd(e)}
                    scalesPageToFit={true}/>
            </View>
        );
    }

    onLoadEnd(e: any) {
        if (e.nativeEvent.title.length > 0) {
            this.props.navigation.setParams({title: this.state.detailInfo.title});
        }
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
export default NoticeDetailScene;
