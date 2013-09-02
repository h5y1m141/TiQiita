var detailWindow;

detailWindow = (function() {

  function detailWindow(data) {
    var WebView, adView, dialog, webViewContents, webViewHeader, webview;
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
    dialog = this._createDialog();
    adView = this._createAdView();
    WebView = require('ui/webView');
    webview = new WebView();
    webViewHeader = webview.retreiveWebViewHeader();
    webViewContents = webview.retreiveWebView();
    detailWindow.add(webViewHeader);
    detailWindow.add(webViewContents);
    detailWindow.add(adView);
    webview.contentsUpdate(data.body);
    webview.headerUpdate(data);
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
    var Admob, adView, adViewHeight, adViewTopPosition, barHeight, screenHeight, webViewHeaderHight, webViewHeight, webViewTopPosition;
    screenHeight = Ti.Platform.displayCaps.platformHeight;
    adViewHeight = 50;
    webViewHeaderHight = 55;
    barHeight = 60;
    webViewHeight = screenHeight - (barHeight + webViewHeaderHight + adViewHeight);
    webViewTopPosition = barHeight;
    adViewTopPosition = webViewHeight + webViewTopPosition;
    Admob = require("ti.admob");
    adView = Admob.createView({
      width: 320,
      height: adViewHeight,
      top: adViewTopPosition,
      left: 0,
      zIndex: 20,
      adBackgroundColor: 'black',
      publisherId: "a1516c99bf7991a"
    });
    return adView;
  };

  return detailWindow;

})();

module.exports = detailWindow;
