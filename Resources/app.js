var Client, Qiita, actInd, activityIndicator, commandController, controller, defaultState, listBtn, mainTable, mainWindow, menu, menuTable, moment, momentja, qiita, qiitaController, refreshBtn, slideState, t, tab, tabGroup, tableView, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;
moment = require('lib/moment.min');
momentja = require('lib/momentja');
Qiita = require('model/qiita');
tableView = require('ui/tableView');
menuTable = require('ui/menuTable');
qiitaController = require('controllers/qiitaController');
Client = require("controllers/client");
commandController = new Client();
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
  menu = new menuTable();
  mainWindow.add(actInd);
  mainWindow.add(mainTable);
  mainWindow.add(menu);
  mainWindow.leftNavButton = listBtn;
  mainWindow.rightNavButton = refreshBtn;
  commandController.useMenu("storedStocks");
  commandController.useMenu("storedMyStocks");
  commandController.useMenu("followingTags");
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