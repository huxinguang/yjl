/**
 * Created by huxinguang on 2017/7/6.
 */

import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import screen from '../../common/screen';
import ChooseList from './ChooseList';

class RoomChooseView extends PureComponent {

    constructor(props) {
        super(props);

    }

    render() {

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} horizontal={true}>
                    <ChooseList
                        style={styles.firstLevel}
                        itemBackgoundColor='white'
                        listTitle='小区'
                        data={[{key: 'a'}, {key: 'b'}]}
                        renderItem={({item}) => <Text>{item.key}</Text>}
                    />
                    <ChooseList
                        style={styles.secondLevel}
                        itemBackgoundColor='ghostwhite'
                        listTitle='楼栋'
                        data={[{key: 'c'}, {key: 'd'}]}
                        renderItem={({item}) => <Text >{item.key}</Text>}
                    />
                    <ChooseList
                        style={styles.thirdLevel}
                        itemBackgoundColor='whitesmoke'
                        listTitle='单元'
                        data={[{key: 'e'}, {key: 'f'}]}
                        renderItem={({item}) => <Text>{item.key}</Text>}
                    />
                    <ChooseList
                        style={styles.fourthLevel}
                        itemBackgoundColor='lightgray'
                        listTitle='楼层'
                        data={[{key: 'g'}, {key: 'h'}]}
                        renderItem={({item}) => <Text>{item.key}</Text>}
                    />
                    <ChooseList
                        style={styles.fifthLevel}
                        itemBackgoundColor='gray'
                        listTitle='房间号'
                        data={[{key: 'i'}, {key: 'j'}]}
                        renderItem={({item}) => <Text>{item.key}</Text>}
                    />
                </ScrollView>

            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        // flex: 1,
        flexDirection: 'row',
        width: screen.width
    },
    firstLevel: {
        flex: 1,
        width: 150,
    },
    secondLevel: {
        // flex: 1,
        width: 80
    },
    thirdLevel: {
        // flex: 1,
        width: 70
    },
    fourthLevel: {
        // flex: 1,
        width: 50
    },
    fifthLevel: {
        // flex: 1,
        width: 50
    }


});

export default RoomChooseView;