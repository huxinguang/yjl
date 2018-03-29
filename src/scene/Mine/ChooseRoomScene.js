/**
 * Created by huxinguang on 2017/7/6.
 */

import React, {PureComponent} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {color} from '../../widget';
import screen from '../../common/screen';
import ChooseList from './ChooseList';
import {get} from '../../api';
import {GlobalValue} from '../../Global';
import Toast from 'react-native-easy-toast';

class ChooseRoomScene extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '选择房间号',
        headerRight: (
            <TouchableOpacity onPress={() => {
                navigation.goBack();
                DeviceEventEmitter.emit('RoomSelected', navigation.state.params.roomAddress, navigation.state.params.roomId);
            }}>
                <Text style={{margin: 10, color: 'white', fontSize: 16}}>确定</Text>
            </TouchableOpacity>
        ),
    });

    static propTypes = {
        navigation: PropTypes.object
    };


    state: {
        xiaoqu: number,
        loudong: number,
        danyuan: number,
        louceng: number,
        fangjianhao: number,
        estateData: Array,
        buildingData: Array,
        unitData: Array,
        floorData: Array,
        roomData: Array,
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            xiaoqu: 0,
            loudong: 0,
            danyuan: 0,
            louceng: 0,
            fangjianhao: 0,
            estateData: [],
            buildingData: [],
            unitData: [],
            floorData: [],
            roomData: []
        };
    }

    componentDidMount() {
        this.requestRegionalism_tree();
    }

    requestRegionalism_tree() {
        let _this = this;
        const paramMap = {
            'service': 'User.Regionalism_tree',
            'time': (new Date()).valueOf(),
            'tag': GlobalValue.block
        };
        get(paramMap, function (data) {
            let dataList = data.info.map(
                (info) => {
                    return {
                        name: info.name,
                        id: info.id,
                        children: info.children
                    };
                }
            );

            if (dataList) {

                let building = dataList[0].children.map(
                    (buildInfo) => {
                        return {
                            name: buildInfo.name,
                            id: buildInfo.id,
                            children: buildInfo.children
                        };
                    }
                );

                let unit = building[0].children.map(
                    (unitInfo) => {
                        return {
                            name: unitInfo.name,
                            id: unitInfo.id,
                            children: unitInfo.children
                        };
                    }
                );

                let floor = unit[0].children.map(
                    (floorInfo) => {
                        return {
                            name: floorInfo.name,
                            id: floorInfo.id,
                            children: floorInfo.children
                        };
                    }
                );

                let room = floor[0].children.map(
                    (roomInfo) => {
                        return {
                            name: roomInfo.name,
                            id: roomInfo.id,
                            address: roomInfo.address
                        };
                    }
                );

                _this.setState({
                    xiaoqu: 0,
                    loudong: 0,
                    danyuan: 0,
                    louceng: 0,
                    fangjianhao: 0,
                    estateData: dataList,
                    buildingData: building,
                    unitData: unit,
                    floorData: floor,
                    roomData: room
                });

                _this.props.navigation.setParams({
                    roomAddress: room[0].address,
                    roomId: room[0].id
                });
            }
        }, function (error) {
            console.log('data is error' + error);
            _this.refs.toast.show(error);
        });
    }

    render() {

        return (
            <ScrollView style={styles.scrollView} horizontal={true}>
                <ChooseList
                    style={styles.firstLevel}
                    itemBackgoundColor='white'
                    listTitle='小区'
                    data={this.state.estateData}
                    selectedIndex={this.state.xiaoqu}
                    onPressItem={this.onPressEstateItem.bind(this)}

                />
                <ChooseList
                    style={styles.secondLevel}
                    itemBackgoundColor='ghostwhite'
                    listTitle='楼栋'
                    data={this.state.buildingData}
                    selectedIndex={this.state.loudong}
                    onPressItem={this.onPressBuildingItem.bind(this)}
                />
                <ChooseList
                    style={styles.thirdLevel}
                    itemBackgoundColor='whitesmoke'
                    listTitle='单元'
                    data={this.state.unitData}
                    selectedIndex={this.state.danyuan}
                    onPressItem={this.onPressUnitItem.bind(this)}
                />
                <ChooseList
                    style={styles.fourthLevel}
                    itemBackgoundColor='lightgray'
                    listTitle='楼层'
                    data={this.state.floorData}
                    selectedIndex={this.state.louceng}
                    onPressItem={this.onPressFloorItem.bind(this)}
                />
                <ChooseList
                    style={styles.fifthLevel}
                    itemBackgoundColor='gray'
                    listTitle='房间号'
                    data={this.state.roomData}
                    selectedIndex={this.state.fangjianhao}
                    onPressItem={this.onPressRoomItem.bind(this)}
                />
                <Toast ref='toast'/>
            </ScrollView>
        );
    }

    onPressEstateItem(atIndex) {

        let building = this.state.estateData[atIndex].children.map(
            (buildInfo) => {
                return {
                    name: buildInfo.name,
                    id: buildInfo.id,
                    children: buildInfo.children
                };
            }
        );

        let unit = building[0].children.map(
            (unitInfo) => {
                return {
                    name: unitInfo.name,
                    id: unitInfo.id,
                    children: unitInfo.children
                };
            }
        );

        let floor = unit[0].children.map(
            (floorInfo) => {
                return {
                    name: floorInfo.name,
                    id: floorInfo.id,
                    children: floorInfo.children
                };
            }
        );

        let room = floor[0].children.map(
            (roomInfo) => {
                return {
                    name: roomInfo.name,
                    id: roomInfo.id,
                    address: roomInfo.address
                };
            }
        );

        this.props.navigation.setParams({
            roomAddress: room[0].address,
            roomId: room[0].id
        });

        this.setState({
            xiaoqu: atIndex,
            loudong: 0,
            danyuan: 0,
            louceng: 0,
            fangjianhao: 0,
            buildingData: building
        });

    }

    onPressBuildingItem(atIndex) {

        let unit = this.state.buildingData[atIndex].children.map(
            (unitInfo) => {
                return {
                    name: unitInfo.name,
                    id: unitInfo.id,
                    children: unitInfo.children
                };
            }
        );

        let floor = unit[0].children.map(
            (floorInfo) => {
                return {
                    name: floorInfo.name,
                    id: floorInfo.id,
                    children: floorInfo.children
                };
            }
        );

        let room = floor[0].children.map(
            (roomInfo) => {
                return {
                    name: roomInfo.name,
                    id: roomInfo.id,
                    address: roomInfo.address
                };
            }
        );

        this.props.navigation.setParams({
            roomAddress: room[0].address,
            roomId: room[0].id
        });

        this.setState({
            loudong: atIndex,
            danyuan: 0,
            louceng: 0,
            fangjianhao: 0,
            unitData: unit,
            floorData: floor,
            roomData: room
        });


    }

    onPressUnitItem(atIndex) {

        let floor = this.state.unitData[atIndex].children.map(
            (floorInfo) => {
                return {
                    name: floorInfo.name,
                    id: floorInfo.id,
                    children: floorInfo.children
                };
            }
        );

        let room = floor[0].children.map(
            (roomInfo) => {
                return {
                    name: roomInfo.name,
                    id: roomInfo.id,
                    address: roomInfo.address
                };
            }
        );

        this.props.navigation.setParams({
            roomAddress: room[0].address,
            roomId: room[0].id
        });

        this.setState({
            danyuan: atIndex,
            louceng: 0,
            fangjianhao: 0,
            floorData: floor,
            roomData: room
        });


    }

    onPressFloorItem(atIndex) {

        let room = this.state.floorData[atIndex].children.map(
            (roomInfo) => {
                return {
                    name: roomInfo.name,
                    id: roomInfo.id,
                    address: roomInfo.address
                };
            }
        );

        this.props.navigation.setParams({
            roomAddress: room[0].address,
            roomId: room[0].id
        });

        this.setState({
            louceng: atIndex,
            fangjianhao: 0,
            roomData: room
        });


    }

    onPressRoomItem(atIndex) {

        let room = this.state.roomData[atIndex];

        this.props.navigation.setParams({
            roomAddress: room.address,
            roomId: room.id
        });

        this.setState({
            fangjianhao: atIndex
        });

    }

}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'row',
        width: screen.width,
    },
    firstLevel: {
        flex: 1,
        width: 165,
        backgroundColor: 'white'
    },
    secondLevel: {
        flex: 1,
        width: 70,
        backgroundColor: 'ghostwhite'
    },
    thirdLevel: {
        flex: 1,
        width: 70,
        backgroundColor: 'whitesmoke'
    },
    fourthLevel: {
        flex: 1,
        width: 60,
        backgroundColor: 'lightgray'
    },
    fifthLevel: {
        flex: 1,
        width: 60,
        backgroundColor: 'gray'
    }


});

export default ChooseRoomScene;