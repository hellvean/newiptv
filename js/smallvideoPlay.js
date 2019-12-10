/**
 * Created by yyc on 2019/4/11.
 */
/**
 * 根据节目编码获取播放地址并进行播放
 */
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
            url += "/MediaService/SmallScreen.jsp?ContentID=" + that.code + "&Left=0&Top=0&Width=540&Height=320&CycleFlag=1&GetCntFlag=1&ifameFlag=0";
        }
        that.reqUrl=url;
    }
    var iframe = function(iframeId){
        reqUrl();
		//return;
        if(window.frames.length > 0){
            var frame = document.getElementById(iframeId);
            frame.setAttribute("src", that.reqUrl);
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
            if (that.full) { // 全屏播放
                that.mp.setVideoDisplayMode(1);
            } else { // 非全屏播放
                that.mp.setVideoDisplayMode(0);
                that.mp.setVideoDisplayArea(that.left, that.tp, that.width, that.height);
            }
            that.mp.refreshVideoDisplay();
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
                that.status = 'pause';
            }else{
                that.mp.resume();
                that.status = 'play';
            }
        },
        // 切换静音状态：静音或放音
        toggleMute:  function () {
            if (that.mp.getMuteFlag() == 0) {
                that.mp.setMuteFlag(1);
            } else {
                that.mp.setMuteFlag(0);
            }
        },
        // 音量+
        volUp: function(){
            var vol = that.mp.getVolume();
            if(vol <= 95){
                vol += 5;
                that.mp.setVolume(vol);
            }
        },
        //音量-
        volDown: function(){
            var vol = that.mp.getVolume();
            if(vol >= 5){
                vol -= 5;
                that.mp.setVolume(vol);
            }
        },
        // 快进
        fastForward : function(){
            if(that.speed >= 32 || that.status == 'fastRewind'){
                that.mp.resume();
                that.status = 'play';
                that.speed = 1;
            }else{
                that.speed = that.speed * 2;
                that.status = 'fastForward';
                that.mp.fastForward(that.speed);
            }
        },
        // 快退
        fastRewind: function(){
            if(that.speed >= 32 || that.status == 'fastForward'){
                that.mp.resume();
                that.status = 'play';
                that.speed = 1;
            }else {
                that.speed = that.speed * 2;
                that.status = 'fastRewind';
                that.mp.fastRewind(-that.speed);
            }
        },
        playerStatus: function(){
            return that.status;
        }
    };
}());

