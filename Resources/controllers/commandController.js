var commandController;

commandController = (function() {

  function commandController() {
    var Menu, configCommand, followingTagsCommand, loginCommand, myStocksCommand, stocksCommand;
    Menu = require("controllers/menu");
    this.menu = new Menu();
    myStocksCommand = require("model/getMyStocksCommand");
    stocksCommand = require("model/getStocksCommand");
    configCommand = require("model/configCommand");
    followingTagsCommand = require("model/getFollowingTagsCommand");
    loginCommand = require("model/loginCommand");
    this.menu.addCommands("storedMyStocks", new myStocksCommand());
    this.menu.addCommands("storedStocks", new stocksCommand());
    this.menu.addCommands("config", new configCommand());
    this.menu.addCommands("followingTags", new followingTagsCommand());
    this.menu.addCommands("qiitaLogin", new loginCommand());
  }

  commandController.prototype.useMenu = function(commandLabel) {
    Ti.API.info("commandController.useMenu start. commandLabel is " + commandLabel);
    return this.menu.run(commandLabel);
  };

  commandController.prototype.applyFeedByTagCommand = function(tagName) {
    var feedByTagCommand, menu, param;
    feedByTagCommand = require("model/getFeedByTagCommand");
    param = {
      commandLabel: "followingTag" + tagName,
      command: new feedByTagCommand(tagName)
    };
    menu = Ti.App.Properties.getList("commandMenu");
    menu.push(parm);
    Ti.API.info(Ti.App.Properties.getList("commandMenu"));
    return true;
  };

  commandController.prototype.countUp = function() {
    var direction;
    direction = "vertical";
    Ti.App.Properties.setBool('stateMainTableSlide', true);
    return mainController.slideMainTable(direction);
  };

  return commandController;

})();

module.exports = commandController;
