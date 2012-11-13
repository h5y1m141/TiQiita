class qiitaController
  constructor: () ->
  loadOldEntry: () ->
    url = Ti.App.Properties.getString('nextPageURL')
    Ti.API.info "NEXTPAGE:#{url}"
    actInd.backgroundColor = '#222'
    actInd.opacity = 0.8
    actInd.show()
        
    qiita.getNextFeed(url,(result,links) ->
      for link in links
        if link["rel"] == 'next'
          Ti.App.Properties.setString('nextPageURL',link["url"])

      for json in result
        r = t.createRow(json)
        lastIndex = t.lastRowIndex()

        t.insertRow(lastIndex,r)
        actInd.hide()
    )
    return true

  stockItemToQiita: (uuid) ->
    uuid = Ti.App.Properties.getString('stockUUID')
    actInd.backgroundColor = '#222'
    actInd.message = 'Posting...'
    actInd.zIndex = 20
    actInd.show()  

    qiita.putStock(uuid)
    
    return true
    
  sessionItem: (json) ->
    Ti.API.info "start sessionItem. url is #{json.url}. uuid is #{json.uuid}"
    if json
      Ti.App.Properties.setString('stockURL',json.url)
      Ti.App.Properties.setString('stockUUID',json.uuid)
      Ti.App.Properties.setString('stockID',json.id)
        
  postItemToHatena: () ->
    Ti.API.info(Ti.App.Properties.getString('stockURL'))
    configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config/hatena.json')
    file = configJSON.read().toString()
    hatenaKey = JSON.parse(file)
    hatena = require('lib/hatena').Hatena({
      consumerKey: hatenaKey.consumerKey,
  		consumerSecret: hatenaKey.consumerSecret,
  		accessTokenKey: Ti.App.Properties.getString("hatenaAccessTokenKey", ""),
  		accessTokenSecret: Ti.App.Properties.getString("hatenaAccessTokenSecret", ""),
  		scope: "read_public,write_public,write_private",
    })

    hatena.addEventListener('login', (e)->
      Ti.API.info "start hanate login"

      
      if e.success
        Ti.App.Properties.setString('hatenaAccessTokenKey', e.accessTokenKey)
        Ti.App.Properties.setString('hatenaAccessTokenSecret', e.accessTokenSecret)
        hatena.request('applications/my.json',{}, {}, 'POST',(req)->
          Ti.API.info req
          if req.success
            Ti.API.info "start hatena API request"
            data = JSON.parse req.result.text
            Ti.API.info data
          # if e.success
          #   Ti.API.info e.result.text
        )

    )

    hatena.authorize()
    
    return true
    # 
		# 


module.exports = qiitaController