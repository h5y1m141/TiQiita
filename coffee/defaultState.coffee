class defaultState
  constructor: () ->
    
  moveBackward: () ->
    Ti.API.info "この状態では何もしない"
    return new defaultState()
  moveForward: () ->
    Ti.API.info "スライド開始"
    mainTable.animate({
      duration:200
      left:80
    }, ()-> Ti.App.Properties.setBool("stateMainTableSlide",true))
    return new slideState()

module.exports = defaultState 