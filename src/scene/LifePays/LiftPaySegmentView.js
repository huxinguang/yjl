/**
 * Created by kunpan on 2017/7/24.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback} from 'react-native';
import {screen} from '../../common/index';

var segementViewHeight = 40;

type Props = {
    oneSegmentString: string;
    twoSegmentString: string;
    onSelectedIndexChange?: (index: number) => void;

};

export default class LifePaySegmentView extends PureComponent {
    // static propType = {
    //     oneSegmentString : PropTypes.string,
    //     twoSegmentString : PropTypes.string,
    //     onSelectedIndexChange : PropTypes.func.isRequired,
    // }
    props: Props;

    static defaultProps = {
        oneSegmentString: '代缴费',
        twoSegmentString: '缴费记录',
    };

    state: {
        resetSegmentIndex?: (index: number) => void;
        selectedIndex: number;
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedIndex: 0,

        };
        // 设置全局函数
        global.resetSegmentIndex = this.resetSegmentIndex.bind(this);

    }

    render() {
        var lineLabel;

        lineLabel = this.state.selectedIndex === 0 ?
            <View>
                <Text style={[styles.lineLabelStyle, {marginLeft: 0}]}/>
            </View> :
            <View>
                <Text style={[styles.lineLabelStyle, {marginLeft: screen.width / 2}]}/>
            </View>;

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            selectedIndex: 0,
                        });
                        this.props.onSelectedIndexChange && this.props.onSelectedIndexChange(0);
                    }}>
                        <View style={styles.segementViewStyle}>
                            <Text style={styles.segementTextStyle}>{this.props.oneSegmentString}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{
                        backgroundColor: '#e5e5e5',
                        marginTop: 0,
                        height: segementViewHeight,
                        width: 1,
                        opacity: 0.8
                    }}>
                    </View>

                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            selectedIndex: 1,
                        });
                        this.props.onSelectedIndexChange && this.props.onSelectedIndexChange(1);
                    }}>
                        <View style={styles.segementViewStyle}>
                            <Text style={styles.segementTextStyle}>{this.props.twoSegmentString}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {lineLabel}
            </View>
        );
    }

    /*外部接口区*/

    // 设置当前选中的segment
    resetSegmentIndex(index: number) {
        if (this.state.selectedIndex === index) {
            return;
        }
        this.setState({
            selectedIndex: index,
        });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    segementTextStyle: {
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
    },
    segementViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: screen.width / 2,
        height: segementViewHeight,
        marginLeft: 0,
    },
    lineLabelStyle: {
        backgroundColor: 'orange',
        height: 3,
        width: screen.width / 2,
        marginTop: 0,
    },
});