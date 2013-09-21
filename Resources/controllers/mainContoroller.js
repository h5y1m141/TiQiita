var mainContoroller,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mainContoroller = (function() {

  function mainContoroller() {
    this.stockItem = __bind(this.stockItem, this);

    var Hatena, Qiita;
    Hatena = require("model/hatena");
    this.hatena = new Hatena();
    Qiita = require("model/qiita");
    this.qiita = new Qiita();
    this.tabSetting = {
      "iphone": {
        "main": {
          "windowName": "mainWindow"
        }
      },
      "android": {
        "main": {
          "windowName": "mainWindow"
        }
      }
    };
    this.networkDisconnectedMessage = "ネットワーク接続出来ません。ネットワーク設定を再度ご確認ください";
    this.authenticationFailMessage = "ユーザIDかパスワードに誤りがあるためログインできません";
  }

  mainContoroller.prototype.createTabGroup = function() {
    var MainWindow, mainTab, mainWindow, osname, tabGroup;
    tabGroup = Ti.UI.createTabGroup({
      tabsBackgroundColor: "#f9f9f9",
      shadowImage: "ui/image/shadowimage.png",
      tabsBackgroundImage: "ui/image/tabbar.png",
      activeTabBackgroundImage: "ui/image/activetab.png",
      activeTabIconTint: "#fffBD5"
    });
    tabGroup.addEventListener('focus', function(e) {
      tabGroup._activeTab = e.tab;
      tabGroup._activeTabIndex = e.index;
      if (tabGroup._activeTabIndex === -1) {
        return;
      }
      return Ti.API._activeTab = tabGroup._activeTab;
    });
    osname = Ti.Platform.osname;
    MainWindow = require("ui/" + osname + "/mainWindow");
    mainWindow = new MainWindow();
    mainTab = Titanium.UI.createTab({
      window: mainWindow,
      windowName: this.tabSetting[osname].main.windowName
    });
    tabGroup.addTab(mainTab);
    return tabGroup.open();
  };

  mainContoroller.prototype.qiitaLogin = function() {
    var param,
      _this = this;
    param = {
      url_name: Ti.App.Properties.getString('QiitaLoginID'),
      password: Ti.App.Properties.getString('QiitaLoginPassword')
    };
    Ti.API.debug("[INFO] login start.");
    return this.qiita._auth(param, function(token) {
      Ti.API.debug("token is " + token);
      if (token === null) {
        return alert("ユーザIDかパスワードが間違ってます");
      } else {
        alert("認証出来ました");
        Ti.App.Properties.setString('QiitaLoginID', param.url_name);
        Ti.App.Properties.setString('QiitaLoginPassword', param.password);
        return Ti.App.Properties.setString('QiitaToken', token);
      }
    });
  };

  mainContoroller.prototype.getFeedByTag = function(tagName) {
    var MAXITEMCOUNT, items, moment, momentja, storedTo,
      _this = this;
    storedTo = "followingTag" + tagName;
    items = JSON.parse(Ti.App.Properties.getString(storedTo));
    moment = require('lib/moment.min');
    momentja = require('lib/momentja');
    MAXITEMCOUNT = 20;
    if ((items != null) === false || items === "") {
      return this.qiita.getFeedByTag(tagName, function(result, links) {
        result.sort(function(a, b) {
          if (moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm")) {
            return -1;
          } else {
            return 1;
          }
        });
        Ti.API.info(result.length);
        if (result.length !== MAXITEMCOUNT) {
          return Ti.API.info("loadOldEntry hide");
        } else {
          Ti.API.info(storedTo);
          return _this.refresData(result);
        }
      });
    } else {
      items.sort(function(a, b) {
        if (moment(a.created_at).format("YYYYMMDDHHmm") > moment(b.created_at).format("YYYYMMDDHHmm")) {
          return -1;
        } else {
          return 1;
        }
      });
      return this.refresData(items);
    }
  };

  mainContoroller.prototype.setItems = function() {
    var that;
    that = this;
    return this.qiita.getFeed(function(result) {
      return that.refresData(result);
    });
  };

  mainContoroller.prototype.getFeed = function() {
    var that;
    that = this;
    return this.qiita.getFeed(function(result) {
      return that.refresData(result);
    });
  };

  mainContoroller.prototype.refresData = function(data) {
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
    Ti.API.info(mainListView);
    return mainListView.setSections(sections);
  };

  mainContoroller.prototype.createItems = function(data) {
    var dataSet, layout, rawData, _i, _items, _len;
    dataSet = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      _items = data[_i];
      rawData = _items;
      layout = {
        properties: {
          height: 120,
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

  mainContoroller.prototype.networkConnectionCheck = function(callback) {
    var currentPage;
    if (this.qiita.isConnected() === false) {
      this._alertViewShow(this.networkDisconnectedMessage);
      currentPage = Ti.App.Properties.getString("currentPage");
      Ti.API.info("networkConnectionCheck " + currentPage);
    } else {
      return callback();
    }
  };

  mainContoroller.prototype.authenticationCheck = function(callback) {
    var token;
    token = Ti.App.Properties.getString('QiitaToken');
    if (token === null) {
      return this._alertViewShow(this.authenticationFailMessage);
    } else {
      return callback();
    }
  };

  mainContoroller.prototype.stockItem = function(uuid, url, contents, qiitaPostFlg, hatenaPostFlg, callback) {
    var hatena, hatenaPostResult, qiitaPostResult;
    hatena = this.hatena;
    qiitaPostResult = false;
    hatenaPostResult = false;
    if (qiitaPostFlg === true) {
      return this.qiita.putStock(uuid, function(qiitaresult) {
        var result;
        if (qiitaresult === 'success') {
          qiitaPostResult = true;
        }
        if (hatenaPostFlg === true) {
          return hatena.postBookmark(url, contents, function(hatenaresult) {
            var result;
            Ti.API.info("postBookmark result is " + hatenaresult);
            if (hatenaresult.success) {
              hatenaPostResult = true;
            }
            Ti.API.info("Qiitaとはてブ同時投稿終了。結果は" + qiitaPostResult + "と" + hatenaPostResult + "です");
            result = [qiitaPostResult, hatenaPostResult];
            return callback(result);
          });
        } else {
          result = [qiitaPostResult, hatenaPostResult];
          return callback(result);
        }
      });
    } else {
      if (hatenaPostFlg === true) {
        return hatena.postBookmark(url, contents, function(hatenaresult) {
          var result;
          Ti.API.info("postBookmark result is " + hatenaresult);
          if (hatenaresult.success) {
            hatenaPostResult = true;
          }
          Ti.API.info("はてブ投稿終了。結果は" + qiitaPostResult + "と" + hatenaPostResult + "です");
          result = [qiitaPostResult, hatenaPostResult];
          return callback(result);
        });
      }
    }
  };

  mainContoroller.prototype.sessionItem = function(json) {
    Ti.API.info("start sessionItem. url is " + json.url + ". uuid is " + json.uuid);
    if (json) {
      Ti.App.Properties.setString('stockURL', json.url);
      Ti.App.Properties.setString('stockUUID', json.uuid);
      return Ti.App.Properties.setString('stockID', json.id);
    }
  };

  return mainContoroller;

})();

module.exports = mainContoroller;
