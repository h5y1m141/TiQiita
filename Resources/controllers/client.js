var Client;
Client = (function() {
  function Client() {
    var Menu, screen;
    Menu = require("controllers/menu");
    this.Command = require("controllers/command");
    screen = require("ui/screen");
    this.items = new screen();
    this.menu = new Menu();
  }
  Client.prototype.useMenu = function(selectedNumber) {
    this.menu.addCommands(new this.Command(this.items));
    return this.menu.run(selectedNumber);
  };
  return Client;
})();
module.exports = Client;