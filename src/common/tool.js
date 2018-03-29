export function urlByAppendingParams(url: string, params: Object) {
    let result = url;
    if (result.substr(result.length - 1) != '?') {
        result = result + `?`;
    }

    for (let key in params) {
        let value = params[key];
        result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }

    result = result.substring(0, result.length - 1);
    return result;
}

//将字符串中的emoji表情转换成可插入数据库的格式
export function filterEmoji(content: string) {
    var ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
    var emojireg = content.replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
}

//去除字符串中所有的空格
export function trimAllSpace(content: string) {
    return content.replace(/\s|\xA0/g,"");
}




