class pageController
  constructor:() ->
    currentPage = require('model/currentPage')
    @pageStatus = new currentPage()
    
  showLists:() ->
    return @pageStatus.showLists()
    
  showCurrentStatus:() ->
    return @pageStatus.showCurrentStatus()
     
  useStoredStock:() ->
    lists = @pageStatus.lists
    for list in lists
      if list.label = "storedStocks"
        return @pageStatus.use(list.label)
    
  useStoredMyStock:() ->
    lists = @pageStatus.lists
    for list in lists
      if list.label = "storedMyStocks"
        return @pageStatus.use(list.label)

    
  use:(storedTo) ->
    return @pageStatus.use(storedTo)
    
    
  set:(obj) ->
    return @pageStatus.set(obj)
    
  getStatus:() ->
    return @pageStatus.status
    
  getList:() ->
    return @pageStatus.getList()

module.exports = pageController