/**
 * @author https://github.com/funnyque/easyUpload.js; WeChat:qqyun686
 * @version V3.0.1
 * @description 一款简单易用的H5/Web文件上传插件，支持样式自定义，支持数据可配置，支持多实例上传...
 */
;(function (window, document) {
    var defaultConfigs = {
        easyId: '', //插件插入节点的Id，String类型
        accept: '.jpg,.png,.pdf', //允许文件类型后缀名，逗号分隔，String类型
        action: '', //上传文件地址，String类型
        btnText: {  //按钮展示文字
            select: '选择文件',
            upload: '上传',
            delete: '删除',
            cancel: '终止'
        },
        maxCount: 3, //插件单次添加文件的最大数量，Number类型
        maxSize: 3, //允许上传文件的最大体积，单位M，Number类型
        multiple: true, //是否开启多文件上传，Boolean类型
        messageTime: 2000, //messageBox消息提示毫秒数，Number类型
        responseType: 'text', //xhr的responseType格式，String类型
        showSize: true, //是否展示文件体积，Boolean类型
        showLoading: false, //是否展示上传loading动画，Boolean类型
        statusText: {  //不同状态展示的提示文字，key为对应文件状态(不可修改)，value为展示文字
            0: '允许上传', //文件大小验证合格后的初始状态
            1: '即将上传', //等待上传队列执行到自己时的状态
            2: '0%',      //上传时刚发出xhr还没响应时的状态
            3: '上传成功',  //xhr响应&上传成功时的状态
            4: '上传失败',  //xhr响应&上传失败时的状态
            5: '体积超出',  //检测文件大小超出限定值时的状态
        },
        statusTextColor: {  //不同状态'提示文字'标签的className，key为对应文件状态(不可修改)，value为标签的className
            0: 'normalcolor',  //正常状态字体色的className
            1: 'normalcolor',  //正常状态字体色的className
            2: 'normalcolor',  //正常状态字体色的className
            3: 'normalcolor',  //正常状态字体色的className
            4: 'failedcolor',  //失败状态字体色的className
            5: 'warncolor',    //警告状态字体色的className
        },
        statusBg: {  //不同状态对应标签的className，key为对应文件状态(不可修改)，value为标签的className
            0: 'normalbg',  //正常状态背景色的className
            1: 'normalbg',  //正常状态背景色的className
            2: 'normalbg',  //正常状态背景色的className
            3: 'normalbg',  //正常状态背景色的className
            4: 'failedbg',  //失败状态背景色的className
            5: 'warnbg',    //警告状态背景色的className
        },
        timeout: 0, //请求超时毫秒数，0表示永久，Number类型
        withCredentials: true, //是否允许请求头自带cookie等证书，Boolean类型
        setRequestHeader: null, //配置xhr请求头的方法
        buildSendData: null, //配置xhr发送数据格式的方法，返回data
        checkSuccessCode: null, //检查成功状态码的方法，返回布尔值，默认返回true
        uploadStart: null, //每个文件队列上传前的回调函数，传入参数'self'是当前easyUpload实例，可通过self.files查看队列文件
        uploadEnd: null //每个文件队列上传完成后的回调函数，传入参数'self'是当前easyUpload实例，可通过self.files查看队列文件
    };
    function EasyUpload(configs) {
        var self = this instanceof EasyUpload ? this : Object.create(EasyUpload.prototype);
        self.configs = Object.assign({}, defaultConfigs, configs);
        self.files = [];
        self.fileId = 0;
        self.xhrFiles = [],
        self.isXhrReady = true,
        self.xhr = new XMLHttpRequest();
        render(self);
        return self;
    }
    EasyUpload.prototype = { constouctor: EasyUpload }; //重新指定constouctor
    function render(self) {
        var easyTemplate = 
            '<span class="message-box">我是message</span>' +
            (self.configs.showLoading ?
            '<div class="loading">' +
                '<div class="loading-icon"></div>' +
                '<div class="loading-mask"></div>' +
            '</div>' : '') +
            '<input type="file" name="file" class="input-file"'+ (self.configs.multiple ? 'multiple': '') +' accept="'+ self.configs.accept +'">' +
            '<div class="btn-list">' +
                '<div btntype="select" class="btn btn-list-item btnlist-item-selsct">'+ self.configs.btnText.select +'</div>' +
                '<div btntype="upload" class="btn btn-list-item btnlist-item-upload">'+ self.configs.btnText.upload +'</div>' +
                '<div btntype="delete" class="btn btn-list-item btnlist-item-danger">'+ self.configs.btnText.delete +'</div>' +
                '<div btntype="cancel" class="btn btn-list-item btnlist-item-danger">'+ self.configs.btnText.cancel +'</div>' +
                '<div btntype="checkall" class="btn btn-list-item checkbox unchecked">✓</div>' +
            '</div>' +
            '<ul class="file-list">' +
            '</ul>';
        document.getElementById(self.configs.easyId).innerHTML = easyTemplate;
        bindBtnList(self);
        bindInputFile(self);
    }
    function renderList(self) {
        var listTemplate = '';
        for (var i = 0; i < self.files.length; i++) {
            listTemplate +=
                '<li class="file-list-item" fileid="' + self.files[i].id + '">' +
                '<div class="preview">' +
                (/image\//.test(self.files[i].type) ? '<img class="preview-img"' + ' src="' + self.files[i].base64 + '" alt="' + self.files[i].name + '">' : '<div class="preview-div"></div>') +
                '</div>' +
                '<div class="btn-file">' +
                '<div btntype="delone" class="btn btn-file-del" fileid="' + self.files[i].id + '">' +
                '<span btntype="delone" class="btn-file-del-text" fileid="' + self.files[i].id + '">X</span>' +
                '</div>' +
                '<div btntype="checkone" class="btn btn-file-checkbox checkbox ' + (self.files[i].isChecked ? 'checked' : 'unchecked') + '" fileid="' + self.files[i].id + '">✓</div>' +
                '</div>' +
                '<div class="fileinfo">' +
                '<p class="fileinfo-text">' +
                '<span class="fileinfo-text-name">' + (self.configs.showSize ? '<i class="fileinfo-text-size ' + matchFileSizeBg(self, self.files[i]) + '">' + bytesToSize(self.files[i].size) + '</i>' : '') + self.files[i].name + '</span>' +
                '<span class="fileinfo-text-status ' + self.configs.statusTextColor[self.files[i].status] + '" fileid="' + self.files[i].id + '">' + self.configs.statusText[self.files[i].status] + '</span>' +
                '</p>' +
                '<div class="fileinfo-progress">' +
                '<div class="fileinfo-progress-bar ' + self.configs.statusBg[self.files[i].status] + '" style="width:' + self.files[i].progress + ';" fileid="' + self.files[i].id + '"></div>' +
                '</div>' +
                '</div>' +
                '</li>';
        }
        document.getElementById(self.configs.easyId).querySelector('.file-list').innerHTML = listTemplate;
        bindFileList(self);
    }
    function bindBtnList(self) {
        var easyUpload = document.getElementById(self.configs.easyId);
        easyUpload.querySelector('.btn-list').onclick = function (evt) {
            var evt = evt || window.event,
                target = evt.target || evt.srcElement,
                btntype = target.getAttribute('btntype');
            switch (btntype) {
                case 'select':
                    selectFiles(self);
                    break;
                case 'upload':
                    uploadFiles(self);
                    break;
                case 'delete':
                    delFiles(self);
                    checkAll(self, 'delete');
                    renderList(self);
                    break;
                case 'cancel':
                    cancelUpload(self);
                    break;
                case 'checkall':
                    checkAll(self, 'click');
                    checkList(self);
                    break;
            }
        }
    }
    function bindInputFile(self) {
        var inputFile = document.getElementById(self.configs.easyId).querySelector('.input-file');
        inputFile.addEventListener('change', function () {
            var i = 0,
                _this = this;
            function pushFile(obj) {
                if (self.files.length < self.configs.maxCount) {
                    self.files.push(obj);
                    self.fileId++;
                } else {
                    showMessage(self, {
                        text: '文件数量超出',
                        class_name: self.configs.statusBg[5]
                    })
                }
            }
            function buildFile() {
                if (i < _this.files.length) {
                    var obj = {
                        id: self.fileId,
                        name: _this.files[i].name,
                        size: _this.files[i].size,
                        type: _this.files[i].type,
                        isChecked: false,
                        status: 0,
                        progress: '0%',
                        file: _this.files[i]
                    };
                    if (/image\//.test(_this.files[i].type)) {
                        readImg(_this.files[i], function (base64) {
                            obj.base64 = base64;
                            pushFile(obj);
                            i++;
                            buildFile();
                        });
                    } else {
                        pushFile(obj);
                        i++;
                        buildFile();
                    }
                } else {
                    checkAll(self);
                    renderList(self);
                    _this.value = [];
                }
            }
            buildFile();
        });
    }
    function bindFileList(self) {
        var easyUpload = document.getElementById(self.configs.easyId);
        easyUpload.querySelector('.file-list').onclick = function (evt) {
            var evt = evt || window.event,
                target = evt.target || evt.srcElement,
                fileId = target.getAttribute('fileid'),
                btntype = target.getAttribute('btntype');
            switch (btntype) {
                case 'checkone':
                    checkFileById(self, fileId);
                    checkAll(self);
                    checkList(self, fileId);
                    break;
                case 'delone':
                    delFiles(self, fileId);
                    checkAll(self);
                    renderList(self);
                    break;
            }
        }
    }
    function selectFiles(self) {
        document.getElementById(self.configs.easyId).querySelector('.input-file').click();
    }
    function delFiles(self, fileId) {
        if (self.files.length && !getCheckedCount(self) && fileId==undefined) {
            showMessage(self, {
                text: '未选中文件',
                class_name: self.configs.statusBg[5]
            })
            return;
        }
        var newFiles = [];
        for (var i = 0; i < self.files.length; i++) {
            if (fileId && self.files[i].id != fileId) newFiles.push(self.files[i]);
            if (!fileId && !self.files[i].isChecked) newFiles.push(self.files[i]);
        }
        self.files = newFiles;
    }
    function cancelUpload(self) {
        self.xhr.onabort = function () {
            showMessage(self, {
                text: '成功取消上传',
                class_name: self.configs.statusBg[3]
            })
        }
        self.xhr.abort();
    }
    function checkAll(self, evtType) {
        var allBox = document.getElementById(self.configs.easyId).querySelector('.btn-list').querySelector('.checkbox');
        if (!self.files.length) {
            if (evtType == 'delete') return;
            if (/\sunchecked$/.test(allBox.className)) {
                setCheckBox(allBox, true);
                return;
            }
            if (/\schecked$/.test(allBox.className)) {
                setCheckBox(allBox, false);
                return;
            }
        } else {
            var isAllChecked = getCheckedCount(self) == self.files.length;
            if (evtType == 'click') {
                setCheckBox(allBox, !isAllChecked);
                setCheckedFile(self, (isAllChecked ? false : true));
            } else {
                setCheckBox(allBox, isAllChecked);
            }
        }
    }
    function checkList(self, fileId) {
        var easyUpload = document.getElementById(self.configs.easyId);
        if (fileId) {
            var file = getFileById(self, fileId),
                checkbox = easyUpload.querySelector('[fileid="' + fileId + '"]').querySelector('.checkbox');
            setCheckBox(checkbox, file.isChecked);
        } else {
            var isChecked = getCheckedCount(self) == self.files.length,
                fileList = easyUpload.querySelectorAll('.file-list-item');
            for (var i = 0; i < fileList.length; i++) {
                setCheckBox(fileList[i].querySelector('.checkbox'), isChecked);
            }
        }
    }
    function matchFileSizeBg(self, file) {
        var fileSize = (file.size / Math.pow(1024, 2)).toFixed(2);
        if (self.configs.maxSize > fileSize) {
            return self.configs.statusBg[0];
        } else {
            file.status = 5;
            return self.configs.statusBg[5];
        }
    }
    function getCheckedCount(self) {
        var count = 0;
        for (var i = 0; i < self.files.length; i++) {
            if (self.files[i].isChecked) count++;
        }
        return count;
    }
    function getFileById(self, id) {
        for (var i = 0; i < self.files.length; i++) {
            if (self.files[i].id == id) return self.files[i];
        }
    }
    function checkFileById(self, fileId) {
        for (var i = 0; i < self.files.length; i++) {
            if (self.files[i].id == fileId) {
                self.files[i].isChecked = !self.files[i].isChecked;
            }
        }
    }
    function bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
    function setStatus(self) {
        var fileList = document.getElementById(self.configs.easyId).querySelectorAll('.file-list-item');
        for (var i = 0; i < fileList.length; i++) {
            var id = fileList[i].getAttribute('fileid'),
                tag = fileList[i].querySelector('.fileinfo-text-status');
            tag.innerHTML = self.configs.statusText[getFileById(self, id).status]
        }
    }
    function setProgress(self, fileObj) {
        var easyUpload = document.getElementById(self.configs.easyId);
        var tag = easyUpload.querySelector('[fileid="' + fileObj.id + '"]').querySelector('.fileinfo-progress-bar');
        tag.style.width = fileObj.progress;
        tag.className = 'fileinfo-progress-bar ' + self.configs.statusBg[fileObj.status];
    }
    function setStatusColor(self, fileObj) {
        var tags = document.getElementById(self.configs.easyId).querySelectorAll('.fileinfo-text-status');
        for (var i = 0; i < tags.length; i++) {
            if (fileObj.id == tags[i].getAttribute('fileid')) {
                tags[i].className = 'fileinfo-text-status ' + self.configs.statusTextColor[fileObj.status];
            }
        }

    }
    function setCheckedFile(self, isChecked) {
        for (var i = 0; i < self.files.length; i++) {
            self.files[i].isChecked = isChecked;
        }
    }
    function setCheckBox(tag, isChecked) {
        if (isChecked) {
            if (/\sunchecked$/.test(tag.className)) tag.className = tag.className.replace('unchecked', 'checked');
        } else {
            if (/\schecked$/.test(tag.className)) tag.className = tag.className.replace('checked', 'unchecked');
        }
    }
    function readImg(file, cb) {
        var reader = new FileReader();
        reader.onload = function () {
            cb && cb(this.result);
        }
        reader.readAsDataURL(file);
    }
    function showLoading(self, isShow) {
        var tag = document.getElementById(self.configs.easyId).querySelector('.loading');
        tag.style.display = isShow ? 'block' : 'none';
    }
    function showMessage(self, obj) {
        var tag = document.getElementById(self.configs.easyId).querySelector('.message-box');
        tag.className = 'message-box ' + obj.class_name;
        tag.style.display = 'inline-block';
        tag.innerHTML = obj.text;
        setTimeout(function() {
            tag.style.display = 'none';
        }, self.configs.messageTime);
    }
    function uploadFiles(self) {
        for (var j = 0; j < self.files.length; j++) {
            if (self.files[j].isChecked && (self.files[j].status == 4 || self.files[j].status == 0 || self.files[j].status == 3)) {
                self.files[j].status = 1;
                self.files[j].progress = '0%';
                self.xhrFiles.push(self.files[j]);
                setProgress(self, { progress: '0%', id: self.files[j].id, status: self.files[j].status });
            }
        }
        if (!self.xhrFiles.length) {
            if (self.files.length) {
                showMessage(self, {
                    text: '未选中有效文件',
                    class_name: self.configs.statusBg[5]
                })
            }
            return;
        }
        setStatus(self);
        if(self.isXhrReady) {
            var i = 0;
            self.isXhrReady = false;
            self.configs.uploadStart && self.configs.uploadStart(self);
            self.configs.showLoading && showLoading(self, true);
            function upload() {
                self.xhrFiles[i].status = 2;
                setStatus(self);
                self.xhr.open('post', self.configs.action);
                self.xhr.timeout = self.configs.timeout;
                self.xhr.responseType = self.configs.responseType; //响应返回的数据格式 'json'ie10不支持
                self.xhr.withCredentials = self.configs.withCredentials;
                self.configs.setRequestHeader && self.configs.setRequestHeader(self.xhr);
                self.xhr.addEventListener('progress', function(data){
                    var progress = String(((data.loaded/data.total)*100).toFixed(2)) + '%';
                    self.xhrFiles[i].progress = progress;
                    setProgress(self, { progress: progress, id: self.xhrFiles[i].id, status: self.xhrFiles[i].status });
                });
                self.xhr.onreadystatechange = function() {
                    if (self.xhr.readyState == 4) {
                        var fileObj = {
                            progress: self.xhrFiles[i].progress,
                            id: self.xhrFiles[i].id,
                            status: self.xhrFiles[i].status
                        };
                        if (self.xhr.status == 200 && (self.configs.checkSuccessCode == null) || self.configs.checkSuccessCode(self.xhr)) {
                            setStatusColor(self, fileObj);
                            setProgress(self, fileObj);
                            changeStatus(3);
                        } else {
                            setStatusColor(self, fileObj);
                            setProgress(self, fileObj);
                            changeStatus(4);
                        }
                    }
                }
                if (self.configs.buildSendData == null) {
                    self.xhr.send(null);
                } else {
                    self.xhr.send(self.configs.buildSendData(self.xhrFiles[i]));
                }
            }
            upload();
            function changeStatus(status) {
                self.xhrFiles[i].status = status;
                setStatus(self);
                i++;
                self.isXhrReady = true;
                if (i < self.xhrFiles.length) {
                    upload();
                } else {
                    self.xhrFiles = [];
                    i = 0;
                    self.configs.showLoading && showLoading(self, false);
                    self.configs.uploadEnd && self.configs.uploadEnd(self);
                }
            }
        }
    }
    window.easyUpload = EasyUpload;
}(window, document));