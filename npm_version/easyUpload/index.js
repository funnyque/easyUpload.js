(()=>{var e={808:e=>{var t={easyId:"",accept:".jpg,.png,.pdf",action:"",btnText:{select:"选择文件",upload:"上传",delete:"删除",cancel:"终止"},maxCount:3,maxSize:3,multiple:!0,messageTime:2e3,responseType:"text",showSize:!0,showLoading:!1,statusText:{0:"允许上传",1:"即将上传",2:"0%",3:"上传成功",4:"上传失败",5:"体积超出"},statusTextColor:{0:"normalcolor",1:"normalcolor",2:"normalcolor",3:"normalcolor",4:"failedcolor",5:"warncolor"},statusBg:{0:"normalbg",1:"normalbg",2:"normalbg",3:"normalbg",4:"failedbg",5:"warnbg"},timeout:0,withCredentials:!0,setRequestHeader:null,buildSendData:null,checkSuccessCode:null,uploadStart:null,uploadEnd:null};function s(e){var c=this instanceof s?this:Object.create(s.prototype);return c.configs=Object.assign({},t,e),c.files=[],c.fileId=0,c.xhrFiles=[],c.isXhrReady=!0,c.xhr=new XMLHttpRequest,function(e){var t='<span class="message-box">我是message</span>'+(e.configs.showLoading?'<div class="loading"><div class="loading-icon"></div><div class="loading-mask"></div></div>':"")+'<input type="file" name="file" class="input-file"'+(e.configs.multiple?"multiple":"")+' accept="'+e.configs.accept+'"><div class="btn-list"><div btntype="select" class="btn btn-list-item btnlist-item-selsct">'+e.configs.btnText.select+'</div><div btntype="upload" class="btn btn-list-item btnlist-item-upload">'+e.configs.btnText.upload+'</div><div btntype="delete" class="btn btn-list-item btnlist-item-danger">'+e.configs.btnText.delete+'</div><div btntype="cancel" class="btn btn-list-item btnlist-item-danger">'+e.configs.btnText.cancel+'</div><div btntype="checkall" class="btn btn-list-item checkbox unchecked">✓</div></div><ul class="file-list"></ul>';document.getElementById(e.configs.easyId).innerHTML=t,function(e){document.getElementById(e.configs.easyId).querySelector(".btn-list").onclick=function(t){switch(((t=t||window.event).target||t.srcElement).getAttribute("btntype")){case"select":!function(e){document.getElementById(e.configs.easyId).querySelector(".input-file").click()}(e);break;case"upload":!function(e){for(var t=0;t<e.files.length;t++)!e.files[t].isChecked||4!=e.files[t].status&&0!=e.files[t].status&&3!=e.files[t].status||(e.files[t].status=1,e.files[t].progress="0%",e.xhrFiles.push(e.files[t]),u(e,{progress:"0%",id:e.files[t].id,status:e.files[t].status}));if(e.xhrFiles.length){if(d(e),e.isXhrReady){var s=0;function i(){e.xhrFiles[s].status=2,d(e),e.xhr.open("post",e.configs.action),e.xhr.timeout=e.configs.timeout,e.xhr.responseType=e.configs.responseType,e.xhr.withCredentials=e.configs.withCredentials,e.configs.setRequestHeader&&e.configs.setRequestHeader(e.xhr),e.xhr.addEventListener("progress",(function(t){var i=String((t.loaded/t.total*100).toFixed(2))+"%";e.xhrFiles[s].progress=i,u(e,{progress:i,id:e.xhrFiles[s].id,status:e.xhrFiles[s].status})})),e.xhr.onreadystatechange=function(){if(4==e.xhr.readyState){var t={progress:e.xhrFiles[s].progress,id:e.xhrFiles[s].id,status:e.xhrFiles[s].status};200==e.xhr.status&&null==e.configs.checkSuccessCode||e.configs.checkSuccessCode(e.xhr)?(g(e,t),u(e,t),n(3)):(g(e,t),u(e,t),n(4))}},null==e.configs.buildSendData?e.xhr.send(null):e.xhr.send(e.configs.buildSendData(e.xhrFiles[s]))}function n(t){e.xhrFiles[s].status=t,d(e),s++,e.isXhrReady=!0,s<e.xhrFiles.length?i():(e.xhrFiles=[],s=0,e.configs.showLoading&&h(e,!1),e.configs.uploadEnd&&e.configs.uploadEnd(e))}e.isXhrReady=!1,e.configs.uploadStart&&e.configs.uploadStart(e),e.configs.showLoading&&h(e,!0),i()}}else e.files.length&&m(e,{text:"未选中有效文件",class_name:e.configs.statusBg[5]})}(e);break;case"delete":n(e),l(e,"delete"),i(e);break;case"cancel":!function(e){e.xhr.onabort=function(){m(e,{text:"成功取消上传",class_name:e.configs.statusBg[3]})},e.xhr.abort()}(e);break;case"checkall":l(e,"click"),o(e)}}}(e),function(e){document.getElementById(e.configs.easyId).querySelector(".input-file").addEventListener("change",(function(){var t=0,s=this;function n(t){e.files.length<e.configs.maxCount?(e.files.push(t),e.fileId++):m(e,{text:"文件数量超出",class_name:e.configs.statusBg[5]})}!function o(){if(t<s.files.length){var c={id:e.fileId,name:s.files[t].name,size:s.files[t].size,type:s.files[t].type,isChecked:!1,status:0,progress:"0%",file:s.files[t]};/image\//.test(s.files[t].type)?(a=s.files[t],r=function(e){c.base64=e,n(c),t++,o()},(f=new FileReader).onload=function(){r&&r(this.result)},f.readAsDataURL(a)):(n(c),t++,o())}else l(e),i(e),s.value=[];var a,r,f}()}))}(e)}(c),c}function i(e){for(var t="",s=0;s<e.files.length;s++)t+='<li class="file-list-item" fileid="'+e.files[s].id+'"><div class="preview">'+(/image\//.test(e.files[s].type)?'<img class="preview-img" src="'+e.files[s].base64+'" alt="'+e.files[s].name+'">':'<div class="preview-div"></div>')+'</div><div class="btn-file"><div btntype="delone" class="btn btn-file-del" fileid="'+e.files[s].id+'"><span btntype="delone" class="btn-file-del-text" fileid="'+e.files[s].id+'">X</span></div><div btntype="checkone" class="btn btn-file-checkbox checkbox '+(e.files[s].isChecked?"checked":"unchecked")+'" fileid="'+e.files[s].id+'">✓</div></div><div class="fileinfo"><p class="fileinfo-text"><span class="fileinfo-text-name">'+(e.configs.showSize?'<i class="fileinfo-text-size '+c(e,e.files[s])+'">'+f(e.files[s].size)+"</i>":"")+e.files[s].name+'</span><span class="fileinfo-text-status '+e.configs.statusTextColor[e.files[s].status]+'" fileid="'+e.files[s].id+'">'+e.configs.statusText[e.files[s].status]+'</span></p><div class="fileinfo-progress"><div class="fileinfo-progress-bar '+e.configs.statusBg[e.files[s].status]+'" style="width:'+e.files[s].progress+';" fileid="'+e.files[s].id+'"></div></div></div></li>';document.getElementById(e.configs.easyId).querySelector(".file-list").innerHTML=t,function(e){document.getElementById(e.configs.easyId).querySelector(".file-list").onclick=function(t){var s=(t=t||window.event).target||t.srcElement,c=s.getAttribute("fileid");switch(s.getAttribute("btntype")){case"checkone":!function(e,t){for(var s=0;s<e.files.length;s++)e.files[s].id==t&&(e.files[s].isChecked=!e.files[s].isChecked)}(e,c),l(e),o(e,c);break;case"delone":n(e,c),l(e),i(e)}}}(e)}function n(e,t){if(!e.files.length||a(e)||null!=t){for(var s=[],i=0;i<e.files.length;i++)t&&e.files[i].id!=t&&s.push(e.files[i]),t||e.files[i].isChecked||s.push(e.files[i]);e.files=s}else m(e,{text:"未选中文件",class_name:e.configs.statusBg[5]})}function l(e,t){var s=document.getElementById(e.configs.easyId).querySelector(".btn-list").querySelector(".checkbox");if(e.files.length){var i=a(e)==e.files.length;"click"==t?(p(s,!i),function(e,t){for(var s=0;s<e.files.length;s++)e.files[s].isChecked=t}(e,!i)):p(s,i)}else{if("delete"==t)return;if(/\sunchecked$/.test(s.className))return void p(s,!0);if(/\schecked$/.test(s.className))return void p(s,!1)}}function o(e,t){var s=document.getElementById(e.configs.easyId);if(t){var i=r(e,t);p(s.querySelector('[fileid="'+t+'"]').querySelector(".checkbox"),i.isChecked)}else for(var n=a(e)==e.files.length,l=s.querySelectorAll(".file-list-item"),o=0;o<l.length;o++)p(l[o].querySelector(".checkbox"),n)}function c(e,t){var s=(t.size/Math.pow(1024,2)).toFixed(2);return e.configs.maxSize>s?e.configs.statusBg[0]:(t.status=5,e.configs.statusBg[5])}function a(e){for(var t=0,s=0;s<e.files.length;s++)e.files[s].isChecked&&t++;return t}function r(e,t){for(var s=0;s<e.files.length;s++)if(e.files[s].id==t)return e.files[s]}function f(e){if(0===e)return"0 B";var t=Math.floor(Math.log(e)/Math.log(1024));return(e/Math.pow(1024,t)).toPrecision(3)+" "+["B","KB","MB","GB","TB","PB","EB","ZB","YB"][t]}function d(e){for(var t=document.getElementById(e.configs.easyId).querySelectorAll(".file-list-item"),s=0;s<t.length;s++){var i=t[s].getAttribute("fileid");t[s].querySelector(".fileinfo-text-status").innerHTML=e.configs.statusText[r(e,i).status]}}function u(e,t){var s=document.getElementById(e.configs.easyId).querySelector('[fileid="'+t.id+'"]').querySelector(".fileinfo-progress-bar");s.style.width=t.progress,s.className="fileinfo-progress-bar "+e.configs.statusBg[t.status]}function g(e,t){for(var s=document.getElementById(e.configs.easyId).querySelectorAll(".fileinfo-text-status"),i=0;i<s.length;i++)t.id==s[i].getAttribute("fileid")&&(s[i].className="fileinfo-text-status "+e.configs.statusTextColor[t.status])}function p(e,t){t?/\sunchecked$/.test(e.className)&&(e.className=e.className.replace("unchecked","checked")):/\schecked$/.test(e.className)&&(e.className=e.className.replace("checked","unchecked"))}function h(e,t){document.getElementById(e.configs.easyId).querySelector(".loading").style.display=t?"block":"none"}function m(e,t){var s=document.getElementById(e.configs.easyId).querySelector(".message-box");s.className="message-box "+t.class_name,s.style.display="inline-block",s.innerHTML=t.text,setTimeout((function(){s.style.display="none"}),e.configs.messageTime)}s.prototype={constouctor:s},e.exports=s}},t={};function s(i){var n=t[i];if(void 0!==n)return n.exports;var l=t[i]={exports:{}};return e[i](l,l.exports,s),l.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var i in t)s.o(t,i)&&!s.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=s(808),t=s.n(e);t()({easyId:"easy1",action:"https://jsonplaceholder.typicode.com/posts/",accept:".jpg,.png,.gif,.docx",maxSize:1,showLoading:!0,setRequestHeader:function(e){e.setRequestHeader("content-type","application/x-www-form-urlencoded")},setRequestHeader:function(e){e.setRequestHeader("content-type","application/x-www-form-urlencoded")},buildSendData:function(e){return null},checkSuccessCode:function(e){return!/error/.test(e.responseText.toLowerCase())},uploadStart:function(e){console.log("上传开始，现在的队列是",e.files)},uploadEnd:function(e){console.log("上传完成了，现在的队列是",e.files)}}),t()({easyId:"easy2",action:"https://jsonplaceholder.typicode.com/posts/",accept:".jpg,.png,.gif,.docx",maxSize:3,showLoading:!0,setRequestHeader:function(e){e.setRequestHeader("content-type","application/x-www-form-urlencoded")},buildSendData:function(e){return null},checkSuccessCode:function(e){return!/error/.test(e.responseText.toLowerCase())},uploadStart:function(e){console.log("上传开始，现在的队列是",e.files)},uploadEnd:function(e){console.log("上传完成了，现在的队列是",e.files)}})})()})();