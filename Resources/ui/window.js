var window;
window = (function() {
  function window() {
    var win;
    win = Ti.UI.createWindow({
      title: 'Qiita',
      barColor: '#59BB0C',
      navBarHidden: false,
      tabBarHidden: true
    });
    return win;
  }
  return window;
})();
module.exports = window;