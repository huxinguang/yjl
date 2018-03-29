/**
 * Created by huxinguang on 2017/7/5.
 */

import React, {PureComponent} from 'react';
import {CheckCell, Separator} from '../../widget/index';
import {View} from 'react-native';

class CheckView extends PureComponent {

    state: {
        checkedIndex: number
    };

    static propsType = {};

    constructor(Props) {
        super(Props);
        this.state = {
            checkedIndex: 0
        };
    }

    render() {
        return (
            <View>
                <CheckCell title='我是业主' icon={this.state.checkedIndex === 1 ? require('../../img/Mine/checked.png') : require('../../img/Mine/unchecked.png')}
                    onPressCheck={this.onPressCheck.bind(this)}/>
                <Separator/>
                <CheckCell title='我是家属' icon={this.state.checkedIndex === 2 ? require('../../img/Mine/checked.png') : require('../../img/Mine/unchecked.png')}
                    onPressCheck={this.onPressCheck.bind(this)}/>
                <Separator/>
                <CheckCell title='我是租客' icon={this.state.checkedIndex === 3 ? require('../../img/Mine/checked.png') : require('../../img/Mine/unchecked.png')}
                    onPressCheck={this.onPressCheck.bind(this)}/>
            </View>
        );
    }


    onPressCheck(cell: CheckCell) {
        // alert(cell.props.title);
        if (cell.props.title === '我是业主') {
            this.setState({checkedIndex: 1});

        } else if (cell.props.title === '我是家属') {
            this.setState({checkedIndex: 2});
        } else {
            this.setState({checkedIndex: 3});
        }
    }

}

export default CheckView;