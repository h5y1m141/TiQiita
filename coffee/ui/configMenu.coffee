class configMenu
  constructor: () ->
    groupData = Ti.UI.createTableViewSection(
      headerTitle: "Qiitaアカウント設定"
    )

    QiitaLoginID = Ti.App.Properties.getString('QiitaLoginID')
    QiitaLoginPassword = Ti.App.Properties.getString('QiitaLoginPassword')
    
    row1 = Ti.UI.createTableViewRow
      width: 270
      height: Ti.UI.FILL

    textField1 = Ti.UI.createTextField
      color:"#222"
      top:5
      left:10
      width:230
      height:30
      hintText:"QiitaユーザID"
      font:
        fontSize:14

      keyboardType:Ti.UI.KEYBOARD_EMAIL_ADDRESS
      returnKeyType:Ti.UI.RETURNKEY_DEFAULT
      borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      autocorrect:false
      autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    
    textField1.addEventListener('change',(e) ->
      Ti.App.Properties.setString('QiitaLoginID',e.value)
    )
    
    row1.add textField1
    row1.className = 'url_name'

    row2 = Ti.UI.createTableViewRow
      width: 270
      height:Ti.UI.FILL

    textField2 = Ti.UI.createTextField
      color:"#222"
      top:5
      left:10
      width:230
      height:30
      hintText:"パスワード入力"
      font:
        fontSize:14

      keyboardType:Ti.UI.KEYBOARD_ASCII
      returnKeyType:Ti.UI.RETURNKEY_DEFAULT
      borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      enableReturnKey:true
      passwordMask:true
      autocorrect:false
      
    textField2.addEventListener('change',(e) ->
      Ti.App.Properties.setString('QiitaLoginPassword',e.value)
    )

    

    row2.add textField2
    row2.className = 'password'
    
    if QiitaLoginID isnt null
      textField1.value = QiitaLoginID

    if QiitaLoginPassword isnt null
      textField2.value = QiitaLoginPassword

    row3 = Ti.UI.createTableViewRow
      width: 270
      height:50
      backgroundColor:'#59BB0C'  


    row3label = Ti.UI.createLabel
      color:"#fff"
      top:15
      left:5
      width:250
      height:20
      font:
        fontSize:20
        fontWeight:'bold'
      textAlign:1
      text:"ログインする"


    row3.add row3label

    groupData.add row1
    groupData.add row2
    groupData.add row3

    # SNS 
    platformSection = Ti.UI.createTableViewSection(headerTitle: "SNSアカウント設定")

    @hatenaRow = Ti.UI.createTableViewRow
      touchEnabled: false
      height: Ti.UI.FILL
      selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
    

    @hatenaRow.addEventListener('click',()->
      # Ti.API.info "start hatena"
      # Hatena = require("model/hatena")
      # hatena = new Hatena()
      # hatena.login()
    )
    
    hatenaIconImage = Ti.UI.createImageView
      width:35
      height:35
      top:5
      left:5
      image:"ui/image/hatena.png"
      
    @hatenaLabel = Ti.UI.createLabel(
      left: 50
      width:100
      text: "はてな"
    )
    if Ti.App.Properties.getBool("hatenaAccessTokenKey")?
      @hatenaSwitch = Ti.UI.createSwitch(
        right: 10
        value: true
      )

    else
      @hatenaSwitch = Ti.UI.createSwitch(
        right: 10
        value: false
      )  

      
    
    @hatenaSwitch.addEventListener "change", (e) ->
      if e.value is true

        Hatena = require("model/hatena")
        hatena = new Hatena()
        hatena.login()
      else
        Ti.App.Properties.removeProperty("hatenaAccessTokenKey")
        Ti.App.Properties.removeProperty("hatenaAccessTokenSecret")
     

    @hatenaRow.add hatenaIconImage

    @hatenaRow.add @hatenaLabel
    @hatenaRow.add @hatenaSwitch


    platformSection.add @hatenaRow

    @tableView = Ti.UI.createTableView
      zIndex:5
      data: [groupData,platformSection]


      style: Ti.UI.iPhone.TableViewStyle.GROUPED
      top: 0
      left:50
      width: 270
      height:'auto'
      
    @tableView.addEventListener('click',(e) ->  
      if e.index is 2
        textField2.enabled = false
        actInd.show()
        LoginCommand = require("model/loginCommand")
        loginCommand = new LoginCommand()
        loginCommand.execute()

    )


  getTable:() ->
    return @tableView

  changeHatenaRowElement: (switchFlg) ->
    @hatenaSwitch.value = switchFlg
    return 




module.exports = configMenu