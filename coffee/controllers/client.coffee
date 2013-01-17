class Client
  constructor:() ->
    Menu = require("controllers/menu")
    @Command = require("controllers/command")
    screen = require("ui/screen")
    @items = new screen()    
    @menu = new Menu()
    

  useMenu:(selectedNumber) ->
    @menu.addCommands(new @Command(@items))    
    @menu.run(selectedNumber)


    
module.exports = Client