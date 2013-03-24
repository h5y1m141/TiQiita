class slideState
  constructor: () ->
    # Ti.API.info "STATE: スライド状態"
    
    
  sayState: () ->
    return "[STATE スライド状態]"
  moveUP: () ->
    Ti.API.info "[ACTION] スライドから標準状態に戻る。垂直方向"
    Ti.App.Properties.setBool "stateMainTableSlide",false
    # mainTable.touchEnabled = true
    mainTable.animate({
      duration:200
      top:0
    },()->
      statusView.animate({
        duration:400
        top:-50
      })
    )

    return new defaultState()
  moveDown: () ->    
    Ti.API.info "[STATE スライド状態] この状態では何もしない"
    return new slideState()
    
module.exports = slideState