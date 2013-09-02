var detailWindow;

detailWindow = (function() {

  function detailWindow(data) {
    var adView, adViewHeight, barHeight, dialog, headerContainer, htmlHeaderElement, qiitaCSS, screenHeight, webView, webViewHeaderHight, webViewHeight, webViewTopPosition;
    this.baseColor = {
      barColor: '#4BA503',
      backgroundColor: "#f3f3f3",
      textColor: "#333",
      feedbackColor: '#4BA503',
      separatorColor: '#cccccc'
    };
    detailWindow = Ti.UI.createWindow({
      title: '投稿情報詳細画面',
      barColor: this.baseColor.barColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    qiitaCSS = 'ui/css/qiitaColor.css';
    htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='" + qiitaCSS + "' type='text/css'></link></head>";
    screenHeight = Ti.Platform.displayCaps.platformHeight;
    adViewHeight = 55;
    webViewHeaderHight = 55;
    barHeight = 60;
    webViewTopPosition = webViewHeaderHight;
    webViewHeight = screenHeight - (barHeight + webViewHeaderHight + adViewHeight);
    webView = Ti.UI.createWebView({
      top: 55,
      left: 0,
      zIndex: 5,
      width: 320,
      height: webViewHeight,
      html: "" + htmlHeaderElement + data.body + "</body></html>"
    });
    dialog = this._createDialog();
    adView = this._createAdView();
    headerContainer = this._createHeader(data);
    detailWindow.add(webView);
    detailWindow.add(adView);
    detailWindow.add(headerContainer);
    return detailWindow;
  }

  detailWindow.prototype._createDialog = function() {
    var cancelleBtn, contents, registMemoBtn, selectedColor, selectedValue, t, textArea, titleForMemo, unselectedColor, _view,
      _this = this;
    t = Titanium.UI.create2DMatrix().scale(0.0);
    unselectedColor = "#666";
    selectedColor = "#222";
    selectedValue = false;
    _view = Ti.UI.createView({
      width: 300,
      height: 280,
      top: 0,
      left: 10,
      borderRadius: 10,
      opacity: 0.8,
      backgroundColor: "#333",
      zIndex: 20,
      transform: t
    });
    titleForMemo = Ti.UI.createLabel({
      text: "どの部分に誤りがあったのかご入力ください",
      width: 300,
      height: 40,
      color: this.baseColor.barColor,
      left: 10,
      top: 5,
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    contents = "";
    textArea = Titanium.UI.createTextArea({
      value: '',
      height: 150,
      width: 280,
      top: 50,
      left: 10,
      font: {
        fontSize: 12,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      color: this.baseColor.textColor,
      textAlign: 'left',
      borderWidth: 2,
      borderColor: "#dfdfdf",
      borderRadius: 5,
      keyboardType: Titanium.UI.KEYBOARD_DEFAULT
    });
    textArea.addEventListener('return', function(e) {
      contents = e.value;
      Ti.API.info("登録しようとしてる情報は is " + contents + "です");
      return textArea.blur();
    });
    textArea.addEventListener('blur', function(e) {
      contents = e.value;
      return Ti.API.info("blur event fire.content is " + contents + "です");
    });
    registMemoBtn = Ti.UI.createLabel({
      bottom: 30,
      right: 20,
      width: 120,
      height: 40,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 5,
      color: this.baseColor.barColor,
      backgroundColor: "#4cda64",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "報告する",
      textAlign: 'center'
    });
    registMemoBtn.addEventListener('click', function(e) {
      var MainController, currentUserId, mainController, that;
      that = _this;
      that._setDefaultMapViewStyle();
      that.activityIndicator.show();
      contents = contents;
      currentUserId = Ti.App.Properties.getString("currentUserId");
      Ti.API.info("contents is " + contents + " and shopName is " + shopName);
      MainController = require("controller/mainController");
      mainController = new MainController();
      return mainController.sendFeedBack(contents, shopName, currentUserId, function(result) {
        that.activityIndicator.hide();
        if (result.success) {
          alert("報告完了しました");
        } else {
          alert("サーバーがダウンしているために登録することができませんでした");
        }
        return that._hideDialog(_view, Ti.API.info("done"));
      });
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      left: 20,
      bottom: 30,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: this.baseColor.barColor,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: '中止する',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      _this._setDefaultMapViewStyle();
      return _this._hideDialog(_view, Ti.API.info("done"));
    });
    _view.add(textArea);
    _view.add(titleForMemo);
    _view.add(registMemoBtn);
    _view.add(cancelleBtn);
    return _view;
  };

  detailWindow.prototype._createAdView = function() {
    var Admob, adView;
    Admob = require("ti.admob");
    adView = Admob.createView({
      width: 320,
      height: 55,
      bottom: 0,
      left: 0,
      zIndex: 20,
      adBackgroundColor: 'black',
      publisherId: "a1516c99bf7991a"
    });
    return adView;
  };

  detailWindow.prototype._createHeader = function(data) {
    var dateLabel, headerContainer, iconIamge, moment, momentja, titleLabel;
    moment = require('lib/moment.min');
    momentja = require('lib/momentja');
    headerContainer = Ti.UI.createView({
      top: 0,
      left: 0,
      width: 320,
      height: 55,
      zIndex: 1,
      backgroundColor: '#141414'
    });
    titleLabel = Ti.UI.createLabel({
      font: {
        fontWeight: 'bold',
        fontSize: 16
      },
      color: '#fff',
      top: 5,
      left: 80,
      width: 220,
      height: 40,
      zIndex: 2,
      text: data.title
    });
    dateLabel = Ti.UI.createLabel({
      font: {
        fontSize: 12
      },
      textAlign: 2,
      color: '#fff',
      top: 65,
      left: 80,
      width: 220,
      height: 15,
      zIndex: 2,
      text: '投稿日：' + moment(data.created_at, "YYYY-MM-DD HH:mm:ss Z").fromNow()
    });
    iconIamge = Ti.UI.createImageView({
      left: 5,
      top: 5,
      borderWidth: 1,
      borderColor: '#222',
      borderRadius: 5,
      width: 40,
      height: 40,
      zIndex: 20,
      userName: "",
      defaultImage: "ui/image/logo-square.png",
      backgroundColor: '#cbcbcb',
      image: data.user.profile_image_url
    });
    headerContainer.add(iconIamge);
    headerContainer.add(dateLabel);
    headerContainer.add(titleLabel);
    return headerContainer;
  };

  return detailWindow;

})();

module.exports = detailWindow;
