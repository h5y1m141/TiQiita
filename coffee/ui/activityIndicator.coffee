class activityIndicator
  constructor: () ->
    actInd = Ti.UI.createActivityIndicator
      zIndex:20
      backgroundColor:"#222"
      top:150
      left: 120
      height: 40
      width: 'auto'
      font: 
        fontFamily:'Helvetica Neue'
        fontSize:15
        fontWeight:'bold'
      color: '#fff'
      message: 'loading...'
    return actInd
  
module.exports = activityIndicator  