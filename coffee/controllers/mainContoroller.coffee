class mainContoroller
  constructor:() ->
    @networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください"
    @authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません"
    
  init:() ->
    if controller.networkStatus() is false
      @._alertViewShow @networkDisconnectedMessage
    else  
      # direction = "horizontal"
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',false
      controller.slideMainTable(direction)
      
      commandController.useMenu "storedStocks"
      commandController.useMenu "followingTags"
      
    return true

  networkConnectionCheck:(callback) ->

    if controller.networkStatus() is false
      @._alertViewShow @networkDisconnectedMessage
      direction = "vertical"
      Ti.App.Properties.setBool 'stateMainTableSlide',true
      currentPage = Ti.App.Properties.getString "currentPage"
      Ti.API.info "mainContoroller.networkConnectionCheck #{currentPage}"
      return controller.slideMainTable(direction)
    else
      return callback()
      
  authenticationCheck:(callback)->
    token = Ti.App.Properties.getString 'QiitaToken'
    if token is null
      @._alertViewShow @authenticationFailMessage
    else
      return callback()
    
  _alertViewShow:(messsage) ->
    alertView.editMessage messsage
    alertView.animate()
    


module.exports = mainContoroller  