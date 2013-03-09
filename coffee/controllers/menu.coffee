class Menu
  constructor:() ->
    @commands = []
    # @commands = Ti.App.Properties.getList "TiQiitaMenu"
    
    
  addCommands:(commandLabel,command) ->
    param = 
      commandLabel:commandLabel
      command:command

    return @commands.push(param)
    
  showCommands:() ->
    Ti.API.info @commands
    return true
    
  run:(commandLabel) ->

    
    for command in @commands
      if command.commandLabel is commandLabel
        mainContoroller.networkConnectionCheck(()->
          command.command.execute()
        )
module.exports = Menu