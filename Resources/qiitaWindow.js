var configWindow, qiitaWindow, webViewWindow,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

qiitaWindow = (function() {

  function qiitaWindow(title) {
    var titleName;
    if (title === null) {
      titleName = "Qiita";
    } else {
      titleName = title;
    }
    this.baseWindow = Ti.UI.createWindow({
      title: titleName,
      barColor: '#59BB0C'
    });
  }

  qiitaWindow.prototype.show = function() {
    this.baseWindow.zIndex = 10;
    this.baseWindow.backgroundColor = "#222";
    return this.baseWindow.open({
      transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP
    });
  };

  return qiitaWindow;

})();

configWindow = (function(_super) {

  __extends(configWindow, _super);

  function configWindow() {
    configWindow.__super__.constructor.call(this, "設定画面");
  }

  return configWindow;

})(qiitaWindow);

module.exports = configWindow;

webViewWindow = (function(_super) {

  __extends(webViewWindow, _super);

  function webViewWindow() {
    webViewWindow.__super__.constructor.call(this, "投稿情報");
  }

  return webViewWindow;

})(qiitaWindow);

module.exports = webViewWindow;
