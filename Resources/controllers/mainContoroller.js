var mainContoroller,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mainContoroller = (function() {

  function mainContoroller() {
    this._hideStatusView = __bind(this._hideStatusView, this);

    this._showStatusView = __bind(this._showStatusView, this);
    this.state = new defaultState();
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }

  mainContoroller.prototype.init = function() {
    var loginID, password, _;
    loginID = Ti.App.Properties.getString('QiitaLoginID');
    password = Ti.App.Properties.getString('QiitaLoginPassword');
    _ = require("lib/underscore-min");
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
      this.refreshMenuTable();
      this.startApp();
      this.createConfigWindow();
      this.createMainWindow();
      tabGroup.setActiveTab(0);
      tabGroup.open();
      Ti.App.Properties.setBool('stateMainTableSlide', false);
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

  mainContoroller.prototype.startApp = function() {
    commandController.createMenu("QiitaUser");
    return commandController.useMenu("storedStocks");
  };

  mainContoroller.prototype.refreshMenuTable = function() {
    return menuTable.refreshMenu();
  };

  mainContoroller.prototype.loadEntry = function() {
    var currentPage, items;
    currentPage = Ti.App.Properties.getString("currentPage");
    Ti.API.info("qiitaController.loadEntry start. currentPage is " + currentPage);
    Ti.App.Properties.setString(currentPage, null);
    items = JSON.parse(Ti.App.Properties.getString(currentPage));
    return commandController.useMenu(currentPage);
  };

  mainContoroller.prototype._currentSlideState = function() {
    var flg, state;
    flg = Ti.App.Properties.getBool("stateMainTableSlide");
    if (flg === true) {
      state = "slideState";
    } else {
      state = "default";
    }
    return state;
  };

  mainContoroller.prototype._showStatusView = function() {
    Ti.API.info("データの読み込み。statusView表示");
    Ti.App.Properties.setBool("stateMainTableSlide", false);
    return this.slideMainTable("vertical");
  };

  mainContoroller.prototype._hideStatusView = function() {
    Ti.API.info("データの読み込みが完了したらstatusViewを元に戻す");
    Ti.App.Properties.setBool("stateMainTableSlide", true);
    return this.slideMainTable("vertical");
  };

  mainContoroller.prototype.loadOldEntry = function(storedTo) {
    var MAXITEMCOUNT, currentPage, nextURL,
      _this = this;
    this._showStatusView();
    MAXITEMCOUNT = 20;
    currentPage = Ti.App.Properties.getString("currentPage");
    nextURL = Ti.App.Properties.getString("" + currentPage + "nextURL");
    Ti.API.info(nextURL);
    if (nextURL !== null) {
      qiita.getNextFeed(nextURL, storedTo, function(result) {
        var json, lastIndex, r, _i, _len, _results;
        _this._hideStatusView();
        Ti.API.info("getNextFeed start. result is " + result.length);
        if (result.length !== MAXITEMCOUNT) {
          return mainTableView.hideLastRow();
        } else {
          _results = [];
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            json = result[_i];
            r = mainTableView.createRow(json);
            lastIndex = mainTableView.lastRowIndex();
            _results.push(mainTableView.insertRow(lastIndex, r));
          }
          return _results;
        }
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
    if (slideState === false && direction === "vertical") {
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
    var actionBtn;
    webview.show();
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
            return mainContoroller.stockItemToQiita();
        }
      });
      return dialog.show();
    });
    webWindow.add(actionBtn);
    navController.open(webWindow);
  };

  return mainContoroller;

})();

module.exports = mainContoroller;
