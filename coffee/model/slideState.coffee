class slideState
  constructor: () ->
    # Ti.API.info "STATE: スライド状態"
    
    
  sayState: () ->
    return "[STATE スライド状態]"
  moveUP: () ->
    Ti.API.info "[ACTION] スライドから標準状態に戻る。垂直方向"
    Ti.App.Properties.setBool "stateMainTableSlide",false
    mainTable.touchEnabled = true
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
  moveBackward: () ->
    Ti.API.info "[ACTION] スライドから標準状態に戻る。水平方向"
    Ti.App.Properties.setBool "stateMainTableSlide",false
    page = Ti.App.Properties.getString "currentPage"
    Ti.API.info "[ACTION] 現在のページ #{page}"
    mainTable.touchEnabled = true
    
    mainTable.setOpacity(1.0)
    mainTable.animate({
      duration:200
      left:0
    },()->
      # Ti.API.info "アニメーション終了"
    
    )
    return new defaultState()
    
  moveForward: () ->
    Ti.API.info "[STATE] この状態では何もしない"
    return new slideState()
    
module.exports = slideState