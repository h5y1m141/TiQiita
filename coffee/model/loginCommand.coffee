class loginCommand
  constructor:() ->
  execute:() ->
    param =
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
      
    direction = "vertical"
    Ti.App.Properties.setBool 'stateMainTableSlide',false
    controller.slideMainTable(direction)

    qiita._auth(param, (token)->
      if token is null
        alertView.editMessage "ユーザIDかパスワードが間違ってます"
        alertView.animate()
      else
        alertView.editMessage "認証出来ました"
        alertView.animate()

        Ti.App.Properties.setString('QiitaLoginID', param.url_name)
        Ti.App.Properties.setString('QiitaLoginPassword', param.password)

    )
    
    return true

module.exports = loginCommand  