# easyUploader
一款简单易用H5上传插件，主要面向小文件，支持多文件上传，批量上传，以及混合上传

# 支持
- 文件类型可配置
- 文件数量可配置
- 文件允许大小可配置
- 批量上传
- 上传前预览
- 实时进度条
- base64上传
- formData上传
- 附带样式表可自行修改样式

# 使用说明
1. 页面head内引入插件样式文件mian.css
2. srcipt标签引入easyUploader.js或easyUploader.jq.js
   -  easyUploader.jq.js相比easyUploader.js的区别是内置了一个jq库，项目内如已引用jq库，可选择没有内置jq的easyUploader.js

# 使用示例
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>easyUploader示例</title>
    <link rel="stylesheet" href="./main.css">
    <style>
        html * {
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
    <div id="uploader"></div>

    <script src="./easyUploader.jq.js"></script>
    <script>
        var uploader = easyUploader({
            id: "uploader",
            accept: '.jpg,.png',
            action: 'https://jsonplaceholder.typicode.com/posts/',
            dataFormat: 'formData',
            maxCount: 10,
            maxSize: 3,
            multiple: true,
            data: null,
            beforeUpload: function(file, data, args) {
                data.append('token', '387126b0-7b3e-4a2a-86ad-ae5c5edd0ae6TT'); //上传方式为formData时
                // data.id = file.id; //上传方式为base64时
            },
            onChange: function(fileList) {
                /* input选中时触发 */
            },
            onRemove: function(removedFiles, files) {
                console.log('onRemove', deletedFiles);
            },
            onSuccess: function(res) {
                console.log('onSuccess', res);
            },
            onError: function(err) {
                console.log('onError', err);
            },
        });

        var files = uploader.files; //通过实例的files熟悉可以访问上传文件
        console.log(files);
    </script>
</body>
</html>
```

# 参数配置
```
  defaultConfigs = {
      id: "", //渲染容器id
      accept: '.jpg,.png', //上传类型
      action: "", //自动上传地址
      autoUpload: false, //是否开启自动上传
      contentType: 'application/x-www-form-urlencoded', //同$.ajax参数，默认值为application/x-www-form-urlencoded
      crossDomain: true, //是否允许跨域
      data: null, //上传配置参数
      dataFormat: 'formData', //上传表单类型，有formData和base64两种
      dataType: 'json', //同$.ajax，默认返回数据格式为json
      headers: undefined, //上传的请求头部
      maxCount: 3, //最大上传文件数
      maxSize: 3, //最大上传文件体积，单位M
      multiple: false, //是否开启多选上传
      name: 'file', //上传的文件字段名
      previewWidth: 70, //压缩预览图的宽度
      processData: false, //同$.ajax参数，这里默认为false
      successKey: 'code', //标识上传成功的key
      successValue: 200, //标识上传成功对应的value
      showAlert: true, //是否开启alert提示
      timeout: 300000, //ajax请求超时时间，默认30秒
      withCredentials: true, //是否支持发送 cookie 凭证信息
      beforeUpload: null, //ajax上传前的钩子
      onAlert: null, //alert时的钩子
      onChange: null, //input change的回调函数
      onError: null, //上传失败时的钩子
      onRemove: null, //移除文件时的钩子
      onSuccess: null, //上传成功时的钩子
  }
```

# 版本信息
当前最新版本为V2.0，相对于V1版本体积更小，性能更佳，配置也更加灵活，欢迎新老朋友与我交流，或者给以反馈（update at 2019-03-14）
