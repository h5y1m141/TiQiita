var Menu;
Menu = (function() {
  function Menu() {
    this.commands = [];
    this.previous_command = null;
  }
  Menu.prototype.addCommands = function(commandLabel, command) {
    var param;
    param = {
      commandLabel: commandLabel,
      command: command
    };
    return this.commands.push(param);
  };
  Menu.prototype.run = function(commandLabel) {
    var command, _i, _len, _ref, _results;
    _ref = this.commands;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      command = _ref[_i];
      _results.push(command.commandLabel === commandLabel ? command.command.execute() : void 0);
    }
    return _results;
  };
  return Menu;
})();
module.exports = Menu;