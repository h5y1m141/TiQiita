var Qiita, actInd, controller, defaultState, listBtn, mainTable, mainWindow, menuTable, moment, momentja, qiita, qiitaController, rows, slideState, t, tab, tabGroup, tableView, testsEnabled, token, webView, webViewContents, webViewHeader, webWindow, webview;
Qiita = require('qiita');
tableView = require('tableView');
menuTable = require('menuTable');
moment = require('lib/moment.min');
momentja = require('lib/momentja');
qiitaController = require('qiitaController');
defaultState = require("defaultState");
slideState = require("slideState");
webView = require('webView');
t = new tableView();
qiita = new Qiita();
controller = new qiitaController();
Ti.App.Properties.setBool('stateMainTableSlide', false);
Ti.App.Properties.setString("storedStocks", null);
Ti.App.Properties.setString("storedMyStocks", null);
Ti.App.Properties.setBool("isLastPage", false);
testsEnabled = false;
if (testsEnabled === true) {
  require('test/tests');
} else {
  mainTable = t.getTable();
  token = Ti.App.Properties.getString('QiitaToken');
  if (token === null) {
    qiita._auth();
  }
  Ti.API.info('Token is' + token);
  mainWindow = Ti.UI.createWindow({
    title: 'Qiita',
    barColor: '#59BB0C'
  });
  actInd = Ti.UI.createActivityIndicator({
    zIndex: 10,
    top: 100,
    left: 120,
    height: 40,
    width: 'auto',
    font: {
      fontFamily: 'Helvetica Neue',
      fontSize: 15,
      fontWeight: 'bold'
    },
    color: '#fff',
    message: 'loading...'
  });
  actInd.show();
  mainWindow.add(actInd);
  rows = [];
  qiita.getFeed(function(result, links) {
    var json, link, menu, _i, _j, _len, _len2;
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
    mainWindow.add(mainTable);
    menu = new menuTable();
    mainWindow.add(menu);
    return true;
  });
  listBtn = Ti.UI.createButton({
    systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
  });
  listBtn.addEventListener('click', function() {
    return controller.slideMainTable();
  });
  mainWindow.leftNavButton = listBtn;
  webWindow = Ti.UI.createWindow({
    backButtonTitle: '戻る',
    barColor: '#59BB0C'
  });
  webview = new webView();
  webViewHeader = webview.retreiveWebViewHeader();
  webViewContents = webview.retreiveWebView();
  webWindow.add(webViewHeader);
  webWindow.add(webViewContents);
  webWindow.add(actInd);
  tabGroup = Ti.UI.createTabGroup();
  tab = Ti.UI.createTab({
    window: mainWindow
  });
  tabGroup.addTab(tab);
  tabGroup.open();
}