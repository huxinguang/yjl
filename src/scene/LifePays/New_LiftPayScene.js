/**
 * Created by kunpan on 2017/8/7.
 */
import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GlobalTitle} from '../../Global';
import ImageAndTitleCell from './ImageAndTitleCell';

let margerTopHeight = 20;
let paddingLeftRight = 20;

export default class New_LiftPayScene extends PureComponent {
    static navigationOptions = ({navigation}) => ({
        headerTitle: GlobalTitle.lifeTitle,
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('TestActionSheetScene', {})}>
                <Text style={{margin: 10, color: 'white', fontSize: 16}}>{GlobalTitle.lifePayNaviRightTitle}</Text>
            </TouchableOpacity>
        ),
    });

    static propTypes = {
        navigation: React.PropTypes.object
    };

    render() {
        return (
            <ScrollView
                // horizontal={true}
                pagingEnabled={true}
                bounces={true}
                scrollsToTop={false}
                scrollEventThrottle={100}
                removeClippedSubviews={true}
                automaticallyAdjustContentInsets={false}
                directionalLockEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={styles.container}>
                <View style={styles.viewStyle}>
                    <ImageAndTitleCell titleString='物业费'
                        substring=''
                        desString=''
                        isShowLeftIcon={true}
                        isShowRightIcon={true}
                        source={'iconWuYe'}
                        selectOnPress={() =>
                            this.props.navigation.navigate('New_PropertyPay', {})
                        }>
                    </ImageAndTitleCell>
                </View>

                <View style={styles.viewStyle}>
                    <ImageAndTitleCell titleString='电费'
                        substring=''
                        desString=''
                        isShowLeftIcon={true}
                        isShowRightIcon={true}
                        source={'iconElectric'}
                        selectOnPress={() =>
                            this.props.navigation.navigate('New_ElectricScene', {})
                        }>
                    </ImageAndTitleCell>
                </View>

                <View style={styles.viewStyle}>
                    <ImageAndTitleCell titleString='水费'
                        substring=''
                        desString=''
                        isShowLeftIcon={true}
                        isShowRightIcon={true}
                        isOneTextCenter={true}
                        source={'iconWater'}
                        selectOnPress={() =>
                            this.props.navigation.navigate('New_WaterScene', {})
                        }>
                    </ImageAndTitleCell>
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e4e4e4',
        flexDirection: 'column',
    },
    viewStyle: {
        marginTop: margerTopHeight,
        marginLeft: paddingLeftRight,
        marginRight: paddingLeftRight,
        // width: screen.width - 2 * paddingLeftRight,
        // height : itemViewHeight,
        borderRadius: 10,
    },
});

