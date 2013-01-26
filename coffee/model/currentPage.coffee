class currentPage
  constructor: () ->
    @lists = [
      {label:"storedStock",nextURL:null,lastURL:null},
      {label:"storedMyStocks",nextURL:null,lastURL:null}
    ]
    
  exists:(label) ->
    for list in @lists
      if list.label is label
        return true
        
  set:(obj) ->
    if @exists(obj.label) isnt true
      return @lists.push(obj)
    else
      @edit(obj)
      
  edit:(obj) ->
    for list in @lists
      if list.label is obj.label
        list.label   = obj.label
        list.nextURL = obj.nextURL
        list.lastURL = obj.lastURL
        
  showLists:() ->
    for list in @lists
      Ti.API.info "list.label is #{list.label}"
      Ti.API.info "list.label is #{list.nextURL}"
      
    return @lists
    
module.exports = currentPage  