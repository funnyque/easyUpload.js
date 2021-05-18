/**
 * @author funnyque@163.com; https://github.com/funnyque/easyUpload.js; qq:1016981640
 * @version V3.0.0
 * @description 一款简单易用的H5文件上传插件，支持样式自定义，支持数据可配置，支持多实例上传...
 */
;(function (window, document) {
    var defaultConfigs = {
        easyId: '', //插件插入节点的Id，String类型
        accept: '.jpg,.png,.pdf', //允许文件类型后缀名，逗号分隔，String类型
        action: '', //上传文件地址，String类型
        maxCount: 3, //最大文件数量，Number类型
        maxSize: 3, //最大文件尺寸，Number类型
        multiple: true, //是否开启多文件上传，Boolean类型
        messageTime: 2000, //messageBox消息提示毫秒数，Number类型
        responseType: 'text', //xhr的responseType格式，String类型
        showSize: true, //是否展示文件尺寸，Boolean类型
        timeout: 0, //请求超时毫秒数，0表示永久，Number类型
        withCredentials: true, //是否允许请求头自带cookie等证书，Boolean类型
        setRequestHeader: null, //配置xhr请求头的方法
        buildSendData: null, //配置xhr发送数据格式的方法，返回data
        checkSuccessCode: null //检查成功状态码的方法，返回布尔值
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
    EasyUpload.prototype = { constouctor: EasyUpload, }; //重新指定constouctor
    function render(self) {
        var easyTemplate = 
            '<span class="message-box">我是message</span>' +
            '<input type="file" name="file" class="input-file"'+ (self.configs.multiple ? 'multiple': '') +' accept=".jpg,.png,.gif,.pdf">' +
            '<div class="btn-list">' +
                '<div btntype="select" class="btn btn-list-item btnlist-item-selsct">选择文件</div>' +
                '<div btntype="upload" class="btn btn-list-item btnlist-item-upload">上传</div>' +
                '<div btntype="delete" class="btn btn-list-item btnlist-item-danger">删除</div>' +
                '<div btntype="cancel" class="btn btn-list-item btnlist-item-danger">终止</div>' +
                '<div btntype="checkall" class="btn btn-list-item checkbox unchecked">✓</div>' +
            '</div>' +
            '<ul class="file-list">' +
            '</ul>';
        document.getElementById(self.configs.easyId).innerHTML = easyTemplate;
        bindBtnList(self);
        bindInputFile(self);
    }
    function renderAllBox(self, type) {
        var checkobx = document.getElementById(self.configs.easyId).querySelector('.btn-list').querySelector('.checkbox');
        if (self.files.length == 0) {
            if (/\schecked$/.test(checkobx.className)) {
                checkobx.className = checkobx.className.replace('checked', 'unchecked');
            } else {
                if (type == 'click') checkobx.className = checkobx.className.replace('unchecked', 'checked');
            }
        } else {
            var isAllChecked = true;
            for (var i = 0; i < self.files.length; i++) {
                isAllChecked = isAllChecked && self.files[i].isChecked;
            }
            if (isAllChecked) {
                if (/\sunchecked$/.test(checkobx.className)) checkobx.className = checkobx.className.replace('unchecked', 'checked');
            } else {
                if (/\schecked$/.test(checkobx.className)) checkobx.className = checkobx.className.replace('checked', 'unchecked');
            }
        }
    }
    function renderCheckOne(self, fileIds, target) {
        var easyUpload = document.getElementById(self.configs.easyId);
        for (var i = 0; i < self.files.length; i++) {
            for (var j = 0; j < fileIds.length; j++) {
                if (self.files[i].id == fileIds[j]) {
                    if (target) {
                        checkTarget(self.files[i].isChecked, target);
                    } else {
                        var checkbox = easyUpload.querySelector('[fileid="' + fileIds[j] + '"]').querySelector('.checkbox');
                        checkTarget(self.files[i].isChecked, checkbox);
                    }
                }
            }
        }
        function checkTarget(isChecked, _target) {
            if (isChecked) {
                if (/\sunchecked$/.test(_target.className)) _target.className = _target.className.replace('unchecked', 'checked');
            } else {
                if (/\schecked$/.test(_target.className)) _target.className = _target.className.replace('checked', 'unchecked');
            }
        }
    }
    function renderCheckList(self, fileId) {
        var fileList = document.getElementById(self.configs.easyId).querySelectorAll('.file-list-item');
        for (var i = 0; i < fileList.length; i++) {
            var checkOne = fileList[i].querySelector('.checkbox');
            if (fileId == 'all' && /\sunchecked$/.test(checkOne.className)) {
                checkOne.className = checkOne.className.replace('unchecked', 'checked');
            }
            if (fileId == 'zero' && /\schecked$/.test(checkOne.className)){
                checkOne.className = checkOne.className.replace('checked', 'unchecked');
            } 
        }
    }
    function renderList(self) {
        var listTemplate = '',
            checkedIds = [];
        for (var i = 0; i < self.files.length; i++) {
            if (self.files[i].isChecked) checkedIds.push(self.files[i].id);
            listTemplate +=
            '<li class="file-list-item" fileid="' + self.files[i].id +'">' +
                '<div class="preview">' +
                    (/image\//.test(self.files[i].type) ? '<img class="preview-img"' + ' src="' + self.files[i].base64 + '" alt="' + self.files[i].name +'">' : '<div class="preview-div"></div>') +
                '</div>' +
                '<div class="btn-file">' +
                    '<div btntype="delone" class="btn btn-file-del" fileid="'+ self.files[i].id +'">' +
                        '<span btntype="delone" class="btn-file-del-text" fileid="'+ self.files[i].id +'">X</span>' +
                    '</div>' +
                    '<div btntype="checkone" class="btn btn-file-checkbox checkbox unchecked" fileid="'+ self.files[i].id +'">✓</div>' +
                '</div>' +
                '<div class="fileinfo">' +
                    '<p class="fileinfo-text">' +
                        '<span class="fileinfo-text-name">'+ (self.configs.showSize? '<i class="fileinfo-text-size '+ checkFileSize(self, self.files[i]) +'">'+ bytesToSize(self.files[i].size) +'</i>' : '') + self.files[i].name +'</span>' +
                        '<span class="fileinfo-text-status '+ matchStatusColor(self, self.files[i].status) +'" fileid="'+ self.files[i].id +'">0%</span>' +
                    '</p>' +
                    '<div class="fileinfo-progress">' +
                        '<div class="fileinfo-progress-bar '+ matchStyleBg(self.files[i].status) +'" style="width:'+ self.files[i].progress +';" fileid="'+ self.files[i].id +'"></div>' +
                    '</div>' +
                '</div>' +
            '</li>';
        }
        document.getElementById(self.configs.easyId).querySelector('.file-list').innerHTML = listTemplate;
        bindFileList(self);
        renderStatus(self);
        renderCheckOne(self, checkedIds);
    }
    function checkFileSize(self, file) {
        var fileSize = (file.size / Math.pow(1024, 2)).toFixed(2);
        if (self.configs.maxSize > fileSize) {
            return 'normalbg';
        } else {
            file.status = -2;
            return 'warnbg';
        }
    }
    function bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
    function matchStatusColor(self, status) {
        var statusColor = '';
        switch(status) {
            case -2:
                statusColor = 'warncolor';
                break;
            case -1:
                statusColor = 'failedcolor';
                break;
            case 0: case 1: case 2:
                statusColor = 'normalcolor';
                break;
        }
        return statusColor;
    }
    function renderStatus(self) {
        var fileList = document.getElementById(self.configs.easyId).querySelectorAll('.file-list-item');
        for (var i = 0; i < self.files.length; i++) {
            for (var j = 0; j < fileList.length; j++) {
                if (self.files[i].id == fileList[j].getAttribute('fileid')) {
                    var target = fileList[j].querySelector('.fileinfo-text-status');
                    target.innerHTML = showStatus(self.files[i].status);
                }
            }
        }
        function showStatus(status) {
            var text = '';
            switch(status) {
                case -2:
                    text = '体积超出';
                    break;
                case -1:
                    text = '上传失败';
                    break;
                case 0:
                    text = '允许上传';
                    break;
                case 1:
                    text = '即将上传';
                    break;
                case 2:
                    text = '0%';
                    break;
                case 3:
                    text = '上传成功';
                    break;
            }
            return text;
        }
    }
    function renderProgress(self, fileObj) {
        var easyUpload = document.getElementById(self.configs.easyId);
        if (fileObj instanceof Object) {
            var target = easyUpload.querySelector('[fileid="' + fileObj.id + '"]').querySelector('.fileinfo-progress-bar');
            target.style.width = fileObj.percent;
            target.className = 'fileinfo-progress-bar ' + matchStyleBg(fileObj.status);
        } else {
            var progresses = easyUpload.querySelectorAll('.fileinfo-progress-bar');
            for (var i = 0; i < self.files.length; i++) {
                for (var j = 0; j < progresses.length; j++) {
                    if (self.files[i].id == progresses[j].getAttribute('fileid')) {
                        progresses[j].style.width = self.files[i].percent;
                        progresses[j].className = 'fileinfo-progress-bar ' + matchStyleBg(self.files[i].status);
                    }
                }
            }
        }
    }
    function renderStatusColor(self, fileObj) {
        var targets = document.getElementById(self.configs.easyId).querySelectorAll('.fileinfo-text-status');
        for (var i = 0; i < targets.length; i++) {
            if (fileObj.id == targets[i].getAttribute('fileid')) {
                targets[i].className = 'fileinfo-text-status ' + matchStatusColor(self, fileObj.status);
            }
        }

    }
    function showMessageBox(self, boxObj) {
        var target = document.getElementById(self.configs.easyId).querySelector('.message-box');
        target.className = 'message-box ' + boxObj.class_name;
        target.style.display = 'inline-block';
        target.innerHTML = boxObj.text;
        setTimeout(function() {
            target.style.display = 'none';
        }, self.configs.messageTime);
    }
    function matchStyleBg(status) {
        var statusClass = '';
        switch (status) {
            case -2:
                statusClass = 'warnbg';
                break;
            case -1:
                statusClass = 'failedbg';
                break;
            case 0: case 1: case 2: case 3:
                statusClass = 'normalbg';
                break;
        }
        return statusClass;
    }
    function bindBtnList(self) {
        var easyUpload = document.getElementById(self.configs.easyId);
        easyUpload.querySelector('.btn-list').onclick = function(evt) {
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
                        delFiles(self, 'checked');
                        break;
                    case 'cancel':
                        cancelUpload(self);
                        break;
                    case 'checkall':
                        checkAll(self);
                        break;
                }
        }
    }
    function bindInputFile (self) {
        var inputFile = document.getElementById(self.configs.easyId).querySelector('.input-file');
        inputFile.addEventListener('change', function() {
            var i = 0,
                _this = this;
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
                    }
                    if (/image\//.test(_this.files[i].type)) {
                        readImg(_this.files[i], function (base64) {
                            obj.base64 = base64;
                            if (self.files.length < self.configs.maxCount) {
                                self.files.push(obj);
                            } else {
                                showMessageBox(self, {
                                    text: '文件数量超出',
                                    class_name: 'warnbg'
                                })
                            }
                            i++;
                            buildFile();
                        });
                    } else {
                        if (self.files.length < self.configs.maxCount) {
                            self.files.push(obj);
                        } else {
                            showMessageBox(self, {
                                text: '文件数量超出',
                                class_name: 'warnbg'
                            })
                        }
                        i++;
                        buildFile();
                    }
                    self.fileId++;
                } else {
                    renderAllBox(self);
                    renderList(self);
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
                fileId = parseInt(target.getAttribute('fileid')),
                btntype = target.getAttribute('btntype');
            switch (btntype) {
                case 'checkone':
                    checkEasyFiles(self, fileId, target);
                    break;
                case 'delone':
                    delFiles(self, [fileId]);
                    break;
            }
        }
    }
    function selectFiles(self) {
        document.getElementById(self.configs.easyId).querySelector('.input-file').click();
    }
    function uploadFiles(self) {
        for (var j = 0; j < self.files.length; j++) {
            if (self.files[j].isChecked && (self.files[j].status == -1 || self.files[j].status == 0 || self.files[j].status == 3)) {
                self.files[j].status = 1;
                self.xhrFiles.push(self.files[j]);
            }
        }
        if (!self.xhrFiles.length) {
            if (self.files.length) {
                showMessageBox(self, {
                    text: '未选中有效文件',
                    class_name: 'warnbg'
                })
            }
            return;
        }
        renderStatus(self);
        if(self.isXhrReady) {
            var i = 0;
            self.isXhrReady = false;
            function upload() {
                self.xhrFiles[i].status = 2;
                renderStatus(self);
                self.xhr.open('post', self.configs.action);
                self.xhr.timeout = self.configs.timeout;
                self.xhr.responseType = self.configs.responseType; //响应返回的数据格式 'json'ie10不支持
                self.xhr.withCredentials = self.configs.withCredentials;
                self.configs.setRequestHeader && self.configs.setRequestHeader(self.xhr);
                self.xhr.addEventListener('progress', function(data){
                    var percent = String(((data.loaded/data.total)*100).toFixed(2)) + '%';
                    self.xhrFiles[i].progress = percent;
                    renderProgress(self, {
                        percent: percent,
                        id: self.xhrFiles[i].id,
                        status: self.xhrFiles[i].status
                    });
                });
                self.xhr.onreadystatechange = function() {
                    if (self.xhr.readyState == 4) {
                        if (self.xhr.status == 200 && (self.configs.checkSuccessCode == null) || self.configs.checkSuccessCode(self.xhr)) {
                            renderStatusColor(self, { //changeStatus有i++,要先调用
                                id: self.xhrFiles[i].id,
                                status: 3
                            });
                            changeStatus(3);
                        } else {
                            renderStatusColor(self, {
                                id: self.xhrFiles[i].id,
                                status: -1
                            });
                            changeStatus(-1);
                        }
                        renderProgress(self);
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
                renderStatus(self);
                i++;
                self.isXhrReady = true;
                if (i < self.xhrFiles.length) {
                    upload();
                } else {
                    self.xhrFiles = [];
                    i = 0;
                }
            }
        }
    }
    function delFiles(self, fileIds) {
        var newFiles = [];
        if (fileIds == 'checked') {
            for (var i = 0; i < self.files.length; i++) {
                if (!self.files[i].isChecked) newFiles.push(self.files[i]);
            }
        } else {
            for (var i = 0; i < self.files.length; i++) {
                for (var j = 0; j < fileIds.length; j++) {
                    if (self.files[i].id != fileIds[j]) newFiles.push(self.files[i]);
                }
            }
        }
        if ((self.files.length = newFiles.length) && self.files.length) {
            showMessageBox(self, {
                text: '未选中文件',
                class_name: 'warnbg'
            })
        }
        self.files = newFiles;
        renderAllBox(self);
        renderList(self);
    }
    function cancelUpload(self) {
        self.xhr.onabort = function() {
            showMessageBox(self, {
                text: '成功取消上传',
                class_name: 'normalbg'
            })
        }
        self.xhr.abort();
    }
    function checkAll(self) {
        var checkobx = document.getElementById(self.configs.easyId).querySelector('.btn-list').querySelector('.checkbox');
        if (/\schecked$/.test(checkobx.className)) {
            checkEasyFiles(self, 'zero');
        } else {
            checkEasyFiles(self, 'all');
        }
    }
    function checkEasyFiles(self, fileId, target) {
        if (fileId == 'all' || fileId == 'zero') {
            var isChekced = fileId == 'zero' ? false : true;
            for (var i = 0; i < self.files.length; i++) {
                self.files[i].isChecked = isChekced;
            }
            renderCheckList(self, fileId);
        } else {
            for (var i = 0; i < self.files.length; i++) {
                if (self.files[i].id == fileId) {
                    self.files[i].isChecked = !self.files[i].isChecked;
                }
            }
            renderCheckOne(self, [fileId], target);
        }
        renderAllBox(self, 'click');
    }
    function readImg(file, callback) {
        var reader = new FileReader();
        reader.onload =  function() {
            callback && callback(this.result);
        }
        reader.readAsDataURL(file);
    }
    window.easyUpload = EasyUpload;
}(window, document));