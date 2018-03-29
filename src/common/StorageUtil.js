/**
 * Created by kunpan on 2017/7/5.
 */
import {Component} from 'react';
import {AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import Storage from 'react-native-storage';

let defaultExpires_Default = null;      /// <默认为1天 null没有时间限制
const size = 1000;                /// <默认存储的条数为1000条数据 key - values
let storage;

export default class StorageUtil extends Component {
    static propTypes = {
        defaultExpires: PropTypes.number,
        size: PropTypes.number,
    };

    static defaultProps = {
        defaultExpires: defaultExpires_Default,
        size: size,
    };

    groupQueue: {};

    constructor(props) {
        super(props);
        this.groupQueue = {}();
        this.state = {
            result: false,
        };
        // // 初始化storange
        // this.shareStroageUtilInstan();
        // // 设置全局变量
        // global.storage = storage;
    }

    /*外部接口区*/

    // 初始化storange为单例
    static shareStroageUtilInstan() {
        if (storage === undefined) {
            storage = new Storage({
                size: size,
                //如果不指定则数据只会保存在内存中，重启后即丢失
                storageBackend: AsyncStorage,
                // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
                defaultExpires: defaultExpires_Default,
                // 读写时在内存中缓存数据。默认启用
                enableCache: true, //
                // 如果storage中没有相应数据，或数据已过期，
                // 则会调用相应的sync方法，无缝返回最新数据
                // sync: null,
            });
        }
        return storage;
    }

    // 增、删、改、查
    // 下面每一个方法的参数都是可选填的
    /*key:保存的key值 object：保存的value */
    static storageSave(key, values) {
        this._storageSave(key, values, defaultExpires_Default);
    }

    static removeObjectForKey(key) {
        this.isInit();
        storage.remove({
            key: key,
        });
    }

    static removeAllObject() {
        this.isInit();
        // !! 清空map，移除所有"key-id"数据（但会保留只有key的数据）
        storage.clearMap();
    }

    static clearDataByKey(key) {
        this.isInit();
        // !! 清除某个key下的所有数据
        storage.clearMapForKey(key);
    }

    /*select*/
    static selectObject(key, callBack) {
        this._selectObject(key, callBack);
    }

    /*多个key的查询group*/
    static selectObjectForKey(keyArray: Array, callBack) {
        // this.state.keyQueueArray = keyArray;
        this._selectObjectForKey(keyArray, callBack);
    }

    /*每次查询完成之后请求对应的group中数据*/
    static clearGroup() {
        this.groupQueue = {}();
    }

    /*内部接口区*/
    static isInit() {
        if (storage === undefined) {
            throw '请先调用_getStorage()进行初始化';
        }
    }

    /*key:保存的key值 object：保存的value expires：有效时间，*/
    static _storageSave(key, values, expires) {
        this.isInit();
        storage.save({
            key: key,
            data: values,
            // 如果不指定过期时间，则会使用defaultExpires参数
            // 如果设为null，则永不过期
            expires: expires,
        });
    }

    static _selectObject(key, callBack) {
        this.isInit();
        storage.load({
            key: key,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true,
            // 你还可以给sync方法传递额外的参数
            // syncParams:{ params,
            //     someFlag: someFlag,
            // },

        }).then(ret => {
            callBack(ret);
            return ret;
        }).catch(error => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回warn
            console.log(error.message);
            switch (error.name) {
            case 'NotFoundError' : {
                // TO DO:
                break;
            }
            case 'ExpiredError': {
                // TO DO:
                break;
            }
            }

        });
    }

    // 多个key的查询
    static _selectObjectForKey(keyArray: Array, callBack) {
        this.isInit();

        // map便利 keyArray便利查询
        if (keyArray.length >= 1) {
            // this.groupQueue = {};
            var _this = this;
            _this.groupQueue = {};

            keyArray.map((key, index) => {
                this.selectOneKey(key, index, function (ret, idx) {
                    // 查询完成之后
                    if (ret !== null) {
                        // if(index === idx)
                        //     this.groupQueue[key] = ret;
                        // dict[key] = ret
                        _this.groupQueue[key] = ret;
                    }
                    if (index === keyArray.length - 1) {
                        callBack(_this.groupQueue);
                    }
                });

            });
        }
    }

    //查询单个的key
    static selectOneKey(key, index, oneCallBack) {
        storage.load({
            key: key,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true,
            // 你还可以给sync方法传递额外的参数
            // syncParams:{ params,
            //     someFlag: someFlag,
            // },

        }).then(ret => {
            // this.groupQueue[key] = ret;
            oneCallBack(ret, index);
            return ret;
        }).catch(error => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回warn
            // console.log(error.message);
            switch (error.name) {
            case 'NotFoundError' : {
                // TO DO: 修改map下改key 对应的values 为null
                oneCallBack(null, index);
                break;
            }
            case 'ExpiredError': {
                // TO DO:
                break;
            }
            }

        });
    }
}
