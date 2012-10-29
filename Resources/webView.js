var webView;

webView = (function() {

  function webView() {}

  webView.prototype.create = function(json) {
    var container, css, dateLabel, file, htmlHeaderElement, iconIamge, titleLabel, web, webViewHeaderContainer;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'bootstrap.min.css');
    css = file.read();
    htmlHeaderElement = '<html><head><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1"><style type="text/css">#{css}</style></head>';
    web = Ti.UI.createWebView({
      top: 80,
      left: 0,
      zIndex: 5,
      width: 320,
      html: "" + htmlHeaderElement + json.body + "</body></html>"
    });
    titleLabel = Ti.UI.createLabel({
      font: {
        fontWeight: 'bold',
        fontSize: 16
      },
      color: '#fff',
      top: 10,
      left: 80,
      width: 220,
      height: 50,
      text: json.title
    });
    dateLabel = Ti.UI.createLabel({
      font: {
        fontSize: 12
      },
      textAlign: 2,
      color: '#fff',
      top: 65,
      left: 80,
      width: 220,
      height: 15,
      text: '投稿日：' + moment(json.created_at, "YYYY-MM-DD HH:mm:ss Z").fromNow()
    });
    iconIamge = Ti.UI.createImageView({
      left: 5,
      top: 10,
      borderWidth: 1,
      borderColor: '#222',
      borderRadius: 5,
      width: 50,
      height: 50,
      image: json.user.profile_image_url,
      backgroundColor: '#cbcbcb'
    });
    webViewHeaderContainer = Ti.UI.createLabel({
      top: 0,
      left: 0,
      width: 320,
      height: 80,
      backgroundColor: '#141414'
    });
    webViewHeaderContainer.add(iconIamge);
    webViewHeaderContainer.add(titleLabel);
    webViewHeaderContainer.add(dateLabel);
    container = [];
    container.push(webViewHeaderContainer);
    container.push(web);
    return container;
  };

  return webView;

})();

module.exports = webView;
