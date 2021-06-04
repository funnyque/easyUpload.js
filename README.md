# easyUpload.js ![version](https://img.shields.io/badge/version-3.0.1-informational) ![build](https://img.shields.io/badge/build-passing-brightgreen)
**一款简单简单易用、可配置的H5/Web文件上传插件。支持多文件上传、批量上传、混合上传，以及多实例上传。** easyUpload.js有js和npm两个版本，本版本为js版本。还可「[点我尝试npm版本](https://github.com/funnyque/easyUpload.js/tree/master/npm_version/easy-upload-js)」。

![实例图片](https://ftp.bmp.ovh/imgs/2021/05/4ecbddba9a536b7e.png)
「 [点我查看js版本演示](https://funnyque.github.io/easyUpload.js/) 」

## 特性
- *文件类型可配置*
- *文件数量可配置*
- *文件大小可配置*
- *上传前文件可预览*
- *展示上传实时进度条*
- *批量上传*
- *支持不同类型文件混合上传*
- *支持自由配置 base64 或 FormData 等数据格式*
- *支持自由配置请求头等，api保持和原生api一致*
- *支持自由配置请求成功状态码*
- *css与结构分离，支持自由定制样式*
- *原生js编写，不依赖任何类库*

## 使用说明
1. html页面内引入easyUpload.min.js和easy_upload.min.css，简单配置后即可使用
2. 生产环境建议使用dist文件夹内压缩代码，二次开发测试可参考src文件夹内源代码

## 配置说明
```js
// easyUpload(configs)
easyUpload({
   easyId: 'easy1',
   action: 'https://jsonplaceholder.typicode.com/posts/',
   accept: '.jpg,.png,.gif,.pdf,.docx',
   maxSize: 3, //单位MB
   showLoading: true,
   setRequestHeader: function(xhr) {
       xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
       //和原生xhr配置api保持一致
   },
   buildSendData: function(file) {
       // var formData = new FormData(); // 发送格式为formData时
       // formData.append('name', file.file)
       // return formData;

       // return file.base64; //发送格式为base64时

       return null; //发送空数据，用于测试。默认return null
   },
   checkSuccessCode: function(xhr) {
       if (/error/.test(xhr.responseText.toLowerCase())) { //这里判断仅仅用于测试，具体看项目
           return false;
       } else {
           return true;
       } //默认return true
   },
   uploadStart: function(self) {
        // 文件队列上传前的回调函数，传入唯一参数'self'是当前插件实例
        console.log('上传开始，现在的队列是', self.files)
   },
   uploadEnd: function(self) {
        // 文件队列上传完成后的回调函数，传入唯一参数'self'是当前插件实例
        console.log('上传完成了，现在的队列是', self.files)
   }
});
```

## 参数说明
```js
// 以下为默认配置，重新配置后将覆盖
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
     maxSize: 3, //允许上传文件的最大体积，单位MB，Number类型
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
```

## 欢迎交流及支持
*WeChat: qqyun686（务必备注）*

<center class="half">
    <img src="https://ftp.bmp.ovh/imgs/2021/05/b870caa8aa907479.jpg" width="150" style="margin-right: 50px"/>
    <img src = "https://ftp.bmp.ovh/imgs/2021/05/7fee263e3a0e73f3.jpg" width="150" />
</center>
