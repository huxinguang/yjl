/**
 * Created by kunpan on 2017/6/27.
 */
import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {color} from '../../widget';
import LifeHotShopItem from './LifeHotShopItem';
import {screen} from '../../common';

export default class LifeHotShopView extends PureComponent {
    static propTypes = {
        infos : React.PropTypes.array,
        onGridSelected : React.PropTypes.func,
    };

    static  defaulrProps = {
        infos: []
    };

    render() {

        // let subContentView = this.props.infos.map((info, index) => (
        //
        //     <View style = {{paddingLeft:margetLeft,backgroundColor: 'red',flexDirection:'row'}} key = {index}>
        //         <LifeHotShopItem
        //             info={info}
        //             key={index}
        //             onPress={() => this.props.onGridSelected(index)}/>
        //     </View>
        // ));

        return (

            <View style={styles.container}>
                <View style={styles.containViewStyle}>
                    {this.props.infos.map((info, index) => (
                        <View style = {{paddingLeft:(screen.width - 3 * screen.width * 0.25)/4,backgroundColor: 'white',flexDirection:'row'}} key = {index}>
                        <LifeHotShopItem
                            info={info}
                            key={index}
                            onPress={() => this.props.onGridSelected(index)}/>
                        </View>
                    ))}
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {

        backgroundColor: 'white',
    },
    containViewStyle: {
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-between', //space-between
        // borderTopWidth: screen.onePixel,
        // borderLeftWidth: screen.onePixel,
        borderColor: color.border,
        // paddingLeft: 20,
        // paddingRight: 20,
    },
});

