import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {color, icon} from '../../widget';
import {screen} from '../../common';
import TouchLinking from '../../widget/TouchLinking';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import {Heading1, Paragraph} from '../../widget/Text';

class PhoneBook extends PureComponent {

    static navigationOptions = () => ({
        headerTitle: (
            <Text style={{
                justifyContent: 'center',
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: 'white'
            }}>便民电话</Text>
        ),
        headerRight: (
            <Text/>
        ),
        headerStyle: {backgroundColor: color.theme}
    });

    state: {
        phoneList: [],
        refreshing: boolean,
    };

    constructor(props: Object) {
        super(props);
        this.state = {phoneList: [], refreshing: false};

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
        return item.id;
    }

    requestData() {
        this.setState({refreshing: true});
        let _this = this;
        const paramMap = {
            'service': 'Neighbor.List_telphone',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block
        };
        get(paramMap, function (data) {
            let dataList = data.info;

            if (dataList) {
                _this.setState({
                    phoneList: dataList,
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
                    <Heading1>{info.item.name}</Heading1>
                    <Paragraph numberOfLines={0} style={{color: color.theme, marginTop: 8}}>{info.item.telphone}</Paragraph>
                </View>
                <Text style={{flex: 1, textAlign: 'right', color: color.theme, fontSize: 24, fontFamily: 'iconfont'}}>{icon('lxwy')}</Text>
            </TouchLinking>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.phoneList}
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
        alignItems: 'center',
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

export default connect(select)(PhoneBook);