import React, {PureComponent} from 'react';
import {color, Separator,} from '../../widget';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';
import {DeviceEventEmitter, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import ChooseServiceCell from './ChooseServiceCell';

class ChooseServiceScene extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '选择服务',
        headerRight: (
            <Text/>
        ),
    });

    static propTypes = {
        navigation: PropTypes.object,
    };

    state: {
        data: Array,
        selectedItems: Array
    };

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selectedItems: []
        };

    }

    componentDidMount() {
        this._requestService();
    }


    _requestService() {
        let _this = this;
        const paramMap = {
            'service': 'Esfixs.Choose_serve',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.blockInfo.tag
        };
        get(paramMap, function (data) {
            let dataList = data.info.map(
                (info) => {
                    return {
                        pid: info.pid,
                        name: info.name,
                        price: info.price
                    };
                }
            );

            let selectedItems = [];
            for (let i = 0; i < _this.props.navigation.state.params.services.length; i++) {
                let service = _this.props.navigation.state.params.services[i];
                for (let j = 0; j < dataList.length; j++) {
                    let item = dataList[j];
                    if (service.pid === item.pid) {
                        let index = dataList.indexOf(item);
                        selectedItems.push(index);
                    }
                }
            }

            if (dataList) {
                _this.setState({
                    data: dataList,
                    selectedItems: selectedItems
                });
            }

        });

    }

    _renderItem = (item) => {
        let isCheck = this.state.selectedItems.indexOf(item.index) > -1;
        return <ChooseServiceCell
            service={item.item.name}
            price={item.item.price.toString()}
            index={item.index}
            isChecked={isCheck}
            onPressCheck={this._onPressItem.bind(this)}
        />;
    };

    _keyExtractor(item: Object, index: number) {
        return item.name;
    }

    _separator() {
        return <Separator/>;
    }

    _onPressItem(cell) {
        if (cell.state.checked) {
            let indexAtSelectedItems = this.state.selectedItems.indexOf(cell.props.index);
            this.state.selectedItems.splice(indexAtSelectedItems, 1);
        } else {
            this.state.selectedItems.push(cell.props.index);
        }
        cell.setState({
            checked: !cell.state.checked
        });
    }

    _onPressConfirm() {
        this.props.navigation.goBack();
        let selectedServices = [];
        for (let i = 0; i < this.state.selectedItems.length; i++) {
            let index = this.state.selectedItems[i];
            let service = this.state.data[index];
            selectedServices.push(service);
        }
        DeviceEventEmitter.emit('ServiceSelected', selectedServices);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    style={styles.container}
                    renderItem={this._renderItem}
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this._separator}
                    extraData={this.state}
                >
                </FlatList>

                <TouchableOpacity style={styles.confirm} onPress={() => {
                    this._onPressConfirm();
                }}>
                    <Text style={styles.confirmText}>{'确定'} </Text>
                </TouchableOpacity>
                <Toast ref='toast' position='center'/>
            </View>
        );
    }

}

export default ChooseServiceScene;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
    },
    confirm: {
        backgroundColor: 'red',
        height: 40,
        marginBottom: 0,
        justifyContent: 'center',
    },
    confirmText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },

});