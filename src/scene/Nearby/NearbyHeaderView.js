//import liraries
import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../widget/Text';
import {screen} from '../../common';
import {color} from '../../widget';

// create a component
class NearbyHeaderView extends PureComponent {
    static propTypes = {
        selectedIndex : React.PropTypes.number,
        onSelected   : React.PropTypes.func,
        titles : React.PropTypes.array,
    };

    static defaultProps = {
        onSelected: () => {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.titles.map((title, i) => (
                    <TouchableOpacity
                        style={[{backgroundColor: this.props.selectedIndex == i ? '#FE566D' : 'white'}, styles.item]}
                        key={i}
                        onPress={() => this.props.onSelected(i)}>
                        <Paragraph
                            style={{color: this.props.selectedIndex == i ? 'white' : '#555555'}}>
                            {this.props.titles[i]}
                        </Paragraph>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        width: screen.width / 4 - 10,
        marginLeft: 8,
        marginTop: 5,
        marginBottom: 5,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: screen.onePixel,
        borderColor: color.border,
    },
});

//make this component available to the app
export default NearbyHeaderView;
