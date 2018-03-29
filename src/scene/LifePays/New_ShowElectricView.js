/**
 * Created by kunpan on 2017/8/8.
 */
import React, {PureComponent} from 'react';
import {StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';

let titleTopMarger = 10;
let defaultCellLeftMarge = 10;
let defaultTimer = 5000;

export default class New_ShowElectricView extends PureComponent
{
    static propTypes = {
        onSelectElectBtnClick : React.PropTypes.func,
        remainNumber : React.PropTypes.number,
        updateTime : React.PropTypes.string,
    };

    static defaultProps = {
        remainNumber : 11,
        updateTime : '2017-08-08 02:36:18',
    };

    constructor(props)
    {
        super(props);
        this.state = {
            isUpdateTime : false,       /// < 是否显示更新、菊花
        };

        this._updateState = this._updateState.bind(this);
        global.resetShowElectriView = this.resetShowElectriView.bind(this);
    }

    render()
    {
        let rightView = this.state.isUpdateTime === false ?
            <View style = {styles.rightStyle}>
                <View style = {styles.buttonView}>
                    <Text style = {{color : 'white',fontSize : 14,alignItems : 'center',justifyContent:'center',margin : 10}} onPress={() => {
                        this._updateState();
                        this.props.onSelectElectBtnClick && this.props.onSelectElectBtnClick();
                    }}>
                        {'更新'}
                    </Text>
                </View>
            </View> :
            <View style = {styles.rightStyle}>
                <View style={styles.activityIndicator}>
                    <ActivityIndicator size="small" color="#888888"/>
                    <Text style={styles.footerText}>
                        {'查询中...'}
                    </Text>
                </View>
            </View>;

        return (
            <View style = {styles.constainer}>
                <View style = {{flexDirection : 'column',margin : 10}}>
                    <View style = {{backgroundColor: 'white', justifyContent: 'center'}}>
                        <Text style={{textAlign: 'left', fontSize: 15, color: 'black'}} onPress={() => {
                        }}>
                            {'余额: ' + this.props.remainNumber + ' ¥'}
                        </Text>
                    </View>

                    <View style = {{backgroundColor: 'white', justifyContent: 'center',marginTop : 5}}>
                        <Text style={{textAlign: 'center', fontSize: 15, color: '#555555'}} onPress={() => {
                        }}>
                            {'更新于: ' + this.props.updateTime}
                        </Text>
                    </View>
                </View>
                {rightView}
            </View>
        );
    }

    /*外部接口区*/
    // 更新按钮state的状态
    resetShowElectriView()
    {
        this.setState({
            isUpdateTime : false,
        });
    }

    // 更新余额、时间
    // resetRemainNumberAndTime(remainNumber : number,timeString : string)
    // {
    //     this.setState({
    //
    //     });
    // }

    /*内部接口区*/
    _updateState()
    {
        this.setState({
            isUpdateTime : !this.state.isUpdateTime,
        });

        setTimeout(() => {
            this.setState({
                isUpdateTime : !this.state.isUpdateTime,
            });
        }, defaultTimer);
    }

}

const styles = StyleSheet.create({
    constainer : {
        backgroundColor : 'white',
        flexDirection: 'row',
    },
    rightStyle : {
        flex : 1,
        alignItems : 'center',
        justifyContent :'flex-end',
        backgroundColor:'white',
        flexDirection : 'row',
    },
    buttonView : {
        borderRadius : 5,
        backgroundColor : 'blue',
        alignItems:'center',
        marginRight : defaultCellLeftMarge,
    },
    activityIndicator : {
        flexDirection : 'column',
        alignItems : 'center',
        justifyContent : 'center',
        marginRight : defaultCellLeftMarge,
    },
    footerText: {
        marginTop : 5,
        fontSize: 14,
        color: '#555555'
    }
});