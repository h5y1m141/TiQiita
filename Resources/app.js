var AlertView, CommandController, ConfigMenu, Hatena, MainContoroller, MainTable, MenuTable, NappSlideMenu, ProgressBar, Qiita, QiitaLoginID, QiitaLoginPassword, StatusView, actInd, actionBtn, activityIndicator, alertView, baseCommand, commandController, configMenu, configWindow, createCenterNavWindow, mainContoroller, mainTable, mainTableView, mainWindow, menu, menuTable, moment, momentja, navController, progressBar, qiita, rootWindow, statusView, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win, winLeft;

Ti.App.Properties.setString("storedStocks", null);

Ti.App.Properties.setString("storedMyStocks", null);

Ti.App.Properties.getBool("followingTagsError", false);

Ti.App.Properties.setList("followingTags", null);

Ti.App.Properties.setString("currentPage", "storedStocks");

Ti.App.Properties.setString('QiitaToken', null);

testsEnabled = false;

moment = require('lib/moment.min');

momentja = require('lib/momentja');

Qiita = require('model/qiita');

Hatena = require('model/hatena');

baseCommand = require("model/baseCommand");

qiita = new Qiita();

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

actionBtn = Ti.UI.createButton({
  systemButton: Titanium.UI.iPhone.SystemButton.ACTION
});

actionBtn.addEventListener('click', function() {
  var dialog,
    _this = this;
  dialog = Ti.UI.createOptionDialog();
  dialog.setTitle("どの処理を実行しますか？");
  dialog.setOptions(["Qiitaへストック", "はてブ", "Qiitaへストック&はてブ", "キャンセル"]);
  dialog.setCancel(3);
  dialog.addEventListener('click', function(event) {
    var QiitaToken, alertDialog, hatenaAccessTokenKey;
    hatenaAccessTokenKey = Ti.App.Properties.getString("hatenaAccessTokenKey");
    QiitaToken = Ti.App.Properties.getString('QiitaToken');
    alertDialog = Titanium.UI.createAlertDialog();
    alertDialog.setTitle("Error");
    Ti.API.debug("start dialog action.Event is " + event.index);
    switch (event.index) {
      case 0:
        if ((QiitaToken != null) === true) {
          return mainContoroller.stockItemToQiita();
        } else {
          alertDialog.setMessage("Qiitaのアカウント設定が完了していないため投稿できません");
          return alertDialog.show();
        }
        break;
      case 1:
        if ((hatenaAccessTokenKey != null) === true) {
          return mainContoroller.stockItemToHatena();
        } else {
          alertDialog.setMessage("はてなのアカウント設定が完了していないため投稿できません");
          return alertDialog.show();
        }
        break;
      case 2:
        if ((hatenaAccessTokenKey != null) === true && (QiitaToken != null) === true) {
          mainContoroller.stockItemToQiita();
          return mainContoroller.stockItemToHatena();
        } else {
          alertDialog.setMessage("Qiitaかはてなのアカウント設定が完了していないため投稿できません");
          return alertDialog.show();
        }
    }
  });
  return dialog.show();
});

webWindow.rightNavButton = actionBtn;

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
  configWindow.add(configMenu.getTable());
  configWindow.add(alertView.getAlertView());
  navController = createCenterNavWindow();
  NappSlideMenu = require("dk.napp.slidemenu");
  rootWindow = NappSlideMenu.createSlideMenuWindow({
    centerWindow: navController,
    leftWindow: winLeft,
    rightWindow: configWindow,
    leftLedge: 200,
    rightLedge: 50
  });
  rootWindow.open();
  mainContoroller.init();
}
