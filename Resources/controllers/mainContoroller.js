var mainContoroller;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
mainContoroller = (function() {
  function mainContoroller() {
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }
  mainContoroller.prototype.init = function() {
    var loginID, param, password;
    loginID = Ti.App.Properties.getString('QiitaLoginID');
    password = Ti.App.Properties.getString('QiitaLoginPassword');
    if (controller.networkStatus() === false) {
      Ti.API.info("mainContoroller init fail because of network connection not established");
      this.createMainWindow();
      this.createConfigWindow();
      this._alertViewShow(this.networkDisconnectedMessage);
      tabGroup.setActiveTab(0);
      tabGroup.open();
    } else if (loginID === null || password === null || loginID === "" || password === "") {
      Ti.API.info("@createConfigWindow start");
      this.createConfigWindow();
      tabGroup.setActiveTab(1);
      tabGroup.open();
    } else {
      Ti.API.info("start mainWindow");
      param = {
        url_name: loginID,
        password: password
      };
      qiita._auth(param);
      this.createConfigWindow();
      this.createMainWindow();
      this.refreshMenuTable();
      this.startApp();
      tabGroup.setActiveTab(0);
      tabGroup.open();
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
      Ti.API.info("networkConnectionCheck " + currentPage);
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
  mainContoroller.prototype.createConfigWindow = function() {
    configWindow.add(configMenu);
    configWindow.add(alertView.getAlertView());
    return true;
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
    refreshBtn.addEventListener('click', __bind(function() {
      return this.networkConnectionCheck(function() {
        return controller.loadEntry();
      });
    }, this));
    mainWindow.add(actInd);
    mainWindow.add(mainTable);
    mainWindow.add(menu);
    progressBar.show();
    statusView.add(progressBar);
    mainWindow.add(statusView);
    mainWindow.add(alertView.getAlertView());
    mainWindow.leftNavButton = listBtn;
    mainWindow.rightNavButton = refreshBtn;
    return true;
  };
  mainContoroller.prototype.startApp = function() {
    var direction;
    direction = "vertical";
    Ti.App.Properties.setBool('stateMainTableSlide', false);
    controller.slideMainTable(direction);
    commandController.useMenu("storedStocks");
    return commandController.useMenu("followingTags");
  };
  mainContoroller.prototype.refreshMenuTable = function() {
    return menuTable.refreshMenu();
  };
  return mainContoroller;
})();
module.exports = mainContoroller;