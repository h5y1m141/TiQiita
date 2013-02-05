var AlertView, CommandController, ProgressBar, Qiita, StatusView, actInd, activityIndicator, alertView, commandController, controller, defaultState, direction, listBtn, mainTable, mainWindow, menu, menuTable, moment, momentja, progressBar, qiita, qiitaController, refreshBtn, slideState, statusView, t, tab, tabGroup, tableView, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;
moment = require('lib/moment.min');
momentja = require('lib/momentja');
Qiita = require('model/qiita');
tableView = require('ui/tableView');
menuTable = require('ui/menuTable');
StatusView = require('ui/statusView');
statusView = new StatusView();
AlertView = require('ui/alertView');
alertView = new AlertView();
ProgressBar = require('ui/progressBar');
progressBar = new ProgressBar();
qiitaController = require('controllers/qiitaController');
CommandController = require("controllers/commandController");
commandController = new CommandController();
defaultState = require("model/defaultState");
slideState = require("model/slideState");
webView = require('ui/webView');
win = require('ui/window');
activityIndicator = require('ui/activityIndicator');
t = new tableView();
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
  mainTable = t.getTable();
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
    return controller.loadEntry();
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
  if (controller.networkStatus() === false) {
    alertView.editMessage("ネットワークが利用できない状態です。ご利用の端末のネットワーク設定を再度ご確認ください");
    alertView.animate();
  } else {
    direction = "vertical";
    controller.slideMainTable(direction);
    commandController.useMenu("storedStocks");
    commandController.useMenu("followingTags");
  }
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
  tabGroup.open();
}