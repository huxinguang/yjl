/**
 * Created by Administrator on 2017/6/29.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import color from './color';

class SegmentedControl extends PureComponent {

    static propTypes = {
        style: PropTypes.object,
        values: PropTypes.array,
        selectedIndex: PropTypes.number,
        onChange: PropTypes.func
    };

    static defaultProps = {
        selectedIndex: 0
    };

    constructor(props: Object) {
        super(props);
    }


    render() {
        let items = this.props.values.map((val, i) => {
            let bgColor = this.props.selectedIndex === i ? 'white' : 'transparent';
            let color = this.props.selectedIndex === i ? 'dodgerblue' : 'white';
            let segmentStyle;
            if (i === 0) {
                segmentStyle = styles.segmentLeft;
            } else if (i === this.props.values.length - 1) {
                segmentStyle = styles.segmentRight;
            } else {
                segmentStyle = styles.segment;
            }
            return (
                <TouchableOpacity activeOpacity={10} key={i} style={[segmentStyle, {backgroundColor: bgColor}]}
                    onPress={() => {
                        this.props.onChange && this.props.onChange(i);
                    }}>
                    <Text style={{padding: 5, color: color, fontSize: 14}}>{val}</Text>
                </TouchableOpacity>
            );
        });
        return (
            <View style={[styles.container, this.props.style]}>
                {items}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 3
    },
    segment: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    segmentLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3
    },
    segmentRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3
    },
    SegmentedActiveColor: {color: color.theme},
});

export default SegmentedControl;