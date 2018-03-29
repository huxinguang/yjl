/**
 * Created by huxinguang on 2017/7/7.
 */

import React, {Component} from 'react';
import {FlatList, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import ListItem from './ListItem';

class ChooseList extends Component {

    static propTypes = {
        itemBackgoundColor: PropTypes.string,
        listTitle: PropTypes.string,
        style: PropTypes.number,
        data: PropTypes.array,
        onPressItem: PropTypes.func,
        selectedIndex: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            index: nextProps.selectedIndex
        });
    }

    _renderItem = (item) => {
        let selected = (this.state.index === item.index ? true : false);
        return <ListItem
            title={item.item.name}
            bgColor={this.props.itemBackgoundColor}
            isSelected={selected}
            index={item.index}
            onPress={this.props.onPressItem}/>;
    };

    render() {

        return (
            <View style={{flex: 1}}>
                <Text style={{
                    backgroundColor: this.props.itemBackgoundColor,
                    fontSize: 15,
                    textAlign: 'center'
                }}>{this.props.listTitle}</Text>

                <FlatList
                    style={this.props.style}
                    renderItem={this._renderItem}
                    data={this.props.data}
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}//给FlatList指定extraData={this.state}属性，是为了保证state.selected变化时，能够正确触发FlatList的更新。如果不指定此属性，则FlatList不会触发更新，因为它是一个PureComponent，其props在===比较中没有变化则不会触发更新。
                >
                </FlatList>
            </View>

        );
    }

    _keyExtractor(item: Object, index: number) {
        return item.name;
    }
}

export default ChooseList;

