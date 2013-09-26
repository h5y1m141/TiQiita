var mainWindow;

mainWindow = (function() {

  function mainWindow() {
    var menuBtn,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f9f9f9",
      keyColor: '#59BB0C',
      textColor: "#333",
      contentsColor: "#666",
      grayTextColor: "#999"
    };
    this.window = Ti.UI.createWindow({
      title: "Qiita",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: true,
      navBarHidden: true
    });
    this.slideState = false;
    menuBtn = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: "#f9f9f9",
      width: 40,
      height: 40,
      top: 0,
      left: 10,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe08e")
    });
    menuBtn.addEventListener('click', function(e) {
      Ti.API.info(_this.slideState);
      if (_this.slideState === true) {
        return _this.resetSlide();
      } else {
        return _this.slideWindow();
      }
    });
    this.navView = Ti.UI.createView({
      width: Ti.UI.FULL,
      height: 40,
      top: 0,
      left: 0,
      backgroundColor: this.baseColor.keyColor,
      zIndex: 25
    });
    this.navView.add(menuBtn);
    this.window.add(this.navView);
  }

  mainWindow.prototype.getWindow = function() {
    return this.window;
  };

  mainWindow.prototype.resetSlide = function() {
    var animation, transform;
    transform = Titanium.UI.create2DMatrix();
    animation = Titanium.UI.createAnimation();
    animation.left = 0;
    animation.transform = transform;
    animation.duration = 250;
    mainListView.animate(animation);
    this.navView.animate(animation);
    this.slideState = false;
  };

  mainWindow.prototype.slideWindow = function() {
    var animation, transform;
    transform = Titanium.UI.create2DMatrix();
    animation = Titanium.UI.createAnimation();
    animation.left = 200;
    animation.transform = transform;
    animation.duration = 250;
    mainListView.animate(animation);
    this.navView.animate(animation);
    this.slideState = true;
  };

  mainWindow.prototype._createAdView = function() {
    var Config, adView, config, nend, nendConfig;
    nend = require('net.nend');
    Config = require("model/loadConfig");
    config = new Config();
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

  return mainWindow;

})();

module.exports = mainWindow;
