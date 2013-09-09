class mainWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f9f9f9"
      keyColor:"#44A5CB"
      
    @window = Ti.UI.createWindow
      title:"Qiita"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:true
      navBarHidden:false
      
    @_createNavbarElement()
    t = Titanium.UI.create2DMatrix().scale(0)
    
    @table = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
      width:160
      height:'auto'
      left:150
      top:20
      borderColor:"#f3f3f3"
      borderWidth:2
      borderRadius:10
      zIndex:10
      transform:t

    @table.addEventListener('click',(e) =>
    )
    
    @window.add @table
    return @window
    
  _createNavbarElement:() ->
    windowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"Qiita"

    @window.setTitleControl windowTitle
    return
    
module.exports = mainWindow  