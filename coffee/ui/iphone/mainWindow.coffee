class mainWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f9f9f9"
      keyColor:'#4BA503'
      textColor:"#333"
      contentsColor:"#666"      
      grayTextColor:"#999"      
      
    @window = Ti.UI.createWindow
      title:"Qiita"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:true
      navBarHidden:false
      
    @_createNavbarElement()
    t = Titanium.UI.create2DMatrix().scale(0)
    myTemplate = childTemplates:[
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
      templates:
        template: myTemplate
      defaultItemTemplate: "template"
      
      

    testData = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/testData.json")
    file = testData.read().toString()
    json = JSON.parse(file)

    @refresData(json)
    @window.add @listView
    return @window
  refresData: (data) =>        

    sections = []
    section = Ti.UI.createListSection()
      
    dataSet = []
    # 都道府県のエリア毎に都道府県のrowを生成
    for _items in data
      layout =
        properties:
          height:120
        title:
          text: _items.title
        icon:
          image: _items.user.profile_image_url
        updateTime:
          text: _items.updated_at_in_words
        handleName:
          text: _items.user.url_name
        contents:
          # text: _items.body.replace(/<\/?[^>]+>/gi, "")
          text: _items.raw_body
        tags:
          text: 'javascript,ruby,Titanium'
        tagIcon:
          text:String.fromCharCode("0xe128")
                    
      dataSet.push(layout)

    section.setItems dataSet
    sections.push section

    return @listView.setSections sections
    
  _createNavbarElement:() ->
    windowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:@baseColor.textColor
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        # fontWeight:'bold'
      text:"Qiita"

    @window.setTitleControl windowTitle
    return
    
    
module.exports = mainWindow  