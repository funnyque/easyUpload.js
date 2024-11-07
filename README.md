# easyUpload.js V4.0.0
![version](https://img.shields.io/badge/version-4.0.0-informational) ![build](https://img.shields.io/badge/build-passing-brightgreen) ![browser](https://img.shields.io/badge/Browser-IE9+-brightgreen)
**一款轻量级、易使用、配置灵活的H5/Web上传插件，基于file input。采用原生js及css编写，不依赖其他类库，兼容IE9及以上，压缩体积仅有8kb (css+js)。支持多文件上传，多实例上传，并发上传，混合上传等** 
- easyUpload.js有js和npm两个版本，本版本为js版本。还可「[点我尝试npm版本](https://github.com/funnyque/easyUpload.js/tree/master/npm_version/easy-upload-js)」。

![实例图片](https://s3.bmp.ovh/imgs/2024/11/05/35f6d53466ae53e5.png)
「 [点我查看js版本演示](https://funnyque.github.io/easyUpload.js/) 」

## 特性
- *上传文件类型/数量/大小可配置*
- *上传前中后文件状态及上传进度实时预览*
- *支持多实例上传/批量上传/多类型文件混合上传*
- *支持并发上传（多文件同时上传）*
- *支持自由定义上传数据格式，如base64等*
- *支持自由配置请求头等，api保持和原生XMLHttpRequest一致*
- *支持自由配置请求成功状态*
- *css与结构分离，支持自由定制样式*
- *原生js编写，不依赖任何类库*

## 使用说明
1. html页面内引入easyUpload.min.js和easy_upload.min.css，简单配置后即可使用
2. 生产环境建议使用dist文件夹内压缩代码，二次开发测试可参考src文件夹内源代码

## 配置说明
```js
    var easy = new EasyUpload('#easy1', {
        url: 'https://jsonplaceholder.typicode.com/posts/',
        naxSize: 5,
        maxCount: 3,
        // readAs: 'BinaryString'
    });
    // 本次导入文件数>限定数maxCount时，触发onMax事件
    easy.onMax = function (fs) {
        // in为本次导入文件数，max为限定文件数
        console.log('in:' + fs.in, 'max:' + fs.max);
    }
    // 设置XMLHttpRequest实例的请求头
    easy.setHeader = function (xhr) {
        // 如下：
        // xhr.setRequestHeader('Content-Type', 'application/json');
    }
    // 自定义上传文件数据格式，未定义此方法时以参数readAs定义格式上传（默认base64格式）
    easy.setData = function (file) {
        // flie 为文件信息对象，file.source为原始文件对象
        // console.log(file)

        // 测试用
        return 'abcdefg';
    }
    // setFLag用来标识文件成功上传的状态
    easy.setFlag = function () {
        // return一个结果为true或者false的表达式，用来判断文件是否成功上传到服务器，如下：
        // return this.status == 200; 
    }
    // 文件上传过程中会触发onProgress事件
    easy.onProgress = function (p) {
        // p是上传进度百分比
        console.log('上传中', p)
    }
    // 每完成一个文件上传会触发onLoad事件
    easy.onLoad = function (_this) {
        // _this是当前XMLHttpRequest实例
        console.log('上传完一个', _this)
    }
    // 每失败一个文件上传会触发onError事件
    easy.onError = function (_this) {
        // _this是当前XMLHttpRequest实例
        console.log('上传失败一个', _this)
    }
    // 文件队列（所有文件）上传完成后会触发onEnd事件
    easy.onEnd = function () {
        // this是本次new出来的EasyUpload实例对象，this包含本实例的配置、属性、方法等
        console.log('上传完成', this)
    }

    // 创建另一个实例如下
    var easy2 = new EasyUpload('#easy2', { url: 'xxxx' })
```

## 参数说明
```js
// 以下为默认配置，重新配置后将覆盖
    var oConf = {
        accept: '.jpg,.png,.pdf,.doc,.docx', // 允许导入文件类型
        btnS: '导入文件', // 导入文件按钮展示文字
        btnU: '上传', // 上传文件按钮展示文字
        btnD: '删除', // 删除文件按钮展示文字
        btnC: '终止', // 终止上传按钮展示文字
        maxCount: 3, // 允许单次导入文件数量
        naxSize: 3, // 允许单个文件最大体积，单位M
        multiple: true, // 是否允许一次导入多个文件
        responseType: 'text', // 设置XMLHttpRequest响应数据格式
        timeout: 0, // 设置XMLHttpRequest求超时时间
        url: '', // 文件上传地址
        withCredentials: true, // 设置跨域请求是否提供凭据信息,
        readAs: 'DataURL' // 默认设置读取及长传文件为DataURL即base64格式。未定义setData方法情况下，以此字段定义数据格式上传
    };
```

## 欢迎交流及支持
*@email: funnyque@163.com*
*@wechat id: quedamao*
