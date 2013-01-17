class Command
  constructor:(obj) ->
    @items = obj
    @menuList = [
      description:"ようこそ"
      backCommand:null
      nextCommand:1
    ,
      description:"この画面では基本的な操作方法について解説します"
      backCommand:0
      nextCommand:2
    ,
      description:"応用編について解説します"
      backCommand:1
      nextCommand:3
    ,
      description:"更に踏み込んだTIPSについて解説します"
      backCommand:2
      nextCommand:4
    ,
      description:"アプリ起動します"
      backCommand:3
      nextCommand:null
    ]
    
  moveNext:(selectedNumber) ->
    @._setValue(selectedNumber)
    @._buttonShowFlg()

    return @items
    
  moveBack:(selectedNumber) ->
    @._setValue(selectedNumber)
    @._buttonShowFlg()
    
    return @items
    
  execute:(selectedNumber) ->
    self = @
    
    @._setValue(selectedNumber)
    @._buttonShowFlg()
    @items.backBtn.title = "前"
    @items.nextBtn.title = "次"
    @items.startPointBtn.title = "最初"
    @items.endPointBtn.title = "最後"   


    @items.nextBtn.addEventListener('click',(e) ->
      if e.source.className isnt null
        self.moveNext(e.source.className)
    )      

    @items.backBtn.addEventListener('click',(e) ->
      if e.source.className isnt null
        self.moveBack(e.source.className)
    )

    @items.startPointBtn.addEventListener('click',(e) ->
      self.moveBack(0)
    )

    @items.endPointBtn.addEventListener('click',(e) ->
      lastPoint = self.menuList.length
      self.moveBack(lastPoint-1)
    )
    
    
    win.add @items.startPointBtn unless @items.backBtn.title is null
    win.add @items.backBtn unless @items.backBtn.title is null
    win.add @items.nextBtn unless @items.nextBtn.title is null
    win.add @items.endPointBtn unless @items.nextBtn.title is null
    
    @items.currentView.add @items.label
    
    win.add @items.currentView
    win.add @items.nextView
    
    return win.open()

    
  _setValue:(selectedNumber) ->
    @items.label.text = @menuList[selectedNumber].description
        
    @items.nextBtn.className = @menuList[selectedNumber].nextCommand
    @items.backBtn.className = @menuList[selectedNumber].backCommand
    
    return true
    
  _buttonShowFlg:() ->
    
    if @items.nextBtn.className is null
      @items.nextBtn.hide()
      @items.endPointBtn.hide()
    else 
      @items.nextBtn.show()
      @items.endPointBtn.show()
      
    if @items.backBtn.className is null
      @items.backBtn.hide()
      @items.startPointBtn.hide()
    else 
      @items.backBtn.show()
      @items.startPointBtn.show()      

 

module.exports = Command
