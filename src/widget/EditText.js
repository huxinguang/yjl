/**
 * Created by Administrator on 2017/7/4.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import icon from './IconFont';

class EditText extends PureComponent {

    static propTypes = {
        ...TextInput.props,
    };

    iconLeft: string;

    state: {};

    editText: TextInput;

    constructor(props) {
        super(props);
        this.state = {
            text: props.defaultValue,
            eyeVisible: props.secureTextEntry
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.state.text) {
            this.setState({text: nextProps.defaultValue});
        }
    }

    render() {
        let rightIcon;
        if (this.state.text && this.state.text !== '') {
            if (this.props.secureTextEntry) {
                rightIcon = this.state.eyeVisible ?
                    <Text style={{margin: this.props.inlineImagePadding, fontSize: 18, fontFamily: 'iconfont'}} onPress={() => {
                        this.setState({eyeVisible: false});
                    }}>{icon('hidden_password')}</Text> :
                    <Text style={{margin: this.props.inlineImagePadding, fontSize: 18, fontFamily: 'iconfont'}} onPress={() => {
                        this.setState({eyeVisible: true});
                    }}>{icon('show_password')}</Text>;
            } else {
                rightIcon =
                    <Text style={{margin: this.props.inlineImagePadding, fontSize: 18, fontFamily: 'iconfont'}} onPress={() => {
                        this.editText.clear();
                        this.setState({text: ''});
                        this.props.onChangeText('');
                    }}>{icon('clear')}</Text>;
            }
        }

        return (
            <View style={styles.container}>
                <Text style={{margin: this.props.inlineImagePadding, fontSize: 24, fontFamily: 'iconfont'}}>{icon(this.props.iconLeft)}</Text>
                <TextInput ref={(e) => this.editText = e} style={{flex: 1}} {...this.props} secureTextEntry={this.state.eyeVisible}
                    onChangeText={(text) => {
                        this.props.onChangeText(text);
                        this.setState({text});
                    }}/>
                {rightIcon}
            </View>
        );
    }

}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default EditText;

