var Qiita, actInd, activityIndicator, controller, defaultState, listBtn, mainTable, mainWindow, menuTable, moment, momentja, qiita, qiitaController, refreshBtn, rows, slideState, t, tab, tabGroup, tableView, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;
moment = require('lib/moment.min');
momentja = require('lib/momentja');
Qiita = require('qiita');
tableView = require('ui/tableView');
menuTable = require('ui/menuTable');
qiitaController = require('qiitaController');
defaultState = require("defaultState");
slideState = require("slideState");
webView = require('ui/webView');
win = require('ui/window');
activityIndicator = require('ui/activityIndicator');
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
  mainWindow = new win();
  actInd = new activityIndicator();
  actInd.show();
  mainWindow.add(actInd);
  rows = [];
  qiita.getFeed(function(result, links) {
    var json, menu, _i, _len;
    for (_i = 0, _len = result.length; _i < _len; _i++) {
      json = result[_i];
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
  refreshBtn = Ti.UI.createButton({
    systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
  });
  refreshBtn.addEventListener('click', function() {
    return controller.loadEntry();
  });
  mainWindow.leftNavButton = listBtn;
  mainWindow.rightNavButton = refreshBtn;
  webWindow = new win();
  webWindow.backButtonTitle = '戻る';
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