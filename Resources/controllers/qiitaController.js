var qiitaController;
qiitaController = (function() {
  function qiitaController() {
    this.state = new defaultState();
  }
  qiitaController.prototype.loadEntry = function() {
    var currentPage, direction, items;
    currentPage = Ti.App.Properties.getString("currentPage");
    Ti.API.info("qiitaController.loadEntry start. currentPage is " + currentPage);
    Ti.App.Properties.setString(currentPage, null);
    items = JSON.parse(Ti.App.Properties.getString(currentPage));
    direction = "vertical";
    progressBar.max = 1;
    progressBar.value = 0;
    this.slideMainTable(direction);
    return commandController.useMenu(currentPage);
  };
  qiitaController.prototype.loadOldEntry = function(storedTo) {
    var MAXITEMCOUNT, currentPage, nextURL;
    MAXITEMCOUNT = 20;
    currentPage = Ti.App.Properties.getString("currentPage");
    nextURL = Ti.App.Properties.getString("" + currentPage + "nextURL");
    Ti.API.info(nextURL);
    if (nextURL !== null) {
      qiita.getNextFeed(nextURL, storedTo, function(result) {
        var json, lastIndex, r, _i, _len, _results;
        Ti.API.info("getNextFeed start. result is " + result.length);
        if (result.length !== MAXITEMCOUNT) {
          Ti.API.info("loadOldEntry hide");
          return t.hideLastRow();
        } else {
          Ti.API.info("loadOldEntry show");
          _results = [];
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            json = result[_i];
            r = t.createRow(json);
            lastIndex = t.lastRowIndex();
            _results.push(t.insertRow(lastIndex, r));
          }
          return _results;
        }
      });
    }
    return true;
  };
  qiitaController.prototype.getFeedByTag = function(showFlg, tag) {
    return qiita.getFeedByTag(tag(function(result) {
      return true;
    }));
  };
  qiitaController.prototype.stockItemToQiita = function(uuid) {
    uuid = Ti.App.Properties.getString('stockUUID');
    actInd.backgroundColor = '#222';
    actInd.message = 'Posting...';
    actInd.zIndex = 20;
    actInd.show();
    qiita.putStock(uuid);
    return true;
  };
  qiitaController.prototype.sessionItem = function(json) {
    Ti.API.info("start sessionItem. url is " + json.url + ". uuid is " + json.uuid);
    if (json) {
      Ti.App.Properties.setString('stockURL', json.url);
      Ti.App.Properties.setString('stockUUID', json.uuid);
      return Ti.App.Properties.setString('stockID', json.id);
    }
  };
  qiitaController.prototype.slideMainTable = function(direction) {
    var slideState;
    slideState = Ti.App.Properties.getBool("stateMainTableSlide");
    Ti.API.info("direction is " + direction + ".slideState is " + slideState);
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
  qiitaController.prototype.selectMenu = function(menuName) {
    Ti.API.info("qiitaController.selectMenu start. menuName is " + menuName);
    return commandController.useMenu(menuName);
  };
  qiitaController.prototype.webViewContentsUpdate = function(body) {
    return webview.contentsUpdate(body);
  };
  qiitaController.prototype.webViewHeaderUpdate = function(json) {
    return webview.headerUpdate(json);
  };
  qiitaController.prototype.moveToConfigWindow = function() {
    var configMenu, configWindow, menu;
    configMenu = require("ui/configMenu");
    menu = new configMenu();
    configWindow = new win();
    configWindow.title = "アカウント情報";
    configWindow.backButtonTitle = '戻る';
    configWindow.add(menu);
    return tab.open(configWindow);
  };
  qiitaController.prototype.moveToWebViewWindow = function() {
    var actionBtn;
    actionBtn = Ti.UI.createButton({
      systemButton: Titanium.UI.iPhone.SystemButton.ACTION
    });
    actionBtn.addEventListener('click', function() {
      var dialog;
      dialog = Ti.UI.createOptionDialog();
      dialog.setTitle("どの処理を実行しますか？");
      dialog.setOptions(["ストックする", "キャンセル"]);
      dialog.setCancel(1);
      dialog.addEventListener('click', function(event) {
        Ti.API.info("start dialog action.Event is " + event.index);
        switch (event.index) {
          case 0:
            return controller.stockItemToQiita();
        }
      });
      return dialog.show();
    });
    webview.show();
    webWindow.rightNavButton = actionBtn;
    return tab.open(webWindow);
  };
  qiitaController.prototype.errorHandle = function(param) {
    Ti.API.info(this.message.network.timeout);
    return actInd.hide();
  };
  qiitaController.prototype.logging = function(logData) {
    var logFile, newDir;
    newDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'log');
    newDir.createDirectory();
    if (newDir === true) {
      logFile = Titanium.Filesystem.getFile(newDir.nativePath, 'application.log');
      if (logFile.exists() === false) {
        Ti.API.info("file create");
        logFile.createTimestamp();
        logFile.write(logData);
      } else {
        Ti.API.info("write data");
        logFile.write(logData.toString());
      }
    } else {
      Ti.API.info("write data");
      logFile = Titanium.Filesystem.getFile(newDir.nativePath, 'application.log');
      logFile.write(logData.toString());
    }
    return true;
  };
  qiitaController.prototype.login = function(param) {
    qiita._auth(param, function(token) {
      actInd.backgroundColor = '#222';
      actInd.zIndex = 10;
      actInd.show();
      if (token === null) {
        alert("ユーザIDかパスワードが間違ってます");
      } else {
        alert("認証出来ました");
        Ti.App.Properties.setString('QiitaLoginID', param.url_name);
        Ti.App.Properties.setString('QiitaLoginPassword', param.password);
      }
      return actInd.hide();
    });
    return true;
  };
  qiitaController.prototype.networkStatus = function() {
    return qiita.isConnected();
  };
  return qiitaController;
})();
module.exports = qiitaController;