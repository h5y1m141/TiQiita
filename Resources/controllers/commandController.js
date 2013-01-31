var commandController;
commandController = (function() {
  function commandController() {
    var Menu, configCommand, feedByTagCommand, followingTagsCommand, myStocksCommand, stocksCommand;
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
    feedByTagCommand = require("model/getFeedByTagCommand");
    this.menu.addCommands("followinTagSSH", new feedByTagCommand("followinTagSSH"));
  }
  commandController.prototype.useMenu = function(commandLabel) {
    return this.menu.run(commandLabel);
  };
  commandController.prototype.applyFeedByTagCommand = function(tagName) {
    var feedByTagCommand;
    feedByTagCommand = require("model/getFeedByTagCommand");
    this.menu.addCommands("followinTag" + tagName, new feedByTagCommand(tagName));
    return true;
  };
  commandController.prototype.countUp = function(progressBar) {
    var currentValue, direction, max;
    max = progressBar.max - 1;
    currentValue = progressBar.value;
    Ti.API.info("value check. max is " + max + " and currentValue is " + currentValue);
    if (currentValue === max) {
      direction = "vertical";
      Ti.App.Properties.setBool('stateMainTableSlide', true);
      controller.slideMainTable(direction);
    } else {
      progressBar.value = progressBar.value + 1;
    }
    return true;
  };
  return commandController;
})();
module.exports = commandController;