var mainWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mainWindow = (function() {

  function mainWindow() {
    this.refresData = __bind(this.refresData, this);

    var file, json, myTemplate, t, testData;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f9f9f9",
      keyColor: "#44A5CB"
    };
    this.window = Ti.UI.createWindow({
      title: "Qiita",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: true,
      navBarHidden: false
    });
    this._createNavbarElement();
    t = Titanium.UI.create2DMatrix().scale(0);
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
            color: "#333",
            font: {
              fontSize: 16,
              fontFamily: 'Rounded M+ 1p'
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
            color: "#333",
            font: {
              fontSize: 12,
              fontFamily: 'Rounded M+ 1p'
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
            color: "#333",
            font: {
              fontSize: 12,
              fontFamily: 'Rounded M+ 1p'
            },
            width: 60,
            height: 15,
            right: 0,
            top: 5
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "contents",
          properties: {
            color: "#333",
            font: {
              fontSize: 12,
              fontFamily: 'Rounded M+ 1p'
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
      templates: {
        template: myTemplate
      },
      defaultItemTemplate: "template"
    });
    testData = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/testData.json");
    file = testData.read().toString();
    json = JSON.parse(file);
    this.refresData(json);
    this.window.add(this.listView);
    return this.window;
  }

  mainWindow.prototype.refresData = function(data) {
    var dataSet, layout, section, sections, _i, _items, _len;
    sections = [];
    section = Ti.UI.createListSection();
    dataSet = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      _items = data[_i];
      layout = {
        properties: {
          height: 100
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
        }
      };
      dataSet.push(layout);
    }
    section.setItems(dataSet);
    sections.push(section);
    return this.listView.setSections(sections);
  };

  mainWindow.prototype._createNavbarElement = function() {
    var windowTitle;
    windowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "Qiita"
    });
    this.window.setTitleControl(windowTitle);
  };

  return mainWindow;

})();

module.exports = mainWindow;
