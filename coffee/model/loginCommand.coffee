class loginCommand
  constructor:() ->
    
  execute:() ->

    param =
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    qiita._auth(param, (token)->
      
      if token is null

        alert "ユーザIDかパスワードが間違ってます"
        
      else
        alert "認証出来ました"

        Ti.App.Properties.setString('QiitaLoginID', param.url_name)
        Ti.App.Properties.setString('QiitaLoginPassword', param.password)
        menuTable.refreshMenu()

    )
    
    return true

module.exports = loginCommand  