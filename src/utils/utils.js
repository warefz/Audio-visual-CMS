export default {
    getQueryStrings() {
        var query_string = {};
        var query = window.location.href.split("?")[1];
        if (query) {
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
        }
        return query_string;
    },
    setTitle(title) {
        document.title = title;
        // hack在微信等webview中无法修改document.title的情况
        let iframe = document.createElement('iframe');
        iframe.src = 'http://www.baidu.com/favicon.ico';
        iframe.onload = function () {
            setTimeout(function () {
                document.body.removeChild(iframe);
            }, 0);
        };
        document.body.appendChild(iframe);
    },
    formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
        var o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        var week = {
            '0': '/u65e5',
            '1': '/u4e00',
            '2': '/u4e8c',
            '3': '/u4e09',
            '4': '/u56db',
            '5': '/u4e94',
            '6': '/u516d'
        }
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + ''])
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    },
    isObjectHasKeywords(obj, keywords) {// 递归匹配obj 所有property 是否包含keywords
        var has = false;
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                var property = obj[k];
                if (typeof property == "object") {
                    has = isObjectHasKeywords(property, keywords)
                } else {
                    if (typeof property == 'number') {
                        property += ''
                    }
                    if (property.indexOf && property.toUpperCase().indexOf(keywords.toUpperCase()) !== -1) {
                        has = true;
                    }
                }
                if (has) {
                    break;
                }
            }
        }
        return has;
    },
    compressImage(source_img_obj, quality, output_format) {
        var mime_type = "image/jpeg";
        if (typeof output_format !== "undefined" && output_format == "png") {
            mime_type = "image/png";
        }

        var cvs = document.createElement('canvas');
        cvs.width = source_img_obj.naturalWidth;
        cvs.height = source_img_obj.naturalHeight;
        var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
        var newImageData = cvs.toDataURL(mime_type, quality / 100);
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
        return result_image_obj;
    },
    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type: mimeString});
    },
    getFileSize(file, vm) {
        let reader = new FileReader();
        let image = {};
        reader.onload = function (e) {
            let data = e.target.result;
            console.log(data)
            let image = new Image();
            image.onload = function () {
                vm.image.width = image.naturalWidth;
                vm.image.height = image.naturalHeight;
            }
            image.src = data;
        };
        reader.readAsDataURL(file);
        return image;
    },

    copy2clipboard(msg, vm) {
        try {
            var clipboard = new ClipboardJS('.btn');
            vm.$message.success(msg)
            clipboard.destroy();
        } catch (e) {
            vm.$message.error('复制失败')
        }
    },

    copy2clipboard2(txt,msg,vm) {
    if(window.clipboardData)
    {
        window.clipboardData.clearData();
        window.clipboardData.setData("Text",txt);
        vm.$message.success(msg)
    }
    else if(navigator.userAgent.indexOf("Opera") !== -1)
    {
        window.location = txt;
        vm.$message.success(msg)
    }
    else if (window.netscape)
    {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        }
        catch (e)
        {
            alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) return;
        trans.addDataFlavor('text/unicode');
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = txt;
        str.data = copytext;
        trans.setTransferData("text/unicode",str,copytext.length*2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) return false;
        clip.setData(trans,null,clipid.kGlobalClipboard);
        vm.$message.success(msg)
    }
}
}
