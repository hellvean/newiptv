/**
 * Created by yyc on 2019/4/11.
 */
/**
 * 根据节目编码获取播放地址并进行播放
 */

var backstate = true; //弹窗返回 true表示弹窗未显示 false表示弹窗已显示,遥控器其它按钮事件失效
var forwardTime = 0; //快进时间
var backTime = 0;  //快退时间
var DTime = 0;  //差值时间
//时间秒数转时间格式00:00:00
function secondToDate(result) {
	var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
	var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
	var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
	return result = h + ":" + m + ":" + s;
};

var resetTimer=null;
//数值初始化
function resetData(mp){
	clearTimeout(resetTimer);
	resetTimer = setTimeout(function(){
	    $(".controls").hide();
		$(".retreat").hide();
		$(".forward").hide();
		
		mp.playByTime(1,DTime,1);
		
		DTime = 0;
		forwardTime = 0;
		backTime = 0;
	},500);
};

//声音初始化
var volseTimer = null;
function hidevolume(){
	clearTimeout(volseTimer);
	volseTimer = setTimeout(function(){
		$(".vioce").hide();
	},1000);
};
//音量条
function volupdown(v){
	var w=((v/100).toFixed(2))*190;
	$(".vioce-process-bar").css("width",w+'px');
	if(v == 0){
		//音量为 显示静音图标
		$(".vioce").hide();
		$(".mute").show();
	}else{
		//音量不为静音 隐藏静音图标
		$(".mute").hide();
		$(".vioce").show();
	}
}

