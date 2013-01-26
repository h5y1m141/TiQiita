class pageController
  constructor:() ->
    currentPage = require('model/currentPage')
    @pageStatus = new currentPage()
    
  showLists:() ->
    return @pageStatus.showLists()
    
  set:(obj) ->
    return @pageStatus.set(obj)


module.exports = pageController