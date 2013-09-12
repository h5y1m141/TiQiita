var detailWindow;

detailWindow = (function() {

  function detailWindow(data) {
    var adView, adViewHeight, barHeight, htmlHeaderElement, qiitaCSS, screenHeight, webViewHeight;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f9f9f9",
      keyColor: '#4BA503',
      textColor: "#333"
    };
    this.detailWindow = Ti.UI.createWindow({
      left: 0,
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    this.hatenaAccessTokenKey = Ti.App.Properties.getString("hatenaAccessTokenKey");
    this.QiitaToken = Ti.App.Properties.getString('QiitaToken');
    this.uuid = data.uuid;
    this.url = data.url;
    this._createNavBar(data.title);
    qiitaCSS = 'ui/css/qiitaColor.css';
    htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='" + qiitaCSS + "' type='text/css'></link></head>";
    screenHeight = Ti.Platform.displayCaps.platformHeight;
    adViewHeight = 55;
    barHeight = 40;
    webViewHeight = screenHeight - (barHeight + adViewHeight);
    this.webView = Ti.UI.createWebView({
      top: 0,
      left: 0,
      zIndex: 5,
      width: 320,
      height: webViewHeight,
      html: "" + htmlHeaderElement + data.body + "</body></html>"
    });
    this.dialog = this._createDialog();
    adView = this._createAdView();
    this.detailWindow.add(adView);
    this.detailWindow.add(this.webView);
    this.detailWindow.add(this.dialog);
    return this.detailWindow;
  }

  detailWindow.prototype._createDialog = function() {
    var cancelleBtn, contents, hatenaIcon, hatenaPostFlg, hatenaPostLabel, hatenaPostSwitch, hintLabel, qiitaIcon, qiitaPostFlg, qiitaPostLabel, qiitaPostSwitch, registMemoBtn, selectedValue, t, textArea, textCounter, _view,
      _this = this;
    t = Titanium.UI.create2DMatrix().scale(0.0);
    selectedValue = false;
    qiitaPostFlg = false;
    hatenaPostFlg = false;
    _view = Ti.UI.createView({
      width: 300,
      height: 280,
      top: 10,
      left: 10,
      borderRadius: 10,
      opacity: 0.9,
      backgroundColor: "#333",
      zIndex: 20,
      transform: t
    });
    contents = "";
    textArea = Titanium.UI.createTextArea({
      value: '',
      height: 100,
      width: 280,
      top: 100,
      left: 10,
      textAlign: 'left',
      borderWidth: 2,
      borderColor: "#dfdfdf",
      borderRadius: 5,
      keyboardType: Titanium.UI.KEYBOARD_DEFAULT
    });
    hintLabel = Ti.UI.createLabel({
      text: "(任意)はてブ時登録時のコメント",
      font: {
        fontSize: 12,
        fontFamily: 'Rounded M+ 1p'
      },
      color: "222",
      top: 5,
      left: 7,
      widht: 100,
      height: 20,
      backgroundColor: 'transparent',
      touchEnabled: true
    });
    textCounter = Ti.UI.createLabel({
      text: "0文字",
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p'
      },
      color: '#4BA503',
      bottom: 5,
      right: 5,
      widht: 50,
      height: 20,
      backgroundColor: 'transparent'
    });
    hintLabel.addEventListener('click', function(e) {
      return textArea.focus();
    });
    textArea.add(hintLabel);
    textArea.add(textCounter);
    if (textArea.value.length > 0) {
      hintLabel.hide();
    }
    textArea.addEventListener('return', function(e) {
      contents = e.value;
      Ti.API.info("登録しようとしてる情報は is " + contents + "です");
      return textArea.blur();
    });
    textArea.addEventListener('blur', function(e) {
      contents = e.value;
      return Ti.API.info("blur event fire.content is " + contents + "です");
    });
    textArea.addEventListener('change', function(e) {
      Ti.API.info("e.value.length is " + e.value.length);
      textCounter.text = "" + e.value.length + "文字";
      if (e.value.length > 0) {
        hintLabel.hide();
        if (e.value.length > 100) {
          textCounter.backgroundColor = "#d8514b";
          return textCounter.color = "#f9f9f9";
        } else {
          textCounter.backgroundColor = 'transparent';
          return textCounter.color = '#4BA503';
        }
      } else {
        return hintLabel.show();
      }
    });
    registMemoBtn = Ti.UI.createLabel({
      bottom: 10,
      right: 20,
      width: 120,
      height: 40,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 5,
      color: "#f9f9f9",
      backgroundColor: "#4cda64",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "登録する",
      textAlign: 'center'
    });
    registMemoBtn.addEventListener('click', function(e) {
      var ActivityIndicator, actInd, that;
      that = _this;
      ActivityIndicator = require('ui/activityIndicator');
      actInd = new ActivityIndicator();
      that.detailWindow.add(actInd);
      actInd.show();
      Ti.API.info(qiitaPostFlg);
      Ti.API.info(hatenaPostFlg);
      return mainContoroller.stockItem(that.uuid, that.url, contents, qiitaPostFlg, hatenaPostFlg, function(result) {
        if (result) {
          actInd.hide();
          that._hideDialog(_view, Ti.API.info("投稿処理が完了"));
          that.detailWindow.remove(actInd);
          return actInd = null;
        }
      });
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      left: 20,
      bottom: 10,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: "#f9f9f9",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: '中止する',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      return _this._hideDialog(_view, Ti.API.info("done"));
    });
    qiitaIcon = Ti.UI.createImageView({
      image: "ui/image/logo-square.png",
      top: 10,
      left: 10,
      width: 35,
      height: 35
    });
    if ((this.QiitaToken != null) === true) {
      qiitaPostFlg = true;
    } else {
      qiitaPostFlg = false;
    }
    qiitaPostSwitch = Ti.UI.createSwitch({
      value: qiitaPostFlg,
      top: 15,
      left: 200
    });
    qiitaPostSwitch.addEventListener('change', function(e) {
      return qiitaPostFlg = e.source.value;
    });
    qiitaPostLabel = Ti.UI.createLabel({
      text: "Qiitaへストック",
      textAlign: 'left',
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p'
      },
      color: "#f9f9f9",
      top: 20,
      left: 50,
      widht: 100,
      height: 20,
      backgroundColor: 'transparent'
    });
    hatenaIcon = Ti.UI.createImageView({
      image: "ui/image/hatena.png",
      top: 50,
      left: 10,
      width: 35,
      height: 35
    });
    if ((this.hatenaAccessTokenKey != null) === true) {
      hatenaPostFlg = true;
    } else {
      hatenaPostFlg = false;
    }
    hatenaPostSwitch = Ti.UI.createSwitch({
      value: hatenaPostFlg,
      top: 55,
      left: 200
    });
    hatenaPostSwitch.addEventListener('change', function(e) {
      return hatenaPostFlg = e.source.value;
    });
    hatenaPostLabel = Ti.UI.createLabel({
      text: "はてブする",
      textAlign: 'left',
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p'
      },
      color: "#f9f9f9",
      top: 60,
      left: 50,
      widht: 100,
      height: 20,
      backgroundColor: 'transparent'
    });
    _view.add(qiitaIcon);
    _view.add(qiitaPostSwitch);
    _view.add(qiitaPostLabel);
    _view.add(hatenaIcon);
    _view.add(hatenaPostSwitch);
    _view.add(hatenaPostLabel);
    _view.add(textArea);
    _view.add(registMemoBtn);
    _view.add(cancelleBtn);
    return _view;
  };

  detailWindow.prototype._createAdView = function() {
    var Admob, Config, adView, admobConfig, config;
    Config = require("model/loadConfig");
    config = new Config();
    admobConfig = config.getAdMobData();
    Admob = require("ti.admob");
    adView = Admob.createView({
      width: 320,
      height: 55,
      bottom: 0,
      left: 0,
      zIndex: 20,
      adBackgroundColor: 'black',
      publisherId: admobConfig.publisherId
    });
    return adView;
    return adView;
  };

  detailWindow.prototype._showDialog = function(_view) {
    var animation, t1;
    t1 = Titanium.UI.create2DMatrix();
    t1 = t1.scale(1.0);
    animation = Titanium.UI.createAnimation();
    animation.transform = t1;
    animation.duration = 250;
    return _view.animate(animation);
  };

  detailWindow.prototype._hideDialog = function(_view, callback) {
    var animation, t1;
    t1 = Titanium.UI.create2DMatrix();
    t1 = t1.scale(0.0);
    animation = Titanium.UI.createAnimation();
    animation.transform = t1;
    animation.duration = 250;
    _view.animate(animation);
    return animation.addEventListener('complete', function(e) {
      return callback;
    });
  };

  detailWindow.prototype._createNavBar = function(title) {
    var backBtn, listWindowTitle, menuBtn,
      _this = this;
    menuBtn = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: this.baseColor.textColor,
      width: 28,
      height: 28,
      right: 5,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe08e")
    });
    menuBtn.addEventListener('click', function(e) {
      return _this._showDialog(_this.dialog);
    });
    backBtn = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: this.baseColor.textColor,
      width: 28,
      height: 28,
      right: 5,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe080")
    });
    listWindowTitle = Ti.UI.createLabel({
      textAlign: 'left',
      color: this.baseColor.textColor,
      font: {
        fontSize: 14
      },
      text: title
    });
    this.detailWindow.setTitleControl(listWindowTitle);
    return this.detailWindow.rightNavButton = menuBtn;
  };

  return detailWindow;

})();

module.exports = detailWindow;
