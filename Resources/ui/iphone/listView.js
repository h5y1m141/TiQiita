var listView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

listView = (function() {

  function listView() {
    this.refresData = __bind(this.refresData, this);

    var myTemplate,
      _this = this;
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
      defaultItemTemplate: "template"
    });
    this.listView.addEventListener('itemclick', function(e) {
      var Qiita, animation, currentPage, data, detailWindow, index, nextURL, qiita, that;
      that = _this;
      index = e.itemIndex;
      if (e.section.items[index].loadOld === true) {
        MainWindow.actInd.show();
        Qiita = require('model/qiita');
        qiita = new Qiita();
        currentPage = Ti.App.Properties.getString("currentPage");
        nextURL = Ti.App.Properties.getString("" + currentPage + "nextURL");
        Ti.API.info("currentPage is " + currentPage + " and nextURL is " + nextURL);
        return qiita.getNextFeed(nextURL, currentPage, function(result) {
          var currentSection, items, lastIndex;
          items = maincontroller.createItems(result);
          lastIndex = _this._getLastItemIndex();
          currentSection = _this.listView.sections[0];
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

  listView.prototype.refresData = function(data) {
    var dataSet, loadOld, section, sections;
    sections = [];
    section = Ti.UI.createListSection();
    dataSet = this.createItems(data);
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

  listView.prototype._getLastItemIndex = function() {
    return this.listView.sections[0].items.length - 1;
  };

  return listView;

})();

module.exports = listView;
