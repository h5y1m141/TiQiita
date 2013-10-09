var activityIndicator;

activityIndicator = (function() {

  function activityIndicator() {
    var actInd;
    actInd = Ti.UI.createActivityIndicator({
      zIndex: 20,
      backgroundColor: "#222",
      top: 150,
      left: 120,
      height: 40,
      width: 'auto',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      color: '#fff',
      message: 'loading...'
    });
    return actInd;
  }

  return activityIndicator;

})();

module.exports = activityIndicator;
