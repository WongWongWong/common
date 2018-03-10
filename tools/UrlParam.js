/**
 * 本模块用于解析Url参数
 *
 * author : rex
 * date : 2017/12/23
 */

function UrlParam() {
    var str = location.href;

    var n = str.indexOf("?");
    if (n < 0) {
        return;
    }

    str = str.substr(str.indexOf("?")+1);
    var arr = str.split("&");
    for (var i in arr) { 
        var n = arr[i].indexOf("="); 
        if (n >= 0) { 
            var name = arr[i].substring(0, n);
            var value = arr[i].substr(n + 1);
            this[name] = value;
        } 
    } 
}
