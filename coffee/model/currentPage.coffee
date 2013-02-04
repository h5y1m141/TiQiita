class currentPage
  constructor: () ->
    @lists = []
    @status = null
    @item = {}

  
  use:(label) ->
    Ti.API.info "currentPage.use() start. label is #{label} @lists is #{@lists.length} "
    if @lists.length is 0
      @status = label
    else
      for list in @lists
        if list.label is label
          @status = list.label
          @item = list

    Ti.API.info "currentPage done @item is #{@item}"
      
        
  set:(obj) ->
    _ = require("lib/underscore-min")

    matchItems = _.where(@lists, {"label":obj.label})
    if matchItems.length is 0
      @lists.push obj
      @item = list
    else
      for list in @lists
        if list.label is obj.label
          list.nextURL = obj.nextURL
          list.lastURL = obj.lastURL
    
    Ti.API.info "obj nextURL is #{obj.nextURL} and matchItems is #{matchItems} and @lists is #{@lists}"
      
    
  showLists:() ->
    Ti.API.info @lists
    
  showCurrentStatus:() ->
    Ti.API.info @status
    
  getList:() ->
    Ti.API.info "currentPage getList start @lists is #{@lists} and @status is #{@status}"
    for list in @lists
      Ti.API.info list.label
      if list.label is @status
        obj = list
      else
        noList = {label:"noList",nextURL:null,lastURL:null}
        obj = noList.label
        
    
    return obj
    
module.exports = currentPage  