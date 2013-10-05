var detailWindow;

detailWindow = (function() {

  function detailWindow(data) {
    var adView, adViewHeight, barHeight, htmlHeaderElement, qiitaCSS, screenHeight, webViewHeight;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f9f9f9",
      barBackgroundColor: "#222",
      keyColor: '#59BB0C',
      textColor: "#f9f9f9"
    };
    this.detailWindow = Ti.UI.createWindow({
      left: 0,
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    this.hatenaAccessTokenKey = Ti.App.Properties.getString("hatenaAccessTokenKey");
    this.twitterAccessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey');
    this.QiitaToken = Ti.App.Properties.getString('QiitaToken');
    this.uuid = data.uuid;
    this.url = data.url;
    this.title = data.title;
    this._createTitleView(data.title, data.icon);
    qiitaCSS = 'ui/css/qiitaColor.css';
    htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='" + qiitaCSS + "' type='text/css'></link></head>";
    screenHeight = Ti.Platform.displayCaps.platformHeight;
    adViewHeight = 55;
    barHeight = 40;
    webViewHeight = screenHeight - (barHeight + adViewHeight);
    this.webView = Ti.UI.createWebView({
      top: barHeight,
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
    var cancelleBtn, contents, hatenaIcon, hatenaPostFlg, hatenaPostLabel, hatenaPostSwitch, hintLabel, qiitaIcon, qiitaPostFlg, qiitaPostLabel, qiitaPostSwitch, registMemoBtn, selectedValue, textArea, textCounter, tweetFlg, tweetLabel, tweetSwitch, twitterIcon, _view,
      _this = this;
    selectedValue = false;
    qiitaPostFlg = false;
    hatenaPostFlg = false;
    tweetFlg = false;
    _view = Ti.UI.createView({
      width: Ti.UI.FULL,
      height: Ti.Platform.displayCaps.platformHeight - 40,
      top: Ti.Platform.displayCaps.platformHeight,
      left: 0,
      backgroundColor: "#ddd",
      zIndex: 20
    });
    contents = "";
    textArea = Titanium.UI.createTextArea({
      value: '',
      height: 100,
      width: 300,
      top: 5,
      left: 5,
      textAlign: 'left',
      borderWidth: 2,
      borderColor: "#dfdfdf",
      borderRadius: 5,
      keyboardType: Titanium.UI.KEYBOARD_DEFAULT
    });
    hintLabel = Ti.UI.createLabel({
      text: "(任意)はてブ時登録時のコメント",
      font: {
        fontSize: 12
      },
      color: "#222",
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
        fontSize: 16
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
      bottom: 30,
      right: 20,
      width: 120,
      height: 40,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 5,
      color: "#f9f9f9",
      backgroundColor: "#4cda64",
      font: {
        fontSize: 18
      },
      text: "登録する",
      textAlign: 'center'
    });
    registMemoBtn.addEventListener('click', function(e) {
      var ActivityIndicator, actInd, mainController, that;
      Ti.App.Analytics.trackEvent('detailWindow', 'registMemo', 'regist', 1);
      that = _this;
      ActivityIndicator = require('ui/activityIndicator');
      actInd = new ActivityIndicator();
      that.detailWindow.add(actInd);
      actInd.show();
      mainController = require("controllers/mainContoroller");
      mainController = new mainController();
      return mainController.stockItem(that.uuid, that.url, contents, that.title, qiitaPostFlg, hatenaPostFlg, tweetFlg, function(result) {
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
      bottom: 30,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: "#f9f9f9",
      font: {
        fontSize: 18
      },
      text: '中止する',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      Ti.App.Analytics.trackEvent('detailWindow', 'registMemo', 'cancell', 1);
      return _this._hideDialog(_view, Ti.API.info("done"));
    });
    qiitaIcon = Ti.UI.createImageView({
      image: "ui/image/logo-square.png",
      top: 110,
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
      top: 110,
      left: 200
    });
    qiitaPostSwitch.addEventListener('change', function(e) {
      return qiitaPostFlg = e.source.value;
    });
    qiitaPostLabel = Ti.UI.createLabel({
      text: "Qiitaへストック",
      textAlign: 'left',
      font: {
        fontSize: 16
      },
      color: "#222",
      top: 120,
      left: 50,
      widht: 100,
      height: 20,
      backgroundColor: 'transparent'
    });
    hatenaIcon = Ti.UI.createImageView({
      image: "ui/image/hatena.png",
      top: 150,
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
      top: 155,
      left: 200
    });
    hatenaPostSwitch.addEventListener('change', function(e) {
      return hatenaPostFlg = e.source.value;
    });
    hatenaPostLabel = Ti.UI.createLabel({
      text: "はてブする",
      textAlign: 'left',
      font: {
        fontSize: 16
      },
      color: "#222",
      top: 160,
      left: 50,
      widht: 100,
      height: 20,
      backgroundColor: 'transparent'
    });
    twitterIcon = Ti.UI.createImageView({
      image: "ui/image/twitter.png",
      top: 190,
      left: 10,
      width: 35,
      height: 35
    });
    if ((this.twitterAccessTokenKey != null) === true) {
      tweetFlg = true;
    } else {
      tweetFlg = false;
    }
    tweetSwitch = Ti.UI.createSwitch({
      value: tweetFlg,
      top: 195,
      left: 200
    });
    tweetSwitch.addEventListener('change', function(e) {
      return tweetFlg = e.source.value;
    });
    tweetLabel = Ti.UI.createLabel({
      text: "tweetする",
      textAlign: 'left',
      font: {
        fontSize: 16
      },
      color: "#222",
      top: 195,
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
    _view.add(twitterIcon);
    _view.add(tweetSwitch);
    _view.add(tweetLabel);
    _view.add(textArea);
    _view.add(registMemoBtn);
    _view.add(cancelleBtn);
    return _view;
  };

  detailWindow.prototype._createAdView = function() {
    var Config, adView, config, nend, nendConfig;
    Config = require("model/loadConfig");
    config = new Config();
    nend = require('net.nend');
    nendConfig = config.getNendData();
    adView = nend.createView({
      spotId: nendConfig.spotId,
      apiKey: nendConfig.apiKey,
      width: 320,
      height: 50,
      bottom: 0,
      left: 0,
      zIndex: 20
    });
    adView.addEventListener('start', function(e) {});
    adView.addEventListener('load', function(e) {});
    adView.addEventListener('error', function(e) {
      return Ti.API.info("doesn't load ad data");
    });
    return adView;
  };

  detailWindow.prototype._showDialog = function(_view) {
    var animation, slideTopPostion;
    this.webView.opacity = 0.5;
    slideTopPostion = Ti.Platform.displayCaps.platformHeight - _view.height;
    Ti.API.info(slideTopPostion);
    Ti.API.info(_view.height);
    animation = Ti.UI.createAnimation();
    animation.top = slideTopPostion;
    animation.duration = 300;
    return _view.animate(animation);
  };

  detailWindow.prototype._hideDialog = function(_view, callback) {
    var animation;
    this.webView.opacity = 1.0;
    animation = Ti.UI.createAnimation();
    animation.top = Ti.Platform.displayCaps.platformHeight;
    animation.duration = 300;
    _view.animate(animation);
    return animation.addEventListener('complete', function(e) {
      return callback;
    });
  };

  detailWindow.prototype._createTitleView = function(title, image) {
    var backBtn, shareBtn, _icon, _title, _view,
      _this = this;
    _view = Ti.UI.createView({
      top: 0,
      left: 0,
      width: Ti.UI.FULL,
      height: 40,
      backgroundColor: this.baseColor.keyColor
    });
    shareBtn = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: this.baseColor.textColor,
      width: 40,
      height: 40,
      right: 0,
      font: {
        fontSize: 36,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe118")
    });
    shareBtn.addEventListener('click', function(e) {
      Ti.API.info("shareBtn click. @dialog is " + _this.dialog);
      return _this._showDialog(_this.dialog);
    });
    backBtn = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: this.baseColor.textColor,
      width: 80,
      height: 40,
      left: 10,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe03e")
    });
    backBtn.addEventListener('click', function(e) {
      var animation;
      animation = Ti.UI.createAnimation();
      animation.top = Ti.Platform.displayCaps.platformHeight;
      animation.duration = 300;
      return _this.detailWindow.close(animation);
    });
    _title = Ti.UI.createLabel({
      textAlign: 'left',
      top: 5,
      left: 50,
      width: 220,
      color: this.baseColor.textColor,
      font: {
        fontSize: 14
      },
      text: title
    });
    _icon = Ti.UI.createImageView({
      image: image,
      defaultImage: "ui/image/logo.png",
      top: 10,
      left: 10,
      width: 35,
      height: 35
    });
    _view.add(backBtn);
    _view.add(shareBtn);
    _view.add(_title);
    return this.detailWindow.add(_view);
  };

  return detailWindow;

})();

module.exports = detailWindow;
