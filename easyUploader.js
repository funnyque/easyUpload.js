/**
 * @author  funnyque@163.com (github:https://github.com/funnyque/easyUpload.js) (qq:1016981640)
 * @param   configs(required)
 * @return  Xhr object
 * @version 2.0.4
 * @description js小文件上传插件，支持多文件上传、批量上传及混合上传
 */
;(function(window, document) {
    var easyUploader = function(configs) {
        if (!configs || !configs.id) { alert('缺少配置参数'); return; }
        if (!(this instanceof easyUploader)) return new easyUploader(configs);
        this.initPlugin(configs);
    };
    var defaultConfigs = {
        id: "", /* 渲染容器id */
        accept: '.jpg,.png', /* 上传类型 */
        action: "", /* 上传地址 */
        autoUpload: false, /* 是否开启自动上传 */
        crossDomain: true, /* 是否允许跨域 */
        data: null, /* 上传配置参数，依据dataFormat而不同， */
        dataFormat: 'formData', /* 上传表单类型，有formData和base64两种 */
        dataType: 'json', /* 同$.ajax，默认返回数据格式为json */
        headers: {
          // testKey: 'testValue'
        }, /* 上传的请求头部，视需要配置 */
        maxCount: 3, /* 最大上传文件数 */
        maxSize: 3, /* 最大上传文件体积，单位M */
        multiple: false, /* 是否开启多选上传 */
        name: 'file', /* 上传的文件字段名 */
        previewWidth: 70, /* 压缩预览图的宽度，样式中高度等于宽度 */
        processData: false, /* 同$.ajax参数，这里默认为false */
        successKey: 'code', /* 标识上传成功的key */
        successValue: 200, /* 标识上传成功对应的value */
        showAlert: true, /* 是否开启alert提示 */
        timeout: 0, /* ajax请求超时时间，默认值为0，表示永不超时*/
        withCredentials: true, /* 是否支持发送 cookie 凭证信息 */
        beforeUpload: null, /* ajax上传前的回调函数 */
        onAlert: null, /* alert时的回调函数 */
        onChange: null, /* input change的回调函数 */
        onError: null, /* 上传失败时的回调函数 */
        onRemove: null, /* 移除文件时的回调函数 */
        onSuccess: null, /* 上传成功时的回调函数 */
    },
    iconFile = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAAFVBMVEWZmZmZmZmZmZmZmZmZmZmZmZmZmZk9goCmAAAAB3RSTlMC/rYs1mCR8/Hv3QAAAYBJREFUWMPtmMsSwyAIRRWE///kGmMTH6CYtN0012knC+cU4Uq0zj169CkhqEI7hb2uYOZQnA2cx/GQHjeOFRP0qcHOQe9phLFyCAeBckwc3C1hxDgYchBJEZaYSIgcHpVHE1bRpAzxulUKDuzrCUoVcPOVLCo9t0fjUOGw7k4qaxxyduPPShzQkx8xcHDCOykyZ4zBwysHJnFwEXN4pZhHAmeGeXuFi6UI8Uwx2SuYNn9W6LbXHJM5rUtpFZM9hxCi/P7V7i4LpvYc1oVrMBDOQTVGyKmGwX7dJ6bnqNHwKaCuGbYcFSM3Topb1G0frjkrmLTQzSNpVMVZwaQSjbqYERNBZ0dlE0bpwYKNFgt+BeNKDF/HlF3YXcdYzgn/iklNSRZd9I3YL23RsKp8eHwKfhdDqhh/X/APYVDX11JMC0cBCYOcu7t3dzDUv2tuYGDh0CbmJr2Llw60Ixd/DWO9+3FbnfYobg1mNDFdRufyfrSmzLFodoFGYoPo+a9jVS+3Nw2jSs30KQAAAABJRU5ErkJggg=='; // 非图像文件预览的base64编码

    easyUploader.prototype = {
        configs: {}, /* 当前实例的配置 */
        files: [],
        fileId: 0, /* ajax待传文件id */
        fileObj: {
            fileList: [], /* 当前实例选中过滤后的文件 */
            isReady: true /* 图片转base是异步的，用开关来控制每一次更新 */
        },
        node: { /* 用于接收dom节点 */
            list: null,
            input: null
        },
        ajax: {
            example: null,
            isReady: true,
            index: 0, /*用于接收最近一个等待上传文件的索引 */
        },
        initPlugin: function (configs) {
            this.configs = Object.assign({}, defaultConfigs, configs);
            var container = document.getElementById(this.configs.id);
            if (!container) {
                alert("没有找到id为" + this.configs.id + "的渲染容器");
                return;
            } else {
                container.innerHTML = this.buildUploader();
                this.bindHeadEvent();
            }
            this.startInterceptor(); /* 启动拦截器 */
        },
        buildUploader: function() {
            var html = '';
            html+= '<div class="easy-uploader">'
            +  '<div class="btn-box">'
            +  '<span class="btn-select-file btn">'
            +  '选取文件'
            +  '</span>'
            +  '<span class="btn-upload-file btn primary">'
            +  '上传文件'
            +  '</span>'
            +  '<span class="btn-delete-file btn danger">'
            +  '删除文件'
            +  '</span>'
            +  '<span class="btn-cancel-upload btn danger">'
            +  '终止上传'
            +  '</span>'
            +  '<i class="btn-check-all cursor-select checkbox unchecked"></i>'
            +  '<input class="input-file" type="file" accept="' + this.configs.accept + '" '
            +  (this.configs.multiple ? 'multiple="multiple" ' : '')
            +  'style="display:none;"></input>'
            +  '</div>'
            +  '<ul class="list">'
            +  '</ul>'
            +  '</div>';
            return html;
        },
        updateHeadDom: function() {
            let isAllChecked = true;
            this.files.forEach(function(item) { if (!item.checked) { isAllChecked = false; } });
            if (isAllChecked) {
                $(this.node.input).siblings('.checkbox').removeClass('unchecked').addClass('checked');
            } else {
                $(this.node.input).siblings('.checkbox').removeClass('checked').addClass('unchecked');
            }
        },
        updateFilesDom: function() {
            var that = this,
                html = '';
            var buildCheckBox = function(fileItem) {
                if (that.configs.multiple) {
                    if (fileItem.checked) {
                        return '<i class="btn-check-item select-icon cursor-select checkbox checked"></i>';
                    } else {
                        return '<i class="btn-check-item select-icon cursor-select checkbox unchecked"></i>';
                    }
                } else {
                    return '';
                }
            },
            matchProgressText = function (fileItem) {
                if (fileItem.uploadPercentage == 0) {
                    if (fileItem.uploadStatus == 'loading') {
                        return '等待';
                    } else {
                        return '0%';
                    }
                } else {
                    if (fileItem.uploadStatus == 'error') {
                        return '失败';
                    } else {
                        return (fileItem.uploadPercentage + '%');
                    }
                }
            };
            this.files.forEach(function(fileItem, index) {
                html += '<li id="' + fileItem.id + '" class="list-item">'
                +  '<div class="preview">'
                +  '<img class="preview-img" src="' + fileItem.previewBase +'" />'
                +  '</div>'
                +  '<div class="info">'
                +  '<p class="filename">'
                +  fileItem.file.name
                +  '</p>'
                +  '<div class="progress-wrapper">'
                +  '<div class="progressbar" style="width:' + fileItem.uploadPercentage + '%;'
                +  (fileItem.uploadStatus == 'error' ? 'background-color:#f56c6c' : '') + '">'
                +  '</div>'
                +  '<div class="progress-text">'
                +  matchProgressText(fileItem)
                +  '</div>'
                +  '</div>'
                +  buildCheckBox(fileItem)
                +  '</div>'
                +  '<label class="btn-delete-item delete-label cursor-select">'
                +  '<i class="delete-icon">X</i>'
                +  '</label>'
                +  '</li>';
            });
            this.node.list.html(html);
            this.bindListEvent();
            this.updateHeadDom(); /* 每更新一次list，默认调一次updateHeadDom */
        },
        bindHeadEvent: function() {
            var that = this;
            $(".btn-select-file").off("click").on("click", function() {
                that.node.list = $(this).parent().siblings(".list");
                $(this).parent().children(".input-file").trigger("click").on("change", function(e) {
                    that.fileObj = { fileList: e.target.files, isReady: true };
                    that.node.input = $(this);
                    that.updateFiles();
                    that.configs.onChange && that.configs.onChange(e.target.files);
                });
            });
            $(".btn-upload-file").off("click").on("click", function () {
                var hasLoading = false; /* 用于标识队列中还存在上传状态 */
                that.files.forEach(function (item) { if (item.uploadStatus == 'loading') { hasLoading = true; } });
                if (hasLoading) {
                    if (that.ajax.isReady) {
                        var message = '正在上传，请稍后';
                        if (that.configs.showAlert) { alert(message); }
                        that.configs.onAlert && that.configs.onAlert(message);
                    } else {
                        that.ajax.isReady = true;
                        that.upload();
                    }
                } else {
                    that.ajax.isReady = true;
                    that.upload();
                }
            });
            $(".btn-delete-file").off("click").on("click", function () {
                var hasLoading = false;
                that.files.forEach(function(item) {
                    if (item.checked && item.uploadStatus == 'loading') { hasLoading = true; }
                });
                if (hasLoading) {
                    var message = '正在上传，请稍后操作';
                    if (that.configs.showAlert) { alert(message); }
                    that.configs.onAlert && that.configs.onAlert(message);
                } else {
                    var newFiles = [];
                    that.ajax.isReady = false;
                    that.files.forEach(function (item) {
                        if (!item.checked) { newFiles.push(item); }
                    });
                    that.files = newFiles;
                    that.updateFilesDom();
                    that.ajax.isReady = true;
                }
            });
            $(".btn-cancel-upload").off("click").on("click", function () {
                that.ajax.isReady = false; /* 关闭开关 */
                that.ajax.example.abort();
                that.files.forEach(function(item) {
                    if (item.uploadStatus == 'loading') {item.uploadStatus = 'waiting'; }
                });
                that.updateFilesDom();
            });
            $(".btn-check-all").off("click").on("click", function () {
                var isChecked = true;
                if ($(this).hasClass('checked')) {
                    isChecked = false;
                    $(this).removeClass('checked').addClass('unchecked');
                } else {
                    isChecked = true;
                    $(this).removeClass('unchecked').addClass('checked');
                }
                that.files.forEach(function(item) {
                    item.checked = isChecked;
                    if (!item.checked && item.uploadStatus == 'loading') {
                        item.uploadStatus = 'waiting';
                    }
                });
                that.updateFilesDom();
            });
        },
        bindListEvent: function() {
            var id = undefined,
                that = this;
            $(".btn-delete-item").off("click").on("click", function () {
                id = $(this).parent().attr('id');
              if ((that.files[that.ajax.index] && that.files[that.ajax.index].id == id) && that.files[that.ajax.index].uploadStatus == 'loading') {
                    var message = '正在上传，请稍后操作';
                    if (that.configs.showAlert) { alert(message); }
                    that.configs.onAlert && that.configs.onAlert(message);
                } else {
                    that.ajax.isReady = false;
                    that.files.forEach(function (item, index) {
                        if (item.id == id) { that.files.splice(index, 1); }
                    });
                    that.updateFilesDom();
                    that.ajax.isReady = true;
                }
            });
            $(".btn-check-item").off("click").on("click", function () {
                id = $(this).parent().parent().attr('id');
                that.files.forEach(function (item, index) {
                    if (item.id == id) {
                        if (item.checked) {
                            item.checked = false;
                            if (item.uploadStatus == 'loading') { item.uploadStatus = 'waiting'; }
                        } else {
                            item.checked = true;
                        }
                    }
                });
                that.updateFilesDom();
            });
        },
        checkImg: function (file) {
            var imgTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
                isImg = false;
            imgTypes.forEach(function (type) {
                if (file.type == type) isImg = true;
            });
            return isImg;
        },
        convertToBase: function(file) {
            var reader,
                isImg = this.checkImg(file);
            if (typeof FileReader !== 'undefined') {
                reader = new FileReader();
            } else {
                if (window.FileReader) reader = new window.FileReader();
            }
            reader.onload = (e) => {
                var base = e.target.result;
                if (isImg) {
                    this.compressImg(base, file);
                } else {
                    this.formatFile(file, iconFile, base);
                }
            }
            reader.readAsDataURL(file);
        },
        compressImg: function(base, file) {
            var img;
            if (typeof Image !== 'undefined') {
                img = new Image();
            } else {
                if (window.Image) img = new window.Image();
            }
            var drawImg = (img, w, h) => {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var drawImage = ctx.drawImage;
                ctx.drawImage = (img, sx, sy, sw, sh, dx, dy, dw, dh) => {
                    var vertSquashRatio = 1;
                    if (arguments.length == 9)
                        drawImage.call(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
                    else if (typeof sw != 'undefined') {
                        drawImage.call(ctx, img, sx, sy, sw, sh / vertSquashRatio);
                    } else {
                        drawImage.call(ctx, img, sx, sy);
                    }
                }
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                var previewBase = canvas.toDataURL('image/png');
                this.formatFile(file, previewBase, base);
            };
            img.onload = () => {
                var w = this.configs.previewWidth,
                    h = w;
                drawImg(img, w, h);
            }
            img.src = base;
        },
        formatFile: function(file, previewBase, base) {
            this.files.push({
                ajaxResponse: undefined,
                base: base,
                checked: false,
                file: file,
                id: this.fileId,
                isImg: this.checkImg(file),
                previewBase: previewBase,
                uploadPercentage: 0,
                uploadStatus: 'waiting',
            });
            this.fileId++; /* 保证id自增 */
            this.updateFilesDom(); /* 更新上传文件的dom */
            this.fileObj.isReady = true; /* 每完成一次push打开开关 */
        },
        updateFiles: function (type) {
            var existingCout = this.files.length, /* files 数组里已有的数量 */
                index = 0,
                isSizeOver = false,
                timer = null,
                that = this;
            var onAlert= function(message) {
                if (that.configs.showAlert) { alert(message); }
                if (that.configs.onAlert) { that.configs.onAlert(message); }
            }
            timer = setInterval(function() {
                if (that.fileObj.isReady) {
                    if (that.fileObj.fileList[index] && that.fileObj.fileList[index].size > that.configs.maxSize * (1024 * 1024)) {
                        isSizeOver = true;
                        index++; /* 发现文件尺寸超出就跳过当前文件 */
                    }
                    if (that.files.length < that.configs.maxCount && index < that.fileObj.fileList.length) {
                        that.fileObj.isReady = false; /* 一旦进入代码块立即关闭更新开关 */
                        that.convertToBase(that.fileObj.fileList[index]);
                        index++;
                    } else {
                        var countDiff = that.fileObj.fileList.length + existingCout - that.configs.maxCount,
                            fileSize = that.fileObj.fileList[index - 1] ? (that.fileObj.fileList[index - 1].size / (1024 * 1024)).toFixed(2) : 0,
                            message = '';
                        if (that.configs.multiple && that.fileObj.fileList.length > 1) {
                            /* 选中多个文件时给出不同提示 */
                            if (countDiff > 0 && isSizeOver) {
                                message = '文件数量超出，超出' + countDiff + '个；部分文件大小超出，允许大小为' + that.configs.maxSize + 'M';
                                onAlert(message);
                            } else if (countDiff > 0 && !isSizeOver) {
                                message = '文件数量超出，超出' + countDiff + '个';
                                onAlert(message);
                            } else if (countDiff <= 0 && isSizeOver) {
                                message = '部分文件大小超出，允许大小为' + that.configs.maxSize + 'M';
                                onAlert(message);
                            }
                        } else {
                            if (countDiff > 0 && fileSize > that.configs.maxSize) {
                                message = '文件数量超出，文件大小超出；当前文件' + fileSize + 'M，允许大小为' + that.configs.maxSize + 'M';
                                onAlert(message);
                            } else if (countDiff > 0 && fileSize <= that.configs.maxSize) {
                                message = '文件数量超出';
                                onAlert(message);
                            } else if (countDiff <= 0 && fileSize > that.configs.maxSize) {
                                message = '文件大小超出，当前文件' + fileSize + 'M，允许大小为' + that.configs.maxSize + 'M';
                                onAlert(message);
                            }
                        }
                        $(that.node.input).val("");
                        clearInterval(timer);
                        if (that.configs.autoUpload) {
                            that.files.forEach(function(item) { item.checked = true; });
                            that.upload();
                        } /* 开启自动上传时调用上传方法 */
                    }
                }
            }, 10);
        },
        startInterceptor: function() {
            var that = this;
            $.ajaxSetup({
                crossDomain: that.configs.crossDomain,
                xhrFields: {
                    withCredentials: that.configs.withCredentials
                },
                beforeSend: function () {
                    that.configs.beforeUpload && that.configs.beforeUpload(that.files[that.ajax.index], that.configs.data, arguments);
                }
            });
        },
        upload: function() {
            if (this.ajax.isReady) { /* 开关打开才能进行上传操作 */
                var that = this,
                    hasChecked = false,
                    checkedWaitingFiles = [];
                that.files.forEach(function(item) {
                    if (item.checked) {
                        hasChecked = true;
                        if (item.uploadStatus == 'waiting' || (item.uploadStatus == 'loading' && item.uploadPercentage==0)) {
                            checkedWaitingFiles.push(item);
                        }
                    }
                });
                if (hasChecked) {
                    if (checkedWaitingFiles.length) {
                        that.files.forEach(function(item, index) {
                            if (item.id == checkedWaitingFiles[0].id) {
                                that.ajax.index = index;
                            }
                        });
                        checkedWaitingFiles.forEach(function(item1) {
                            that.files.forEach(function(item2) {
                                if (item1.id == item2.id) {
                                    item2.uploadStatus = 'loading';
                                }
                            });
                        });
                        this.updateFilesDom();
                        if (this.configs.dataFormat == 'formData') {
                            this.configs.data = new FormData();
                            this.configs.data.append(this.configs.name, this.files[this.ajax.index].file);
                        } else {
                            this.configs.data = {}; /* 设为空对象便于在beforeUpload回调函数中配置 */
                        }
                        this.ajax.example = $.ajax({
                            url: that.configs.action,
                            type: "POST",
                            contentType: false,
                            data: that.configs.data,
                            dataType: that.configs.dataType,
                            headers: that.configs.headers,
                            processData: that.configs.processData,
                            timeout: that.configs.timeout,
                            xhr: function () {
                                var myXhr = $.ajaxSettings.xhr();
                                if (myXhr.upload) {
                                    myXhr.upload.addEventListener('progress', function(e) {
                                        that.files[that.ajax.index].uploadPercentage = Math.floor(100 * e.loaded / e.total);
                                        that.updateFilesDom();
                                    }, false);
                                }
                                return myXhr;
                            },
                            success: function (res) {
                                if (res[that.configs.successKey] == that.configs.successValue) {
                                    that.files[that.ajax.index].uploadPercentage = 100;
                                    that.files[that.ajax.index].uploadStatus = 'success';
                                    that.files[that.ajax.index].ajaxResponse = res;
                                } else {
                                    that.files[that.ajax.index].uploadStatus = 'error';
                                    that.files[that.ajax.index].ajaxResponse = res;
                                }
                                that.updateFilesDom();
                                that.configs.onSuccess && that.configs.onSuccess(res);
                                that.upload();
                            },
                            error: function (err) {
                                that.files[that.ajax.index].uploadStatus = 'error';
                                that.files[that.ajax.index].ajaxResponse = err;
                                that.updateFilesDom();
                                that.configs.onError && that.configs.onError(err);
                                that.upload();
                            }
                        });
                    }

                }
            }
        }
    };
    window.easyUploader = easyUploader;
}(window, document));
