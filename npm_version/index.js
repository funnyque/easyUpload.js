import './src/easy_upload.css';
import easyUpload from './src/easyUpload';

easyUpload({
    easyId: 'easy1',
    action: 'https://jsonplaceholder.typicode.com/posts/',
    accept: '.jpg,.png,.gif,.docx',
    maxSize: 1, //单位MB
    showLoading: true,
    setRequestHeader: function(xhr) {
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    },
    setRequestHeader: function (xhr) {
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        //和原生xhr配置api保持一致
    },
    buildSendData: function (file) {
        // var formData = new FormData(); // 发送格式为formData时
        // formData.append('name', file.file)
        // return formData;

        // return file.base64; //发送格式为base64时

        return null; //发送空数据，用于测试。默认return null
    },
    checkSuccessCode: function (xhr) {
        if (/error/.test(xhr.responseText.toLowerCase())) { //这里判断仅仅用于测试，具体看项目
            return false;
        } else {
            return true;
        } //默认return tue
    },
    uploadStart: function (self) {
        // 文件队列上传前的回调函数，传入唯一参数'self'是当前插件实例
        console.log('上传开始，现在的队列是', self.files)
    },
    uploadEnd: function (self) {
        // 文件队列上传完成后的回调函数，传入唯一参数'self'是当前插件实例
        console.log('上传完成了，现在的队列是', self.files)
    }
});

//创建另个一实例如下
easyUpload({
    easyId: 'easy2',
    action: 'https://jsonplaceholder.typicode.com/posts/',
    accept: '.jpg,.png,.gif,.docx',
    maxSize: 3, //单位MB
    showLoading: true,
    setRequestHeader: function (xhr) {
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        //和原生xhr配置api保持一致
    },
    buildSendData: function (file) {
        // var formData = new FormData(); // 发送格式为formData时
        // formData.append('name', file.file)
        // return formData;

        // return file.base64; //发送格式为base64时

        return null; //发送空数据，用于测试。默认return null
    },
    checkSuccessCode: function (xhr) {
        if (/error/.test(xhr.responseText.toLowerCase())) { //这里判断仅仅用于测试，具体看项目
            return false;
        } else {
            return true;
        } //默认return ture
    },
    uploadStart: function (self) {
        // 文件队列上传前的回调函数，传入唯一参数'self'是当前插件实例
        console.log('上传开始，现在的队列是', self.files)
    },
    uploadEnd: function (self) {
        // 文件队列上传完成后的回调函数，传入唯一参数'self'是当前插件实例
        console.log('上传完成了，现在的队列是', self.files)
    }
});
