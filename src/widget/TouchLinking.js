import React, {PureComponent} from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';

class TouchLinking extends PureComponent {

    static propTypes = {
        ...TouchableOpacity.props,
        url: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity {...this.props} onPress={() => {
                Linking.canOpenURL(this.props.url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + this.props.url);
                    } else {
                        return Linking.openURL(this.props.url);
                    }
                }).catch(err => console.error('An error occurred', err));
            }}/>
        );
    }
}

export default TouchLinking;