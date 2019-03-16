# easyUpload.js
V2.0 以后更名为 easyUploader.js，是一款简单易用 H5 上传插件，主要面向小文件，支持多文件上传，批量上传，以及混合上传  
![easyUploader](/example/01.jpg)  
[试一试](http://www.jq22.com/jquery-info17836)

## 支持
- 文件类型可配置
- 文件数量可配置
- 文件允许大小可配置
- 批量上传
- 上传前预览
- 实时进度条
- base64 上传
- formData 上传
- 附带样式表可自行修改样式

## 使用说明
1. 页面 head 内引入插件样式文件 main.css
2. script 标签引入 easyUploader.js 或 easyUploader.jq.js
( easyUploader.jq.js 相比 easyUploader.js 的区别是内置了一个 jq 库，项目内如已引用 jq 库，可选择没有内置 jq 的 easyUploader.js )

## 使用示例
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>示例</title>
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
                /* dataFormat为formData时配置发送数据的方式 */
                data.append('token', '387126b0-7b3e-4a2a-86ad-ae5c5edd0ae6TT');
                data.append('otherKey', 'otherValue');

                /* dataFormat为base64时配置发送数据的方式 */
                // data.base = file.base;
                // data.token = '387126b0-7b3e-4a2a-86ad-ae5c5edd0ae6TT';
                // data.otherKey = 'otherValue';
            },
            onChange: function(fileList) {
                /* input选中时触发 */
            },
            onRemove: function(removedFiles, files) {
                console.log('onRemove', removedFiles);
            },
            onSuccess: function(res) {
                console.log('onSuccess', res);

                /* 通过实例的files属性可以访问上传文件 */
                var files = uploader.files;
                console.log('files', files);
        
                /*
                    files中各个字段值表示意思如下
                    ajaxResponse: ajax的的响应结果
                    base: 文件的base64编码
                    checked: 该文件是否被选中
                    file: 文件对象
                    id: 插件内部标识的文件id
                    isImg: 插件内部标识文件时否是图片
                    previewBase: 文件压缩后的base64编码，用于插件内部展示预览图
                    uploadPercentage: 文件上传进度百分比值
                    uploadStatus: 文件上传状态
                */
            },
            onError: function(err) {
                console.log('onError', err);
            },
        });
    </script>
</body>
</html>
```

## 参数配置
```
defaultConfigs = {
  id: "", /* 渲染容器id */
  accept: '.jpg,.png', /* 上传类型 */
  action: "", /* 上传地址 */
  autoUpload: false, /* 是否开启自动上传 */
  crossDomain: true, /* 是否允许跨域 */
  data: null, /* 上传配置参数，依据dataFormat而不同， */
  dataFormat: 'formData', /* 上传表单类型，有formData和base64两种 */
  dataType: 'json', /* 同$.ajax，默认返回数据格式为json */
  headers: {
      contentType: 'application/x-www-form-urlencoded', /* 默认为此contentType配置 */
  }, /* 上传的请求头部 */
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
  beforeUpload: null, /* ajax上传前的钩子 */
  onAlert: null, /* alert时的钩子 */
  onChange: null, /* input change的回调函数 */
  onError: null, /* 上传失败时的钩子 */
  onRemove: null, /* 移除文件时的钩子 */
  onSuccess: null, /* 上传成功时的钩子 */
}
```

## 当前版本
V2.0.2  (update at 2019-03-17)

## 版本说明
easyUpload.js V2.0 版本升级以后更名 easyUploader.js ，相对于V1版本体积更小，性能更佳，配置也更加灵活，欢迎新老朋友与我交流，或者给以反馈
