window.onblur = null;
function dispatch(el, type){
    try{
        var evt = document.createEvent('Event');
        evt.initEvent(type,true,true);
        el.dispatchEvent(evt);
    }catch(e){alert(e)};
}
var playBtn = document.getElementsByClassName("xt_video_player_play_btn fl")[0];
function resumePlay(){
    setTimeout(() => {
        if(playBtn.className.indexOf('xt_video_player_play_btn_pause') === -1){
            dispatch(playBtn,"click");
        }
    },100);
}
document.addEventListener("visibilitychange",resumePlay,true);

