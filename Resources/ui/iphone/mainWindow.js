var mainWindow;

mainWindow = (function() {

  function mainWindow() {
    var t,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f9f9f9",
      keyColor: "#44A5CB"
    };
    this.window = Ti.UI.createWindow({
      title: "Qiita",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: true,
      navBarHidden: false
    });
    this._createNavbarElement();
    t = Titanium.UI.create2DMatrix().scale(0);
    this.table = Ti.UI.createTableView({
      backgroundColor: "#f3f3f3",
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
      width: 160,
      height: 'auto',
      left: 150,
      top: 20,
      borderColor: "#f3f3f3",
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 10,
      transform: t
    });
    this.table.addEventListener('click', function(e) {});
    this.window.add(this.table);
    return this.window;
  }

  mainWindow.prototype._createNavbarElement = function() {
    var windowTitle;
    windowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "Qiita"
    });
    this.window.setTitleControl(windowTitle);
  };

  return mainWindow;

})();

module.exports = mainWindow;
