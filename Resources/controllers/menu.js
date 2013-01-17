var Menu;
Menu = (function() {
  function Menu(list) {
    this.commands = [];
    this.previous_command = null;
  }
  Menu.prototype.addCommands = function(command) {
    return this.commands.push(command);
  };
  Menu.prototype.run = function(selectedNumber) {
    var command, _i, _len, _ref, _results;
    _ref = this.commands;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      command = _ref[_i];
      _results.push(command.execute(selectedNumber));
    }
    return _results;
  };
  return Menu;
})();
module.exports = Menu;