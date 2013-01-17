var qiitaController;
qiitaController = (function() {
  function qiitaController() {
    this.state = new defaultState();
  }
  qiitaController.prototype.loadOldEntry = function(storedTo) {
    var url;
    url = Ti.App.Properties.getString('nextPageURL');
    Ti.API.info("NEXTPAGE:" + url);
    actInd.backgroundColor = '#222';
    actInd.opacity = 0.8;
    actInd.show();
    qiita.getNextFeed(url, storedTo, function(result, links) {
      var MAXITEMCOUNT, json, lastIndex, link, r, _i, _j, _len, _len2;
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        link = links[_i];
        if (link["rel"] === 'next') {
          Ti.App.Properties.setString('nextPageURL', link["url"]);
        }
      }
      for (_j = 0, _len2 = result.length; _j < _len2; _j++) {
        json = result[_j];
        r = t.createRow(json);
        lastIndex = t.lastRowIndex();
        t.insertRow(lastIndex, r);
        actInd.hide();
      }
      MAXITEMCOUNT = 20;
      if (result.length !== MAXITEMCOUNT) {
        return t.hideLastRow();
      }
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
  qiitaController.prototype.webViewContentsUpdate = function(body) {
    return webview.contentsUpdate(body);
  };
  qiitaController.prototype.webViewHeaderUpdate = function(json) {
    return webview.headerUpdate(json);
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
  qiitaController.prototype.loadEntry = function() {
    Ti.API.info("called loadEntry method. mainTable is " + mainTable);
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
  qiitaController.prototype.show = function() {
    return alert("start contoroller show");
  };
  qiitaController.prototype.login = function(flg) {
    Ti.API.info("start Qiita Login. login flag is " + flg);
    return true;
  };
  return qiitaController;
})();
module.exports = qiitaController;