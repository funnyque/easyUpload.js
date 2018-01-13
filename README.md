# easyUpload.js
一款流畅的H5文件上传插件，依赖于jquery

**# 支持 #**</br>
1、文件类型自定义（图片及各类文件均可自定义）</br>
2、文件大小自定义（自定义允许文件大小）</br>
3、是否允许多文件上传自定义</br>
4、多文件上传数量自定义</br>
5、布局样式自定义</br>
6、单文件上传及删除</br>
7、多文件一键上传及删除</br>
8、上传实时进度条</br>
9、文件预览</br>

**# 使用 #**</br>
1、页面head标签内引入'easy-upload.css'

2、页面script标签内依次引入jquery.js、easyUpload.js

3、插件配置，配置方法如下：
（页面结构仅需要一个容器，这里是一个id为easyContainer的div）

$('#easyContainer').easyUpload({
  allowFileTypes: '*.pdf;*.doc;*.docx;*.jpg',//允许上传文件类型，格式'*.pdf;*.doc;'
  allowFileSize: 100000,//允许上传文件大小(kb)
  selectText: '选择文件',//上传按钮文案
  multi: true,//是否允许多文件上传
  multiNum: 5,//多文件上传时允许的有效文件数
  showNote: true,//是否展示文件上传说明
  note: '提示：最多上传5个文件，超出默认前五个，支持格式为：doc、docx、pdf、jpg',//文件上传说明
  showPreview: true,//是否显示文件预览
  url: '/api/file/cdn/uploadHead',//上传文件地址
  fileName: 'file',//文件filename配置参数
  formParam: {
    token: $.cookie('token_cookie')
  },//文件以外的配置参数，格式：{key1:value1,key2:value2}
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