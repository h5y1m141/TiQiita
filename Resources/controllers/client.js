var Client;
Client = (function() {
  function Client() {
    var Menu, configCommand, myStocksCommand, stocksCommand;
    Menu = require("controllers/menu");
    this.menu = new Menu();
    myStocksCommand = require("model/getMyStocksCommand");
    stocksCommand = require("model/getStocksCommand");
    configCommand = require("model/configCommand");
    this.menu.addCommands("storedMyStocks", new myStocksCommand());
    this.menu.addCommands("storedStocks", new stocksCommand());
    this.menu.addCommands("config", new configCommand());
  }
  Client.prototype.useMenu = function(commandLabel) {
    return this.menu.run(commandLabel);
  };
  return Client;
})();
module.exports = Client;