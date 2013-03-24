class defaultState
  constructor: () ->
    # Ti.API.info "STATE: 標準状態"
    
    
  sayState: () ->
    return "[STATE 標準状態]"
  moveUP: () ->
    Ti.API.info "[STATE 標準状態]この状態では何もしない"
    return new defaultState()
  moveDown: () ->
    Ti.API.info "[ACTION] スライド開始"
    progressBar.value = 0
    progressBar.show()    
    Ti.App.Properties.setBool "stateMainTableSlide",true
    statusView.animate({
        duration:400
        top:0
    },() ->
      # mainTable.touchEnabled = false
      mainTable.animate({
        duration:200
        top:50
      })
    )
    
    return new slideState()
    


module.exports = defaultState 