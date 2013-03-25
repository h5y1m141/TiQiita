var commandController;

commandController = (function() {

  function commandController() {
    var Menu, myStocksCommand, stocksCommand;
    Menu = require("controllers/menu");
    this.menu = new Menu();
    stocksCommand = require("model/getStocksCommand");
    this.menu.addCommands("storedStocks", new stocksCommand());
    myStocksCommand = require("model/getMyStocksCommand");
    this.menu.addCommands("storedMyStocks", new myStocksCommand());
  }

  commandController.prototype.createMenu = function() {
    Ti.API.info("[commandController] createMenu start");
    mainContoroller.refreshMenuTable();
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
