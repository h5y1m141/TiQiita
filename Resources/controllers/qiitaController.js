var qiitaController;
qiitaController = (function() {
  function qiitaController() {
    this.state = new defaultState();
    this.message = {
      network: {
        timeout: "ネットワーク接続できないかサーバがダウンしてるようです"
      }
    };
  }
  qiitaController.prototype.loadEntry = function() {
    actInd.backgroundColor = '#222';
    actInd.zIndex = 10;
    actInd.show();
    return qiita.getFeed(function(result, links) {
      var json, link, rows, _i, _j, _len, _len2;
      rows = [];
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        if (link["rel"] === 'next') {
          Ti.App.Properties.setString('nextPageURL', link["url"]);
        }
      }
      for (_j = 0, _len2 = result.length; _j < _len2; _j++) {
        json = result[_j];
        rows.push(t.createRow(json));
      }
      rows.push(t.createRowForLoadOldEntry('storedStocks'));
      mainTable.setData(rows);
      actInd.hide();
      return true;
    });
  };
  qiitaController.prototype.loadOldEntry = function(storedTo) {
    var MAXITEMCOUNT, url;
    url = Ti.App.Properties.getString('nextPageURL');
    Ti.API.info("loadOldEntry start. NEXTPAGE:" + url);
    Ti.API.info("storedTo is " + storedTo);
    actInd.backgroundColor = '#222';
    actInd.opacity = 1.0;
    actInd.zIndex = 10;
    actInd.show();
    MAXITEMCOUNT = 20;
    qiita.getNextFeed(url, storedTo, function(result) {
      var json, lastIndex, r, _i, _len;
      Ti.API.info("getNextFeed start. result is " + result.length);
      if (result.length !== MAXITEMCOUNT) {
        Ti.API.info("loadOldEntry hide");
        t.hideLastRow();
      } else {
        Ti.API.info("loadOldEntry show");
        for (_i = 0, _len = result.length; _i < _len; _i++) {
          json = result[_i];
          r = t.createRow(json);
          lastIndex = t.lastRowIndex();
          t.insertRow(lastIndex, r);
        }
      }
      return actInd.hide();
    });
    return true;
  };
  qiitaController.prototype.getFeed = function() {
    var rows;
    rows = [];
    actInd.message = 'loading...';
    actInd.backgroundColor = '#222';
    actInd.opacity = 1.0;
    actInd.show();
    return qiita.getFeed(function(result, links) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(t.createRow(json));
      }
      rows.push(t.createRowForLoadOldEntry('storedStocks'));
      mainTable.setData(rows);
      actInd.hide();
      return true;
    });
  };
  qiitaController.prototype.getMyStocks = function() {
    var MAXITEMCOUNT, rows;
    actInd.message = 'loading...';
    actInd.backgroundColor = '#222';
    actInd.opacity = 1.0;
    actInd.zIndex = 10;
    actInd.show();
    rows = [];
    MAXITEMCOUNT = 20;
    qiita.getMyStocks(function(result) {
      var json, _i, _len;
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        json = result[_i];
        rows.push(t.createRow(json));
      }
      if (result.length !== MAXITEMCOUNT) {
        Ti.API.info("loadOldEntry hide");
      } else {
        Ti.API.info("loadOldEntry show");
        rows.push(t.createRowForLoadOldEntry('storedMyStocks'));
      }
      actInd.hide();
      return mainTable.setData(rows);
    });
    return true;
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
  qiitaController.prototype.slideMainTable = function() {
    if (Ti.App.Properties.getBool("stateMainTableSlide") === false) {
      return this.state = this.state.moveForward();
    } else {
      return this.state = this.state.moveBackward();
    }
  };
  qiitaController.prototype.selectMenu = function(menuName) {
    var items, json, result, _i, _len;
    result = [];
    if (menuName === "stock") {
      items = JSON.parse(Ti.App.Properties.getString('storedMyStocks'));
    } else {
      items = JSON.parse(Ti.App.Properties.getString('storedStocks'));
    }
    switch (menuName) {
      case "config":
        return this.moveToConfigWindow();
      case "stock":
        return this.getMyStocks();
      case "allLabel":
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          json = items[_i];
          result.push(t.createRow(json));
        }
        result.push(t.createRowForLoadOldEntry('storedStocks'));
        break;
    }
    mainTable.setData(result);
    return true;
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
  return qiitaController;
})();
module.exports = qiitaController;