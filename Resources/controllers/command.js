var Command;
Command = (function() {
  function Command(obj) {
    this.items = obj;
    this.menuList = [
      {
        description: "ようこそ",
        backCommand: null,
        nextCommand: 1
      }, {
        description: "この画面では基本的な操作方法について解説します",
        backCommand: 0,
        nextCommand: 2
      }, {
        description: "応用編について解説します",
        backCommand: 1,
        nextCommand: 3
      }, {
        description: "更に踏み込んだTIPSについて解説します",
        backCommand: 2,
        nextCommand: 4
      }, {
        description: "アプリ起動します",
        backCommand: 3,
        nextCommand: null
      }
    ];
  }
  Command.prototype.moveNext = function(selectedNumber) {
    this._setValue(selectedNumber);
    this._buttonShowFlg();
    return this.items;
  };
  Command.prototype.moveBack = function(selectedNumber) {
    this._setValue(selectedNumber);
    this._buttonShowFlg();
    return this.items;
  };
  Command.prototype.execute = function(selectedNumber) {
    var self;
    self = this;
    this._setValue(selectedNumber);
    this._buttonShowFlg();
    this.items.backBtn.title = "前";
    this.items.nextBtn.title = "次";
    this.items.startPointBtn.title = "最初";
    this.items.endPointBtn.title = "最後";
    this.items.nextBtn.addEventListener('click', function(e) {
      if (e.source.className !== null) {
        return self.moveNext(e.source.className);
      }
    });
    this.items.backBtn.addEventListener('click', function(e) {
      if (e.source.className !== null) {
        return self.moveBack(e.source.className);
      }
    });
    this.items.startPointBtn.addEventListener('click', function(e) {
      return self.moveBack(0);
    });
    this.items.endPointBtn.addEventListener('click', function(e) {
      var lastPoint;
      lastPoint = self.menuList.length;
      return self.moveBack(lastPoint - 1);
    });
    if (this.items.backBtn.title !== null) {
      win.add(this.items.startPointBtn);
    }
    if (this.items.backBtn.title !== null) {
      win.add(this.items.backBtn);
    }
    if (this.items.nextBtn.title !== null) {
      win.add(this.items.nextBtn);
    }
    if (this.items.nextBtn.title !== null) {
      win.add(this.items.endPointBtn);
    }
    this.items.currentView.add(this.items.label);
    win.add(this.items.currentView);
    win.add(this.items.nextView);
    return win.open();
  };
  Command.prototype._setValue = function(selectedNumber) {
    this.items.label.text = this.menuList[selectedNumber].description;
    this.items.nextBtn.className = this.menuList[selectedNumber].nextCommand;
    this.items.backBtn.className = this.menuList[selectedNumber].backCommand;
    return true;
  };
  Command.prototype._buttonShowFlg = function() {
    if (this.items.nextBtn.className === null) {
      this.items.nextBtn.hide();
      this.items.endPointBtn.hide();
    } else {
      this.items.nextBtn.show();
      this.items.endPointBtn.show();
    }
    if (this.items.backBtn.className === null) {
      this.items.backBtn.hide();
      return this.items.startPointBtn.hide();
    } else {
      this.items.backBtn.show();
      return this.items.startPointBtn.show();
    }
  };
  return Command;
})();
module.exports = Command;