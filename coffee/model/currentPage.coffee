class currentPage
  constructor: () ->
    @lists = []
    @status = null
    fsStore = require('lib/fs-store')
    qiitaDB.use('store', fsStore)
    qiitaDB.collection('localItems')
    @localItems = qiitaDB.collection
    

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
    # qiitaDB.localItems.findOne({"label":obj.label}, (err,doc) ->
    #   if doc is null
    #     qiitaDB.localItems.insert(obj,(err, doc) ->
    #       Ti.API.info "local stored. doc is #{doc}"
    #     )
    #   else
    #     qiitaDB.localItems.update
    #       label: obj.label
    #     ,
    #     $set:
    #       label: obj.label
    #       nextURL: obj.nextURL
    #       lastURL: obj.lastURL
          
    #   return @status = obj.label  
    # )
      
    
  showLists:() ->
    Ti.API.info @lists
    
  showCurrentStatus:() ->
    Ti.API.info @status
    
module.exports = currentPage  