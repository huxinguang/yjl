
import React,{PureComponent} from 'react';
import {ViewPagerAndroid,StyleSheet,View,Text} from 'react-native';
import system from './common/system';
import screen from './common/screen';
import PropTypes from 'prop-types';

class GuideViewPager extends PureComponent{

    static propTypes = {
        onStartBtnClicked:PropTypes.func
    };

    constructor(){
        super();

    }

    render(){

        return(
            system.isAndroid ?
                <ViewPagerAndroid style = {styles.container}
                                  initialPage = {0}
                >
                    <View style = {styles.image1}/>
                    <View style = {styles.image2}/>
                    <View style = {styles.image3}>
                        <Text style = {styles.text} onPress = {() =>{this.props.onStartBtnClicked && this.props.onStartBtnClicked()}}>
                            {'start app'}
                        </Text>
                    </View>
                </ViewPagerAndroid>
                : null
        );
    }


}

export default GuideViewPager;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#4F9D9D'
    },
    image1:{
        backgroundColor:'#82D900',
        width: screen.width,
        height:screen.height
    },
    image2:{
        backgroundColor:'#FF44FF',
        width: screen.width,
        height:screen.height
    },
    image3:{
        backgroundColor:'#FF5809',
        width: screen.width,
        height:screen.height
    },
    text:{
        fontSize: 20,
        color: 'white'

    }



});