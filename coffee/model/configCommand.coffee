class configCommand
  constructor:() ->
  execute:() ->
    configMenu = require("ui/configMenu")
    menu = new configMenu()
    configWindow = new win()
    configWindow.title = "アカウント情報"
    configWindow.backButtonTitle = '戻る'
    configWindow.add menu
    return tab.open(configWindow)

module.exports = configCommand    