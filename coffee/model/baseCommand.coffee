class baseCommand
  constructor:() ->
    @direction = "vertical"
    
  _currentSlideState:() ->
    flg = Ti.App.Properties.getBool "stateMainTableSlide"
    if flg is true
      state = "slideState"
    else
      state = "default"

    return state

  _showStatusView:() ->
    Ti.API.info "[ACTION] スライド開始"
    progressBar.value = 0
    progressBar.show()    
    statusView.animate({
        duration:400
        top:0
    },() ->
      Ti.API.debug "mainTable を上にずらす"
      mainTable.animate({
        duration:200
        top:50
      })
    )


  _hideStatusView:() ->
    Ti.API.info "[ACTION] スライドから標準状態に戻る。垂直方向"
    mainTable.animate({
      duration:200
      top:0
    },()->
      Ti.API.debug "mainTable back"
      progressBar.hide()
      statusView.animate({
        duration:400
        top:-50
      })
    )

    
    

module.exports = baseCommand