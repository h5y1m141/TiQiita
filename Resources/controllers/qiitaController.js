var qiitaController;
qiitaController = (function() {
  function qiitaController() {
    var Client;
    this.state = new defaultState();
    this.message = {
      network: {
        timeout: "ネットワーク接続できないかサーバがダウンしてるようです"
      }
    };
    Client = require("controllers/client");
    this.client = new Client();
  }
  qiitaController.prototype.loadEntry = function() {
    actInd.backgroundColor = '#222';
    actInd.zIndex = 10;
    actInd.show();
    return qiita.getFeed(function(result, links) {
      var json, link, rows, _i, _j, _len, _len2, _obj;
      rows = [];
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        if (link["rel"] === 'next') {
          Ti.App.Properties.setString('nextPageURL', link["url"]);
        }
      }
      pageController.showLists();
      _obj = {
        label: 'storedStocks',
        nextURL: link["url"],
        lastURL: null
      };
      pageController.set(_obj);
      pageController.showLists();
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
    actInd.backgroundColor = '#222';
    actInd.opacity = 1.0;
    actInd.zIndex = 10;
    actInd.show();
    MAXITEMCOUNT = 20;
    qiita.getNextFeed(url, storedTo, function(result) {
      var json, lastIndex, r, _i, _len, _obj;
      Ti.API.info("getNextFeed start. result is " + result.length);
      pageController.showLists();
      _obj = {
        label: storedTo,
        nextURL: url,
        lastURL: null
      };
      pageController.set(_obj);
      pageController.showLists();
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
  qiitaController.prototype.getFeedByTag = function(showFlg, tag) {
    return qiita.getFeedByTag(tag(function(result) {
      actInd.hide();
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
    return this.client.useMenu(menuName);
  };
  qiitaController.prototype.currentPage = function(label, nextURL) {
    var currentPage;
    currentPage = {
      label: storedTo,
      nextURL: nextURL
    };
    return Ti.App.Properties.setString("currentPage", JSON.stringify(currentPage));
  };
  qiitaController.prototype.getCurrentPage = function() {
    return JSON.parse(Ti.App.Properties.getString("currentPage"));
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