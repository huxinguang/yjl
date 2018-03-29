/**
 * Created by kunpan on 2017/8/9.
 */
import React, {PureComponent} from 'react';
import {StyleSheet,
    Text,
    View,
    ListView,
    ScrollView,
    TextInput,
} from 'react-native';

import {color,SpacingView} from '../../widget/index';
import {GlobalTitle} from '../../Global';
import BaseStyleConfig from '../../config/BaseStyleConfig';
import ImageAndTitleCell from './ImageAndTitleCell';
import {get} from '../../api';
import {GlobalValue} from '../../Global';

let textInputHeight = 30;

export default class New_WaterScene extends PureComponent
{
    static navigationOptions = () => ({
        headerTitle : (
            <Text style={BaseStyleConfig.baseNaviTitleStyle}>
                {GlobalTitle.lifePayWaterTitle}
            </Text>
        ),
        headerStyle: {backgroundColor: color.theme},
    });

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            // 是否点击刷新试图
            isReloadForDidSelectItem: false,
            //
            addressArray: [],
        };

        this._requestGetAddress = this._requestGetAddress.bind(this);
        // 对象初始化的时候请求用户地址信息
        this._requestGetAddress();

    }

    render() {
        let bottomView =
            <View style={{backgroundColor: 'white', flexDirection: 'column', flex: 0.15 * 3 /5.5}}>
                <View style={{backgroundColor: 'blue',flex : 1, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 15, color: 'white'}} onPress={() => {
                    }}>
                        {'支 付'}
                    </Text>
                </View>
            </View>;

        let titleString = GlobalValue.userInfo && GlobalValue.userInfo.title;
        let substring = GlobalValue.userInfo && GlobalValue.userInfo.uname;

        return (
            <View style = {styles.container}>
                <ScrollView
                    style = {styles.container}
                    pagingEnabled={true}
                    bounces={true}
                    scrollsToTop={false}
                    scrollEventThrottle={100}
                    removeClippedSubviews={true}
                    automaticallyAdjustContentInsets={false}
                    directionalLockEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <ImageAndTitleCell titleString = {titleString}
                        substring = {substring}
                        desString = {this.state.addressArray.length > 0 ? this.state.addressArray[0]: '该用户下没有地址'}
                        isShowLeftIcon= {true}
                        isShowRightIcon={true}
                        source={'gps'}
                        selectOnPress={() =>
                            this._selectUserInfo && this._selectUserInfo()
                        }
                    >
                    </ImageAndTitleCell>

                    <SpacingView style={{backgroundColor: color.background,height: 2}} />

                    <SpacingView style={{backgroundColor: '#f5f',height: 10}} />


                    <SpacingView style={{backgroundColor: '#f5f',height: 10}} />

                    <View style = {{marginLeft: 20,marginRight: 20,borderRadius : 5,borderColor : 'black',backgroundColor :'white',alignItems : 'center',justifyContent : 'center'}}>
                        <TextInput style = {styles.textInputStyle} placeholder = {'缴费金额0.01~500(¥)'} >
                        </TextInput>
                    </View>

                </ScrollView>

                {bottomView}
            </View>
        );

    }

    /*获取该用户下address*/
    _requestGetAddress()
    {
        let paramsMap = {
            'service' : 'Esfixs.Choose_address',
            'time' : (new Date().valueOf()),
            'tag' : GlobalValue.blockInfo && GlobalValue.blockInfo.tag,};
        let _this = this;
        get(paramsMap,function (data) {
            if(data.code === 0)
            {
                if (data.info)
                {
                    // 刷新界面
                    _this.setState({
                        addressArray: data.info,
                    });
                }
            }

        },function (error) {
            alert('_requestGetAddress fail error =' + error);
        });
    }
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        flex : 1,
    },
    textInputStyle : {
        color : 'orange',
        fontSize: 16,
        textAlign: 'center',
        height : textInputHeight,
        margin : 10,
    },
});