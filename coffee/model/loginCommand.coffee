class loginCommand
  constructor:() ->
    
  execute:() ->

    param =
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')

    Ti.API.info "[INFO] login start."  
    qiita._auth(param, (token)=>
      
      if token is null

        alert "ユーザIDかパスワードが間違ってます"
        actInd.hide()
        
      else
        alert "認証出来ました。\n自動的にメインの画面に切り替わりますのでしばらくお待ち下さい"
        actInd.hide()
        Ti.App.Properties.setString 'QiitaLoginID', param.url_name
        Ti.App.Properties.setString 'QiitaLoginPassword', param.password
        Ti.App.Properties.setString 'QiitaToken', token
        
        mainContoroller.createMainWindow()
        mainContoroller.refreshMenuTable()
        commandController.useMenu "storedStocks"
        tabGroup.setActiveTab(0)
        tabGroup.open()


    )
    
    return true

module.exports = loginCommand  