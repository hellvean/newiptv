var Tool = function(){
	
	var this_ = this;
	
	//机顶盒厂家分类焦点适配
	try{
		var STB = navigator.appName;
		//if(STB == "Ranger" || STB == "EIS iPanel"){//机顶盒浏览器区分 华为 创维
		if(STB == "Ranger"){//机顶盒浏览器区分 华为 创维
			iPanel.focusWidth = "-1";//焦点框宽度
		}else if(STB == "ztebw" || STB == "Fhbw2.0" || STB == "EIS iPanel"){//中兴 烽火
			iPanel.focusWidth = "0";//焦点框宽度
		}else{
			iPanel.focusWidth = "0";//焦点框宽度
		}
	}catch(e){
	}
	
	//ip配置
	this.getIP = function(){
		//return "http://42.236.61.18:5124/iptv/fit/";
		return "http://10.253.255.149:5124/iptv/fit/"
	}
	
	//用户行为记录接口
	this.setLog = function(ossUserId,sourceDesc,sourcePath){
		$.ajax({
			url: "http://10.253.255.149:5124/iptv/fit/adminUserLog/add",
			type: "post",
			contentType:"application/json; charset=utf-8",
			data: JSON.stringify({
				ossUserId: ossUserId,
				sourceDesc: sourceDesc,
				sourcePath: sourcePath,
				masterId: this_.getCookie("masterId")
			}),
			success: function(res){
				
			},
			error: function(error){
				
			}
		})
	}
	
	//时间戳转年月日
	this.getLocalTime = function(nS){
		var T = new Date(parseInt(nS) * 1000);
		T = T.getFullYear() + '-' + (T.getMonth() + 1) + '-' + T.getDate() + ' ' + T.getHours() + ':' + T.getMinutes() + ':' + T.getSeconds();
		return T;
	};
	
	//截取URL携带参数
	this.getParam = function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	
	//删除数组中指定元素
	this.removeByValue = function(arry,val){
		for(var i=0; i<arry.length; i++) {
		    if(arry[i] == val) {
		      arry.splice(i, 1);
		      break;
		    }
		}
	};
	
	//删除字符串中指定子字符串
	// this.deleteStr = function(Str){
	// 	var str = Str.replace("?","");
	// 	return str;   
	// };
	
	//浅拷贝转换成深拷贝
	this.deepclone = function(obj){
		var cloneObj = JSON.stringify(obj);
		cloneObj = JSON.parse(cloneObj);
		return cloneObj;
	}
	
	//存储cookie
	this.setCookie = function(name,value){
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
	};
	
	//获取cookie
	this.getCookie = function(name){
		var arg = name + "= ";
		var alen = arg.length;
		var clen = document.cookie.length;
		var cookies = document.cookie.split(';');
		for (i = 0; i < cookies.length; i++) {
		    var items = cookies[i].split('=');
		    if (items[0].replace(/[ ]/g,"") == name)
		        return cookies[i].substr(cookies[i].indexOf("=")+1, cookies[i].length);
		    //return items[1];
		}
		return null;
	};
	
	//记录用户
	this.grabEvent = function(evt,eventHandler){
		evt = evt ? evt : window.event;
		var keycode = evt.keyCode;
		if(keycode == null) {
		    keycode = evt.which;
		}
		var code = "";
		var value = "";
		switch(keycode) {
		    case 280:
		        code = "KEY_REFRESH";
		        break;
		    case 33://上翻页
		        code = "KEY_PAGE_UP";
		        break;
		    case 34:
		        code = "KEY_PAGE_DOWN";
		        break;
		    case 37://左
		        code = "KEY_LEFT";
		        break;
		    case 38://上
		        code = "KEY_UP";
		        break;
		    case 39://右
		        code = "KEY_RIGHT";
		        break;
		    case 40://下
		        code = "KEY_DOWN";
		        break;
		    case 8://返回
		        code = "KEY_BACK";
		        break;
		    case 13://OK
		        code = "KEY_SELECT";
		        break;
		    case 0x0030://0
		        code = "KEY_NUMERIC";
		        value = "0";
		        break;
		    case 0x0031://1
		        code = "KEY_NUMERIC1";
		        value = "1";
		        break;
		    case 0x0032://2
		        code = "KEY_NUMERIC2";
		        value = "2";
		        break;
		    case 0x0033://3
		        code = "KEY_NUMERIC3";
		        value = "3";
		        break;
		    case 0x0034://4
		        code = "KEY_NUMERIC4";
		        value = "4";
		        break;
		    case 0x0035://5
		        code = "KEY_NUMERIC5";
		        value = "5";
		        break;
		    case 0x0036://6
		        code = "KEY_NUMERIC6";
		        value = "6";
		        break;
		    case 0x0037://7
		        code = "KEY_NUMERIC7";
		        value = "7";
		        break;
		    case 0x0038://8
		        code = "KEY_NUMERIC8";
		        value = "8";
		        break;
		    case 0x0039://9
		        code = "KEY_NUMERIC9";
		        value = "9";
		        break;
		    case 0x011B://输入法
		        code = "KEY_#";
		        break;
		    case 0x0118://delete
		        code = "KEY_DELETE";
		        break;
		    case 259://提高音量
		        code = "KEY_VOLUMEUP";
		        break;
		    case 260://降低音量
		        code = "KEY_VOLUMEDOWN";
		        break;
		    case 261://静音键
		        code = "KEY_MUTE";
		        break;
		    case 257://频道加键
		        break;
		    case 258://频道减键
		        break;
		    case 263://暂停播放键
		        code = "KEY_PAUSE";
		        break;
		    case 264://快进键
		        code = "KEY_PLAYFORWARD";
		        break;
		    case 265://快退键
		        code = "KEY_PLAYREWIND";
		        break;
		    case 768://播放事件
		        code = "KEY_UTILITY";
		        break;
		    case 272://返回首页
		        code = "KEY_HOME";
		        break;
		}
		eventHandler({"code":code, "value":value});
	}
	
	//机顶盒打印信息
	this.alertLog = function(msg){
		var alertwrap = '<div style="background:#fff;border:1px solid #ddd;border-radius: 4px;padding:15px 25px;line-height:24px;position: absolute;top:25%;left:10%;z-index:999;width:80%;">'
							+msg+
						'</div>';
		$("body").append(alertwrap);
	}
	
	//获取机顶盒用户数据
	this.getAuthorinfo = function(infotype){
		try{
			var authorInfo = Authentication.CTCGetConfig();
			var info = null;
			for(var i in authorInfo){
				console.log(i);
				if(i == infotype){
					info = authorInfo[i];
					break;
				}
			};
			return info;
		}catch(e){
			//开发测试默认值
			var authorInfo = {
				"UserID":"1",
				"UserToken":"123"
			};
			var info = null;
			for(var i in authorInfo){
				console.log(i);
				if(i == infotype){
					info = authorInfo[i];
					break;
				}
			};
			return info;
		}
	}
	
	//阻塞点击和释放点击
	this.stopclick = function(clickobj){
		if(clickobj.attr("isclick") && clickobj.attr("isclick") == "1"){
			return;
		}else{
			clickobj.attr("isclick","1");
		}
	}
	this.startclick = function(clickobj){
		clickobj.removeAttr("isclick");
	}
	
	//ajax 请求操作
	this.ajaxActive = function(method,apiname,params,datatype,callback,errcallback){
		var Apiaddress = apiname;
		if(method == "get"){
			$.ajax({
				type:method,
				url:Apiaddress,
				datatype:datatype,
				timeout: 10000,
				success:function(data){
					console.log(actionname+" : "+JSON.stringify(data));
					if(typeof data == "string"){
						data = JSON.parse(data);
					}
					if(typeof callback == "function"){
						callback(data);
					}
				},
				error:function(error){
					console.log(JSON.stringify(error));
					if(typeof errcallback == "function"){
						errcallback(data);
					}
				}
			});
		}else{
			$.ajax({
				type:method,
				url:Apiaddress,
				data:params,
				datatype:datatype,
				timeout: 10000,
				success:function(data){
					console.log(actionname+" : "+JSON.stringify(data));
					if(typeof data == "string"){
						data = JSON.parse(data);
					}
					if(typeof callback == "function"){
						callback(data);
					}
				},
				error:function(error){
					console.log(JSON.stringify(error));
					if(typeof errcallback == "function"){
						errcallback(data);
					}
				}
			});
		}
	}
	
	this.isSTBType = function(STBTypeArray){
		var blackSTBTypeArray = STBTypeArray;
		function getSTBType () {
			var stbModel = '';
			if(typeof(Authentication) == 'object')
			{
				stbModel = Authentication.CTCGetConfig('STBType');
		
				if (!stbModel)
				{
					stbModel = Authentication.CUGetConfig("STBType");
				}
		
				if(!stbModel)
				{
					stbModel = Authentication.CTCGetConfig("device.stbmodel");
				}
			}
		
			if(!stbModel && typeof(ztebw) == 'object' )
			{
				stbModel = ztebw.ioctlRead("infoZTEHWType");
				if(!stbModel)
				{
					stbModel = ztebw.ioctlRead("infoHWProduct");
				}
			}
			return stbModel;
		}
		var STBType = getSTBType();
		
		return (function (STBType,blackSTBTypeArray) {
			if(STBType) {
				STBType = STBType.toLocaleUpperCase();
				if (Object.prototype.toString.call(blackSTBTypeArray) == '[object Array]') {
					var length = blackSTBTypeArray.length;
					for (var i = 0; i < length; i++) {
						if( STBType.indexOf(blackSTBTypeArray[i].toLocaleUpperCase()) === 0 ){
							return true;
						}
					}
				}else {
				}
			}else {
			}
			return false;
		}(STBType,blackSTBTypeArray));
	}
	
}

var tool = new Tool();

//监听遥控器按钮事件
document.onkeydown = function(e){
	tool.grabEvent(e,eventHandler);
}
document.onkeypress = function(e){
	tool.grabEvent(e,eventHandler);
}
document.onsystemevent = function(e){
	tool.grabEvent(e,eventHandler);
}
document.onirkeypress = function(e){
	tool.grabEvent(e,eventHandler);
}