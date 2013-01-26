class Menu
  constructor:() ->
    @commands = []
    @previous_command =  null
    
  addCommands:(commandLabel,command) ->
    param = 
      commandLabel:commandLabel
      command:command
    return @commands.push(param)
    
    
  run:(commandLabel) ->
    for command in @commands
      if command.commandLabel is commandLabel
        command.command.execute()

module.exports = Menu