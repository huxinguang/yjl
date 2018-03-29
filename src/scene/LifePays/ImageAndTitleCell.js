/**
 * Created by kunpan on 2017/7/7.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {PropTypes} from 'prop-types';
import {screen} from '../../common/index';
import icon from '../../widget/IconFont';

let onlyTitleTopMarger = 0;
let titleTopMarger = 10;

export default class ImageAndTitleCell extends PureComponent {
    static propTypes = {
        // height : React.PropTypes.number,    ///< default view height
        // iconStyle : React.PropTypes.any,
        source: PropTypes.string,       ///< right icon source React.PropTypes.number,

        titleString: PropTypes.string,

        substring: PropTypes.string,

        desString: PropTypes.string,

        isShowRightIcon: PropTypes.bool,
        isShowLeftIcon: PropTypes.bool,
        isOneTextCenter: PropTypes.bool,   /// < 是否title居中显示 default : false

        selectOnPress: PropTypes.func,
    };

    static defaultProps = {
        // TitleStyle : styles.defaultTitleTextStyle,
        titleString: '',
        substring: '',
        // SubStyle : styles.defaultSubTextStyle,
        desString: '',
        // DesStyle : styles.defaultDesTextStyle,
        // iconStyle : styles.defaultIconStyle,
        source: null,
        isShowRightIcon: true,
        isShowLeftIcon: true,
        isOneTextCenter: false,
    };

    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.titleString.length > 0 && this.props.desString.length === 0) {
            titleTopMarger = 0;
        } else {
            titleTopMarger = 10;
        }
    }

    /*外部接口区*/

    /*内部接口区*/
    // <Image style = {styles.defaultRightIcon} source={this.props.source} 'gps' />;
    // {/*<Image style = {styles.defaultIconStyle} source={this.props.source}/>;*/}

    /*试图渲染区*/
    render() {
        let rightIcon = this.props.isShowRightIcon === true && this.props.source &&
            <Text style={[{fontFamily: 'iconfont', fontSize: 26, color: 'blue'}, styles.defaultRightIcon]}>
                {icon('iconTyRight')}
            </Text>;

        let leftIcon = this.props.isShowLeftIcon === true && this.props.source &&
            <Text style={[{fontFamily: 'iconfont', fontSize: 30, color: 'blue'}, styles.defaultIconStyle]}>
                {icon(this.props.source)}
            </Text>;

        let title = this.props.titleString.length > 0 &&
            <Text style={[styles.defaultTitleTextStyle, {marginTop: this.props.isOneTextCenter === true ? onlyTitleTopMarger : titleTopMarger}]}>
                {this.props.titleString}
            </Text>;
        let sub = this.props.substring.length > 0 &&
            <View style={{justifyContent: 'flex-end', flex: 1}}>
                <Text style={styles.defaultSubTextStyle}>
                    {this.props.substring}
                </Text>
            </View>;

        let des = this.props.desString.length > 0 &&
            <Text style={styles.defaultDesTextStyle}>
                {this.props.desString}
            </Text>;

        return (
            <View style={{backgroundColor: 'red', flexDirection: 'row'}}>
                <TouchableWithoutFeedback onPress={() => {
                    this.props.selectOnPress && this.props.selectOnPress();
                }}>
                    <View style={styles.container}>
                        {leftIcon}
                        <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row', width: screen.width * 0.72}}>
                                {title}
                                {sub}
                            </View>
                            {des}
                        </View>

                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {
                    this.props.selectOnPress && this.props.selectOnPress();
                }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#f5f5f5',
                        paddingRight: 10, flex: 1,
                    }}>
                        {rightIcon}
                    </View>
                </TouchableWithoutFeedback>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex : 1,
        backgroundColor: '#f5f5f5',
        // justifyContent : 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    defaultIconStyle: {
        margin: 10,
        width: 30,
        height: 30,

    },
    defaultTitleTextStyle: {
        textAlign: 'center',
        marginLeft: 10,
        // marginTop : 10,
        fontSize: 14,
        color: 'black',
    },
    defaultDesTextStyle: {
        // textAlign:'center',
        textAlign: 'left',
        color: '#999999',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        flexWrap: 'wrap',
    },
    defaultSubTextStyle: {
        // textAlign : 'center',
        textAlign: 'right',
        marginLeft: 50,
        marginTop: 10,
        fontSize: 14,
        color: 'black',
    },
    defaultRightIcon: {
        // marginLeft : screen.width * 1/4,
        // marginRight : screen.width - 40,
        alignItems: 'center',
        width: 30,
        height: 30,
    },
});
