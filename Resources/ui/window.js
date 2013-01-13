var window;
window = (function() {
  function window() {
    var win;
    win = Ti.UI.createWindow({
      title: 'Qiita',
      barColor: '#59BB0C'
    });
    return win;
  }
  return window;
})();
module.exports = window;