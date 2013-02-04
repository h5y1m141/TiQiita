class alertView
  constructor:() ->
    @alertView =Titanium.UI.createView
      zIndex:5
      width: 320
      height: 80
      top:0
      left:0
      backgroundGradient:
        type: "linear"
        startPoint:
          x: "50%"
          y: "0%"

        endPoint:
          x: "50%"
          y: "100%"
          
        colors: [
          color: "#fe0700"
          offset: 1.0
        ,
          color: "#f74504"
          offset: 0.5
        ,

          color: "#e77208"
          offset: 0.0
          
        ]
    warnImage = Ti.UI.createImageView
      width:50
      height:50
      top:10
      left:5
      image:"ui/image/dark_warn@2x.png"
      
    @message = Ti.UI.createLabel
      text:"ネットワークが利用できないかQiitaのサーバがダウンしてるようです。"
      width: 200
      height:60
      top:10
      left:70
      font:
        fontSize: 14
        fontWeight:'bold'        
      color: "#fff"
      
    @alertView.add warnImage
    @alertView.add @message
    
    return true

  editMessage:(value) ->
    return @message.text = value
      
  getAlertView:() ->
    return @alertView

  show:() ->
    return @alertView.show()
    
module.exports = alertView