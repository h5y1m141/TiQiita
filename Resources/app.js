var CommandController, PageController, ProgressBar, Qiita, StatusView, actInd, activityIndicator, commandController, controller, defaultState, direction, listBtn, mainTable, mainWindow, menu, menuTable, moment, momentja, pageController, progressBar, qiita, qiitaController, refreshBtn, slideState, statusView, t, tab, tabGroup, tableView, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;
moment = require('lib/moment.min');
momentja = require('lib/momentja');
Qiita = require('model/qiita');
tableView = require('ui/tableView');
menuTable = require('ui/menuTable');
StatusView = require('ui/statusView');
statusView = new StatusView();
ProgressBar = require('ui/progressBar');
progressBar = new ProgressBar();
qiitaController = require('controllers/qiitaController');
PageController = require('controllers/pageController');
pageController = new PageController();
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
Ti.App.Properties.setString("followinTagSSH", null);
Ti.App.Properties.setString("followinTagZsh", null);
Ti.App.Properties.setString("followinTagsinatra", null);
Ti.App.Properties.setString("followinTagJavaScript", null);
Ti.App.Properties.setString("followinTagCoffeeScript", null);
Ti.App.Properties.setString("followinTagRuby", null);
Ti.App.Properties.setList("followinTags", null);
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
  mainWindow.leftNavButton = listBtn;
  mainWindow.rightNavButton = refreshBtn;
  direction = "vertical";
  controller.slideMainTable(direction);
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
  tabGroup.tabBarVisible = false;
  tab = Ti.UI.createTab({
    window: mainWindow
  });
  tabGroup.addTab(tab);
  tabGroup.open();
}