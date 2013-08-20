var win = Ti.UI.createWindow({
    backgroundColor:'white'
});
win.open();

var ad = require('net.nend');
var adView = ad.createView({
    spotId: 3174,
    apiKey: "c5cb8bc474345961c6e7a9778c947957ed8e1e4f",
    width: 320,
    height: 50,
    bottom: 0,
    left: 0
});

// 受信成功通知
adView.addEventListener('receive',function(e){
    Ti.API.info('receive');
});
// 受信エラー通知
adView.addEventListener('error',function(e){
    Ti.API.info('error');
});
// クリック通知
adView.addEventListener('receive',function(e){
    Ti.API.info('receive');
});
// 復帰通知
adView.addEventListener('dismissScreen',function(e){
    Ti.API.info('dismissScreen');
});

//##################################

var btnLayout = Ti.UI.createView({
    layout: 'horizontal',
})

// 広告リロード停止ボタン
var pauseBtn = Ti.UI.createButton({
   title: 'pause', 
   width: '50%'
});
pauseBtn.addEventListener('click', function(e) {
    adView.pause();
});

// 広告リロード再開ボタン
var resumeBtn = Ti.UI.createButton({
   title: 'resume', 
   width: '50%'
});
resumeBtn.addEventListener('click', function(e) {
    adView.resume();
});

btnLayout.add(pauseBtn);
btnLayout.add(resumeBtn);
win.add(btnLayout);

win.add(adView);
