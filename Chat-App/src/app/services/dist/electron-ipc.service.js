"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ElectronIpcService = void 0;
var core_1 = require("@angular/core");
//const electron=<any>window;
var electron = window.require('electron');
var Store = window.require('electron-store');
var store = new Store();
var ElectronIpcService = /** @class */ (function () {
    function ElectronIpcService() {
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
    ElectronIpcService.prototype.setBadgeWindow = function (count) {
        electron.ipcRenderer.sendSync('update-badge', count);
    };
    ElectronIpcService.prototype.DeleteBadgeWindow = function () {
        electron.ipcRenderer.sendSync('update-badge', null);
    };
    ElectronIpcService.prototype.OpenAppNotify = function () {
        //console.log(electron.ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
        //angular-> electron
        electron.ipcRenderer.send('Open-notify-mesage');
    };
    ElectronIpcService.prototype.setCookie = function (cookie) {
        return electron.ipcRenderer.sendSync('set-cookie-sync', cookie);
    };
    ElectronIpcService.prototype.getCookie = function () {
        return electron.ipcRenderer.sendSync('get-cookie-sync');
    };
    ElectronIpcService.prototype.DeleteCookie = function () {
        return electron.ipcRenderer.send('delete-cookie-sync');
    };
    ElectronIpcService.prototype.setProgressBarWindows = function () {
        return electron.ipcRenderer.send('setProgressBarWindows');
    };
    ElectronIpcService.prototype.activeWindows = function () {
        return electron.ipcRenderer.send('activeWindows');
    };
    ElectronIpcService.prototype.setIdGroup = function (IdGroup) {
        store.set('idgroup', IdGroup);
        // return electron.ipcRenderer.send('set-idgroup-sync', IdGroup)
    };
    ElectronIpcService.prototype.getIdGroup = function () {
        return store.get('idgroup');
    };
    ElectronIpcService.prototype.getActiveApp = function () {
        return store.get('active');
    };
    ElectronIpcService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ElectronIpcService);
    return ElectronIpcService;
}());
exports.ElectronIpcService = ElectronIpcService;
