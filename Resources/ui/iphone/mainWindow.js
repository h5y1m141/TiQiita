var mainWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mainWindow = (function() {

  function mainWindow() {
    this.refresData = __bind(this.refresData, this);

    var ConfigMenu, Qiita, configMenu, menuBtn, myTemplate, navView, qiita,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f9f9f9",
      keyColor: '#4BA503',
      textColor: "#333",
      contentsColor: "#666",
      grayTextColor: "#999"
    };
    this.window = Ti.UI.createWindow({
      title: "Qiita",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: true,
      navBarHidden: true
    });
    ConfigMenu = require("ui/iphone/configMenu");
    configMenu = new ConfigMenu();
    this.window.add(configMenu);
    this.slideState = false;
    menuBtn = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: "#f9f9f9",
      width: 28,
      height: 28,
      top: 5,
      left: 10,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe08e")
    });
    menuBtn.addEventListener('click', function(e) {
      var animation, transform;
      if (_this.slideState === true) {
        transform = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.left = 0;
        animation.transform = transform;
        animation.duration = 250;
        _this.listView.animate(animation);
        navView.animate(animation);
        return _this.slideState = false;
      } else {
        transform = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.left = 200;
        animation.transform = transform;
        animation.duration = 250;
        _this.listView.animate(animation);
        navView.animate(animation);
        return _this.slideState = true;
      }
    });
    navView = Ti.UI.createView({
      width: Ti.UI.FULL,
      height: 40,
      top: 0,
      left: 0,
      backgroundColor: this.baseColor.keyColor,
      zIndex: 25
    });
    navView.add(menuBtn);
    this.window.add(navView);
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
        }
      ]
    };
    this.listView = Ti.UI.createListView({
      top: 40,
      left: 0,
      templates: {
        template: myTemplate
      },
      defaultItemTemplate: "template"
    });
    this.listView.addEventListener('itemclick', function(e) {
      var Qiita, animation, currentPage, data, detailWindow, index, nextURL, qiita, that;
      that = _this;
      index = e.itemIndex;
      if (e.section.items[index].loadOld === true) {
        Qiita = require('model/qiita');
        qiita = new Qiita();
        currentPage = Ti.App.Properties.getString("currentPage");
        nextURL = Ti.App.Properties.getString("" + currentPage + "nextURL");
        return qiita.getNextFeed(nextURL, currentPage, function(result) {
          var currentSection, items, lastIndex;
          items = _this._createItems(result);
          lastIndex = _this._getLastItemIndex();
          currentSection = _this.listView.sections[0];
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
    this.window.add(this.listView);
    Qiita = require('model/qiita');
    qiita = new Qiita();
    qiita.getFeed(function(result) {
      var MAXITEMCOUNT;
      MAXITEMCOUNT = 20;
      return _this.refresData(result);
    });
    return this.window;
  }

  mainWindow.prototype._createItems = function(data) {
    var dataSet, layout, rawData, _i, _items, _len;
    dataSet = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      _items = data[_i];
      rawData = _items;
      layout = {
        properties: {
          height: 120,
          accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
          selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE,
          data: rawData
        },
        title: {
          text: _items.title
        },
        icon: {
          image: _items.user.profile_image_url
        },
        updateTime: {
          text: _items.updated_at_in_words
        },
        handleName: {
          text: _items.user.url_name
        },
        contents: {
          text: _items.body.replace(/<\/?[^>]+>/gi, "")
        },
        tags: {
          text: 'javascript,ruby,Titanium'
        },
        tagIcon: {
          text: String.fromCharCode("0xe128")
        }
      };
      dataSet.push(layout);
    }
    return dataSet;
  };

  mainWindow.prototype.refresData = function(data) {
    var dataSet, loadOld, section, sections;
    sections = [];
    section = Ti.UI.createListSection();
    dataSet = this._createItems(data);
    section = Ti.UI.createListSection();
    loadOld = {
      loadOld: true,
      properties: {
        selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE
      },
      title: {
        text: 'load old'
      }
    };
    dataSet.push(loadOld);
    section.setItems(dataSet);
    sections.push(section);
    return this.listView.setSections(sections);
  };

  mainWindow.prototype._getLastItemIndex = function() {
    return this.listView.sections[0].items.length - 1;
  };

  mainWindow.prototype._createAdView = function() {
    var Config, adView, config, nend, nendConfig;
    nend = require('net.nend');
    Config = require("model/loadConfig");
    config = new Config();
    nendConfig = config.getNendData();
    adView = nend.createView({
      spotId: nendConfig.spotId,
      apiKey: nendConfig.apiKey,
      width: 320,
      height: 50,
      bottom: 0,
      left: 0,
      zIndex: 20
    });
    adView.addEventListener('start', function(e) {});
    adView.addEventListener('load', function(e) {});
    adView.addEventListener('error', function(e) {
      return Ti.API.info("doesn't load ad data");
    });
    return adView;
  };

  return mainWindow;

})();

module.exports = mainWindow;
