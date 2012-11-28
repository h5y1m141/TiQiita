class qiitaWindow
  constructor: (title) ->
    if title is null
      titleName = "Qiita"
    else
      titleName = title
      
    @baseWindow = Ti.UI.createWindow
      title:titleName
      barColor:'#59BB0C'
  add: (element) ->
    @baseWindow.add element
    return true
    
  show: ->
    @baseWindow.zIndex = 10

    @baseWindow.backgroundColor = "#222"
    return @baseWindow.open({transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP})

class configWindow extends qiitaWindow
  constructor: () ->
    super "設定画面"

module.exports = configWindow

class webViewWindow extends qiitaWindow
  constructor: () ->
    super "投稿情報"
    

module.exports = webViewWindow
  
  



      
