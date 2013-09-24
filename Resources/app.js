var Config, ListView, MainContoroller, MainWindow, QiitaLoginID, QiitaLoginPassword, analytics, config, configMenu, gaKey, gaModule, mainListView, mainWindow, maincontroller, menu, menuTable, osname, testsEnabled;

Config = require("model/loadConfig");

config = new Config();

gaKey = config.getGoogleAnalyticsKey();

gaModule = require('lib/Ti.Google.Analytics');

analytics = new gaModule(gaKey);

Ti.App.addEventListener("analytics_trackPageview", function(e) {
  var path;
  path = Titanium.Platform.name;
  return analytics.trackPageview(path + e.pageUrl);
});

Ti.App.addEventListener("analytics_trackEvent", function(e) {
  return analytics.trackEvent(e.category, e.action, e.label, e.value);
});

Ti.App.Analytics = {
  trackPageview: function(pageUrl) {
    return Ti.App.fireEvent("analytics_trackPageview", {
      pageUrl: pageUrl
    });
  },
  trackEvent: function(category, action, label, value) {
    return Ti.App.fireEvent("analytics_trackEvent", {
      category: category,
      action: action,
      label: label,
      value: value
    });
  }
};

analytics.start(10, true);

Ti.App.Properties.setString("storedStocks", null);

Ti.App.Properties.setString("storedMyStocks", null);

Ti.App.Properties.getBool("followingTagsError", false);

Ti.App.Properties.setList("followingTags", null);

Ti.App.Properties.setString("currentPage", "storedStocks");

testsEnabled = false;

MainContoroller = require('controllers/mainContoroller');

maincontroller = new MainContoroller();

QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID');

QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword');

if (testsEnabled === true) {
  require('test/tests');
} else {
  osname = Ti.Platform.osname;
  ListView = require("ui/" + this.osname + "/listView");
  MainWindow = require("ui/" + osname + "/mainWindow");
  configMenu = require("ui/" + osname + "/configMenu");
  menuTable = require("ui/iphone/menuTable");
  menuTable = new menuTable();
  this.window.add(menuTable);
  mainListView = new ListView();
  MainWindow = new MainWindow();
  configMenu = new configMenu();
  menu = configMenu.getMenu();
  mainWindow = MainWindow.getWindow();
  mainWindow.add(mainListView);
  mainWindow.add(menu);
  maincontroller.getFeed();
  mainWindow.open();
}
