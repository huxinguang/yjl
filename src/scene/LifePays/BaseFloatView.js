/**
 * Created by kunpan on 2017/7/31.
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native';

type Props = {
    children?: any;             // subView
    modalVisible ?: boolean;    // 是否显示floatView  true : show
    onSelectMaskView?: () => void;  // 点击蒙层处理 暴露给外面调用 外部可以不调用.
    subViewPadding ?:number;        // 默认的子试图距离left、rightmarge边距
    // borderRadius ?: number;         // 是否圆角      --- > 在subView中设置
    innerContainerJustifyContent ?: any;       // 内容试图是否居中、居底部设置 default : center
};

export default class BaseFloatView extends PureComponent
{
    props : Props;

    static defaultProps = {
        innerContainerJustifyContent : 'center',
    };

    constructor(props : Props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            animationType: 'none',//none slide fade
            modalVisible: this.props.modalVisible,//模态场景是否可见
            transparent: true,//是否透明显示
        };
        this.hideFloatViewVisible = this.hideFloatViewVisible.bind(this);
        global.hideFloatViewVisible = this.hideFloatViewVisible.bind(this);
    }


    render() {
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };

        return (
            <View style= {{alignSelf:'center', alignItems :'center'}}>
                <Modal
                    animationType={this.state.animationType}
                    transparent={this.state.transparent}
                    visible={this.state.modalVisible}
                    // onRequestClose={() => { this._setModalVisible(false) } }
                    onShow={this.startShow}
                    onRequestClose={() => {
                        this.hideFloatViewVisible(false);
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => {
                        this.hideFloatViewVisible(false);
                    }}>
                        <View style={[styles.container,modalBackgroundStyle, {justifyContent : (this.props.innerContainerJustifyContent)},{padding: (this.props.subViewPadding >= 0 ? this.props.subViewPadding : 40)},
                        // {borderRadius : (this.props.borderRadius > 0 ? this.props.borderRadius : 0)}
                        ]}
                        >
                            {this._rednerChildrenView()}

                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

            </View>
        );
    }

    /*内部接口区*/
    hideFloatViewVisible(visible)
    {
        this._setModalVisible(visible);

        if(this.props.onSelectMaskView && this.props.onSelectMaskView())
        {
            this.props.onSelectMaskView();
        }
    }

    _setModalVisible = (visible) =>
    {
        this.setState({ modalVisible: visible });
    }

    startShow=()=>{
        // alert('开始显示了');
    }


    _rednerChildrenView()
    {
        return React.Children.map(this.props.children, (child, i) => (
            <View key={'r_' + i}>
                {child}
            </View>
        ));
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // padding: (this.props.subViewPadding > 0 ? this.props.subViewPadding : 40),
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
    },
});
