class Menu
  constructor:() ->
    @commands = []
    
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
        Ti.API.info "Menu.run. command is #{command.commandLabel}"
        command.command.execute()

module.exports = Menu