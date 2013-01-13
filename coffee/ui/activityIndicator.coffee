class activityIndicator
  constructor: () ->
    actInd = Ti.UI.createActivityIndicator
      zIndex:10
      top:100
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