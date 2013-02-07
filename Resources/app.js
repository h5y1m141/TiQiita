var AlertView, CommandController, MainContoroller, MainTable, ProgressBar, Qiita, StatusView, actInd, activityIndicator, alertView, commandController, controller, defaultState, listBtn, mainContoroller, mainTable, mainTableView, mainWindow, menu, menuTable, moment, momentja, progressBar, qiita, qiitaController, refreshBtn, slideState, statusView, tab, tabGroup, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;
moment = require('lib/moment.min');
momentja = require('lib/momentja');
Qiita = require('model/qiita');
MainTable = require('ui/mainTable');
menuTable = require('ui/menuTable');
StatusView = require('ui/statusView');
statusView = new StatusView();
AlertView = require('ui/alertView');
alertView = new AlertView();
ProgressBar = require('ui/progressBar');
progressBar = new ProgressBar();
MainContoroller = require('controllers/mainContoroller');
mainContoroller = new MainContoroller();
qiitaController = require('controllers/qiitaController');
CommandController = require("controllers/commandController");
commandController = new CommandController();
defaultState = require("model/defaultState");
slideState = require("model/slideState");
webView = require('ui/webView');
win = require('ui/window');
activityIndicator = require('ui/activityIndicator');
mainTableView = new MainTable();
qiita = new Qiita();
controller = new qiitaController();
Ti.App.Properties.setBool('stateMainTableSlide', false);
Ti.App.Properties.setString("storedStocks", null);
Ti.App.Properties.setString("storedMyStocks", null);
Ti.App.Properties.setList("followingTags", null);
Ti.App.Properties.setString("currentPage", "storedStocks");
testsEnabled = false;
if (testsEnabled === true) {
  require('test/tests');
} else {
  mainTable = mainTableView.getTable();
  mainWindow = new win();
  actInd = new activityIndicator();
  listBtn = Ti.UI.createButton({
    systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS
  });
  listBtn.addEventListener('click', function() {
    var direction;
    direction = "horizontal";
    return controller.slideMainTable(direction);
  });
  refreshBtn = Ti.UI.createButton({
    systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
  });
  refreshBtn.addEventListener('click', function() {
    return mainContoroller.networkConnectionCheck(function() {
      return controller.loadEntry();
    });
  });
  menu = new menuTable();
  mainWindow.add(actInd);
  mainWindow.add(mainTable);
  mainWindow.add(menu);
  progressBar.show();
  statusView.add(progressBar);
  mainWindow.add(statusView);
  mainWindow.add(alertView.getAlertView());
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
  mainContoroller.init();
  tabGroup = Ti.UI.createTabGroup();
  tabGroup.tabBarVisible = false;
  tab = Ti.UI.createTab({
    window: mainWindow
  });
  tabGroup.addTab(tab);
  tabGroup.open();
}