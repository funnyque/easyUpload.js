# easy-upload-js ![version](https://img.shields.io/badge/version-3.0.1-informational) ![build](https://img.shields.io/badge/build-passing-brightgreen)
**A easy configurable upload plugin. Support multi file upload, batch upload, mixed upload, and multi instance upload**

![demo](https://ftp.bmp.ovh/imgs/2021/05/4ecbddba9a536b7e.png)
「 [example](https://funnyque.github.io/easyUpload.js/) | [Github](https://github.com/funnyque/easyUpload.js/tree/master/npm_version) 」

## Features
- *Allow profile types*
- *Allow profile count*
- *Allow profile size*
- *Allow preview before upload*
- *Show real time upload progress*
- *Allow multiple uploads*
- *Allow mixed uploads*
- *Allow configing base64 or FormData*
- *Allow configing request header，api same as xhr's api*
- *Allow configing success code*
- *Allow configing css freely*
- *Native JS, does not rely on any class library*

## How to use
```js
// step1: intall
npm install easy-upload-js

// step2: import css
import 'easy-upload-js/css/index.css';

// step3: import plugin
import easyUpload from 'easy-upload-js';

// step4: config plugin
easyUpload(configs); // You can read the configs below
```

## Configs
```js
// easyUpload(configs);
easyUpload({
   easyId: 'easy1',
   action: 'https://jsonplaceholder.typicode.com/posts/',
   accept: '.jpg,.png,.gif,.pdf,.docx',
   maxSize: 3, //MB
   showLoading: true,
   setRequestHeader: function(xhr) {
       xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
       //same as xhr's api
   },
   buildSendData: function(file) {
       // var formData = new FormData();
       // formData.append('name', file.file)
       // return formData;

       // return file.base64;

       return null; // default return null
   },
   checkSuccessCode: function(xhr) {
       if (/error/.test(xhr.responseText.toLowerCase())) { 
           return false; // just for test here
       } else {
           return true;
       } // default return true
   },
   uploadStart: function(self) {
        // callback function after upload starts
        console.log('current upload queue is', self.xhrFiles)
   },
   uploadEnd: function(self) {
        // callback function after upload
        console.log('current upload queue is', self.xhrFiles)
   }
});
```

## Params
```js
 defaultConfigs = {
     easyId: '', //plugin's id, String type
     accept: '.jpg,.png,.pdf', //allowed file types, String type
     action: '', //upload url, String type
     btnText: {  //button's text, String type
         select: '选择文件',
         upload: '上传',
         delete: '删除',
         cancel: '终止'
     },
     maxCount: 3, //allow max file count once, Number type
     maxSize: 3, //allowed file's size，MB，Number type
     multiple: true, //allowed multiple files, Booleantype
     messageTime: 2000, //message's show time, Number type
     responseType: 'text', //xhr's responseType，String type
     showSize: true, //show file's size, Boolean type
     showLoading: false, //show loading animation, Boolean type
     statusText: {  //text for deferent status
         0: '允许上传', //size is ok
         1: '即将上传', //in the upload queue
         2: '0%',      //wait for xhr's response
         3: '上传成功',  //xhr response and upload successfully
         4: '上传失败',  //xhr response and failed upload
         5: '体积超出',  //file size over
     },
     statusTextColor: {  //className for statue
         0: 'normalcolor',  //normal statue
         1: 'normalcolor',  //normal statue
         2: 'normalcolor',  //normal statue
         3: 'normalcolor',  //normal statue
         4: 'failedcolor',  //failed status
         5: 'warncolor',    //warning status
     },
     statusBg: {  //background color for deferent status
         0: 'normalbg',  //normal status
         1: 'normalbg',  //normal status
         2: 'normalbg',  //normal status
         3: 'normalbg',  //normal status
         4: 'failedbg',  //failed status
         5: 'warnbg',    //warning status
     },
     timeout: 0, //request timeout milliseconds, 0 means permanent, Number type
     withCredentials: true, //allow upload cookies and others，Boolean type
     setRequestHeader: null, //function of how to configure XHR request header
     buildSendData: null, //function of build sending data，return data
     checkSuccessCode: null, //function of check success code，defaule return true
     uploadStart: null, //callback before upload
     uploadEnd: null //callback after upload
 };
```

## Support & Contact
*WeChat: qqyun686（remark please）*

<center class="half">
    <img src="https://ftp.bmp.ovh/imgs/2021/05/b870caa8aa907479.jpg" width="150" style="margin-right: 50px"/>
    <img src = "https://ftp.bmp.ovh/imgs/2021/05/7fee263e3a0e73f3.jpg" width="150" />
</center>
