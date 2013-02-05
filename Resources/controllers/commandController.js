var commandController;
commandController = (function() {
  function commandController() {
    var Menu, configCommand, followingTagsCommand, myStocksCommand, stocksCommand;
    Menu = require("controllers/menu");
    this.menu = new Menu();
    myStocksCommand = require("model/getMyStocksCommand");
    stocksCommand = require("model/getStocksCommand");
    configCommand = require("model/configCommand");
    followingTagsCommand = require("model/getFollowingTagsCommand");
    this.menu.addCommands("storedMyStocks", new myStocksCommand());
    this.menu.addCommands("storedStocks", new stocksCommand());
    this.menu.addCommands("config", new configCommand());
    this.menu.addCommands("followingTags", new followingTagsCommand());
  }
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
  commandController.prototype.countUp = function(progressBar) {
    var currentValue, direction, max;
    max = progressBar.max - 1;
    currentValue = progressBar.value + 1;
    Ti.API.info("value check. max is " + max + " and currentValue is " + currentValue);
    if (currentValue !== max) {
      progressBar.value = progressBar.value + 1;
    } else {
      direction = "vertical";
      Ti.App.Properties.setBool('stateMainTableSlide', true);
      controller.slideMainTable(direction);
    }
    return true;
  };
  return commandController;
})();
module.exports = commandController;