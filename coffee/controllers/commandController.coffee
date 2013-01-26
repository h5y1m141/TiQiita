class commandController
  constructor:() ->
    Menu = require("controllers/menu")
    @menu = new Menu()
    myStocksCommand = require("model/getMyStocksCommand")
    stocksCommand = require("model/getStocksCommand")
    configCommand = require("model/configCommand")
    followingTagsCommand = require("model/getFollowingTagsCommand")
    @menu.addCommands("storedMyStocks",new myStocksCommand())
    @menu.addCommands("storedStocks",new stocksCommand())
    @menu.addCommands("config",new configCommand())
    @menu.addCommands("followingTags", new followingTagsCommand())
    
  useMenu:(commandLabel) ->
    @menu.run(commandLabel)
    
  countUp:(progressBar) ->
    max = progressBar.max-1
    currentValue = progressBar.value
    Ti.API.info "value check. max is #{max} and currentValue is #{currentValue}"
    if currentValue is max
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      controller.slideMainTable(direction)
    else  
      progressBar.value = progressBar.value+1
      
    return true
  
          
module.exports = commandController