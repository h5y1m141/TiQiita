class currentPage
  constructor: () ->
    @lists = []
    @status = null
    @item = null
  
  use:(label) ->
    if label isnt "followingTags"
      for list in @lists
        if list.label is label
          @item = list

    return @item
    
  set:(obj) ->
    _ = require("lib/underscore-min")
    Ti.API.info "set current Page object. label is #{obj.label}"
    matchItems = _.where(@lists, {"label":obj.label})
    if matchItems.length is 0
      @lists.push obj
    else
      for list in @lists
        if list.label is obj.label
          list.nextURL = obj.nextURL
          

    return true
    
  showLists:() ->
    for list in @lists
      Ti.API.info "currentPage showLists. #{list.label} and  #{list.nextURL}"
    
    
module.exports = currentPage  