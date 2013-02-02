class currentPage
  constructor: () ->
    @lists = []
    @status = null
    
  exists:(label) ->
    for list in @lists
      Ti.API.info "currentPage exists. list.label is #{list.label}"
      if list.label is label
        return true
  use:(label) ->
    Ti.API.info "currentPage.use() start. label is #{label} @lists is #{@lists.length} @status is #{@status}"

    for list in @lists
      Ti.API.info "currentPage.use loop. list.label is #{list.label}"
      if list.label is label
        @status = list.label
      # else
      #   noList = {label:"noList",nextURL:null,lastURL:null}
      #   @status = noList.label

    Ti.API.info "currentPage done @status is #{@status}"
      
        
  set:(obj) ->
    Ti.API.info "currentPage.set start. obj is #{obj.label}"
    if @.exists(obj.label) isnt true and obj.label isnt "undefined"
      Ti.API.info "currentPage @lists.push start. obj label is #{obj.label}"
      @lists.push(obj)
    else
      @.edit(obj)

    return @status = obj.label  
      
  edit:(obj) ->
    Ti.API.info "currentPage.edit start"
    for list in @lists
      if list.label is obj.label
        list.label   = obj.label
        list.nextURL = obj.nextURL
        list.lastURL = obj.lastURL
        
    Ti.API.info "currentPage.edit done. label is #{list.label} . nextURL is #{list.nextURL} @lists length is #{@lists.length}"

    return true
    
  showLists:() ->
    Ti.API.info @lists
    
  showCurrentStatus:() ->
    Ti.API.info @status
    
module.exports = currentPage  