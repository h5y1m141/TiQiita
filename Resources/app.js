var AlertView, CommandController, MainContoroller, MainTable, MenuTable, ProgressBar, Qiita, StatusView, actInd, activityIndicator, alertView, commandController, controller, defaultState, mainContoroller, mainTable, mainTableView, mainWindow, menu, menuTable, moment, momentja, progressBar, qiita, qiitaController, slideState, statusView, tab, tabGroup, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;
Ti.App.Properties.setBool('stateMainTableSlide', false);
Ti.App.Properties.setString("storedStocks", null);
Ti.App.Properties.setString("storedMyStocks", null);
Ti.App.Properties.setList("followingTags", null);
Ti.App.Properties.setString("currentPage", "storedStocks");
Ti.App.Properties.setString('QiitaToken', null);
testsEnabled = false;
moment = require('lib/moment.min');
momentja = require('lib/momentja');
defaultState = require("model/defaultState");
slideState = require("model/slideState");
Qiita = require('model/qiita');
qiita = new Qiita();
MainContoroller = require('controllers/mainContoroller');
qiitaController = require('controllers/qiitaController');
CommandController = require("controllers/commandController");
controller = new qiitaController();
mainContoroller = new MainContoroller();
commandController = new CommandController();
MainTable = require('ui/mainTable');
MenuTable = require('ui/menuTable');
StatusView = require('ui/statusView');
AlertView = require('ui/alertView');
ProgressBar = require('ui/progressBar');
webView = require('ui/webView');
win = require('ui/window');
activityIndicator = require('ui/activityIndicator');
statusView = new StatusView();
alertView = new AlertView();
progressBar = new ProgressBar();
mainTableView = new MainTable();
mainTable = mainTableView.getTable();
mainWindow = new win();
actInd = new activityIndicator();
menuTable = new MenuTable();
menu = menuTable.getMenu();
webWindow = new win();
webWindow.backButtonTitle = '戻る';
webview = new webView();
webViewHeader = webview.retreiveWebViewHeader();
webViewContents = webview.retreiveWebView();
webWindow.add(webViewHeader);
webWindow.add(webViewContents);
webWindow.add(actInd);
tabGroup = Ti.UI.createTabGroup();
tabGroup.tabBarVisible = false;
tab = Ti.UI.createTab({
  window: mainWindow
});
tabGroup.addTab(tab);
if (testsEnabled === true) {
  require('test/tests');
} else {
  mainContoroller.init();
}