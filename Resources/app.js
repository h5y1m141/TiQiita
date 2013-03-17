var AlertView, CommandController, ConfigMenu, Hatena, MainContoroller, MainTable, MenuTable, NappSlideMenu, ProgressBar, Qiita, QiitaLoginID, QiitaLoginPassword, StatusView, actInd, activityIndicator, alertView, baseCommand, commandController, configMenu, configWindow, createCenterNavWindow, defaultState, hatena, mainContoroller, mainTable, mainTableView, mainWindow, menu, menuTable, moment, momentja, navController, progressBar, qiita, rootWindow, slideState, statusView, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win, winLeft;

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

webWindow = new win();

webview = new webView();

webViewHeader = webview.retreiveWebViewHeader();

webViewContents = webview.retreiveWebView();

webWindow.add(webViewHeader);

webWindow.add(webViewContents);

webWindow.add(actInd);

QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');

QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword');

if (testsEnabled === true) {
  require('test/tests');
} else {
  createCenterNavWindow = function() {
    var leftBtn, navController, rightBtn;
    leftBtn = Ti.UI.createButton({
      title: "Menu"
    });
    leftBtn.addEventListener("click", function() {
      rootWindow.toggleLeftView();
      rootWindow.setCenterhiddenInteractivity("TouchDisabledWithTapToCloseBouncing");
      return rootWindow.setPanningMode("NavigationBarPanning");
    });
    rightBtn = Ti.UI.createButton({
      title: "Config"
    });
    rightBtn.addEventListener("click", function() {
      rootWindow.toggleRightView();
      rootWindow.setCenterhiddenInteractivity("TouchDisabledWithTapToCloseBouncing");
      return rootWindow.setPanningMode("NavigationBarPanning");
    });
    mainWindow.leftNavButton = leftBtn;
    mainWindow.rightNavButton = rightBtn;
    mainWindow.add(mainTable);
    mainWindow.add(actInd);
    progressBar.show();
    statusView.add(progressBar);
    mainWindow.add(statusView);
    mainWindow.add(alertView.getAlertView());
    navController = Ti.UI.iPhone.createNavigationGroup({
      window: mainWindow
    });
    return navController;
  };
  winLeft = Ti.UI.createWindow({
    backgroundColor: "white"
  });
  winLeft.add(menu);
  configWindow = new win();
  configWindow.title = "Qiitaアカウント設定";
  configWindow.backgroundColor = '#fff';
  configWindow.add(actInd);
  configWindow.add(configMenu);
  configWindow.add(alertView.getAlertView());
  navController = createCenterNavWindow();
  NappSlideMenu = require("dk.napp.slidemenu");
  rootWindow = NappSlideMenu.createSlideMenuWindow({
    centerWindow: navController,
    leftWindow: winLeft,
    rightWindow: configWindow,
    leftLedge: 160
  });
  rootWindow.setParallaxAmount(0.1);
  rootWindow.setPanningMode("NoPanning");
  mainContoroller.refreshMenuTable();
  mainContoroller.startApp();
  rootWindow.open();
}
