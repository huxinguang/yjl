import {ToastAndroid} from 'react-native';
import {GlobalValue} from './Global';

const HOST = 'https://yjl.skyocean.com';
// const HOST = 'http://192.168.1.64';
// const HOST = 'http://192.168.10.147';
const API = HOST + '/tyapi/Public/skyocean/';

const serialize = function (obj) {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
};

const dispatch = function (code, msg) {
    if (code === 11001) {
        global.store.dispatch({
            type: 'LOGGED_OUT',
        });
    }
};

const get = async function (paramMap, successCallback, errorCallback) {
    try {
        let uid = GlobalValue.userId;
        let token = GlobalValue.userToken;
        if (uid && token) {
            paramMap.uid = uid;
            paramMap.token = token;
        }
        let url = API + '?' + serialize(paramMap);
        let response = await fetch(url, {
            method: 'GET',
            header: {'Content-Type': 'application/json'}
        });
        let json = await response.json();
        if (json) {
            let ret = json.ret;
            if (ret && (200 === parseInt(ret))) {
                let obj = json.data;
                if (obj) {
                    if (obj.code === 0 && successCallback) {
                        successCallback(obj);
                    } else {
                        dispatch(obj.code, obj.msg);
                        errorCallback(obj.msg);
                    }
                } else {
                    console.log('data.data is null');
                }
            } else {
                ToastAndroid.show(json.msg, ToastAndroid.SHORT);
                console.log('---' + url + '---' + JSON.stringify(json));
            }
        } else {
            console.log('---与服务器通讯错误---');
        }
    } catch (error) {
        if (errorCallback) errorCallback(error);
    }
};

const post = async function (paramMap, successCallback, errorCallback) {
    try {
        let uid = GlobalValue.userId;
        let token = GlobalValue.userToken;
        if (uid && token) {
            paramMap.uid = uid;
            paramMap.token = token;
        }
        let formData = new FormData();
        if (paramMap) {
            for (let key in paramMap) {
                if (paramMap.hasOwnProperty(key)) {
                    formData.append(key, paramMap[key]);
                }
            }
        }
        let response = await fetch(API, {
            method: 'POST',
            header: {'Content-Type': 'application/json'},
            body: formData
        });
        let json = await response.json();
        if (json) {
            let ret = json.ret;
            if (ret && (200 === parseInt(ret))) {
                let obj = json.data;
                if (obj) {
                    if (obj.code === 0 && successCallback) {
                        successCallback(obj);
                    } else {
                        dispatch(obj.code, obj.msg);
                        errorCallback(obj.msg);
                    }
                } else {
                    console.log('data.data is null');
                }
            } else {
                ToastAndroid.show(json.msg, ToastAndroid.SHORT);
                console.log('---' + API + '---' + JSON.stringify(json));
            }
        } else {
            console.log('---与服务器通讯错误---');
        }
    } catch (error) {
        if (errorCallback) errorCallback(error);
    }
};

export function recommendUrlWithId(id) {
    return 'http://api.meituan.com/group/v1/deal/recommend/collaborative?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=hWCwhGYpNTG7TjXWHOwPykgoKX0%3D&__skno=433ACF85-E134-4FEC-94B5-DA35D33AC753&__skts=1436343274.685593&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&cate=0&ci=1&cityId=1&client=iphone&did=' + id + '&district=-1&fields=id%2Cslug%2Cimgurl%2Cprice%2Ctitle%2Cbrandname%2Crange%2Cvalue%2Cmlls%2Csolds&hasbuy=0&latlng=0.000000%2C0.000000&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-07-08-15-36746&offset=0&scene=view-v4&userId=10086&userid=10086&utm_campaign=AgroupBgroupD100Fab_i550poi_ktv__d__j___ab_i_group_5_3_poidetaildeallist__a__b___ab_gxhceshi0202__b__a___ab_pindaoquxincelue0630__b__b1___ab_i_group_5_6_searchkuang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_i550poi_xxyl__b__leftflow___ab_b_food_57_purepoilist_extinfo__a__a___ab_waimaiwending__a__a___ab_waimaizhanshi__b__b1___ab_i550poi_lr__d__leftflow___ab_i_group_5_5_onsite__b__b___ab_xinkeceshi__b__leftflowGhomepage_guess_27774127&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7';
}


export function groupPurchaseDetailWithId(id) {
    return 'http://api.meituan.com/group/v1/deal/list/id/' + id + '?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=4NDQ%2BojQ%2BZGArOWQCEgWI19Pzus%3D&__skno=803C28CE-8BA8-4831-B2DE-7BCD484348D9&__skts=1435888257.411030&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&ci=1&client=iphone&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-07-03-09-14430&userid=10086&utm_campaign=AgroupBgroupC1080988208017226240_c0_e68cafa9e104898bb8bfcd78b64aef671D100Fab_i_group_5_3_poidetaildeallist__a__b___ab_chunceshishuju__a__a___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_waimaiwending__a__a___ab_gxh_82__nostrategy__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_pindaoshenyang__a__leftflow___ab_pindaoquxincelue0630__b__b1___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___b1junglehomepagecatesort__b__leftflow___ab_i_group_5_5_onsite__b__b___ab_i_group_5_6_searchkuang__a__leftflowGhomepage_guess_27774127&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7';
}

/**
 * 用于把用utf16编码的字符转换成实体字符，以供后台存储
 * @param  {string} str 将要转换的字符串，其中含有utf16字符将被自动检出
 * @return {string}     转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符
 */
const utf16toEntities = function (str)
{
    var patt = '[\ud800-\udbff][\udc00-\udfff]'.normalize(); //检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
};

const HTMLDecode = function(str){//html decode
    if (str == null || str.length == 0) return "";
    var s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    /*s = s.replace(/&nbsp;/g, " ");*/
    s = s.replace(/&apos;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
};

const CStr = function (s) {
    if (s == null || s.length == 0) {
        return '';
    }
    return String(s).replace(/(^\s+)|(\s+$)/g,"");
}

export {

    HOST,

    API,

    get,

    post,

    utf16toEntities,

    HTMLDecode,

    CStr,
};

export default {

    //todo 测试接口 不再使用后删除

    recommend: 'http://api.meituan.com/group/v1/recommend/homepage/city/1?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=mrUZYo7999nH8WgTicdfzaGjaSQ=&__skno=51156DC4-B59A-4108-8812-AD05BF227A47&__skts=1434530933.303717&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&ci=1&client=iphone&limit=40&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-06-17-14-50363&offset=0&position=39.983497,116.318042&userId=10086&userid=10086&utm_campaign=AgroupBgroupD100Fab_chunceshishuju__a__a___b1junglehomepagecatesort__b__leftflow___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_gxh_82__nostrategy__leftflow___ab_pindaoshenyang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_trip_yidizhoubianyou__b__leftflow___ab_i_group_5_3_poidetaildeallist__a__b___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___ab_pind',

    discount: 'http://api.meituan.com/group/v1/deal/topic/discount/city/1?ci=1&client=iphone&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-06-17-14-50363&userid=10086&utm_campaign=AgroupBgroupD100Fab_chunceshishuju__a__a___b1junglehomepagecatesort__b__leftflow___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_gxh_82__nostrategy__leftflow___ab_pindaoshenyang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_trip_yidizhoubianyou__b__leftflow___ab_i_group_5_3_poidetaildeallist__a__b___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___ab_pindaoquxincelue__a__leftflow___ab_i_group_5_5_onsite__b__b___ab_i_group_5_6_searchkuang__a__leftflow&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7',
};