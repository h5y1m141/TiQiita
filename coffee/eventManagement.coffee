class eventManagement
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


  stockItemToQiita: (uuid) ->
    Ti.API.info uuid
    return true

module.exports = eventManagement