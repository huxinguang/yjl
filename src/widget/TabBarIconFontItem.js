//import liraries
import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
import {Text} from 'react-native';
import {icon} from '../widget';

// create a component
class TabBarIconFontItem extends PureComponent {

    static propTypes = {
        focused: PropTypes.bool,
        tintColor: PropTypes.string,
        selectedIcon: PropTypes.string,
        normalIcon: PropTypes.string
    };

    render() {
        return (
            <Text style={{fontSize: 22, color: this.props.tintColor, fontFamily: 'iconfont'}}>
                {this.props.focused ? icon(this.props.selectedIcon) : icon(this.props.normalIcon)}
            </Text>
        );
    }
}

//make this component available to the app
export default TabBarIconFontItem;
