# easyUpload.js
这是一款H5文件上传插件，之所以写这个，是因为试用过很多资源，却发现都无法满足项目业务需求。大部资源只是涉及一个或两个场景，因此，我决定从第一行代码开始，来打造一个不一样的东西。它可以覆盖大部分应用场景，同时它也必须是高效、稳定、易配置。正是出于以上的动机，便有了这个小项目。本人90后单生狗一枚，水平有限，欢迎各位网友批评指正，也可与我联系交流（WeChat:xunyangpipa；QQ:1016981640）

## 插件支持
- 支持文件类型自定义
- 支持文件允许大小自定义
- 支持是否开启多文件上传自定义
- 支持多文件上传允许上传文件数自定义
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
easyUpload.js是插件的核心文件；easy-upload.less便于对css修改；easy-upload.css是less预处理后编译文件，对less不熟悉可以直接修改它；font文件夹里有插件需要用到的字体库；img里有显示上传状态的gif；项目中其他文件则是为了便于你查看demo后加入的。当然，这个插件依赖于jq，调用插件之前需要先引入jq。关于插件的使用，你可以参考下面的使用说明，也可以直接查看demo.html内的示例，这样你可以更快的搞明白

## 使用说明
插件使用只需四步：

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
  allowFileTypes: '*.jpg;*.doc;*.pdf',//允许上传文件类型，格式';*.doc;*.pdf'
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
  timeout: 30000,//请求超时时间
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

## 另外
再次感谢，十分欢迎你给出指正及建议，或与我联系交流，如果感到快乐那就给个star，O(∩_∩)O哈哈~