/*
easyUpload.js
funnyque@163.com
https://github.com/funnyque
*/
; (function ($) {
  $.fn.easyUpload = function (opts) {
    var defaults = {
      allowFileTypes: '*.pdf;*.doc;*.docx;*.jpg',//允许上传文件类型，格式'*.pdf;*.doc;'
      allowFileSize: 100000,
      selectText: '选择文件',//上传按钮文案
      multi: true,//是否允许多文件上传
      multiNum: 5,//多文件上传时允许的有效文件数
      showNote: true,//是否展示文件上传说明
      note: '提示：最多上传5个文件，超出默认前五个，支持格式为：doc、docx、pdf',//文件上传说明
      showPreview: true,
      url: '',//上传文件地址
      fileName: 'file',//文件配置参数
      formParam: null,//文件以外的配置参数，格式：{key1:value1,key2:value2}
      timeout: 30000,//请求超时时间
      okCode: 200,//与后端返回数据code值一致时执行成功回调，不配置默认200
      successFunc: null,//上传成功回调函数
      errorFunc: null,//上传失败回调函数
      deleteFunc: null//删除文件回调函数
    }
    var option = $.extend(defaults, opts);
    // 通用函数集合
    var F = {
      // 将文件的单位由bytes转换为KB或MB，若第二个参数指定为true，则永远转换为KB
      formatFileSize: function (size, justKB) {
        if (size > 1024 * 1024 && !justKB) {
          size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        } else {
          size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
        }
        return size;
      },
      // 将输入的文件类型字符串转化为数组,原格式为*.jpg;*.png
      getFileTypes: function (str) {
        var result = [];
        var arr = str.split(";");
        for (var i = 0, len = arr.length; i < len; i++) {
          result.push(arr[i].split(".").pop());
        }
        return result;
      }
    };
    this.each(function (index, element) {
      // 文件相关变量
      var allowFiles = [];
      var selectedFiles = {};
      // 文件上传请求次数
      var postedNum = 0;
      // 标识上传是否完成
      var upFiniehed = true;
      // 标识当前是否允许新的文件上传
      var allowNewPost = true;
      // 进度条相关变量
      var loadedPercent = 0;
      var increasePercent = 1;
      var showTimer = undefined;
      var uploadCompleted = false;
      //  定义变量接收上传返回结果
      var response = {};
      response.success = [];
      response.error = [];
      // 实例化相关变量
      var _ele = $(element);
      var easyManager = {
        init: function () {
          var $html = '';
          $html = '<div class="easy_upload-container"><div class="easy_upload-head">';
          $html += '<input type="file" '
          $html += option.multi ? 'multiple ' : '';
          $html += 'class="fileInput" data-count="0" style="display:none;" />';
          $html += '<span class="easy_upload_select noselect">' + option.selectText + '</span>';
          $html += option.multi ? '<span class="easy_upload_head_btn1 noselect">上传</span>' : '';
          $html += option.multi ? '<span class="easy_upload_head_btn2 noselect">删除</span>' : '';
          $html += option.multi ? '<i class="easyUploadIcon noselect head_check" data-checked="no">&#xe693;</i>' : '';
          $html += option.showNote ? '<span class="easy_upload_note">' + option.note + '</span>' : '';
          $html += '</div>';
          $html += '<ul class="easy_upload_queue"></ul>';
          $html += '</div>';
          _ele.html($html);
          this.bindHead();
        },
        bindHead: function () {
          var _this = this;
          // 绑定前先解绑，一个页面多个easyUpload实例时如不解绑，事件会执行多次
          $('.easy_upload_select').off('click').click(function () {
            $(this).parent().find('.fileInput').trigger('click');
          });
          $('.fileInput').off('change').change(function () {
            var count = Number($(this).attr('data-count'));
            var fileArr = [];
            var files = this.files;
            for (var i = 0; i < files.length; i++) {
              var obj = {};
              obj.index = count;
              obj.file = files[i];
              fileArr.push(obj);
              // 用对象将所有选择文件存储起来
              selectedFiles[count] = obj;
              count++;
            }
            $(this).val('').attr('data-count', count);
            _this._checkFile(fileArr, this);
            $(this).parent().find('.head_check').html('&#xe693;').attr('data-checked', 'no');
          });
          $('.head_check').off('click').click(function () {
            var opt = { type:'all', target:this };
            var flag = $(this).attr('data-checked');
            if (flag == 'no') {
              opt.check = 'yes';
            } else {
              opt.check = 'no';
            }
            _this._handleCheck(opt);
          });
          $('.easy_upload_head_btn1').off('click').click(function(){
            var queueUl = $(this).parent().parent().find('.easy_upload_queue');
            var arr = _this._findItems(1, queueUl);
            if (arr.length>0) {
              allowFiles = allowFiles.concat(arr);
              upFiniehed = true;
              _this._uploadFile(queueUl);
            }
          });
          $('.easy_upload_head_btn2').off('click').click(function(){
            var queueUl = $(this).parent().parent().find('.easy_upload_queue');
            var arr = _this._findItems(2, queueUl);
            if (arr.length>0) _this._deleFiles(arr,queueUl);
          });
        },
        bindQueue: function () {
          var _this = this;
          $('.queue_check').off('click').click(function () {
            var opt = { type:'notall', target:this };
            var flag = $(this).attr('data-checked');
            if (flag == 'no') {
              opt.check = 'yes';
            } else {
              opt.check = 'no';
            }
            _this._handleCheck(opt);
            // 点击单个时同时判断是否有全部选中
            var checkedAll = _this._countCheck(this);
            var hItem = $(this).parent().parent().parent().parent().find('.head_check');
            if (checkedAll) {
              $(hItem).html('&#xe61e;').attr('data-checked', 'yes');
            } else {
              $(hItem).html('&#xe693;').attr('data-checked', 'no');
            }
          });
          $('.easy_upload_upbtn').off('click').click(function(){
            var index = $(this).parent().parent().attr('data-index');
            allowFiles.push(index);
            $(this).hide(400);
            var queueUl = $(this).parent().parent().parent();
            _this._uploadFile(queueUl);
          });
          $('.easy_upload_delbtn').off('click').click(function(){
            var upStatus = $(this).parent().parent().find('.queue_check').attr('data-up');
            if (upStatus!='3') {
              var indx = $(this).parent().parent().attr('data-index');
              var target = $(this).parent().parent().parent();
              _this._deleFiles([indx], target);
            }
          });
        },
        _checkFile: function (fileArr, target) {
          var typeArr = F.getFileTypes(option.allowFileTypes);
          if (typeArr.length > 0) {
            for (var i = 0; i < fileArr.length; i++) {
              var f = fileArr[i].file;
              if (parseInt(F.formatFileSize(f.size, true)) <= option.allowFileSize) {
                if ($.inArray('*', typeArr) >= 0 || $.inArray(f.name.split('.').pop(), typeArr) >= 0) {
                  fileArr[i].allow = true;
                } else {
                  fileArr[i].allow = false;
                }
              } else {
                fileArr[i].allow = false;
              }
            }
          }
          this._renderFile(fileArr, target);
        },
        _renderFile: function (fileArr, target) {
          var queueUl = $(target).parent().parent().find('.easy_upload_queue');
          function render(file) {
            var preview;
            var f = file.file;
            var fileType = f.name.split('.').pop();
            if (fileType == 'bmp' || fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
              var imgSrc = URL.createObjectURL(f);
              preview = '<img class="easy_upload_img" src="' + imgSrc + '" />';
            } else if (fileType == 'rar' || fileType == 'zip' || fileType == 'arj' || fileType == 'z') {
              preview = '<i class="easy_upload_icon easyUploadIcon">&#xe69d;</i>';
            } else {
              preview = '<i class="easy_upload_icon easyUploadIcon">&#xe64d;</i>';
            }
            var sHtml = '';
            sHtml += '<p class="status status1">可以上传</p>';
            sHtml += '<p class="status status2">等待上传</p>';
            sHtml += '<p class="status status3">上传中</p>';
            sHtml += '<p class="status status4">上传失败</p>';
            sHtml += '<p class="status status5">上传成功</p>';
            var $html = '';
            $html += '<li class="easy_upload_queue_item" data-index="' + file.index +'">';
            $html += option.showPreview ? '<div class="easy_upload_preview queue_item-section">' + preview + '</div>' : '';
            $html += '<div class="easy_upload_file1 queue_item-section">';
            $html += '<p class="easy_upload_filename">'+ f.name +'</p>';
            $html += '<p class="easy_upload_progress">';
            $html += '<span class="easy_upload_bar"></span>';
            $html += '</p>';
            $html += '</div>';
            $html += '<div class="easy_upload_file2 queue_item-section">';
            $html += '<p class="easy_upload_fiesize">' + F.formatFileSize(f.size) +'</p>';
            $html += '<p class="easy_upload_percent">0%</p>';
            $html += '</div>';
            $html += '<div class="easy_upload_status queue_item-section">';
            $html += file.allow ? sHtml : '<p class="status status6">文件不允许</p>';
            $html += '</div>';
            $html += '<div class="easy_upload_btn queue_item-section">';
            $html += file.allow ? '<p class="easy_upload_upbtn btn noselect">上传</p>' : '';
            $html += '<p class="easy_upload_delbtn btn noselect">删除</p>';
            $html += '</div>';
            $html += '<div class="easy_upload_checkone queue_item-section">';
            $html += option.multi ? '<i class="easyUploadIcon noselect queue_check queue_check_allow_'+ file.allow +'" data-checked="no" data-up="1">&#xe693;</i>' : '';
            $html += '</div>';
            if (option.multi) {
              $(queueUl).append($html);
            } else {
              $(queueUl).html($html);
            }
          }
          for (var i = 0; i < fileArr.length; i++) {
            if (option.multi) {
              var qItemNum = $(queueUl).find('.easy_upload_queue_item:visible').length;
              if (qItemNum<option.multiNum) render(fileArr[i]);          
            } else {
              render(fileArr[i]);
            }
          }
          this.bindQueue();
        },
        _handleCheck: function (opt) {
          if (opt.type=='all') {
            if (opt.check=='yes') {
              $(opt.target).html('&#xe61e;').attr('data-checked', 'yes');
              var qItems = $(opt.target).parent().parent().find('.queue_check');
              for (var i=0; i<qItems.length; i++) {
                $(qItems[i]).html('&#xe61e;').attr('data-checked', 'yes');
              }
            } else {
              $(opt.target).html('&#xe693;').attr('data-checked', 'no');
            }
          } else {
            if (opt.check=='yes') {
              $(opt.target).html('&#xe61e;').attr('data-checked', 'yes');
            } else {
              $(opt.target).html('&#xe693;').attr('data-checked', 'no');
            }
          }
        },
        _countCheck: function(target) {
          var checkedAll = true;
          var qItems = $(target).parent().parent().parent().find('.queue_check');
          for (var i=0; i<qItems.length; i++) {
            if ($(qItems[i]).attr('data-checked') == 'no') checkedAll = false;
          }
          return checkedAll;
        },
        _uploadFile: function(target) {
          var _this = this;
          this._setStatus2(target);
          function controlUp() {
            if (postedNum < allowFiles.length) {
              upFiniehed = false;
              upload();
            } else {
              upFiniehed = true;
            }
          }
          function upload() {
            if (allowNewPost) {
              allowNewPost = false;
              var file = selectedFiles[allowFiles[postedNum]];
              postedNum++;
              _this._resetParam();
              var fd = new FormData();
              fd.append(option.fileName, file.file);
              if (option.formParam) {
                for (key in option.formParam) {
                  fd.append(key, option.formParam[key]);
                }
              }
              _this._setUpStatus({ index: file.index, target: target }, 1);
              _this._showProgress(file.index,target);
              $.ajax({
                url: option.url,
                type: "POST",
                data: fd,
                processData: false,
                contentType: false,
                timeout: option.timeout,
                success: function (res) {
                  // 标记索引，用于删除操作
                  res.easyFileIndex = file.index;
                  var param = _this._findEle(file.index, target);
                  if (res.code!=option.okCode){
                    allowNewPost = true;
                    if (option.multi) {
                      response.error.push(res);
                      option.errorFunc && option.errorFunc(response);
                    } else {
                      option.errorFunc && option.errorFunc(res);
                    }
                    _this._handleFailed(param);
                  } else {
                    uploadCompleted = true;
                    if (option.multi) {
                      response.success.push(res);
                      option.successFunc && option.successFunc(response);
                    } else {
                      option.successFunc && option.successFunc(res);
                    }
                  }
                  controlUp();
                  _this._setUpStatus({ index: file.index, target: target }, 2);
                },
                error: function (res) {
                  res.easyFileIndex = file.index;
                  if (option.multi) {
                    response.error.push(res);
                    option.errorFunc && option.errorFunc(response);
                  } else {
                    option.errorFunc && option.errorFunc(res);
                  }
                  allowNewPost = true;
                  var param = _this._findEle(file.index, target);
                  _this._handleFailed(param);
                  controlUp();
                  _this._setUpStatus({ index: file.index, target: target }, 2);
                }
              });
            }
          }
          if (upFiniehed) upload(target);
        },
        _setUpStatus: function(opt,type) {
          var param = this._findEle(opt.index, opt.target);
          if (type==1) {
            $(param.ele).find('.queue_check').attr('data-up',3);
          } else {
            $(param.ele).find('.queue_check').attr('data-up', 4);
          }
        },
        _setStatus2: function(target) {
          var _this = this;
          allowFiles.forEach(function(item){
            var qItem = _this._findEle(item, target);
            if (qItem.upStatus=='1') {
              $(qItem.statusDiv).find('.status').hide().end().find('.status2').show();
              $(qItem.ele).find('.easy_upload_upbtn').hide();
              $(qItem.ele).find('.queue_check').attr('data-up',2);
            }
          });
        },
        _showProgress: function(index,target) {
          var _this = this;
          var param = this._findEle(index, target);
          $(param.ele).find('.easy_upload_upbtn').hide(400);
          $(param.statusDiv).find('.status').hide().end().find('.status3').show();
          var upBar = param.upBar;
          var upPeacent = param.upPeacent;
          var percentBoundary = Math.floor(Math.random() * 10) + 75;
          showTimer = setInterval(function () {
            if (loadedPercent < 100) {
              if (!uploadCompleted && loadedPercent > percentBoundary) {
                increasePercent = 0;
              } else {
                increasePercent = 1;
              }
              loadedPercent += increasePercent;
              $(upPeacent).text(loadedPercent + '%');
              $(upBar).css("width", loadedPercent + "%");
            } else {
              $(upPeacent).text('100%');
              $(upBar).css("width", "100%");
              $(param.statusDiv).find('.status').hide().end().find('.status5').show();
              upFiniehed = true;
              allowNewPost = true;
              clearInterval(showTimer);
              if (postedNum < allowFiles.length) _this._uploadFile(target);
            }
          }, 10);
        },
        _findEle: function(index, target) {
          var obj = {};
          obj.ele = $(target).find(`.easy_upload_queue_item[data-index=${index}]`);
          obj.upBar = $(obj.ele).find('.easy_upload_bar');
          obj.upPeacent = $(obj.ele).find('.easy_upload_percent');
          obj.statusDiv = $(obj.ele).find('.easy_upload_status');
          obj.upStatus = $(obj.ele).find('.queue_check').attr('data-up');
          return obj;
        },
        _findItems: function(type,target) {
          var arr = [];
          if (type==1) {
            var icon = $(target).find('.queue_check_allow_true[data-up="1"][data-checked="yes"]:visible');
          } else{
            var icon = $(target).find('.queue_check[data-up="1"][data-checked="yes"]:visible,.queue_check[data-up="2"][data-checked="yes"]:visible,.queue_check[data-up="4"][data-checked="yes"]:visible');
          }
          for (var i = 0; i < icon.length; i++) {
            var indx = $(icon[i]).parent().parent().attr('data-index');
            arr.push(indx);
          }
          return arr;
        },
        _deleFiles: function(arr,target) {
          var _this = this;
          function dele(item) {
            response.success.forEach(function(item1,index1){
              if (item == item1.easyFileIndex) response.success.splice(index1,1);
            });
            response.error.forEach(function(item2,index2){
              if (item == item2.easyFileIndex) response.error.splice(index2, 1);
            });
          }
          function deleAllowFiles(itm) {
            allowFiles.forEach(function(item,index){
              if (itm == item) allowFiles.splice(index,1);
            }); 
          }
          arr.forEach(function(item){
            $(target).find(`.easy_upload_queue_item[data-index=${item}]`).hide().find('.queue_check').hide();
            if (option.multi) dele(item);
            var qItem = _this._findEle(item, target);
            if (qItem.upStatus=='2') deleAllowFiles(item);
          });
          option.deleteFunc && option.deleteFunc(response);
        },
        _handleFailed: function(param) {
          clearInterval(showTimer);
          $(param.upBar).css("background-color", "red");
          $(param.statusDiv).find('.status').hide().end().find('.status4').show();
        },
        _resetParam: function() {
          loadedPercent = 0;
          increasePercent = 1;
          showTimer = undefined;
          uploadCompleted = false;
        }
      };
      easyManager.init();
    });
  }
}(jQuery));