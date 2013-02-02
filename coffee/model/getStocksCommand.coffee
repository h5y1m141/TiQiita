class getStocksCommand
  constructor:() ->
    @value = 'storedStocks'
  execute:() ->
    result = []
    items = JSON.parse(Ti.App.Properties.getString(@value))
    if items isnt null
      result.push(t.createRow(json)) for json in items
      result.push(t.createRowForLoadOldEntry(@value))
    else
      @.getFeed()

    mainTable.setData result
    
  getFeed:() ->
    rows = []
    value = @value
    qiita.getFeed( (result,links) ->
      for link in links
        if link["rel"] == 'next'
          nextURL = link["url"]
        else if link["rel"] == 'last'
          lastURL = link["url"]
          
      _obj = {label:value,nextURL:nextURL,lastURL:lastURL}

      pageController.set(_obj)
      commandController.countUp(progressBar)
      rows.push(t.createRow(json)) for json in result
      rows.push(t.createRowForLoadOldEntry(value))
      mainTable.setData rows

      return true
    )
    
module.exports =  getStocksCommand 