var Qiita, actInd, activityIndicator, controller, defaultState, listBtn, mainTable, mainWindow, menuTable, moment, momentja, qiita, qiitaController, refreshBtn, rows, slideState, t, tab, tabGroup, tableView, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;
moment = require('lib/moment.min');
momentja = require('lib/momentja');
Qiita = require('qiita');
tableView = require('tableView');
menuTable = require('menuTable');
qiitaController = require('qiitaController');
defaultState = require("defaultState");
slideState = require("slideState");
webView = require('webView');
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
  qiita._auth();
  Ti.API.info(Ti.App.Properties.getString('QiitaToken'));
  mainWindow.add(actInd);
  rows = [];
  qiita.getFeed(function(result, links) {
    var link, menu, _i, _len;
    for (_i = 0, _len = links.length; _i < _len; _i++) {
      link = links[_i];
      if (link["rel"] === 'next') {
        Ti.App.Properties.setString('nextPageURL', link["url"]);
      }
    }
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