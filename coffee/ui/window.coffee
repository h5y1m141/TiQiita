class window
  constructor: () ->
    win = Ti.UI.createWindow
      title:'Qiita'
      barColor:'#59BB0C'
      navBarHidden: false
      tabBarHidden: true
      
    return win

   

module.exports = window    