class listView
  constructor:()->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f9f9f9"
      keyColor:'#59BB0C'
      textColor:"#333"
      contentsColor:"#666"      
      grayTextColor:"#999"
    

    myTemplate =
    childTemplates:[
      # icon
      type: "Ti.UI.ImageView"
      bindId:"icon"
      properties:
        defaultImage:"ui/image/logo.png"
        width:40
        height:40
        left:5
        top:5
    ,
      # title
      type: "Ti.UI.Label"
      bindId:"title"
      properties:
        color: @baseColor.textColor
        font:
          fontSize:16
          fontWeight:'bold'
        width:240
        height:20
        left:60
        top:25
    ,
      # handleName
      type: "Ti.UI.Label"
      bindId:"handleName"
      properties:
        color: @baseColor.keyColor
        font:
          fontSize:12
        width:200
        height:15
        left:60
        top:5
    ,
      # updateTime
      type: "Ti.UI.Label"
      bindId:"updateTime"
      properties:
        color: @baseColor.textColor
        font:
          fontSize:12
          # fontFamily : 'Rounded M+ 1p'
        width:60
        height:15
        right:0
        top:5
    ,
      # tagIcon
      type: "Ti.UI.Label"
      bindId:"tagIcon"
      properties:
        color: @baseColor.keyColor
        font:
          fontSize:16
          fontFamily:'LigatureSymbols'
        width:20
        height:15
        left:60
        top:103
    ,
      # tags
      type: "Ti.UI.Label"
      bindId:"tags"
      properties:
        color: @baseColor.keyColor
        font:
          fontSize:12
        width:240
        height:15
        left:80
        top:100
    ,
      # contents
      type: "Ti.UI.Label"
      bindId:"contents"
      properties:
        color: @baseColor.contentsColor
        font:
          fontSize:12
          # fontFamily : 'Rounded M+ 1p'
        width:240
        height:50
        left:60
        top:45
          
        
    ]            
    @listView = Ti.UI.createListView
      top:40
      left:0
      zIndex:10
      templates:
        template: myTemplate
      defaultItemTemplate: "template"      
    @listView.addEventListener('itemclick',(e) =>
      that = @
      index = e.itemIndex
      if e.section.items[index].loadOld is true
        Qiita = require('model/qiita')
        qiita = new Qiita()
        currentPage = Ti.App.Properties.getString "currentPage"
        nextURL = Ti.App.Properties.getString "#{currentPage}nextURL"

        qiita.getNextFeed(nextURL,currentPage,(result) =>
          items = @createItems(result)
          lastIndex = @_getLastItemIndex()
          currentSection = @listView.sections[0]
          return currentSection.insertItemsAt(lastIndex,items)

        )
      else
        
        # e.section.items[index]を参照することで
        # secitonに配置したアイコン、タイトルやカスタムプロパティの値も全て取得できる

        data =
          uuid:e.section.items[index].properties.data.uuid
          url:e.section.items[index].properties.data.url
          title:e.section.items[index].properties.data.title
          body:e.section.items[index].properties.data.body
          icon:e.section.items[index].properties.data.user.profile_image_url
        Ti.App.Analytics.trackPageview "/list/url?#{data.url}"
        
        
        detailWindow = require('ui/iphone/detailWindow')
        detailWindow = new detailWindow(data)
        detailWindow.top = Ti.Platform.displayCaps.platformHeight        
        animation = Ti.UI.createAnimation()
        animation.top = 0
        animation.duration = 300
        detailWindow.open(animation)

    )
    return @listView
    
  createItems:(data) ->
    dataSet = []

    for _items in data
      rawData = _items
      layout =
        properties:
          height:120
          selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE
          data:rawData
          
        title:
          text: _items.title
        icon:
          image: _items.user.profile_image_url
        updateTime:
          text: _items.updated_at_in_words
        handleName:
          text: _items.user.url_name
        contents:
          text: _items.body.replace(/<\/?[^>]+>/gi, "")
          # text: _items.raw_body
        tags:
          text: 'javascript,ruby,Titanium'
        tagIcon:
          text:String.fromCharCode("0xe128")
      dataSet.push(layout)
                
    return dataSet
    
  refresData: (data) =>
    sections = []
    section = Ti.UI.createListSection()
    
    dataSet = @createItems(data)
      
    # 過去の投稿を読み込むためのもの
    section = Ti.UI.createListSection()
    loadOld =
      loadOld:true
      properties:
        selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE
      title:
        text: 'load old'
      
    dataSet.push(loadOld)
    
    section.setItems dataSet
    sections.push section

    return @listView.setSections sections
    
  _getLastItemIndex: () ->
    # -1 するのは、過去の投稿を読み込むためのitemが存在するため
    return @listView.sections[0].items.length-1
    
module.exports = listView  