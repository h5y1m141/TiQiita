var progressBar;
progressBar = (function() {
  function progressBar() {
    var ind;
    ind = Titanium.UI.createProgressBar({
      top: 0,
      height: 30,
      width: 200,
      zIndex: 20,
      min: 0,
      max: 1,
      value: 0,
      color: "#fff",
      message: "Downloading....",
      style: Ti.UI.iPhone.ProgressBarStyle.PLAIN,
      font: {
        fontSize: 12
      }
    });
    return ind;
  }
  return progressBar;
})();
module.exports = progressBar;