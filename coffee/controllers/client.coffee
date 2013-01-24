class Client
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
        
          
module.exports = Client