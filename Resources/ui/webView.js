var webView;

webView = (function() {

  function webView() {
    var adViewHeight, barHeight, bootstrapCSS, file, qiitaCSS, screenHeight, stockURL, stockUUID, webViewHeaderHight, webViewHeight, webViewTopPosition;
    screenHeight = Ti.Platform.displayCaps.platformHeight;
    adViewHeight = 50;
    webViewHeaderHight = 55;
    barHeight = 60;
    webViewTopPosition = webViewHeaderHight;
    webViewHeight = screenHeight - (barHeight + webViewHeaderHight + adViewHeight);
    Ti.API.info("" + webViewHeaderHight + " and " + webViewHeight + " and " + webViewTopPosition);
    this.webViewHeaderContainer = Ti.UI.createView({
      top: 0,
      left: 0,
      width: 320,
      height: webViewHeaderHight,
      zIndex: 1,
      backgroundColor: '#141414'
    });
    Ti.API.info("webViewHeight is " + webViewHeight);
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'ui/css/qiita.css');
    this.css = file.read();
    qiitaCSS = 'ui/css/qiitaColor.css';
    bootstrapCSS = 'ui/css/bootstrap.min.css';
    this.htmlHeaderElement = "<html><head><meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1'><link rel='stylesheet' href='" + qiitaCSS + "' type='text/css'></link></head>";
    this.web = Ti.UI.createWebView({
      top: webViewTopPosition,
      left: 0,
      zIndex: 5,
      width: 320,
      height: webViewHeight,
      html: "init"
    });
    this.titleLabel = Ti.UI.createLabel({
      font: {
        fontWeight: 'bold',
        fontSize: 16
      },
      color: '#fff',
      top: 5,
      left: 80,
      width: 220,
      height: 40,
      zIndex: 2,
      text: "no title"
    });
    this.dateLabel = Ti.UI.createLabel({
      font: {
        fontSize: 12
      },
      textAlign: 2,
      color: '#fff',
      top: 65,
      left: 80,
      width: 220,
      height: 15,
      zIndex: 2,
      text: "no date"
    });
    this.iconIamge = Ti.UI.createImageView({
      left: 5,
      top: 5,
      borderWidth: 1,
      borderColor: '#222',
      borderRadius: 5,
      width: 40,
      height: 40,
      zIndex: 20,
      userName: "",
      defaultImage: "ui/image/logo-square.png",
      backgroundColor: '#cbcbcb',
      image: ""
    });
    stockURL = null;
    stockUUID = null;
  }

  webView.prototype.retreiveWebView = function() {
    return this.web;
  };

  webView.prototype.retreiveWebViewHeader = function() {
    return this.webViewHeaderContainer;
  };

  webView.prototype.headerUpdate = function(json) {
    this.titleLabel.text = json.title;
    this.dateLabel.text = '投稿日：' + moment(json.created_at, "YYYY-MM-DD HH:mm:ss Z").fromNow();
    this.iconIamge.image = json.user.profile_image_url;
    this.iconIamge.userName = json.user.url_name;
    this.iconIamge.addEventListener('click', function(e) {
      return Ti.API.info(e.source.userName);
    });
    this.webViewHeaderContainer.add(this.iconIamge);
    this.webViewHeaderContainer.add(this.titleLabel);
    return true;
  };

  webView.prototype.contentsUpdate = function(body) {
    this.web.html = "" + this.htmlHeaderElement + body + "</body></html>";
    return true;
  };

  webView.prototype.show = function() {
    return this.web.show();
  };

  webView.prototype.setStockUUID = function(stockUUID) {
    this.stockUUID = stockUUID;
  };

  webView.prototype.setStockURL = function(stockURL) {
    this.stockURL = stockURL;
  };

  webView.prototype.getStockUUID = function() {
    return this.stockUUID;
  };

  webView.prototype.getStockURL = function() {
    return this.stockURL;
  };

  return webView;

})();

module.exports = webView;
