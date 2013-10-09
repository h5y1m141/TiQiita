var listView;

listView = (function() {

  function listView() {
    var TiISRefreshControl, myTemplate,
      _this = this;
    TiISRefreshControl = require('be.k0suke.tiisrefreshcontrol');
    Ti.API.info("module is => " + TiISRefreshControl);
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f9f9f9",
      keyColor: '#59BB0C',
      textColor: "#333",
      contentsColor: "#666",
      grayTextColor: "#999"
    };
    myTemplate = {
      childTemplates: [
        {
          type: "Ti.UI.ImageView",
          bindId: "icon",
          properties: {
            defaultImage: "ui/image/logo.png",
            width: 40,
            height: 40,
            left: 5,
            top: 5
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "title",
          properties: {
            color: this.baseColor.textColor,
            font: {
              fontSize: 16,
              fontWeight: 'bold'
            },
            width: 240,
            height: 20,
            left: 60,
            top: 25
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "handleName",
          properties: {
            color: this.baseColor.keyColor,
            font: {
              fontSize: 12
            },
            width: 200,
            height: 15,
            left: 60,
            top: 5
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "updateTime",
          properties: {
            color: this.baseColor.textColor,
            font: {
              fontSize: 12
            },
            width: 60,
            height: 15,
            right: 0,
            top: 5
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "tagIcon",
          properties: {
            color: this.baseColor.keyColor,
            font: {
              fontSize: 16,
              fontFamily: 'LigatureSymbols'
            },
            width: 20,
            height: 15,
            left: 60,
            top: 103
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "tags",
          properties: {
            color: this.baseColor.keyColor,
            font: {
              fontSize: 12
            },
            width: 240,
            height: 15,
            left: 80,
            top: 100
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "contents",
          properties: {
            color: this.baseColor.contentsColor,
            font: {
              fontSize: 12
            },
            width: 240,
            height: 50,
            left: 60,
            top: 45
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "loadBtn",
          properties: {
            color: this.baseColor.contentsColor,
            font: {
              fontSize: 32,
              fontFamily: 'LigatureSymbols'
            },
            width: 320,
            height: 50,
            textAlign: "center",
            left: 0,
            top: 0
          }
        }
      ]
    };
    this.listView = Ti.UI.createListView({
      top: 40,
      left: 0,
      zIndex: 20,
      templates: {
        template: myTemplate
      },
      defaultItemTemplate: "template",
      refreshControlEnabled: true
    });
    this.listView.addEventListener("refreshstart", function(e) {
      _this.listView.isRefreshing();
      return setTimeout((function() {
        return _this.listView.refreshFinish();
      }), 5000);
    });
    this.listView.addEventListener('itemclick', function(e) {
      var animation, data, detailWindow, index, that;
      that = _this;
      index = e.itemIndex;
      if (e.section.items[index].loadOld === true) {
        MainWindow.actInd.show();
        return maincontroller.getNextFeed(function(items) {
          var currentSection, lastIndex;
          lastIndex = that._getLastItemIndex();
          Ti.API.info("lastIndex is " + lastIndex);
          currentSection = that.listView.sections[0];
          MainWindow.actInd.hide();
          return currentSection.insertItemsAt(lastIndex, items);
        });
      } else {
        data = {
          uuid: e.section.items[index].properties.data.uuid,
          url: e.section.items[index].properties.data.url,
          title: e.section.items[index].properties.data.title,
          body: e.section.items[index].properties.data.body,
          icon: e.section.items[index].properties.data.user.profile_image_url
        };
        Ti.App.Analytics.trackPageview("/list/url?" + data.url);
        detailWindow = require('ui/iphone/detailWindow');
        detailWindow = new detailWindow(data);
        detailWindow.top = Ti.Platform.displayCaps.platformHeight;
        animation = Ti.UI.createAnimation();
        animation.top = 0;
        animation.duration = 300;
        return detailWindow.open(animation);
      }
    });
    return this.listView;
  }

  listView.prototype._getLastItemIndex = function() {
    return this.listView.sections[0].items.length - 1;
  };

  return listView;

})();

module.exports = listView;
