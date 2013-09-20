var mainWindow;

mainWindow = (function() {

  function mainWindow() {
    var ConfigMenu, configMenu, menuBtn, menuTable, navView,
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
    ConfigMenu = require("ui/iphone/configMenu");
    configMenu = new ConfigMenu();
    menuTable = require("ui/iphone/menuTable");
    menuTable = new menuTable();
    this.window.add(menuTable);
    this.slideState = false;
    menuBtn = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: "#f9f9f9",
      width: 28,
      height: 28,
      top: 5,
      left: 10,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe08e")
    });
    menuBtn.addEventListener('click', function(e) {
      var animation, transform;
      if (_this.slideState === true) {
        transform = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.left = 0;
        animation.transform = transform;
        animation.duration = 250;
        mainListView.animate(animation);
        navView.animate(animation);
        return _this.slideState = false;
      } else {
        transform = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.left = 200;
        animation.transform = transform;
        animation.duration = 250;
        mainListView.animate(animation);
        navView.animate(animation);
        return _this.slideState = true;
      }
    });
    navView = Ti.UI.createView({
      width: Ti.UI.FULL,
      height: 40,
      top: 0,
      left: 0,
      backgroundColor: this.baseColor.keyColor,
      zIndex: 25
    });
    navView.add(menuBtn);
    this.window.add(navView);
    return this.window;
  }

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
