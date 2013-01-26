class progressBar
  constructor:() ->
    ind = Titanium.UI.createProgressBar(
      top: 0
      height: 30
      width: 200
      zIndex:20
      min: 0
      max: 3
      value: 0
      color: "#fff"
      message: "Downloading...."
      style: Ti.UI.iPhone.ProgressBarStyle.PLAIN
      font:
        fontSize: 12
    )
    return ind
    
module.exports = progressBar    