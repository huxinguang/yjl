/**
 * Created by Administrator on 2017/7/18.
 */
const map = {
    'arrow_right': '58949',
    'phone': '58941',
    'password': '58938',
    'hidden_password': '58940',
    'show_password': '58942',
    'clear': '58939',
    'wywx': '58936',
    'shjf': '58933',
    'ycfw': '58963',
    'kdcx': '58893',
    'lxwy': '58946',
    'pinche': '58916',
    'yhq': '58892',
    'bmdh': '58972',
    'icon_home': '58928',
    'icon_property': '58927',
    'icon_life': '58926',
    'icon_neighbor': '58925',
    'icon_mine': '58924',
    'star_full': '58894',
    'star_empty': '58895',
    'icon_add': '58896',
    'icon_search': '58905',
    'icon_chatbubble': '58891',

    /*添加web版本的资源图片*/
    'gps': '58903',
    'iconTyRight': '58900',
    'icontycheckmarkoutline': '58912',
    'icontycircleoutline': '58913',
    /*生活缴费页面中 临时的图片*/
    'iconWuYe': '58903',
    'iconElectric': '58906',
    'iconWater': '58909',
    'iconSuccess': '58912',
    'iconStarNormal': '58895',
    'iconStarSelected':'58894',
    'iconTime':'58910'


};
module.exports = (name) => String.fromCharCode(map[name]);