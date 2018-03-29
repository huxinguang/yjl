/**
 * Created by huxinguang on 2017/7/6.
 */

'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import icon from './IconFont';
import PropTypes from 'prop-types';

class StarScore extends Component {

    static propTypes = {
        originalScore: PropTypes.number.isRequired,
        style: PropTypes.object.isRequired,
        starStyle: PropTypes.object,
        scoreAble: PropTypes.bool
    };

    state:{
        totalScore:number,
        currentScore:number
    };

    constructor(props) {
        super(props);
        this.state = {
            totalScore: 5,
            currentScore: this.props.originalScore,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.originalScore !== this.props.originalScore) {
            this.setState({
                currentScore: nextProps.originalScore
            });
        }
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {this.renderStars()}
            </View>
        );
    }

    renderStars() {
        let images = [];
        for (var i = 1; i <= this.state.totalScore; i++) {
            let currentCount = i;
            images.push(
                <View key={"i" + i}>
                    <Text style={[styles.star, this.props.starStyle]} onPress={() => {
                        this.props.scoreAble ? this.score(currentCount) : null;
                    }}>
                        {icon('iconStarNormal')}
                    </Text>
                    {this.renderYellowStart(i)}
                </View>
            );
        }
        return images;
    }

    renderYellowStart(count) {
        if (count <= this.state.currentScore) {
            return (
                <Text style={[styles.star, this.props.starStyle, {position: 'absolute'}]} onPress={() => {
                    this.props.scoreAble ? this.score(count) : null;
                }}>
                    {icon('iconStarSelected')}
                </Text>
            );
        }
    }

    score(i) {
        this.setState({
            currentScore: i
        });
    }

}

var styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
    },
    star: {
        marginLeft: 5,
        fontFamily: 'iconfont',
        fontSize: 14,
        color: 'gold',
        textAlign: 'center',
    }
});


export default StarScore;