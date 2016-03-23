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
let mainWindow;
let selectWindow = null;
var windows = [];
const windowOptions = {
    "useContentSize": true,
    "skipTaskbar": true
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
    
    app.dock.hide();
    
};

var showWindow = function(id) {
    switch (id) {
        case 0:
            if (selectWindow == null) {
                selectWindow = new BrowserWindow();
                selectWindow.loadUrl('file://' + __dirname + '/templates/window.html');
                selectWindow.on('closed', function() {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    selectWindow = null;
                });
            } else {
                selectWindow.focus();
            }
            break;
        default:
            console.log("MenuItem '" + id + "' not supported.");
            break;
    }
};

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    // selectWindow = new BrowserWindow();
    
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    // selectWindow.loadUrl('file://' + __dirname + '/templates/window.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // selectWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

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
