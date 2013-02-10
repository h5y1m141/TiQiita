var mainContoroller;
mainContoroller = (function() {
  function mainContoroller() {
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }
  mainContoroller.prototype.init = function() {
    var ConfigMenu, configMenu, configWindow, direction, loginID, password;
    loginID = Ti.App.Properties.getString('QiitaLoginID');
    password = Ti.App.Properties.getString('QiitaLoginPassword');
    if (controller.networkStatus() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
    } else if (loginID === null || password === null) {
      ConfigMenu = require("ui/configMenu");
      configMenu = new ConfigMenu();
      configWindow = new win();
      configWindow.title = "アカウント情報";
      configWindow.backButtonTitle = '戻る';
      configWindow.add(configMenu);
      tab.window = configWindow;
      tabGroup.open();
    } else {
      this.createMainWindow();
      this.refreshMenuTable();
      direction = "vertical";
      Ti.App.Properties.setBool('stateMainTableSlide', false);
      controller.slideMainTable(direction);
      commandController.useMenu("storedStocks");
    }
    return true;
  };
  mainContoroller.prototype.networkConnectionCheck = function(callback) {
    var currentPage, direction;
    if (controller.networkStatus() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
      direction = "vertical";
      Ti.App.Properties.setBool('stateMainTableSlide', true);
      currentPage = Ti.App.Properties.getString("currentPage");
      Ti.API.info("mainContoroller.networkConnectionCheck " + currentPage);
      return controller.slideMainTable(direction);
    } else {
      return callback();
    }
  };
  mainContoroller.prototype.authenticationCheck = function(callback) {
    var token;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      return this._alertViewShow(this.authenticationFailMessage);
    } else {
      return callback();
    }
  };
  mainContoroller.prototype._alertViewShow = function(messsage) {
    alertView.editMessage(messsage);
    return alertView.animate();
  };
  mainContoroller.prototype.createMainWindow = function() {
    var listBtn, refreshBtn;
    listBtn = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
    });
    listBtn.addEventListener('click', function() {
      var direction;
      direction = "horizontal";
      return controller.slideMainTable(direction);
    });
    refreshBtn = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
    });
    refreshBtn.addEventListener('click', function() {
      return mainContoroller.networkConnectionCheck(function() {
        return controller.loadEntry();
      });
    });
    mainWindow.add(actInd);
    mainWindow.add(mainTable);
    mainWindow.add(menu);
    progressBar.show();
    statusView.add(progressBar);
    mainWindow.add(statusView);
    mainWindow.add(alertView.getAlertView());
    mainWindow.leftNavButton = listBtn;
    mainWindow.rightNavButton = refreshBtn;
    return tabGroup.open();
  };
  mainContoroller.prototype.refreshMenuTable = function() {
    return menuTable.refreshMenu();
  };
  return mainContoroller;
})();
module.exports = mainContoroller;