var TiGaussianFilterView = require('net.uchidak.tigfview');
Ti.API.info("module is => " + TiGaussianFilterView);

var win = Ti.UI.createWindow({
    backgroundColor : '#f8f8f8'
});

var main = Ti.UI.createView({
    width : Ti.UI.FILL,
    height : Ti.UI.FILL,
    layout : 'vertical'
});

var mask = Ti.UI.createView({
    width : Ti.UI.FILL,
    height : Ti.UI.FILL,
    backgroundColor : '#95a5a6',
    opacity : 0.72
});

var label = Ti.UI.createLabel({
    top : 10,
    width : 300,
    height : 44,
    backgroundColor : '#2ecc71',
    text : 'I LOVE Ti',
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    font : {
        fontSize : 24
    },
    rasterizationScale : 0.5,
    shouldRasterize : true,
    kCAFilterTrilinear : true,
});

var image = Ti.UI.createImageView({
    top : 10,
    width : 100,
    height : 100,
    image : 'http://uchidak.net/wp-content/uploads/2013/06/iconsample-300x300.png',
    rasterizationScale : 0.5,
    shouldRasterize : true,
    kCAFilterTrilinear : true,
    kCAFilterNearest : true
});

var button = Ti.UI.createButton({
    top : 10,
    width : 300,
    height : 44,
    title : 'Button',
    rasterizationScale : 0.5,
    shouldRasterize : true,
    kCAFilterTrilinear : true
});

var table = Ti.UI.createTableView({
    top : 10,
    width : 300,
    height : Ti.UI.SIZE,
    data : [{
        title : 'foo'
    }, {
        title : 'bar'
    }, {
        title : 'foo'
    }],
    backgroundColor : '#ccc',
    rasterizationScale : 0.5,
    shouldRasterize : true,
    kCAFilterTrilinear : true
});

main.add(label);
main.add(image);
main.add(button);
main.add(table);

win.add(main);
win.add(mask);

win.open();
