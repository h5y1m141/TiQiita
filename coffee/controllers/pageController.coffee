class pageController
  constructor:() ->
    currentPage = require('model/currentPage')
    @pageStatus = new currentPage()
    
  showLists:() ->
    return @pageStatus.showLists()
    
  showCurrentStatus:() ->
    return @pageStatus.showCurrentStatus()
     
  useStoredStock:() ->
    statusObj = @pageStatus.lists[0]
    return @pageStatus.use(statusObj)
    
  useStoredMyStock:() ->
    statusObj = @pageStatus.lists[1]
    return @pageStatus.use(statusObj)
    
  use:(storedTo) ->
    return @pageStatus.use(storedTo)
    
    
  set:(obj) ->
    return @pageStatus.set(obj)


module.exports = pageController