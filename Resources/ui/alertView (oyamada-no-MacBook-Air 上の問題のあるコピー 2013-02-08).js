var alertView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
alertView = (function() {
  function alertView() {
    var warnImage;
    this.alertView = Titanium.UI.createView({
      zIndex: 5,
      width: 320,
      height: 80,
      top: -80,
      left: 0,
      backgroundGradient: {
        type: "linear",
        startPoint: {
          x: "50%",
          y: "0%"
        },
        endPoint: {
          x: "50%",
          y: "100%"
        },
        colors: [
          {
            color: "#fe0700",
            offset: 1.0
          }, {
            color: "#f74504",
            offset: 0.5
          }, {
            color: "#e77208",
            offset: 0.0
          }
        ]
      }
    });
    warnImage = Ti.UI.createImageView({
      width: 50,
      height: 50,
      top: 10,
      left: 5,
      image: "ui/image/dark_warn@2x.png"
    });
    this.message = Ti.UI.createLabel({
      text: "ネットワークが利用できないかQiitaのサーバがダウンしてるようです。",
      width: 200,
      height: 60,
      top: 10,
      left: 70,
      font: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      color: "#fff"
    });
    this.alertView.add(warnImage);
    this.alertView.add(this.message);
    this.alertView.hide();
    return true;
  }
  alertView.prototype.editMessage = function(value) {
    return this.message.text = value;
  };
  alertView.prototype.getAlertView = function() {
    return this.alertView;
  };
  alertView.prototype.show = function() {
    return this.alertView.show();
  };
  alertView.prototype.animate = function() {
    this.alertView.show();
    statusView.top = -50;
    progressBar.hide();
    return this.alertView.animate({
      duration: 600,
      top: 0
    }, __bind(function() {
      return this.alertView.animate({
        duration: 2000,
        top: 1
      }, __bind(function() {
        return this.alertView.animate({
          duration: 600,
          top: -80
        }, __bind(function() {
          return this.alertView.hide();
        }, this));
      }, this));
    }, this));
  };
  return alertView;
})();
module.exports = alertView;