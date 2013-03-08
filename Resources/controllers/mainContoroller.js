var mainContoroller;

mainContoroller = (function() {

  function mainContoroller() {
    this.state = new defaultState();
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }

  mainContoroller.prototype.init = function() {
    var loginID, param, password;
    loginID = Ti.App.Properties.getString('QiitaLoginID');
    password = Ti.App.Properties.getString('QiitaLoginPassword');
    if (qiita.isConnected() === false) {
      Ti.API.info("mainContoroller init fail because of network connection not established");
      this.createMainWindow();
      this.createConfigWindow();
      this._alertViewShow(this.networkDisconnectedMessage);
      tabGroup.setActiveTab(0);
      tabGroup.open();
    } else if ((loginID != null) === false || loginID === "") {
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
    if (qiita.isConnected() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
      direction = "vertical";
      Ti.App.Properties.setBool('stateMainTableSlide', true);
      currentPage = Ti.App.Properties.getString("currentPage");
      Ti.API.info("networkConnectionCheck " + currentPage);
      return this.slideMainTable(direction);
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
    var listBtn, refreshBtn,
      _this = this;
    listBtn = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
    });
    listBtn.addEventListener('click', function() {
      var direction;
      direction = "horizontal";
      Ti.API.info("listBtn click." + direction);
      return _this.slideMainTable(direction);
    });
    refreshBtn = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
    });
    refreshBtn.addEventListener('click', function() {
      return _this.networkConnectionCheck(function() {
        return _this.loadEntry();
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
    return true;
  };

  mainContoroller.prototype.startApp = function() {
    var direction;
    direction = "vertical";
    Ti.App.Properties.setBool('stateMainTableSlide', false);
    this.slideMainTable(direction);
    commandController.createMenu("QiitaUser");
    return commandController.useMenu("storedStocks");
  };

  mainContoroller.prototype.refreshMenuTable = function() {
    return menuTable.refreshMenu();
  };

  mainContoroller.prototype.loadEntry = function() {
    var currentPage, direction, items;
    currentPage = Ti.App.Properties.getString("currentPage");
    Ti.API.info("qiitaController.loadEntry start. currentPage is " + currentPage);
    Ti.App.Properties.setString(currentPage, null);
    items = JSON.parse(Ti.App.Properties.getString(currentPage));
    direction = "vertical";
    this.slideMainTable(direction);
    return commandController.useMenu(currentPage);
  };

  mainContoroller.prototype.loadOldEntry = function(storedTo) {
    var MAXITEMCOUNT, currentPage, direction, nextURL,
      _this = this;
    MAXITEMCOUNT = 20;
    currentPage = Ti.App.Properties.getString("currentPage");
    nextURL = Ti.App.Properties.getString("" + currentPage + "nextURL");
    direction = "vertical";
    this.slideMainTable(direction);
    Ti.API.info(nextURL);
    if (nextURL !== null) {
      qiita.getNextFeed(nextURL, storedTo, function(result) {
        var json, lastIndex, r, _i, _len;
        Ti.API.info("getNextFeed start. result is " + result.length);
        if (result.length !== MAXITEMCOUNT) {
          mainTableView.hideLastRow();
        } else {
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            json = result[_i];
            r = mainTableView.createRow(json);
            lastIndex = mainTableView.lastRowIndex();
            mainTableView.insertRow(lastIndex, r);
          }
        }
        direction = "vertical";
        return _this.slideMainTable(direction);
      });
    }
    return true;
  };

  mainContoroller.prototype.stockItemToQiita = function(uuid) {
    uuid = Ti.App.Properties.getString('stockUUID');
    qiita.putStock(uuid);
    return true;
  };

  mainContoroller.prototype.sessionItem = function(json) {
    Ti.API.info("start sessionItem. url is " + json.url + ". uuid is " + json.uuid);
    if (json) {
      Ti.App.Properties.setString('stockURL', json.url);
      Ti.App.Properties.setString('stockUUID', json.uuid);
      return Ti.App.Properties.setString('stockID', json.id);
    }
  };

  mainContoroller.prototype.slideMainTable = function(direction) {
    var slideState;
    slideState = Ti.App.Properties.getBool("stateMainTableSlide");
    Ti.API.info("[SLIDEMAINTABLE] direction is " + direction + ".slideState is " + slideState);
    if (slideState === false && direction === "horizontal") {
      return this.state = this.state.moveForward();
    } else if (slideState === true && direction === "horizontal") {
      return this.state = this.state.moveBackward();
    } else if (slideState === false && direction === "vertical") {
      return this.state = this.state.moveDown();
    } else if (slideState === true && direction === "vertical") {
      return this.state = this.state.moveUP();
    } else {

    }
  };

  mainContoroller.prototype.selectMenu = function(menuName) {
    Ti.API.info("mainController.selectMenu start. menuName is " + menuName);
    return commandController.useMenu(menuName);
  };

  mainContoroller.prototype.webViewContentsUpdate = function(body) {
    return webview.contentsUpdate(body);
  };

  mainContoroller.prototype.webViewHeaderUpdate = function(json) {
    return webview.headerUpdate(json);
  };

  mainContoroller.prototype.moveToWebViewWindow = function() {
    var actionBtn, self;
    self = this;
    actionBtn = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.ACTION
    });
    actionBtn.addEventListener('click', function() {
      var dialog,
        _this = this;
      dialog = Ti.UI.createOptionDialog();
      dialog.setTitle("どの処理を実行しますか？");
      dialog.setOptions(["ストックする", "キャンセル"]);
      dialog.setCancel(1);
      dialog.addEventListener('click', function(event) {
        Ti.API.info("start dialog action.Event is " + event.index);
        switch (event.index) {
          case 0:
            return self.stockItemToQiita();
        }
      });
      return dialog.show();
    });
    webview.show();
    webWindow.rightNavButton = actionBtn;
    return mainTab.open(webWindow);
  };

  return mainContoroller;

})();

module.exports = mainContoroller;
