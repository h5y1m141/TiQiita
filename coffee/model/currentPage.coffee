class currentPage
  constructor: () ->
    @lists = []
    @status = null
    
  exists:(label) ->
    for list in @lists
      if list.label is label
        return true
  use:(label) ->
    for list in @lists
      if list.label is label
        return @status = list
      else
        noList = {label:"noList",nextURL:null,lastURL:null}
        return @status = noList
        
  set:(obj) ->
    Ti.API.info "currentPage.set start. obj is #{obj.label}"
    if @.exists(obj.label) isnt true and obj.label isnt "undefined"
      @lists.push(obj)
    else
      @edit(obj)

    return @status = obj  
      
  edit:(obj) ->
    Ti.API.info "currentPage.edit start"
    for list in @lists
      if list.label is obj.label
        list.label   = obj.label
        list.nextURL = obj.nextURL
        list.lastURL = obj.lastURL
        
    Ti.API.info "currentPage.edit done. nextURL is #{list.nextURL}"
    
  showLists:() ->
    Ti.API.info @lists
    
  showCurrentStatus:() ->
    Ti.API.info @status
    
module.exports = currentPage  