//视频数据初始化获取
function goUtility(mp){
	//document.getElementById("alert").innerHTML = mp.getMediaDuration();
	$(".alltime").html(secondToDate(mp.getMediaDuration()));
	$(".currenttime").html(secondToDate(mp.getCurrentPlayTime()));
	var ww = (mp.getCurrentPlayTime()*1000/mp.getMediaDuration()).toFixed(2);
	$(".process-bar").css("width",ww+'px');
	
	eval("eventJson = " + Utility.getEvent());
	var typeStr = eventJson.type;
	switch(typeStr) {
	    case "EVENT_MEDIA_BEGINING":
	        return false;
	    case "EVENT_MEDIA_ERROR":
			//视频出现错误
			console.log(eventJson.error_code,eventJson.error_message);
	        return false;
	    case "EVENT_MEDIA_END":
			//播放结束
			if(backstate){
				backstate = false;
				var time = parseInt(parseInt(mp.getDurationPlayTime()) / 60);
				var ca = time*5;
				$(".finshed .time").html(time);
				$(".finshed .xiaohao").html(ca);
				$(".finshed").show(function(){
					$(".finshOk").focus();
				});
			}
	        return false;
	    default :
	        break;
	};
	return true;
}
var player = (function () {
    var that= this;  // 修复JavaScript语言设计的缺陷

    /**
     * @param code
     * code作为的url参数，
     * iframe加载url指向的播放页面，从该页面获取播放地址
     */
    var reqUrl = function () {
        var epgdomain;
        if("CTCSetConfig" in Authentication){
            epgdomain = Authentication.CTCGetConfig("EPGDomain" ); //电信规范
        } else {
            epgdomain = Authentication.CUGetConfig("EPGDomain"); //联通规范
        }
		//epgdomain = "http://www.baidu.com/index.jsp/";
        var last = epgdomain.indexOf("/jsp/");
        var url = "";
        if (last == -1) {
            last = epgdomain.lastIndexOf("/");
            url = epgdomain.substr(0,last );
            url += "/MediaService/SmallScreen?ContentID=" + that.code + "&GetCntFlag=1&ContentType=VOD&Type=cp&ProtocolType=1"
        } else {
            url = epgdomain.substr(0,last );
            url += "/MediaService/SmallScreen.jsp?ContentID=" + that.code + "&Left=0&Top=0&Width=930&Height=550&CycleFlag=1&GetCntFlag=1&ifameFlag=0";
        }
        this.reqUrl=url;
    }
    var iframe = function(iframeId){
        reqUrl();
        if(window.frames.length > 0){
            var frame = document.getElementById(iframeId);
            frame.setAttribute("src", this.reqUrl);
            frame.onload = function(){
                player.destroy();
                player.play();
            }
        }else{
            document.body.innerHTML += '<iframe onload="player.play()" onunload="player.destroy()" name="if_smallscreen" iframeborder="no" scrolling="no" style="display:none; width:1280px; height: 720px" id="iframe" src='+requrl+'></iframe>';
        }
    }

    return {
        init : function(code, timestamp,left, top, width, height,iframeId) {
            that.code = code;
            that.timestamp = timestamp;
            that.left = left;
            that.tp = top;
            that.width = width;
            that.height = height;
            that.full = false;
            that.iframeId=iframeId;
            if(iframeId ==null || iframeId=="" || iframeId==undefined){
                that.iframeId="if_smallscreen";
            }
            iframe(iframeId); // 使用iframe加载播放页面
        },

        // iframe加载完成之后，获取播放串，并进行播放
        play : function() {
            that.mediastr = "";
            that.mediastr = window.frames[that.iframeId].getMediastr(that.code);
            that.mp = new MediaPlayer();
            that.instanceId = that.mp.getNativePlayerInstanceID();
            that.status="play";
            that.speed=1;
            that.mp.setAllowTrickmodeFlag(0);
            that.mp.setNativeUIFlag(1);
            that.mp.setAudioVolumeUIFlag(1);
            that.mp.setMuteUIFlag(1);
            that.mp.setAudioTrackUIFlag(0);
            that.mp.setProgressBarUIFlag(1);
            that.mp.setSingleMedia(that.mediastr);
			//tool.alertLog(that.mediastr);
            if (that.full) { // 全屏播放
                that.mp.setVideoDisplayMode(1);
            } else { // 非全屏播放
                that.mp.setVideoDisplayMode(0);
                that.mp.setVideoDisplayArea(that.left, that.tp, that.width, that.height);
            }
            that.mp.refreshVideoDisplay();
			//初始化进度条
			that.mp.setVolume(50);
			setTimeout(function(){
				goUtility(that.mp);
			},500)
            if (that.timestamp == 'undefined' || that.timestamp == "" || that.timestamp == null) {
                that.mp.playFromStart();
            } else {
                that.mp.playByTime(1, that.timestamp);
            }
        },
        getCurrentPlayTime: function() {
            return that.mp.getCurrentPlayTime();
        },
        getDurationPlayTime: function() {
            return that.mp.getMediaDuration();
        },
        playByTime: function(timestamp) {
            that.timestamp = timestamp;
            that.mp.playByTime(1, that.timestamp);
        },
        getPlayTimeFixed: function() {
            return (that.mp.getCurrentPlayTime()/that.mp.getMediaDuration()).toFixed(2);
        },
        timeFormat: function(second) {
            var m = Math.floor(second/60);
            m = m<10 ? ('0'+m) : m;
            var s = second%60;
            s = s<10 ? ('0'+s) : s;
            return m + ':' + s;
        },
        //获取播放串
        getMediastr: function() {
            return that.mediastr;
        },
        // 停止播放，释放资源
        destroy : function () {
            if(that.mp) {
                that.mp.stop();
            }
        },
        // 暂停
        pause: function(){
            that.speed = 1;
            that.status = 'pause';
            that.mp.pause();
        },
        // 从暂停、快进、快退中恢复播放
        resume: function(){
            that.speed = 1;
            that.status = 'play';
            that.mp.resume();
        },
        // 切换播放状态：暂停或恢复/
        togglePlay: function(){
            if(that.status =='play'){
                that.mp.pause();
				setTimeout(function(){
					$(".play").show();
					$(".controls").show();
					that.status = 'pause';
				},200);
				var ww = (that.mp.getCurrentPlayTime()*1000/that.mp.getMediaDuration()).toFixed(2);
				$(".currenttime").html(secondToDate(that.mp.getCurrentPlayTime()));
				$(".process-bar").css("width",ww+'px');
            }else{
                that.mp.resume();
				setTimeout(function(){
					that.status = 'play';
					$(".play").hide();
					$(".controls").hide();
				},200)
            }
        },
        // 切换静音状态：静音或放音
        toggleMute:  function () {
    //         if (that.mp.getMuteFlag() == 0) {
    //             that.mp.setMuteFlag(1);
				// $(".mute").show();
    //         } else {
    //             that.mp.setMuteFlag(0);
				// $(".mute").hide();
    //         }
			that.mp.setVolume(0);
			//显示静音图标
			$(".mute").show();
        },
        // 音量+
        volUp: function(){
            var vol = that.mp.getVolume();
            if(vol <= 95){
                vol += 5;
                that.mp.setVolume(vol);
				volupdown(vol);
				hidevolume();
            }
        },
        //音量-
        volDown: function(){
            var vol = that.mp.getVolume();
            if(vol >= 5){
                vol -= 5;
                that.mp.setVolume(vol);
				volupdown(vol);
				hidevolume();
            }
        },
        // 快进
        fastForward : function(){
            // if(that.speed >= 32 || that.status == 'fastRewind'){
            //     that.mp.resume();
            //     that.status = 'play';
            //     that.speed = 1;
            // }else{
            //     that.speed = that.speed * 2;
            //     that.status = 'fastForward';
            //     that.mp.fastForward(that.speed);
            // };
			
			$(".forward").show();
			$(".controls").show();
			var alltime = parseInt(that.mp.getMediaDuration());
			forwardTime += 10;
			DTime = parseInt(that.mp.getCurrentPlayTime()) + forwardTime; // 增加10秒后的播放位置
			if(DTime < alltime){
			    $(".currenttime").html(secondToDate(DTime));
			}else{
			    $(".currenttime").html(secondToDate(alltime));
			    DTime = alltime;
			};
			var ww = (DTime*1000/parseInt(that.mp.getMediaDuration())).toFixed(2);
			$(".process-bar").css("width",ww+'px');
			resetData(that.mp);
			
        },
        // 快退
        fastRewind: function(){
            // if(that.speed >= 32 || that.status == 'fastForward'){
            //     that.mp.resume();
            //     that.status = 'play';
            //     that.speed = 1;
            // }else {
            //     that.speed = that.speed * 2;
            //     that.status = 'fastRewind';
            //     that.mp.fastRewind(-that.speed);
            // }
			$(".retreat").show();
			$(".controls").show();
			var alltime = parseInt(that.mp.getMediaDuration());
			backTime += 10;
			DTime = parseInt(that.mp.getCurrentPlayTime()) - backTime; // 减少10秒后的播放位置
			if(DTime > 0){
			    $(".currenttime").html(secondToDate(DTime));
			}else{
			   $(".currenttime").html('00:00:00');
			   DTime = 0;
			};
			var ww = (DTime*1000/parseInt(that.mp.getMediaDuration())).toFixed(2);
			$(".process-bar").css("width",ww+'px');
			resetData(that.mp);
        },
        playerStatus: function(){
            return that.status;
        }
    };
}());

