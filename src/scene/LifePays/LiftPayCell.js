/**
 * Created by kunpan on 2017/7/25.
 */
import React, {PureComponent} from 'react';
import {Image,StyleSheet, Text, TouchableOpacity,View,TouchableWithoutFeedback} from 'react-native';
import {screen} from '../../common/index';
import icon from '../../widget/IconFont';
// import {NavigationScreenProp as boolean} from '../../../node_modules/react-navigation/lib-rn/TypeDefinition';
import {SpacingView,color} from '../../widget/index';

var defaultCellHeight = 40;
var defaultCellLeftMarge = 10;
var defaultCellItemTopmarger = 5;

type Props = {
    didSelectCellItem?: (cellType : number,isSelect : boolean,payId : number) => void;
    cellType : React.PropTypes.number,      // 0 表示代缴费 1.表示缴费记录
    titleString : React.PropTypes.string,
    timeString : React.PropTypes.string,
    payTimeString : React.PropTypes.string, // 这个可以选填的 isRequire
    id : React.PropTypes.number,
};

export default class LiftPayCell extends PureComponent
{
    props : Props;
    static defaultProps = {
        cellType: 0,
        titleString : '',
        timeString : '',
        payTimeString : '',
        isSelectDefult : false,
        id : 0,
    };

    state = {
        isSelect :boolean,
    };
    constructor(props : Props)
    {
        super(props);
        this.state = {
            isSelect : false,
        };
    }

    render()
    {
        var isSelectTmp =null;
        let checkImage = this.state.isSelect === false ?
            <View style = {styles.checkBoxStyle}>
            <Text style={{fontSize: 18, fontFamily: 'iconfont',marginRight:defaultCellLeftMarge}} onPress={() => {
                this.setState({isSelect: true});
                isSelectTmp = true;
                this.props.didSelectCellItem && this.props.didSelectCellItem(this.props.cellType,isSelectTmp,this.props.id);

            }}>{icon('icontycircleoutline')}</Text>
            </View> :
            <View style = {styles.checkBoxStyle}>
            <Text style={{fontSize: 18, fontFamily: 'iconfont',marginRight:defaultCellLeftMarge,color : 'orange'}} onPress={() => {
                this.setState({isSelect: false});
                isSelectTmp = false;
                this.props.didSelectCellItem && this.props.didSelectCellItem(this.props.cellType,isSelectTmp,this.props.id);
            }}>{icon('icontycheckmarkoutline')}</Text>
            </View>;

        let rightView = this.props.cellType === 0 ? checkImage :
            <View style = {styles.checkBoxStyle}>
                <Text style={{marginRight: 10, fontSize: 12}}>
                    {'缴费日期:2016-11-14'}
                    </Text>
            </View>;

        return(
            <TouchableWithoutFeedback style={styles.container} onPress={() => {
                this.setState({
                    isSelect : !this.state.isSelect
                });
                isSelectTmp = !this.state.isSelect;
                this.props.didSelectCellItem && this.props.didSelectCellItem(this.props.cellType,isSelectTmp,this.props.id);
            }}>
                <View style = {{flexDirection : 'column'}}>
                <View style = {{flexDirection : 'row'}}>
                <View style = {{flexDirection : 'column',marginLeft:10,marginTop : 5}}>
                <Text style={styles.titleTextStyle}>
                    {'物业费: ' + this.props.titleString + '元'}
                </Text>
                <Text style={styles.timeTextStyle}>
                    {'费用周期: ' + this.props.timeString }
                </Text>
                </View>
                {rightView}
                </View>
                    <SpacingView style={{backgroundColor: color.background,height: 1.5,marginTop : 3}} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        backgroundColor : 'white',
        flexDirection : 'row',
        height : defaultCellHeight,
    },
    leftViewStyle : {
        marginTop : defaultCellItemTopmarger,
        marginLeft : defaultCellLeftMarge,
        flexDirection: 'column',
        alignItems : 'center',
        justifyContent : 'center',
    },
    titleTextStyle :{
        fontSize : 14,
        color: '#FE566D',
        textAlign : 'left',
    },
    timeTextStyle : {
        fontSize:12,
        color: '#FE566D',
        textAlign: 'left',
        marginTop: 2,
    },
    payTextStyle : {
        fontSize:12,
        color: '#FE566D',
        textAlign: 'center',
    },
    checkBoxStyle : {
        flex : 1,
        alignItems : 'center',
        justifyContent :'flex-end',
        backgroundColor:'white',
        flexDirection : 'row',
    },
});