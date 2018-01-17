# easyUpload.js
试用过一些资源，发现无法满足项目业务需求，或者无法满足个人的免费要求。因此，我决定从第一行代码开始，来编写一个即免费又好用的玩意。它可以覆盖大部分应用场景，同时也必须高效、稳定、易配置。是的，正是出于这个动机，才有了你看到的这个小项目。个人水平有限，欢迎各位网友批评指正，也可与我联系交流（Email：funnyque@163.com； QQ：1016981640）

## 插件支持
- 文件类型可配置
- 允许文件大小可配置
- 是否开启多文件上传可配置
- 多文件上传数可配置
- 支持样式自定义
- 支持单文件上传及删除
- 支持多文件一键上传及删除
- 支持实时展示上传进度条
- 支持上传前文件预览

## 文件说明
实际需要用到这里的文件可能只有：

```text
easyUpload.js
easy-upload.less
easy-upload.css
font/
img/
```
easyUpload.js是插件的主要文件；easy-upload.less便于对css修改；easy-upload.css是less预处理后编译文件，对less不熟悉可以直接修改它；font文件夹里有插件需要用到的字体库；img里有显示上传状态的gif；项目中其他文件则是为了便于你查看demo后加入的。当然，这个插件依赖于jq，调用插件之前需要先引入jq。关于插件的使用，你可以参考下面的使用说明，也可以直接查看demo.html内的示例，这样你可以更快的搞明白

## 使用说明
插件使用四步搞定：

- 定义一个结构用于放入插件
```html
<div id="easyContainer"></div>
```

- 引入easy-upload.css
```html
<link rel="stylesheet" href="easy-upload.css">
```

- 引入jq及easyUpload.js
```html
<script src="vendor/jquery-1.12.4.min.js"></script>
<script src="easyUpload.js"></script>
```

- 配置插件
```javascript
$('#easyContainer').easyUpload({
  allowFileTypes: '*.jpg;*.doc;*.pdf',//允许上传文件类型，格式'*.jpg;*.doc;*.pdf'
  allowFileSize: 100000,//允许上传文件大小(KB)
  selectText: '选择文件',//选择文件按钮文案
  multi: true,//是否允许多文件上传
  multiNum: 5,//多文件上传时允许的文件数
  showNote: true,//是否展示文件上传说明
  note: '提示：最多上传5个文件，支持格式为doc、pdf、jpg',//文件上传说明
  showPreview: true,//是否显示文件预览
  url: '/api/file/upload',//上传文件地址
  fileName: 'file',//文件filename配置参数
  formParam: {
    token: $.cookie('token_cookie')//不需要验证token时可以去掉
  },//文件filename以外的配置参数，格式：{key1:value1,key2:value2}
  timeout: 10000,//请求超时时间
  okCode: 200,//与后端返回数据code值一致时执行成功回调，不配置默认200
  successFunc: function(res) {
    console.log('成功回调', res);
  },//上传成功回调函数
  errorFunc: function(res) {
    console.log('失败回调', res);
  },//上传失败回调函数
  deleteFunc: function(res) {
    console.log('删除回调', res);
  }//删除文件回调函数
});
```