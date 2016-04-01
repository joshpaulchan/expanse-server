'esversion: 6';
'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;

// Keep a global reference of the window and tray objects, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let trayIcon;
let trayMenu;

var windows = {
    0: {
        obj: null,
        template: 'file://' + __dirname + '/templates/window.html'
    },
    1: {
        obj: null,
        template: 'file://' + __dirname + '/templates/gestures.html'
    },
    2: {
        obj: null,
        template: 'file://' + __dirname + '/templates/options.html'
    }
};

var winOpts = {
    "useContentSize": true,
    "skipTaskbar": true,
    "width": 480,
    "height": 320
};

var initialize = function() {
    // initialize the app
    
    // create the tray icon
    trayIcon = new Tray(__dirname + '/img/icon.png');
    
    // define the menu item templates for the tray icon
    var template = [
        {
            "label": "Windows",
            "id": 0
        },
        {
            "label": "Gestures",
            "id": 1
        },
        {
            "label": "Options",
            "id": 2
        },
        {
            "label": "Divider",
            "type": "separator"
        }
    ];
    
    // assign the click functions to the item
    template = template.map(function(menuItem) {
        if (typeof menuItem.id !== 'undefined') {
            menuItem.click = function(menuItem, BrowserWindow) {
                showWindow(menuItem.id);    
            };
        }
        return menuItem;
    });
    
    // Add exit command
    template.push({
        "label": "Exit",
        "click": function(mi, bw) {
            app.quit();
        }
    });
    
    trayMenu = new Menu.buildFromTemplate(template);
    
    trayIcon.setToolTip("Status: ONLINE");
    trayIcon.setContextMenu(trayMenu);
    
    if (process.platform == 'darwin') {
        app.dock.hide();
    }
    
    // Notification.requestPermission();
    // var n = new Notification('Expanse', {
    //     body: 'Expanse is ready.'
    // });
};

var showWindow = function(id) {
    // if id is not supported, exit
    if (!(id in Object.keys(windows))) {
        // console.log("Menu item '" + id + "' not supported.");
        return;
    }
    
    var win = windows[id];
    if (typeof win.obj === 'undefined' || win.obj === null) {
        win = new BrowserWindow(winOpts);
        win.loadURL(windows[id].template);
        win.on('closed', function() {
            windows[id].obj = null;
        });
        windows[id].obj = win;
        // console.log(windows);
    } else {
        win.obj.focus();
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', initialize);

// Don't quit all windows are closed.
app.on('window-all-closed', function() {});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
