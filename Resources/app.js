var AlertView, CommandController, ConfigMenu, Hatena, MainContoroller, MainTable, MenuTable, ProgressBar, Qiita, QiitaLoginID, QiitaLoginPassword, StatusView, actInd, activityIndicator, alertView, baseCommand, commandController, configMenu, configTab, configWindow, defaultState, hatena, mainContoroller, mainTab, mainTable, mainTableView, mainWindow, menu, menuTable, moment, momentja, progressBar, qiita, slideState, statusView, tabGroup, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win;

Ti.App.Properties.setBool('stateMainTableSlide', false);

Ti.App.Properties.setString("storedStocks", null);

Ti.App.Properties.setString("storedMyStocks", null);

Ti.App.Properties.getBool("followingTagsError", false);

Ti.App.Properties.setList("followingTags", null);

Ti.App.Properties.setList("TiQiitaMenu", []);

Ti.App.Properties.setString("currentPage", "storedStocks");

Ti.App.Properties.setString('QiitaToken', null);

testsEnabled = false;

moment = require('lib/moment.min');

momentja = require('lib/momentja');

defaultState = require("model/defaultState");

slideState = require("model/slideState");

Qiita = require('model/qiita');

Hatena = require('model/hatena');

baseCommand = require("model/baseCommand");

hatena = new Hatena();

qiita = new Qiita();

hatena.login();

MainContoroller = require('controllers/mainContoroller');

CommandController = require("controllers/commandController");

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

ConfigMenu = require("ui/configMenu");

statusView = new StatusView();

alertView = new AlertView();

progressBar = new ProgressBar();

mainTableView = new MainTable();

mainTable = mainTableView.getTable();

mainWindow = new win();

actInd = new activityIndicator();

menuTable = new MenuTable();

menu = menuTable.getMenu();

configMenu = new ConfigMenu();

configWindow = new win();

webWindow = new win();

webWindow.backButtonTitle = '戻る';

webview = new webView();

webViewHeader = webview.retreiveWebViewHeader();

webViewContents = webview.retreiveWebView();

webWindow.add(webViewHeader);

webWindow.add(webViewContents);

webWindow.add(actInd);

configWindow.title = "Qiitaアカウント設定";

configWindow.backgroundColor = '#fff';

configWindow.add(actInd);

QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');

QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword');

tabGroup = Ti.UI.createTabGroup();

tabGroup.tabBarVisible = false;

mainTab = Ti.UI.createTab({
  window: mainWindow,
  icon: "ui/image/light_home@2x.png"
});

configTab = Ti.UI.createTab({
  window: configWindow,
  icon: "ui/image/light_gear@2x.png"
});

tabGroup.addTab(mainTab);

tabGroup.addTab(configTab);

if (testsEnabled === true) {
  require('test/tests');
} else {
  mainContoroller.init();
}
