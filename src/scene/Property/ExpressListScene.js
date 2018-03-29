import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {color} from '../../widget';
import {screen} from '../../common';
import TouchLinking from '../../widget/TouchLinking';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import {Heading1, Paragraph} from '../../widget/Text';

class ExpressListScene extends PureComponent {
    static navigationOptions = () => ({
        headerTitle: '快递代收',
        headerRight: (
            <Text/>
        ),
    });

    state: {
        expressList: [],
        refreshing: boolean,
    };

    constructor(props: Object) {
        super(props);
        this.state = {expressList: [], refreshing: false};

        {
            (this: any).requestData = this.requestData.bind(this);
        }
    }

    componentDidMount() {
        this.requestData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            if (nextProps.isLoggedIn) {
                this.requestData();
            } else {
                this.props.navigation.navigate('Login', {});
            }
        }
    }

    keyExtractor(item: Object) {
        return item.bid;
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Express_list',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block,
            'page': 1,
            'limit': 5
        };
        get(paramMap, function (data) {
            let dataList = data.info;

            if (dataList) {
                _this.setState({
                    expressList: dataList,
                    refreshing: false
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.setState({refreshing: false});
        });
    }

    renderCell(info: Object) {
        return (
            <TouchLinking style={styles.cellContainer} url={'tel:' + info.item.telphone}>
                <View>
                    <Heading1>{'物流单号 ' + info.item.field1}</Heading1>
                    <Paragraph numberOfLines={0} style={{color: color.theme, marginTop: 12}}>{info.item.field3}</Paragraph>
                </View>
                <View style={{flex: 1}}/>
                <View>
                    <Heading1>{info.item.field17}</Heading1>
                    <Paragraph>{'取件时间'}</Paragraph>
                    <Paragraph numberOfLines={0} style={{color: color.theme}}>{info.item.field7}</Paragraph>
                </View>
            </TouchLinking>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.expressList}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.requestData}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderCell}
                    // onEndReached={this.requestPersonData(this.person_page_index)}
                    // 加载更多
                    onEndReachedThreshold={10}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    cellContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: screen.onePixel,
        borderColor: color.border,
        backgroundColor: 'white',
    },
});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

export default connect(select)(ExpressListScene);