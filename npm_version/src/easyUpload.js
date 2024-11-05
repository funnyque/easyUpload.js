/**
 * @description: 基于file input及原生js的文件上传插件，仅支持ie9及以上
 * @version: V4.0.0
 * @author: funnyque@163.com
 * @Github: https://github.com/funnyque/easyUpload.js
 */
; (function (mod, doc) {
    // 插件默认配置
    var oConf = {
        accept: '.jpg,.png,.pdf,.doc,.docx', // 允许导入文件类型
        btnS: '导入文件', // 导入文件按钮展示文字
        btnU: '上传', // 上传文件按钮展示文字
        btnD: '删除', // 删除文件按钮展示文字
        btnC: '终止', // 终止上传按钮展示文字
        maxCount: 3, // 允许单次导入文件数量
        naxSize: 3, // 允许单个文件最大体积，单位M
        multiple: true, // 是否允许一次导入多个文件
        responseType: 'text', // 设置XMLHttpRequest响应数据格式
        timeout: 0, // 设置XMLHttpRequest求超时时间
        url: '', // 文件上传地址
        withCredentials: true, // 设置跨域请求是否提供凭据信息,
        readAs: 'DataURL' // 默认设置读取及长传文件为DataURL即base64格式。未定义setData方法情况下，以此字段定义数据格式上传
    };
    function EasyUpload(id, obj) {
        this.eNode = doc.querySelector(id);
        if (!this.eNode) { alert('插件初始化id错误'); return }
        var _this = this; _this.files = {}; _this.xhrs = {}; _this.id = 0;
        this.conf = assign(obj);
        build.call(_this);
        this.fNode = this.eNode.querySelector('.file-inpt');
        this.lNode = this.eNode.querySelector('.file-list');
        this.eNode.onclick = function (e) {
            var tag = e.target;
            if (tag.className.indexOf('select') !== -1) {
                _this.fNode.click();
            } else if (tag.className.indexOf('upload') !== -1) {
                upload.call(_this);
            } else if (tag.className.indexOf('delete') !== -1) {
                delet.call(_this, 0, tag);
            } else if (tag.className.indexOf('cancel') !== -1) {
                cancel.call(_this);
            } else if (tag.className.indexOf('checall') !== -1) {
                check.call(_this, 0, tag);
            } else if (tag.className.indexOf('checone') !== -1) {
                check.call(_this, 1, tag); // 默认全选，第二个参数有真值时选一个
            } else if (tag.className.indexOf('deleone') !== -1) {
                delet.call(_this, 1, tag); // 默认删除选中，第二个参数有真值时删除一个
            }
        }
    }
    mod.EasyUpload = EasyUpload;
    function build() {
        var arr = [
            '<div class="easy-upload">',
            '   <div class="btns">',
            '       <input type="file" name="file" class="file-inpt" accept="' + this.conf.accept + '"' + (this.conf.multiple ? ' multiple ' : '') + ' style="display: none;">',
            '       <input type="button" value="' + this.conf.btnS + '" class="select pointer">',
            '       <input type="button" value="' + this.conf.btnU + '" class="upload no-border radius pointer white bg-blue">',
            '       <input type="button" value="' + this.conf.btnD + '" class="delete no-border radius pointer white bg-red">',
            '       <input type="button" value="' + this.conf.btnC + '" class="cancel no-border radius pointer white bg-red">',
            '       <input type="checkbox" class="checall pointer">',
            '       <i class="msg new">未导入文件</i>',
            '   </div>',
            '   <ul class="file-list">',
            '   </ul>',
            '</div>'
        ];
        this.eNode.innerHTML = arr.join('');
        // 同步处理异步dom更新
        setTimer.call(this, function (_this) {
            _this.fNode.onchange = function () {
                packFiles.call(_this, this.files);
                render.call(_this);
                checkAll.call(_this);
            }
        });
    }
    function render() {
        var arrs = [];
        for (var i in this.files) {
            if (this.files[i] !== null) {
                var arr = [
                    '<li class="file-li over-hidden radius">',
                    '   <div class="info">',
                    '       <p class="over-hidden ' + matchColor(this.files[i].status) + '">',
                    '           <span class="name-size">',
                    '               <i class="f-size white radius ' + matchColor(this.files[i].status, 1) + '">' + this.files[i].size + '</i>',
                    '               <i class="f-name">' + this.files[i].name + '</i>',
                    '           </span>',
                    '           <span class="tips">',
                    '               <i class="status">' + matchText(this.files[i].status) + '</i>',
                    '               <i class="percent">' + this.files[i].percent + '</i>',
                    '           </span>',
                    '       </p>',
                    '       <div class="wrap over-hidden radius">',
                    '           <div class="progress ' + matchColor(this.files[i].status, 1) + '" style="width:' + this.files[i].percent + ';"></div>',
                    '       </div>',
                    '   </div>',
                    '   <div class="pic-box">',
                    '       <i class="pic no-selec' + (/data:image\//.test(this.files[i].data) ? '" style="background-image: url(' + this.files[i].data + ');"' : ' icon"') + '></i>',
                    '   </div>',
                    '   <div class="li-btns over-hidden">',
                    '       <input type="checkbox" ' + (this.files[i].checked ? 'checked' : '') + ' data-id="' + i + '" class="checone pointer">',
                    '       <i data-id="' + i + '" class="deleone no-selec pointer white"></i>',
                    '   </div>',
                    '</li>'
                ];
                arrs.push(arr.join(''));
            }
        }
        this.lNode.innerHTML = arrs.join('');
    }
    function setTimer(cb) {
        var _this = this,
            t = null;
        t = setTimeout(function () {
            cb(_this);
            clearTimeout(t);
        }, 0);
    }
    function packFiles(ofs) {
        var _this = this,
            fs = [], //保存maxCount以内file
            frs = {}; // 保存FileReader对象
        if (ofs.length > this.conf.maxCount) {
            // 触发onMax事件
            this.onMax && this.onMax.call(_this, {
                in: ofs.length,
                max: this.conf.maxCount
            });
            for (var i = 0; i < this.conf.maxCount; i++) { fs.push(ofs[i]) }
        } else {
            fs = ofs;
        }
        for (var i = 0; i < fs.length; i++) {
            frs[i] = new FileReader();
            // 将数据保存到FileReader对象上
            frs[i].i = i;
            frs[i].o = {
                id: this.id,
                name: fs[i].name,
                type: fs[i].type,
                size: sizeConvert(fs[i].size),
                checked: false,
                percent: '0%',
                status: statusConvert.call(this, fs[i].size),
                source: fs[i],
                data: ''
            }
            frs[i].id = this.id;
            this.id++;
            frs[i].onload = function (e) {
                this.o.data = e.target.result;
                _this.files[this.id] = this.o;
                render.call(_this);
                checkAll.call(_this);
                if (this.i == fs.length - 1) {
                    frs = null; // 销毁FileReader对象集合
                    _this.fNode.value = '';
                }
            }
            var ra = this.conf.readAs;
            frs[i]['readAs' + ra] ? frs[i]['readAs' + ra](fs[i]) : frs[i].readAsDataURL(fs[i]);
        }
    }
    function upload() {
        var _this = this,
            arr = [];
        this.xhrs.on = 0; // 开始上传xhr对象为0个
        this.xhrs.done = 0; // 已上传完xhr对象为0个
        for (var i in this.files) {
            if (this.files[i] !== null && this.files[i].checked && this.files[i].status !== '-2') {
                this.xhrs[i] = new XMLHttpRequest();
                this.xhrs[i].id = this.files[i].id // 保存当前上传文件id 到xhr对象上
                this.xhrs[i].open('post', this.conf.url);
                this.xhrs[i].timeout = this.conf.timeout;
                this.xhrs[i].responseType = this.conf.responseType; //响应返回的数据格式 'json',ie10不支持
                this.xhrs[i].withCredentials = this.conf.withCredentials;
                _this.setHeader && _this.setHeader.call(_this, this.xhrs[i]);
                this.xhrs[i].send(this.setData ? this.setData.call(this, this.files[i]) : this.files[i].data);
                this.xhrs.on++;
                this.files[i].status = '1';
                this.files[i].percent = '0%';
                render.call(this);
                this.xhrs[i].onprogress = function (e) {
                    if (e.lengthComputable) {
                        var p = (e.loaded / e.total) * 100 + '%';
                        _this.files[this.id].status = '1';
                        _this.files[this.id].percent = p;
                        render.call(_this);
                        _this.onProgress && _this.onProgress.call(_this, p);
                    }
                };
                this.xhrs[i].onload = function () {
                    _this.xhrs.done++;
                    var flag = _this.setFlag && _this.setFlag.call(_this, this);
                    if (flag == undefined ? (this.status >= 200 && this.status < 300) : flag) {
                        _this.files[this.id].status = '2';
                    } else {
                        _this.files[this.id].status = '-1';
                    }
                    render.call(_this);
                    _this.onLoad && _this.onLoad.call(_this, this);
                    if (_this.xhrs.on == _this.xhrs.done) {
                        showMsg.call(_this, '上传结束');
                        _this.onEnd && _this.onEnd.call(_this, this);
                        _this.xhrs = {};
                    }
                };
                this.xhrs[i].onerror = function () {
                    _this.xhrs.done++;
                    _this.files[this.id].status = '-1';
                    render.call(_this);
                    if (_this.xhrs.on == _this.xhrs.done + 1) {
                        showMsg.call(_this, '上传结束');
                        _this.onEnd && _this.onEnd.call(_this, this);
                        _this.xhrs = {};
                    } else {
                        _this.onError && _this.onError.call(_this, this);
                    }
                };
            }
        }
    }
    function delet(flag, tag) {
        if (flag) {
            var id = tag.getAttribute('data-id');
            this.files[id] = null;
        } else {
            for (var i in this.files) {
                if (this.files[i] !== null && this.files[i]['checked']) this.files[i] = null;
            }
        }
        render.call(this);
        checkAll.call(this);
    }
    function cancel() {
        var _this = this;
        for (var i in this.xhrs) {
            if (this.xhrs[i]) {
                this.xhrs[i].onabort = function () {
                    showMsg.call(_this, '成功终止');
                };
                this.xhrs[i].abort();
            }
        }
    }
    function check(flag, tag) {
        if (flag) {
            checkAll.call(this, tag);
        } else {
            for (var i in this.files) {
                if (this.files[i] !== null) this.files[i]['checked'] = tag.checked;
            }
            var cks = this.eNode.querySelectorAll('.checone');
            for (var j = 0; j < cks.length; j++) {
                cks[j]['checked'] = tag.checked;
            }
            showMsg.call(this, tag.checked ? '已选中' : '未选中')
        }

    }
    function checkAll(tag) {
        var hasOne = false, // 默认1个都未选
            isAll = true, // 默认选中了所有
            allTag = this.eNode.querySelector('.checall');
        if (tag) { // 选中1个
            var id = tag.getAttribute('data-id');
            this.files[id]['checked'] = tag.checked;
        }
        for (var i in this.files) {
            if (this.files[i] !== null) {
                if (this.files[i]['checked']) {
                    hasOne = true;
                } else {
                    isAll = false;
                }
            }
        }
        allTag.checked = isAll;
        showMsg.call(this, hasOne ? '已选中' : '未选中');
    }
    function matchColor(s, t) {
        t ? t = 'bg-' : t = '';
        switch (s) {
            case '-2':
                return t + 'yellow';
            case '-1':
                return t + 'red';
            case '0':
                return t + 'blue';
            case '1': case '2':
                return t + 'green';
        }
    }
    function matchText(s) {
        switch (s) {
            case '-2':
                return '文件过大';
            case '-1':
                return '上传失败';
            case '0':
                return '允许上传'
            case '1':
                return '正在上传';
            case '2':
                return '上传成功';
        }
    }
    function showMsg(m) {
        var n = this.eNode.querySelector('.msg').innerText = m || '操作成功';
    }
    /** 以下为工具函数 */
    function assign(s) {
        if (s !== null && typeof s === 'object') {
            for (var k in s) oConf[k] == undefined ? '' : oConf[k] = s[k];
        }
        return oConf;
    }
    function sizeConvert(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
    }
    function statusConvert(bytes) {
        var fSize = (bytes / Math.pow(1024, 2)).toFixed(2);
        if (this.conf.naxSize >= fSize) {
            return '0';
        } else {
            return '-2';
        }
    }
}(module, document))