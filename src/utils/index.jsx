/* eslint-disable no-undef */
/**
 * Created by hzzhangzhang1 on 2018年4月
 */
const moment = require('moment');
// import moment from "moment";
module.exports = {
    isInteger: str => {
        return /^[1-9]\d*$/.test(str);
    },

    queryString: () => {
        let _queryString = {};
        const _query = window.location.search.substr(1);
        const _vars = _query.split('&');
        _vars.forEach((v, i) => {
            const _pair = v.split('=');
            if (!_queryString.hasOwnProperty(_pair[0])) {
                _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
            } else if (typeof _queryString[_pair[0]] === 'string') {
                const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
                _queryString[_pair[0]] = _arr;
            } else {
                _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
            }
        });
        return _queryString;
    },

    setCookie: (name, value, days) => {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    },

    getYearList: (num, lcount) => {
        let currentTime = new Date();
        let currentYear = currentTime.getFullYear() + 1 + lcount;
        let graduationYear = [];
        if (num > lcount) {
            for (let i = 0; i <= num; i++) {
                currentYear--;
                if (i == num) {
                    graduationYear.push({ id: i, value: currentYear + '及以前' });
                } else {
                    graduationYear.push({ id: currentYear, value: currentYear });
                }
            }
        } else {
            alert('!!!num > yearsLaterCount');
        }
        return graduationYear;
    },

    loadJsZip: function(cb, links, name, splitName) {
        cb && cb(links, name || '批量作品', splitName);
    },

    loadFiles: (loadList, zipName, splitName, cb) => {
        if (!Array.isArray(loadList)) return;

        var zip = new JSZip();
        var Promise = window.Promise;

        cb && cb('start');

        if (!Promise) {
            Promise = JSZip.external.Promise;
        }

        /**
         * Fetch the content and return the associated promise.
         * @param {String} url the url of the content to fetch.
         * @return {Promise} the promise containing the data.
         */
        function urlToPromise(url) {
            return new Promise(function(resolve, reject) {
                JSZipUtils.getBinaryContent(url, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }

        loadList.map((item, index) => {
            let decordUrl = decodeURI(item).replace(/(http|https):/, window.location.protocol);
            let lastIndex = decordUrl.lastIndexOf(splitName);

            if (lastIndex === -1) {
                return;
            }

            let fileName = decordUrl.substring(lastIndex + splitName.length);
            return zip.file('[' + index + ']--' + fileName, urlToPromise(decordUrl), { binary: true });
        });

        // when everything has been downloaded, we can trigger the dl
        zip.generateAsync({ type: 'blob' }).then(function callback(blob) {
            cb && cb('end');
            saveAs(blob, zipName || new Date().getTime() + '.zip');
        });
    },

    //获取url中的参数
    getParams: function(url) {
        url = url || window.location.href;
        let reg = /(\w+)=([^&]+)/g,
            params = {},
            result = [],
            index = url.indexOf('?');

        url = decodeURIComponent(url.slice(index + 1, url.length) || '');
        while ((result = reg.exec(url))) {
            params[result[1]] = result[2];
        }
        return params;
    },

    // 是否包含英文
    includeEn: function(str) {
        if (!str) return false;
        if (str.search(/[a-zA-Z]+/) > -1) return true;
        return false;
    },

    // 只包含英文和空格
    onlyEn: str => /^[a-zA-Z\s.]+$/.test(str),

    // 只包含中文,和空格
    onlyCn: function(str) {
        return /^[\u4e00-\u9fa5\s.]+$/.test(str);
    },

    // 只包含中文和英文
    includeEnAndCn: function(str) {
        return !/^[\u4e00-\u9fa5\s.]+$/.test(str) && !/^[A-Za-z\s.]+$/.test(str) && !/[^a-zA-z\s\u4e00-\u9fa5.]+/.test(str);
    },

    includeOtherVarchar: function(str) {
        return /[^a-zA-z\s\u4e00-\u9fa5.]+/.test(str);
    },

    // 身份证校验
    isIdNumber: str => /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/.test(str),

    // 只允许输入英文字母、数字、空格、中文（=@#）
    canInput: str => {
        return str.replace(/[^\w=@#^\u4E00-\u9FA5 ]/gi, '');
    },

    // 去除一头一尾
    empty: str => str.replace(/^\s+|\s+$/g, ''),

    //去除所有空格
    emptyAll: str => str.replace(/\s/g, ''),

    /**
     * 解析数组 或者字符串
     * '1' => 1
     * ['1'] => [1]
     */
    parseStr2Num: function(str) {
        const type = Object.prototype.toString.call(str);
        if (type === '[object String]') return +str;
        if (type === '[object Array]') return str.map(item => +item);
        return str;
    },
    parseNum2str: function(num) {
        const type = Object.prototype.toString.call(num);
        if (type === '[object Number]') return num.toString();
        if (type === '[object Array]') return num.map(item => item.toString());
        return num;
    },
    array2map: function(list, key, prefix) {
        var result = {},
            i,
            l,
            p;
        for (i = 0, l = list.length; i < l; i++) {
            item = list[i];
            p = prefix + list[i][key];
            result[p] = list[i];
        }
        return result;
    },

    // 判断是否是手机号
    mobile: mobile => /^(1)\d{10}$/.test(mobile),

    // 判断是否是email
    email: email => email.includes('@'),

    // 中国身份证号判断
    idNumber: function(str) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(str);
    },

    //外国身份证号判断
    foreignIdNumber: function(str) {
        return str.length < 18 ? true : false;
    },

    //判断target是否在obj内
    contains: function(obj, target) {
        if (obj == null) return false;
        for (var i = 0, l = obj.length; i < l; i++) {
            if (obj[i] === target) {
                return true;
            }
        }
        return false;
    },
    //判断data是否为type类型
    isTypeOf: function(_data, _type) {
        try {
            _type = _type.toLowerCase();
            if (_data === null) return _type == 'null';
            if (_data === undefined) return _type == 'undefined';
            return Object.prototype.toString.call(_data).toLowerCase() == '[object ' + _type + ']';
        } catch (e) {
            return !1;
        }
    },
    uniqueArr: function(data) {
        data = data || [];
        var a = {};
        for (var i = 0; i < data.length; i++) {
            var v = data[i];
            if (typeof a[v] === 'undefined') {
                a[v] = 1;
            }
        }
        data.length = 0;
        for (var j in a) {
            data[data.length] = j;
        }
        return data;
    },
    spliceArray: function(arr1, arr2, key) {
        var type = Object.prototype.toString.call(arr1[0]);
        var tempArr = JSON.parse(JSON.stringify(arr1));
        if (type === '[object Object]') {
            for (var i = 0, len2 = arr2.length; i < len2; i++)
                for (var j = 0, len1 = arr1.length; j < len1; j++) {
                    // console.log(arr2[i][key]+','+arr1[j][key]);
                    if (arr2[i][key] == arr1[j][key]) tempArr.splice(j, 1);
                }
            return tempArr;
        } else {
            for (var len = arr2.length; len--; ) tempArr.splice(arr1.indexOf(arr2[len]), 1);
            return tempArr;
        }
    },
    multiline: function(func) {
        var reg = /^function\s*\(\)\s*\{\s*\/\*+\s*([\s\S]*)\s*\*+\/\s*\}$/;
        return reg.exec(func)[1];
    },
    hasClass: function(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    addClass: function(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += ' ' + cls;
    },
    //验证是否为空对象
    isEmptyObject: function(obj) {
        for (var item in obj) {
            return false;
        }
        return true;
    },

    // 全屏展示
    launchFullscreen: function(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullScreen();
        }
    },

    // 退出全屏
    exitFullscreen: function() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    },

    // 校验是否有全屏状态节点
    hasFullElement: function() {
        var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
        if (isFull === undefined) isFull = false;
        return isFull;
    },

    // 获取全屏状态节点
    getFullElement: function() {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        return fullscreenElement;
    },

    //数组转化为对象--第一个数组为key，第二个为value eg 如[1,2,5]和[18,8,6]转换成对象{1:18,2:8,5:6}。
    toObject: function(list, values) {
        var result = {};
        for (var i = 0; i < list.length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    },

    // 将数字每千分位逗号隔开 12345--》12,345
    toThousands: function(num) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },

    // 数组求和
    sum: function(arr) {
        var len = arr.length;
        if (len == 0) {
            return 0;
        } else if (len == 1) {
            return arr[0];
        } else {
            return arr[0] + this.sum(arr.slice(1));
        }
    },

    traverse: function(obj, target, result) {
        var tempTree = obj.tree;
        if (tempTree.frontLink === target) {
            if (tempTree.sub) {
                result.push({
                    id: tempTree.id,
                    frontLink: target,
                    sub: tempTree.sub
                });
            } else {
                result.push({
                    id: tempTree.id,
                    frontLink: target
                });
            }
        }
        if (tempTree.sub) {
            for (var i = 0; i < tempTree.sub.length; i++) {
                obj.tree = tempTree.sub[i];
                obj.isRoot = false;
                this.traverse(obj, target, result);
            }
        }
    },

    getAuthMenu: function(data, target) {
        var self = this;
        var result = [];
        data.forEach((tree, index) => {
            self.traverse(
                {
                    tree: tree
                },
                target,
                result
            );
        });
        return result;
        // console.log(JSON.stringify(result));
    },

    // 判断对象中是否含有null值 true-否
    isObjHasNull: obj => {
        let flag = true;
        for (const i in obj) {
            if (obj[i] == 'null' || obj[i] == 'undefined') {
                flag = false;
            }
        }
        return flag;
    },
    /*
     *向上取整
     *ceil(401, 100) => 500
     */
    ceil: function(data, count = 1) {
        return Math.ceil(data / count) * count;
    },
    ua: function() {
        // åˆ¤æ–­æ˜¯å¦æ˜¯ chrome
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        if (window.ActiveXObject) Sys.ie = ua.match(/msie ([\d.]+)/)[1];
        else if (document.getBoxObjectFor) Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1];
        else if (window.MessageEvent && !document.getBoxObjectFor) Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1];
        else if (window.opera) Sys.opera = ua.match(/opera.([\d.]+)/)[1];
        else if (window.openDatabase) Sys.safari = ua.match(/version\/([\d.]+)/)[1];

        return Sys;
    },

    format: time => {
        if (!time) return '--';
        var day = +(time / (60 * 60 * 24));
        var hour = +((time / (60 * 60)) % 24);
        var min = +((time / 60) % 60);
        return day > 0 ? day + '天' + hour + '小时' + min + '分钟' : hour + '小时' + min + '分钟';
    },
    getWorkYears: (start, end, mess = '工作经验') => {
        // 获取工作经验，或一段工作时长
        if (start === null) return `无${mess}`;

        let totalYears = end ? moment(end).diff(moment(start), 'months') : moment().diff(moment(start), 'months'), // 距今总月数
            years = Math.floor(totalYears / 12), // 距今年数
            months = totalYears % 12;

        if (years >= 10) return `十年以上`;

        return (years ? `${years}年` : '') + `${months ? months + `个月` : ''}`;
    },

    /**
     * 深拷贝
     */
    deepClone: source => {
        if (!source || typeof source !== 'object') {
            throw new Error('error arguments', 'shallowClone');
        }
        var targetObj = source.constructor === Array ? [] : {};
        for (var keys in source) {
            if (source.hasOwnProperty(keys)) {
                if (source[keys] && typeof source[keys] === 'object') {
                    targetObj[keys] = source[keys].constructor === Array ? [] : {};
                    targetObj[keys] = deepClone(source[keys]);
                } else {
                    targetObj[keys] = source[keys];
                }
            }
        }
        return targetObj;
    }
};
