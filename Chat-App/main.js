const { app, BrowserWindow, nativeImage, Tray,Menu } = require('electron');
// const {CapacitorSplashScreen,configCapacitor}= require('@capacitor/electron');
  // const isDevMode = require('electron-is-dev');
  const Store = require('electron-store');
  const store = new Store();
const { ipcMain } = require("electron");
const { session } = require("electron");
const path = require('path');
const Badge = require('electron-windows-badge');
const url = require('url');
 const { autoUpdater } = require('electron-updater');
// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;
active:Boolean=false
// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = false;



// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [
  {
    label: 'Options',
    submenu: [
      {
        label: 'Open Dev Tools',
        click() {
          mainWindow.openDevTools();
        },
      },
    ],
  },
];
let top = {}; // prevent gc to keep windows
async function createWindow () {
  // Define our main window size
  top.win = new BrowserWindow({
    height: 920,
    width: 1600,
    icon:"./src/assets/JeeChat.png",
    // show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      
      contextIsolation: false,
      // preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    }
  });

  top.win.setMenuBarVisibility(false)
// configCapacitor(mainWindow);

 
// top.win.webContents.openDevTools();
  // if(useSplashScreen) {
  //   splashScreen = new CapacitorSplashScreen(mainWindow);
  //   splashScreen.init(false);
  
  // } else {
   
    // mainWindow.loadFile("./");
    const startUrl = url.format({
      pathname: path.join(__dirname, '/dist/index.html'),
      protocol: 'file:',
      slashes: true
  });
  top.win.loadURL(startUrl);
   top.win.set
 new Badge(top.win);
 top.win.once ('ready-to-show', () => { 
  autoUpdater.checkForUpdatesAndNotify (); 
});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
// app.on('ready', createWindow);
app.on('ready', () => {
  app.setAppUserModelId("Thông Báo");
 // app.setAppUserModelId(process.execPath);
 createWindow();
 top.win.on("close", ev => {
  //console.log(ev);
  ev.sender.hide();
  ev.preventDefault(); // prevent quit process
});
top.tray = new Tray(nativeImage.createEmpty());
const menu = Menu.buildFromTemplate([
    {label: "Actions", submenu: [
        {label: "OpenJeechat", click: (item, window, event) => {
            //console.log(item, event);
              // console.log("CCCC")
            top.win.show();
          
        }},
    ]},
    
    {type: "separator"},
    {role: "quit"}, // "role": system prepared action menu
]);

top.tray.setToolTip("JeeChat");
//top.tray.setTitle("Tray Example"); // macOS only
top.tray.setContextMenu(menu);

top.tray.on('click', () => {
 top.win.show();
});
// Option: some animated web site to tray icon image
// see: https://electron.atom.io/docs/tutorial/offscreen-rendering/
top.icons = new BrowserWindow({
    show: false, webPreferences: {offscreen: true}});
top.icons.loadURL("https://cdn.jee.vn/jee-chat/File/JeeChat102466329.png");
top.icons.webContents.on("paint", (event, dirty, image) => {
    if (top.tray) top.tray.setImage(image.resize({width: 16, height: 16}));
});
});

app.on("before-quit", ev => {
  // BrowserWindow "close" event spawn after quit operation,
  // it requires to clean up listeners for "close" event
  top.win.removeAllListeners("close");
  // release windows
  top = null;
});
// Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     // app.quit();
//     app.hide();
   
//   }
// });

// app.setBadgeCount(1)

app.on('browser-window-blur', () => {
  // Your code
  this.active=false;
  console.log("HHHHHHHHHHHH", this.active)
  store.set('active',false);
  // top.win.setProgressBar(1);
})

app.on('browser-window-focus', () => {
  // Your code
  this.active=true;
  top.win.setProgressBar(0);
   console.log("focusCCCCCCCCCCCC", this.active)
   store.set('active',true);
})
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (top.win === null) {
    createWindow();
  }


  
});

ipcMain.on("get-cookie-sync", (event, arg) => {
  //get cookie based on arg

  session.defaultSession.cookies
    .get(arg)
    .then((cookies) => {
      event.returnValue =cookies
    })
    .catch((error) => {
      console.log(error)
      event.returnValue=undefined
    });
  
});

ipcMain.on("set-cookie-sync", (event, arg) => {
  //get cookie based on arg
  session.defaultSession.cookies.set(arg)
  .then(() => {
    // success
    event.returnValue =true
  }, (error) => {
    console.error(error)
    event.returnValue =false
  })
  
});


ipcMain.on("delete-cookie-sync", (event, arg) => {
session.defaultSession.clearStorageData({storages: ['cookies']})
        .then(() => {
            // console.log('All cookies cleared');
        })
        .catch((error) => {
            console.error('Failed to clear cookies: ', error);
        });

      });

ipcMain.on("Open-notify-mesage", (event, data) => {
  top.win.show();
 });

ipcMain.on("setProgressBarWindows", (event, data) => {
  top.win.setProgressBar(1);
 });




 ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
autoUpdater.on ('update-available', () => { 
  console.log("Sự kiên update")
  mainWindow.webContents.send ('update_available'); 
});
autoUpdater.on ('update-download', () => { 
  console.log("Sự kiên download")
  mainWindow.webContents.send ('update_downloaded'); 
});
ipcMain.on ('restart_app', () => { 
  autoUpdater.quitAndInstall (); 
});
// Define any IPC or other custom functionality below here
