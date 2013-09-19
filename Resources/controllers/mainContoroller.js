var mainContoroller,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mainContoroller = (function() {

  function mainContoroller() {
    this.stockItem = __bind(this.stockItem, this);

    this._hideStatusView = __bind(this._hideStatusView, this);

    this._showStatusView = __bind(this._showStatusView, this);

    var Hatena, Qiita;
    Hatena = require("model/hatena");
    this.hatena = new Hatena();
    Qiita = require("model/qiita");
    this.qiita = new Qiita();
    this.tabSetting = {
      "iphone": {
        "main": {
          "windowName": "mainWindow"
        }
      },
      "android": {
        "main": {
          "windowName": "mainWindow"
        }
      }
    };
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }

  mainContoroller.prototype.createTabGroup = function() {
    var MainWindow, mainTab, mainWindow, osname, tabGroup;
    tabGroup = Ti.UI.createTabGroup({
      tabsBackgroundColor: "#f9f9f9",
      shadowImage: "ui/image/shadowimage.png",
      tabsBackgroundImage: "ui/image/tabbar.png",
      activeTabBackgroundImage: "ui/image/activetab.png",
      activeTabIconTint: "#fffBD5"
    });
    tabGroup.addEventListener('focus', function(e) {
      tabGroup._activeTab = e.tab;
      tabGroup._activeTabIndex = e.index;
      if (tabGroup._activeTabIndex === -1) {
        return;
      }
      return Ti.API._activeTab = tabGroup._activeTab;
    });
    osname = Ti.Platform.osname;
    MainWindow = require("ui/" + osname + "/mainWindow");
    mainWindow = new MainWindow();
    mainTab = Titanium.UI.createTab({
      window: mainWindow,
      windowName: this.tabSetting[osname].main.windowName
    });
    tabGroup.addTab(mainTab);
    return tabGroup.open();
  };

  mainContoroller.prototype.qiitaLogin = function() {
    var param,
      _this = this;
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    Ti.API.debug("[INFO] login start.");
    return this.qiita._auth(param, function(token) {
      Ti.API.debug("token is " + token);
      if (token === null) {
        return alert("ユーザIDかパスワードが間違ってます");
      } else {
        alert("認証出来ました");
        Ti.App.Properties.setString('QiitaLoginID', param.url_name);
        Ti.App.Properties.setString('QiitaLoginPassword', param.password);
        return Ti.App.Properties.setString('QiitaToken', token);
      }
    });
  };

  mainContoroller.prototype.init = function() {
    var loginID, password, _;
    loginID = Ti.App.Properties.getString('QiitaLoginID');
    password = Ti.App.Properties.getString('QiitaLoginPassword');
    _ = require("lib/underscore-min");
    if (this.qiita.isConnected() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
    } else if ((loginID != null) === false || loginID === "") {
      rootWindow.toggleRightView();
      commandController.useMenu("storedStocks");
    } else {
      Ti.API.info("start mainWindow");
      Ti.API.info(Ti.App.Properties.getString('QiitaToken'));
      this.refreshMenuTable();
      commandController.useMenu("storedStocks");
    }
    return true;
  };

  mainContoroller.prototype.networkConnectionCheck = function(callback) {
    var currentPage;
    if (this.qiita.isConnected() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
      currentPage = Ti.App.Properties.getString("currentPage");
      Ti.API.info("networkConnectionCheck " + currentPage);
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

  mainContoroller.prototype.refreshMenuTable = function() {
    Ti.API.debug("refreshMenuTable");
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

  mainContoroller.prototype._showStatusView = function() {
    Ti.API.info("[ACTION] スライド開始");
    progressBar.value = 0;
    progressBar.show();
    return statusView.animate({
      duration: 400,
      top: 0
    }, function() {
      Ti.API.debug("mainTable を上にずらす");
      return mainTable.animate({
        duration: 200,
        top: 50
      });
    });
  };

  mainContoroller.prototype._hideStatusView = function() {
    Ti.API.info("[ACTION] スライドから標準状態に戻る。垂直方向");
    return mainTable.animate({
      duration: 200,
      top: 0
    }, function() {
      Ti.API.debug("mainTable back");
      progressBar.hide();
      return statusView.animate({
        duration: 400,
        top: -50
      });
    });
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
      this.qiita.getNextFeed(nextURL, storedTo, function(result) {
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

  mainContoroller.prototype.stockItem = function(uuid, url, contents, qiitaPostFlg, hatenaPostFlg, callback) {
    var hatena, hatenaPostResult, qiitaPostResult;
    hatena = this.hatena;
    qiitaPostResult = false;
    hatenaPostResult = false;
    if (qiitaPostFlg === true) {
      return this.qiita.putStock(uuid, function(qiitaresult) {
        var result;
        if (qiitaresult === 'success') {
          qiitaPostResult = true;
        }
        if (hatenaPostFlg === true) {
          return hatena.postBookmark(url, contents, function(hatenaresult) {
            var result;
            Ti.API.info("postBookmark result is " + hatenaresult);
            if (hatenaresult.success) {
              hatenaPostResult = true;
            }
            Ti.API.info("Qiitaとはてブ同時投稿終了。結果は" + qiitaPostResult + "と" + hatenaPostResult + "です");
            result = [qiitaPostResult, hatenaPostResult];
            return callback(result);
          });
        } else {
          result = [qiitaPostResult, hatenaPostResult];
          return callback(result);
        }
      });
    } else {
      if (hatenaPostFlg === true) {
        return hatena.postBookmark(url, contents, function(hatenaresult) {
          var result;
          Ti.API.info("postBookmark result is " + hatenaresult);
          if (hatenaresult.success) {
            hatenaPostResult = true;
          }
          Ti.API.info("はてブ投稿終了。結果は" + qiitaPostResult + "と" + hatenaPostResult + "です");
          result = [qiitaPostResult, hatenaPostResult];
          return callback(result);
        });
      }
    }
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
    Ti.API.info("webview show finish " + (moment()));
    Ti.API.info("" + (webview.getStockUUID()));
    navController.open(webWindow);
  };

  return mainContoroller;

})();

module.exports = mainContoroller;
