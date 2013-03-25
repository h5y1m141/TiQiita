var commandController;

commandController = (function() {

  function commandController() {
    var Menu;
    Menu = require("controllers/menu");
    this.menu = new Menu();
  }

  commandController.prototype.createMenu = function(user) {
    var configCommand, loginCommand, myStocksCommand, stocksCommand;
    Ti.API.info("[commandController] createMenu start");
    stocksCommand = require("model/getStocksCommand");
    configCommand = require("model/configCommand");
    loginCommand = require("model/loginCommand");
    this.menu.addCommands("storedStocks", new stocksCommand());
    this.menu.addCommands("config", new configCommand());
    this.menu.addCommands("qiitaLogin", new loginCommand());
    if (user === "QiitaUser") {
      Ti.API.info("[MENU] for QiitaUser");
      myStocksCommand = require("model/getMyStocksCommand");
      this.menu.addCommands("storedMyStocks", new myStocksCommand());
      mainContoroller.refreshMenuTable();
    }
    return true;
  };

  commandController.prototype.useMenu = function(commandLabel) {
    Ti.API.info("commandController.useMenu start. commandLabel is " + commandLabel);
    return this.menu.run(commandLabel);
  };

  commandController.prototype.applyFeedByTagCommand = function(tagName) {
    var feedByTagCommand;
    feedByTagCommand = require("model/getFeedByTagCommand");
    this.menu.addCommands("followingTag" + tagName, new feedByTagCommand(tagName));
    return true;
  };

  return commandController;

})();

module.exports = commandController;
