import { Injectable } from '@angular/core';
//const electron=<any>window;
const electron = (<any>window).require('electron');
const Store = (<any>window).require('electron-store');

const store = new Store();
@Injectable({
  providedIn: 'root'
})
export class ElectronIpcService {

  asyncReplyResult
  
  constructor() {

    ////electron -> angular
    // electron.ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log('async')
    //   console.log(arg) // prints "pong"
    //   this.asyncReplyResult=arg
    // })
    
   }

  // test(val) {
  //   //console.log(electron.ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  //   //angular-> electron
  //   electron.ipcRenderer.send('asynchronous-message', val)
  // }
  setBadgeWindow(count:number)
  {
    electron.ipcRenderer.sendSync('update-badge', count);
  }
  DeleteBadgeWindow()
{
  electron.ipcRenderer.sendSync('update-badge', null);
}

  OpenAppNotify() {
    //console.log(electron.ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
    //angular-> electron
  
    electron.ipcRenderer.send('Open-notify-mesage')
  }
  setCookie(cookie){
    return electron.ipcRenderer.sendSync('set-cookie-sync', cookie)
  }

  getCookie(){
    return electron.ipcRenderer.sendSync('get-cookie-sync')
  }
  DeleteCookie()
  {
    return electron.ipcRenderer.send('delete-cookie-sync')
    
  }
setProgressBarWindows()
{
  return electron.ipcRenderer.send('setProgressBarWindows')
}
activeWindows()
{
  return electron.ipcRenderer.send('activeWindows')
}
  
  setIdGroup(IdGroup){
   
    store.set('idgroup', IdGroup);
    // return electron.ipcRenderer.send('set-idgroup-sync', IdGroup)
  }

  getIdGroup(){
    
    return  store.get('idgroup')
  }
  getActiveApp(){
    
    return  store.get('active')
  }
  
}
