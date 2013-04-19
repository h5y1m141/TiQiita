var AlertView, CommandController, ConfigMenu, Hatena, MainContoroller, MainTable, MenuTable, ProgressBar, Qiita, QiitaLoginID, QiitaLoginPassword, StatusView, actInd, actionBtn, activityIndicator, alertView, baseCommand, commandController, configMenu, mainContoroller, mainTable, mainTableView, mainWindow, menu, menuTable, moment, momentja, progressBar, qiita, statusView, tab1, tabGroup, testsEnabled, webView, webViewContents, webViewHeader, webWindow, webview, win, win1;

Ti.App.Properties.setString("storedStocks", null);

Ti.App.Properties.setString("storedMyStocks", null);

Ti.App.Properties.getBool("followingTagsError", false);

Ti.App.Properties.setList("followingTags", null);

Ti.App.Properties.setString("currentPage", "storedStocks");

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
  win1 = Titanium.UI.createWindow();
  mainTable.height = 640;
  win1.add(mainTable);
  mainContoroller.init();
  win1.hideTabBar();
  tabGroup = Ti.UI.createTabGroup();
  tab1 = Ti.UI.createTab({
    window: win1,
    title: '最新ニュース'
  });
  tabGroup.addTab(tab1);
  tabGroup.open();
}
