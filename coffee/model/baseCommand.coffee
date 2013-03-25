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
    Ti.API.info "データの読み込み。statusView表示"

    return mainContoroller.slideMainTable(@direction)


  _hideStatusView:() ->
    Ti.API.info "データの読み込みが完了したらstatusViewを元に戻す"

    mainContoroller.slideMainTable(@direction)

    
    

module.exports = baseCommand