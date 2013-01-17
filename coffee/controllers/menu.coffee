class Menu
  constructor:(list) ->
    @commands = []
    @previous_command =  null
    
  addCommands:(command) ->
    return @commands.push(command)
    
    
  run:(selectedNumber) ->
    for command in @commands
      command.execute(selectedNumber)
      
    

module.exports = Menu