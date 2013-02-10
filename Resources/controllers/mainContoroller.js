var mainContoroller;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
mainContoroller = (function() {
  function mainContoroller() {
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }
  mainContoroller.prototype.init = function() {
    var loginID, password;
    loginID = Ti.App.Properties.getString('QiitaLoginID');
    password = Ti.App.Properties.getString('QiitaLoginPassword');
    if (controller.networkStatus() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
    } else if (loginID === "" || password === "") {
      this.createWelcomeAppsWindow();
    } else {
      this.createMainWindow();
      this.refreshMenuTable();
      this.startApp();
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
  mainContoroller.prototype.createWelcomeAppsWindow = function() {
    var ConfigMenu, QiitaLoginID, QiitaLoginPassword, backView, closeBtn, configMenu, configWindow, label1, label2, label3, textField1, textField2;
    ConfigMenu = require("ui/configMenu");
    configMenu = new ConfigMenu();
    configWindow = new win();
    configWindow.title = "アカウント情報";
    configWindow.backgroundColor = '#fff';
    QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');
    QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword');
    closeBtn = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.DONE
    });
    closeBtn.addEventListener('click', __bind(function() {
      var listBtn, refreshBtn;
      configWindow.close();
      configWindow.hide();
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
      this.startApp();
      return tab.open(mainWindow);
    }, this));
    configWindow.rightNavButton = closeBtn;
    backView = Titanium.UI.createView({
      zIndex: 5,
      width: 310,
      height: 250,
      left: 5,
      top: 50,
      borderRadius: 10,
      backgroundColor: '#59BB0C'
    });
    label1 = Ti.UI.createLabel({
      color: "#222",
      top: 5,
      left: 5,
      width: 100,
      height: 40,
      text: "ログインID"
    });
    textField1 = Ti.UI.createTextField({
      color: "#222",
      top: 5,
      left: 110,
      width: 150,
      height: 40,
      hintText: "ユーザID",
      font: {
        fontSize: 14
      },
      keyboardType: Ti.UI.KEYBOARD_EMAIL_ADDRESS,
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      autocorrect: false,
      autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    });
    textField1.addEventListener('change', function(e) {
      return Ti.App.Properties.setString('QiitaLoginID', e.value);
    });
    label2 = Ti.UI.createLabel({
      color: "#222",
      top: 50,
      left: 5,
      width: 100,
      height: 40,
      text: "パスワード"
    });
    textField2 = Ti.UI.createTextField({
      color: "#222",
      top: 50,
      left: 110,
      width: 150,
      height: 40,
      hintText: "パスワード入力",
      font: {
        fontSize: 14
      },
      keyboardType: Ti.UI.KEYBOARD_ASCII,
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      passwordMask: true,
      autocorrect: false
    });
    textField2.addEventListener('change', function(e) {
      return Ti.App.Properties.setString('QiitaLoginPassword', e.value);
    });
    label3 = Ti.UI.createLabel({
      color: "#fff",
      top: 100,
      left: 5,
      width: 300,
      height: 40,
      textAlign: 1,
      font: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      text: "ログインする"
    });
    label3.addEventListener('click', function(e) {
      return commandController.useMenu("qiitaLogin");
    });
    backView.add(label1);
    backView.add(textField1);
    backView.add(label2);
    backView.add(textField2);
    backView.add(label3);
    configWindow.add(backView);
    tab.window = configWindow;
    return tabGroup.open();
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
    return tabGroup.open();
  };
  mainContoroller.prototype.startApp = function() {
    var direction;
    direction = "vertical";
    Ti.App.Properties.setBool('stateMainTableSlide', false);
    controller.slideMainTable(direction);
    return commandController.useMenu("storedStocks");
  };
  mainContoroller.prototype.refreshMenuTable = function() {
    return menuTable.refreshMenu();
  };
  return mainContoroller;
})();
module.exports = mainContoroller;