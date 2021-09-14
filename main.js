const electron = require('electron');
const { app, BrowserWindow, Menu, MenuItem, clipboard, Tray, nativeImage, session } = electron;
const rightMenu = require('electron-context-menu');

let win = null;

app.disableHardwareAcceleration();
app.on("ready", () =>
{
  if(process.platform == "darwin")
    win = new BrowserWindow({show: false, titleBarStyle: 'hiddenInset', width: 688, height: 850});
  else
    win = new BrowserWindow({show: false, titleBarStyle: 'hidden', titleBarOverlay: {color: '#000000', symbolColor: '#FFFFFF'}, width: 688, height: 900});
  win.loadURL(`https://twitter.com`);
  var webContents = win.webContents;
  tray = new Tray(nativeImage.createFromPath('twitter.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'TwitterApp', type: 'normal', enabled: false },
    { type: 'separator'},
    { label: '終了', type: 'normal', click: () => { app.quit(); } }
  ]);
  tray.setContextMenu(contextMenu);
  const menu = new Menu();
  menu.append(new MenuItem(
    {
    label: 'TwitterApp',
    submenu: 
      [
        {
          label: '現在のURLをコピー',
          accelerator: process.platform === 'darwin' ? 'Option+C' : 'Alt+C',
          click: () => { clipboard.writeText(webContents.getURL()); }
        },
        {
          label: '拡大',
          role: 'zoomIn'
        },
        {
          label: '縮小',
          role: 'zoomOut'
        },
        {
          label: '拡大率をリセット',
          role: 'resetZoom'
        },
        {
          role: 'toggleDevTools',
          label: '開発者ツールを切り替え'
        },
        {
          role: 'close',
          label: '閉じる'
        },
        {
          label: '終了',
          role: 'quit'
        }
      ]
    },
  ));
  Menu.setApplicationMenu(menu);

  rightMenu
  ({
    prepend: (defaultActions, parameters, browserWindow) =>
    [
      {
        label: '現在のURLをコピー',
        visible: true,
        click: () => {
          clipboard.writeText(win.getURL());
        }
      }
    ],
    showSaveImage: true
  });
  win.once('ready-to-show', () =>
  {
    win.show();
  });
  webContents.on('new-window', (event, url) =>
  {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  webContents.on('page-favicon-updated', () =>
  {
    webContents.insertCSS('* { font-family: roboto, system-ui!important; } ::-webkit-scrollbar { display:none; } header, .r-1h3ijdo { -webkit-app-region: drag!important; user-select: none!important; } .r-6koalj, .r-2eszeu {-webkit-app-region:no-drag!important;} .r-1vvnge1 { padding-top: 30px!important;');
    if(process.platform != "darwin") webContents.insertCSS(".r-obd0qt.r-s8bhmr { margin-right:130px!important; }")
  });

  win.on("closed", () =>
  {
    win = null;
  });
});

app.on("window-all-closed", () =>
{
  app.quit();
})