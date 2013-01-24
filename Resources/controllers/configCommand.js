var configCommand;
configCommand = (function() {
  function configCommand() {}
  configCommand.prototype.execute = function() {
    var configMenu, configWindow, menu;
    configMenu = require("ui/configMenu");
    menu = new configMenu();
    configWindow = new win();
    configWindow.title = "アカウント情報";
    configWindow.backButtonTitle = '戻る';
    configWindow.add(menu);
    return tab.open(configWindow);
  };
  return configCommand;
})();
module.exports = configCommand;