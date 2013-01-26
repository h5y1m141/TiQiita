class statusView
  constructor:() ->
    statusView =Titanium.UI.createView
      zIndex:5
      width: 320
      height: 50
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
          color: "#222"
          offset: 1.0
        ,
          color: "#444"
          offset: 0.5
        ,

          color: "#222"
          offset: 0.0
          
        ]          

        # colors: [
        #   color: "#ff0700"
        #   offset: 1.0
        # ,
        #   color: "#e77208"
        #   offset: 0.5
        # ,
        # 
        #   color: "#ff0700"
        #   offset: 0.0
          
        # ]
    return statusView
module.exports = statusView