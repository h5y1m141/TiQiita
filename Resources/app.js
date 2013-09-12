var MainContoroller, QiitaLoginID, QiitaLoginPassword, maincontroller, testsEnabled;

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
  maincontroller.createTabGroup();
}
