class progressBar
  constructor:() ->
    ind = Titanium.UI.createProgressBar(
      top: 0
      height: 70
      width: 150
      zIndex:20
      min: 0
      max: 10
      value: 0
      color: "#888"
      message: "Downloading 0 of 10"
      style: Ti.UI.iPhone.ProgressBarStyle.PLAIN
      font:
        fontSize: 14
        fontWeight: "bold"
      
    )
    return ind
    
module.exports = progressBar    