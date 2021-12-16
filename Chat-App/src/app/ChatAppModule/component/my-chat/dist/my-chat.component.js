"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyChatComponent = void 0;
var layout_utils_service_1 = require("./../../../crud/utils/layout-utils.service");
var core_1 = require("@angular/core");
var create_convesation_group_component_1 = require("../create-convesation-group/create-convesation-group.component");
var create_conversation_user_component_1 = require("../create-conversation-user/create-conversation-user.component");
var call_video_component_1 = require("../call-video/call-video.component");
var NotifyMess_1 = require("../../models/NotifyMess");
var MyChatComponent = /** @class */ (function () {
    function MyChatComponent(auth, messageService, router, _sanitizer, titleService, changeDetectorRefs, translate, chatService, socketService, conversationServices, presence, notify, _ngZone, layoutUtilsService, dialog, soundsevices, electron_services) {
        var _this = this;
        this.auth = auth;
        this.messageService = messageService;
        this.router = router;
        this._sanitizer = _sanitizer;
        this.titleService = titleService;
        this.changeDetectorRefs = changeDetectorRefs;
        this.translate = translate;
        this.chatService = chatService;
        this.socketService = socketService;
        this.conversationServices = conversationServices;
        this.presence = presence;
        this.notify = notify;
        this._ngZone = _ngZone;
        this.layoutUtilsService = layoutUtilsService;
        this.dialog = dialog;
        this.soundsevices = soundsevices;
        this.electron_services = electron_services;
        this._subscriptions = [];
        this.dem = 0;
        this.active = false;
        this.listApp = [];
        this.lstUserOnline = [];
        this.lstContact = [];
        this.myFiles = [];
        // mở khung chat tự động
        // unReadMessageFromSenderUsername(IdGroup: any) {
        //   let index =this.lstContact.findIndex(x=>x.IdGroup==IdGroup);
        //   if(index>=0&&this.lstContact[index].Active===1&&this.lstContact[index].isGroup==false
        //     )
        //   {
        //     this.chatService.UpdateUnRead(IdGroup,"read").subscribe(res=>{
        //       if(res.status===1)
        //       {
        //       }
        //       else
        //       {
        //         return;
        //       }
        //     })
        //   }
        //   else{
        //     //Update unread
        //     this.chatService.UpdateUnRead(IdGroup,"unread").subscribe(res=>{
        //       if(res.status===1)
        //       {
        //       }
        //       else
        //       {
        //         return;
        //       }
        //     })
        //   }
        //   if(index>=0&&this.lstContact[index].isGroup==true)
        //   {
        //   }
        // }
        this.loadUnreadList = new core_1.EventEmitter();
        // đọc tất cả tin nhắn
        this.listAllread = [];
        this.listunread = [];
        this.listTam = [];
        var user = this.auth.getAuthFromLocalStorage()['user'];
        this.name = user['customData']['personalInfo']['Fullname'];
        this.Avatar = user['customData']['personalInfo']['Avatar'];
        this.BgColor = user['customData']['personalInfo']['BgColor'];
        this.UserId = user['customData']['jee-account']['userID'];
        this.customerID = user['customData']['jee-account']['customerID'];
        var dt = this.auth.getAuthFromLocalStorage();
        this.userCurrent = dt.user.username;
        var sb = this.presence.OpenmessageUsername$.subscribe(function (data) {
            // console.log("BBBBBBBBBBBBBBBBBB",data)
            // if(data[0].UserName!==this.userCurrent)
            // {
            _this.unReadMessageFromSenderUsername(data);
            // }
        });
        this._subscriptions.push(sb);
    }
    MyChatComponent.prototype.CheckActiveNotify = function (IdGroup) {
        var index = this.lstContact.findIndex(function (x) { return x.IdGroup == IdGroup; });
        if (index >= 0) {
            return true;
        }
        else {
            return false;
        }
    };
    MyChatComponent.prototype.getClass = function (item) {
        return item > 0 ? 'unread lastmess' : 'lastmess';
    };
    MyChatComponent.prototype.getFileDetails = function (e) {
        for (var i = 0; i < e.target.files.length; i++) {
            this.myFiles.push(e.target.files[i]);
        }
    };
    MyChatComponent.prototype.UploadVideo = function () {
        var frmData = new FormData();
        frmData.append("file", this.myFiles[0], this.myFiles[0].name);
        this.chatService.UploadVideo(frmData).subscribe(function (res) {
        });
    };
    MyChatComponent.prototype.quanlytaikhoan = function () {
        window.open("https://app.jee.vn/ThongTinCaNhan", "_blank");
    };
    MyChatComponent.prototype.unReadMessageFromSenderUsername = function (datanotifi) {
        var _this = this;
        var active = this.electron_services.getActiveApp();
        console.log("datanotifi", datanotifi);
        var isGroup;
        //  console.log("KKKKKKKKKKKKKKKKKK",this.electron_services.getIdGroup())
        var chatgroup = Number.parseInt(this.electron_services.getIdGroup());
        console.log("chatgroup", chatgroup);
        var index = this.lstContact.findIndex(function (x) { return x.IdGroup == datanotifi[0].IdGroup; });
        if (index >= 0) {
            isGroup = this.lstContact[index].isGroup;
        }
        var sb = this.messageService.Newmessage.subscribe(function (res) {
            // console.log('RRRRRRRRR',res)
            if (res && res !== undefined && res.length > 0) {
                var vitri = _this.lstContact.findIndex(function (x) { return x.IdGroup == res[0].IdGroup; });
                if (vitri > 0) {
                    _this.lstContact.unshift(_this.lstContact[vitri]);
                    _this.lstContact.splice(vitri + 1, 1);
                    _this.lstContact[0].LastMess.splice(0, 1, res[0]);
                    _this.ScrollToTop();
                    _this.changeDetectorRefs.detectChanges();
                }
                else {
                    _this.lstContact[0].LastMess.splice(0, 1, res[0]);
                }
            }
            else {
                var vitri = _this.lstContact.findIndex(function (x) { return x.IdGroup == datanotifi[0].IdGroup; });
                if (vitri > 0 && vitri !== 0) {
                    _this.lstContact.unshift(_this.lstContact[vitri]);
                    _this.lstContact.splice(vitri + 1, 1);
                    _this.ScrollToTop();
                    _this.changeDetectorRefs.detectChanges();
                }
            }
        });
        this._subscriptions.push(sb);
        //  }
        // phần danh cho TH
        if (isGroup) {
            if (chatgroup.toString() !== datanotifi[0].IdGroup.toString() && this.userCurrent !== datanotifi[0].UserName) {
                var sb_1 = this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup, this.userCurrent, "unread").subscribe(function (res) {
                    if (res.status === 1) {
                        var sbs_1 = _this.chatService.GetUnreadMessInGroup(datanotifi[0].IdGroup, _this.UserId).subscribe(function (res) {
                            if (_this.lstContact[index].UnreadMess == null || _this.lstContact[index].UnreadMess == 0) {
                                _this.dem += 1;
                                // this.soundsevices.playAudioMessage();
                                _this.electron_services.setBadgeWindow(_this.dem);
                                // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
                                var data = _this.auth.getAuthFromLocalStorage();
                                if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0) {
                                    _this.contentnotfy = "Gửi một file đính kèm";
                                }
                                else {
                                    _this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
                                }
                                _this.chatService.publishMessNotifiGroup(data.access_token, datanotifi[0].IdGroup, _this.contentnotfy, datanotifi[0].InfoUser[0].Fullname).subscribe(function (res) {
                                    var customevent = new CustomEvent("newMessage", {
                                        detail: {
                                            UserId: datanotifi[0].InfoUser[0].ID_user,
                                            username: datanotifi[0].InfoUser[0].Username,
                                            IdGroup: datanotifi[0].IdGroup,
                                            isGroup: true,
                                            title: datanotifi[0].TenNhom,
                                            avatar: '../../../../assets/JeeChat.png',
                                            message: datanotifi[0].InfoUser[0].Fullname + ":" + _this.contentnotfy,
                                            myservice: _this.chatService //passing SettingsService reference
                                        },
                                        bubbles: true,
                                        cancelable: true
                                    });
                                    event.target.dispatchEvent(customevent); //dispatch custom event
                                    if (_this.CheckActiveNotify(datanotifi[0].IdGroup)) {
                                        desktop_notify(customevent);
                                        _this.electron_services.setProgressBarWindows();
                                    }
                                });
                            }
                            // console.log("this.lstContact[index].UnreadMess",this.lstContact[index].UnreadMess)
                            // console.log("res.data[0].slunread",res.data[0].slunread)
                            if (_this.lstContact[index].UnreadMess != 0 && _this.lstContact[index].UnreadMess < res.data[0].slunread && _this.userCurrent !== datanotifi[0].UserName) {
                                console.log("Noti vào chỗ này");
                                // this.soundsevices.playAudioMessage();
                                var data = _this.auth.getAuthFromLocalStorage();
                                if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0) {
                                    _this.contentnotfy = "Gửi một file đính kèm";
                                }
                                else {
                                    _this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
                                }
                                _this.chatService.publishMessNotifiGroup(data.access_token, datanotifi[0].IdGroup, _this.contentnotfy, datanotifi[0].InfoUser[0].Fullname).subscribe(function (res) {
                                });
                                var vitriafter = _this.lstContact.findIndex(function (x) { return x.IdGroup == datanotifi[0].IdGroup; });
                                _this.lstContact[vitriafter].UnreadMess = res.data[0].slunread;
                                var customevent = new CustomEvent("newMessage", {
                                    detail: {
                                        UserId: datanotifi[0].InfoUser[0].ID_user,
                                        username: datanotifi[0].InfoUser[0].Username,
                                        IdGroup: datanotifi[0].IdGroup,
                                        isGroup: true,
                                        title: datanotifi[0].TenNhom,
                                        avatar: '../../../../assets/JeeChat.png',
                                        message: datanotifi[0].InfoUser[0].Fullname + ":" + _this.contentnotfy,
                                        myservice: _this.chatService //passing SettingsService reference
                                    },
                                    bubbles: true,
                                    cancelable: true
                                });
                                event.target.dispatchEvent(customevent); //dispatch custom event
                                if (_this.CheckActiveNotify(datanotifi[0].IdGroup)) {
                                    desktop_notify(customevent);
                                    _this.electron_services.setProgressBarWindows();
                                }
                            }
                            _this.lstContact[0].UnreadMess = res.data[0].slunread;
                            _this._subscriptions.push(sbs_1);
                            _this.changeDetectorRefs.detectChanges();
                        });
                    }
                });
            }
            else if (this.userCurrent == datanotifi[0].UserName) {
                // dành cho trường hợp offline
                setTimeout(function () {
                    var useroffline = [];
                    var userpusnotify = [];
                    var vitritb = _this.lstContact.findIndex(function (x) { return x.IdGroup == datanotifi[0].IdGroup; });
                    if (_this.lstUserOnline.length > 0) {
                        _this.lstUserOnline.forEach(function (element) {
                            useroffline = _this.lstContact[vitritb].ListMember.filter(function (word) { return word.Username != element.Username && word.Username != _this.userCurrent; });
                            // for(let i=0;i<this.lstContact[vitritb].ListMember.length;i++)
                            // {
                            //     if(element.Username!=this.lstContact[vitritb].ListMember[i].Username)
                            //     {
                            //       useroffline.push(this.lstContact[vitritb].ListMember[i].Username)
                            //     }
                            // }
                        });
                        useroffline.forEach(function (element) {
                            userpusnotify.push(element.Username);
                        });
                    }
                    else {
                        useroffline = _this.lstContact[vitritb].ListMember.filter(function (word) { return word.Username != _this.userCurrent; });
                        useroffline.forEach(function (element) {
                            userpusnotify.push(element.Username);
                        });
                    }
                    _this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup, _this.userCurrent, "read").subscribe(function (res) {
                        if (res.status === 1) {
                            if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0) {
                                _this.contentnotfy = "Gửi một file đính kèm";
                            }
                            else {
                                _this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
                            }
                            var data = _this.auth.getAuthFromLocalStorage();
                            var us = new NotifyMess_1.UserModelGroup();
                            us.lstUserTbGroup = userpusnotify;
                            _this.chatService.publishMessNotifiGroupOffline(data.access_token, us, datanotifi[0].IdGroup, _this.contentnotfy, datanotifi[0].InfoUser[0].Fullname).subscribe(function (res) {
                            });
                        }
                        else {
                            console.log("Eror update status message");
                        }
                    });
                }, 2000);
            }
            // phần dành cho active windows
            if (chatgroup.toString() !== datanotifi[0].IdGroup.toString() && this.userCurrent !== datanotifi[0].UserName) {
                var sb_2 = this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup, this.userCurrent, "unread").subscribe(function (res) {
                    if (res.status === 1) {
                        var sbs_2 = _this.chatService.GetUnreadMessInGroup(datanotifi[0].IdGroup, _this.UserId).subscribe(function (res) {
                            if (_this.lstContact[index].UnreadMess == null || _this.lstContact[index].UnreadMess == 0) {
                                _this.dem += 1;
                                // this.soundsevices.playAudioMessage();
                                _this.electron_services.setBadgeWindow(_this.dem);
                                // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
                                var data = _this.auth.getAuthFromLocalStorage();
                                if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0) {
                                    _this.contentnotfy = "Gửi một file đính kèm";
                                }
                                else {
                                    _this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
                                }
                                _this.chatService.publishMessNotifiGroup(data.access_token, datanotifi[0].IdGroup, _this.contentnotfy, datanotifi[0].InfoUser[0].Fullname).subscribe(function (res) {
                                    var customevent = new CustomEvent("newMessage", {
                                        detail: {
                                            UserId: datanotifi[0].InfoUser[0].ID_user,
                                            username: datanotifi[0].InfoUser[0].Username,
                                            IdGroup: datanotifi[0].IdGroup,
                                            isGroup: true,
                                            title: datanotifi[0].TenNhom,
                                            avatar: '../../../../assets/JeeChat.png',
                                            message: datanotifi[0].InfoUser[0].Fullname + ":" + _this.contentnotfy,
                                            myservice: _this.chatService //passing SettingsService reference
                                        },
                                        bubbles: true,
                                        cancelable: true
                                    });
                                    event.target.dispatchEvent(customevent); //dispatch custom event
                                    if (_this.CheckActiveNotify(datanotifi[0].IdGroup)) {
                                        desktop_notify(customevent);
                                        _this.electron_services.setProgressBarWindows();
                                    }
                                });
                            }
                            // console.log("this.lstContact[index].UnreadMess",this.lstContact[index].UnreadMess)
                            // console.log("res.data[0].slunread",res.data[0].slunread)
                            if (_this.lstContact[index].UnreadMess != 0 && _this.lstContact[index].UnreadMess < res.data[0].slunread && _this.userCurrent !== datanotifi[0].UserName) {
                                console.log("Noti vào chỗ này");
                                // this.soundsevices.playAudioMessage();
                                var data = _this.auth.getAuthFromLocalStorage();
                                if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0) {
                                    _this.contentnotfy = "Gửi một file đính kèm";
                                }
                                else {
                                    _this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
                                }
                                _this.chatService.publishMessNotifiGroup(data.access_token, datanotifi[0].IdGroup, _this.contentnotfy, datanotifi[0].InfoUser[0].Fullname).subscribe(function (res) {
                                });
                                var vitriafter = _this.lstContact.findIndex(function (x) { return x.IdGroup == datanotifi[0].IdGroup; });
                                _this.lstContact[vitriafter].UnreadMess = res.data[0].slunread;
                                var customevent = new CustomEvent("newMessage", {
                                    detail: {
                                        UserId: datanotifi[0].InfoUser[0].ID_user,
                                        username: datanotifi[0].InfoUser[0].Username,
                                        IdGroup: datanotifi[0].IdGroup,
                                        isGroup: true,
                                        title: datanotifi[0].TenNhom,
                                        avatar: '../../../../assets/JeeChat.png',
                                        message: datanotifi[0].InfoUser[0].Fullname + ":" + _this.contentnotfy,
                                        myservice: _this.chatService //passing SettingsService reference
                                    },
                                    bubbles: true,
                                    cancelable: true
                                });
                                event.target.dispatchEvent(customevent); //dispatch custom event
                                if (_this.CheckActiveNotify(datanotifi[0].IdGroup)) {
                                    desktop_notify(customevent);
                                    _this.electron_services.setProgressBarWindows();
                                }
                            }
                            _this.lstContact[0].UnreadMess = res.data[0].slunread;
                            _this._subscriptions.push(sbs_2);
                            _this.changeDetectorRefs.detectChanges();
                        });
                    }
                });
                this._subscriptions.push(sb_2);
            }
        }
        else {
            // cần check ở chỗ này
            // dành cho user lúc online
            if (chatgroup.toString() != datanotifi[0].IdGroup.toString()) {
                if (index >= 0 && this.userCurrent !== datanotifi[0].UserName) {
                    this.chatService.UpdateUnRead(datanotifi[0].IdGroup, this.UserId, "unread").subscribe(function (res) {
                        if (res.status === 1) {
                            _this.chatService.GetUnreadMess(datanotifi[0].IdGroup).subscribe(function (res) {
                                if (_this.lstContact[index].UnreadMess == null || _this.lstContact[index].UnreadMess == 0) {
                                    _this.dem += 1;
                                    _this.electron_services.setBadgeWindow(_this.dem);
                                    // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
                                }
                                if (_this.lstContact[index].UnreadMess < res.data[0].slunread) {
                                    // this.soundsevices.playAudioMessage();
                                    var data = _this.auth.getAuthFromLocalStorage();
                                    if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0) {
                                        _this.contentnotfy = "Gửi một file đính kèm";
                                    }
                                    else {
                                        _this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
                                    }
                                    _this.chatService.publishMessNotifi(data.access_token, datanotifi[0].IdGroup, _this.contentnotfy, datanotifi[0].InfoUser[0].Fullname, datanotifi[0].InfoUser[0].Avatar).subscribe(function (res) {
                                    });
                                }
                                var customevent = new CustomEvent("newMessage", {
                                    detail: {
                                        UserId: datanotifi[0].InfoUser[0].ID_user,
                                        username: datanotifi[0].InfoUser[0].Username,
                                        IdGroup: datanotifi[0].IdGroup,
                                        isGroup: false,
                                        title: datanotifi[0].InfoUser[0].Fullname,
                                        avatar: datanotifi[0].InfoUser[0].Avatar,
                                        message: _this.contentnotfy,
                                        myservice: _this.chatService //passing SettingsService reference
                                    },
                                    bubbles: true,
                                    cancelable: true
                                });
                                event.target.dispatchEvent(customevent); //dispatch custom event
                                console.log("this.CheckActiveNotify(datanotifi[0].IdGroup)", _this.CheckActiveNotify(datanotifi[0].IdGroup));
                                if (_this.CheckActiveNotify(datanotifi[0].IdGroup)) {
                                    desktop_notify(customevent);
                                    _this.electron_services.setProgressBarWindows();
                                }
                                // sẽ đưa lên đầu tiên và + thêm số lượng
                                _this.lstContact[0].UnreadMess = res.data[0].slunread;
                                _this.changeDetectorRefs.detectChanges();
                            });
                        }
                        else {
                            return;
                        }
                    });
                }
                // else
                // {
                //   this.chatService.UpdateUnReadGroup(IdGroup, this.userCurrent,"unread").subscribe(res=>{
                //     if(res.status===1)
                //     {
                //     }
                //     else
                //     {
                //       return;
                //     }
                //   })
                // }
            }
            else {
                // dành cho user lúc offline
                var check = this.lstUserOnline.findIndex(function (x) { return x.Username == _this.lstContact[0].Username; });
                if (check < 0) {
                    this.chatService.UpdateUnRead(datanotifi[0].IdGroup, this.lstContact[index].UserId, "unread").subscribe(function (res) {
                        if (res.status === 1) {
                            var data = _this.auth.getAuthFromLocalStorage();
                            var conent = void 0;
                            if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0) {
                                conent = "Gửi một file đính kèm";
                            }
                            else {
                                conent = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
                            }
                            _this.chatService.publishMessNotifiOfline(data.access_token, datanotifi[0].IdGroup, conent, datanotifi[0].InfoUser[0].Fullname, datanotifi[0].InfoUser[0].Avatar).subscribe(function (res) {
                            });
                            // let noti={
                            //   title:datanotifi[0].InfoUser[0].Fullname,
                            //   avatar:datanotifi[0].InfoUser[0].Avatar,
                            //   message:this.contentnotfy
                            // }
                            //  this.electron_services.Notify(noti)
                        }
                        else {
                            return;
                        }
                    });
                }
            }
        }
    };
    MyChatComponent.prototype.UpdateUnreadMess = function (IdGroup, UserId, count) {
        if (this.searchText) {
            this.searchText = "";
        }
        this.electron_services.setIdGroup(IdGroup);
        // localStorage.setItem('chatGroup', JSON.stringify(IdGroup));
        if (count > 0) {
            var index = this.lstContact.findIndex(function (x) { return x.IdGroup == IdGroup; });
            this.lstContact[index].UnreadMess = 0;
            if (this.dem > 0) {
                this.dem = this.dem - 1;
            }
            this.electron_services.setBadgeWindow(this.dem);
            this.chatService.UpdateUnRead(IdGroup, UserId, "read").subscribe(function (res) {
                if (res) {
                }
                else {
                    console.log("Eror");
                }
            });
            this.changeDetectorRefs.detectChanges();
        }
    };
    MyChatComponent.prototype.UpdateUnreadMessGroup = function (IdGroup, userUpdateRead, count) {
        this.electron_services.setIdGroup(IdGroup);
        if (count > 0) {
            var index = this.lstContact.findIndex(function (x) { return x.IdGroup == IdGroup; });
            this.lstContact[index].UnreadMess = 0;
            if (this.dem > 0) {
                this.dem = this.dem - 1;
            }
            this.electron_services.setBadgeWindow(this.dem);
            this.chatService.UpdateUnReadGroup(IdGroup, userUpdateRead, "read").subscribe(function (res) {
                if (res.status === 1) {
                }
            });
            this.changeDetectorRefs.detectChanges();
        }
    };
    MyChatComponent.prototype.updateNumberNoti = function (value) {
        if (value == true) {
            this.getNotiUnread();
        }
    };
    MyChatComponent.prototype.getNotiUnread = function () {
        var _this = this;
        this.socketService.getNotificationList('unread').subscribe(function (res) {
            var dem = 0;
            res.forEach(function (x) { return dem++; });
            _this.numberInfo = dem;
            _this.changeDetectorRefs.detectChanges();
        });
    };
    MyChatComponent.prototype.logout = function () {
        var _this = this;
        this.auth.logoutToSSO().subscribe(function (res) {
            localStorage.clear();
            _this.auth.logout();
        });
        this.presence.disconnectToken();
    };
    MyChatComponent.prototype.AllRead = function () {
        var _this = this;
        this.listAllread = [];
        this.listTam.forEach(function (item) {
            if (item.UnreadMess > 0) {
                _this.listAllread.push(item);
            }
        });
        this.listAllread.forEach(function (item) {
            //user bt
            var index = _this.lstContact.findIndex(function (x) { return x.IdGroup == item.IdGroup; });
            if (index >= 0) {
                _this.lstContact[index].UnreadMess = 0;
            }
            if (item.isGroup) {
                _this.chatService.UpdateUnRead(item.IdGroup, item.UserId, "read").subscribe(function (res) {
                    if (res) {
                    }
                    else {
                        console.log("Eror");
                    }
                });
            }
            else {
                //  group
                _this.chatService.UpdateUnReadGroup(item.IdGroup, item.Username, "read").subscribe(function (res) {
                    if (res.status === 1) {
                    }
                    else {
                        console.log("Eror");
                    }
                });
            }
        });
        this.dem = 0;
        this.changeDetectorRefs.detectChanges();
    };
    MyChatComponent.prototype.changed = function (item) {
        var _this = this;
        this.listunread = [];
        if (item == 1) {
            this.GetContact();
        }
        else if (item == 2) {
            this.listTam.forEach(function (item) {
                if (item.UnreadMess > 0) {
                    _this.listunread.push(item);
                }
            });
            this.lstContact = this.listunread.slice();
            this.changeDetectorRefs.detectChanges();
        }
        else if (item == 3) {
            this.listTam.forEach(function (item) {
                if (item.UnreadMess == 0) {
                    _this.listunread.push(item);
                }
            });
            this.lstContact = this.listunread.slice();
            this.changeDetectorRefs.detectChanges();
        }
    };
    MyChatComponent.prototype.GetContact = function () {
        var _this = this;
        this.lstContact = [];
        if (this.lstContact.length == 0) {
            this.active = true;
        }
        var sb = this.chatService.GetContactChatUser().subscribe(function (res) {
            _this.lstContact = res.data;
            _this.listTam = res.data;
            _this.changeDetectorRefs.detectChanges();
            _this.getSoLuongMessUnread();
            console.log('lstContact', _this.lstContact);
            _this.active = false;
        });
        this._subscriptions.push(sb);
    };
    // Bắt đầu phần bài đăng
    MyChatComponent.prototype.creaFormDelete = function (IdGroup, isGroup) {
        var _this = this;
        var _title = this.translate.instant('Xóa cuộc hội thoại');
        var _description = this.translate.instant('Bạn có muốn xóa không ?');
        var _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
        var _deleteMessage = this.translate.instant('Xóa thành công !');
        var _erroMessage = this.translate.instant('Xóa không thành công !');
        var dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(function (res) {
            if (!res) {
                return;
            }
            if (isGroup) {
                // xóa group nhóm thực  chất là rời nhóm
                _this.conversationServices.DeleteThanhVienInGroup(IdGroup, _this.UserId).subscribe(function (res) {
                    if (res && res.status == 1) {
                        _this.layoutUtilsService.showActionNotification('Thành công !', layout_utils_service_1.MessageType.Read, 3000, true, false, 3000, 'top', 1);
                        _this.GetContact();
                    }
                    else {
                        _this.layoutUtilsService.showActionNotification('Thất bại !', layout_utils_service_1.MessageType.Read, 3000, true, false, 3000, 'top', 0);
                    }
                });
            }
            else {
                // xóa group user với nhau
                var sb_3 = _this.conversationServices.DeleteConversation(IdGroup).subscribe(function (res) {
                    if (res && res.status === 1) {
                        _this.router.navigateByUrl('/Chat');
                        var index = _this.lstContact.findIndex(function (x) { return x.IdGroup == IdGroup; });
                        if (index >= 0) {
                            _this.lstContact.splice(index, 1);
                            _this.layoutUtilsService.showActionNotification('Thành công !', layout_utils_service_1.MessageType.Read, 3000, true, false, 3000, 'top', 1);
                            // this.GetContact();
                        }
                        _this.layoutUtilsService.showActionNotification(_deleteMessage, layout_utils_service_1.MessageType.Delete, 4000, true, false, 3000, 'top', 1);
                    }
                    else {
                        _this.layoutUtilsService.showActionNotification(_erroMessage, layout_utils_service_1.MessageType.Delete, 4000, true, false, 3000, 'top', 0);
                    }
                    _this._subscriptions.push(sb_3);
                });
            }
        });
    };
    MyChatComponent.prototype.GetListApp = function () {
        var _this = this;
        this.notify.getListApp().subscribe(function (res) {
            if (res.status == 1) {
                _this.listApp = res.data;
            }
        });
    };
    MyChatComponent.prototype.getSoLuongMessUnread = function () {
        var _this = this;
        this.dem = 0;
        if (this.lstContact) {
            this.lstContact.forEach(function (element) {
                if (element.UnreadMess > 0) {
                    _this.dem += 1;
                }
            });
            this.electron_services.setBadgeWindow(this.dem);
            // this.titleService.setTitle('('+this.dem+')'+" JeeChat");
        }
    };
    MyChatComponent.prototype.setIntrvl = function () {
        var _this = this;
        setInterval(function () {
            if (_this.dem > 0) {
                _this.getSoLuongMessUnread();
            }
        }, 1000);
    };
    // setIntrvl1(){
    //   setInterval(() => {
    //     if (this.dem>0) {
    //       this.titleService.setTitle('('+this.dem+')'+" JeeChat");
    //     }else if (this.dem===0)
    //     {
    //       this.titleService.setTitle("JeeChat");
    //     }
    //   }, 2000);
    // }
    MyChatComponent.prototype.ngOnInit = function () {
        this.setIntrvl();
        // this.electron_services.getActiveApp();
        console.log("this.electron_services.getActiveApp();", this.electron_services.getActiveApp());
        // this.setIntrvl1();
        // if(this.dem=0)
        // {
        //   this.titleService.setTitle('('+this.dem+')'+" JeeChat");
        // }
        this.GetListApp();
        this.presence.connectToken();
        this.GetContact();
        this.subscribeToEvents();
        this.subscribeToEventsOffLine();
        this.UpdateNewGroup();
        this.RefreshConverstionWhenDeleteMember();
        // this.subscribeToEventsNewMess();
        this.EventSubcibeCallVideo();
        this.subscribeToEventsHidenmes();
        this.eventsubrouterNotify();
    };
    MyChatComponent.prototype.eventsubrouterNotify = function () {
        var _this = this;
        this.chatService.notify$.subscribe(function (res) {
            if (res) {
                _this.electron_services.OpenAppNotify();
                //  console.log("CCCC",res);
                if (!res.isGroup) {
                    _this.chatService.UpdateUnRead(res.IdGroup, res.UserId, "read").subscribe(function (data) {
                        console.log("UpdateUnReadGroup", data);
                        if (data.status == 1) {
                            if (_this.dem > 0) {
                                _this.dem = _this.dem - 1;
                            }
                            _this.electron_services.setBadgeWindow(_this.dem);
                            var index_1 = _this.lstContact.findIndex(function (x) { return x.IdGroup == res.IdGroup; });
                            if (index_1 >= 0) {
                                _this.lstContact[index_1].UnreadMess = 0;
                            }
                        }
                    });
                }
                else {
                    _this.chatService.UpdateUnReadGroup(res.IdGroup, _this.userCurrent, "read").subscribe(function (res) {
                    });
                }
                if (_this.dem > 0) {
                    _this.dem = _this.dem - 1;
                }
                _this.electron_services.setBadgeWindow(_this.dem);
                var index = _this.lstContact.findIndex(function (x) { return x.IdGroup == res.IdGroup; });
                if (index >= 0) {
                    _this.lstContact[index].UnreadMess = 0;
                }
                _this.electron_services.setIdGroup(res.IdGroup);
                _this.router.navigateByUrl("/Chat/Messages/" + res.IdGroup + "/null");
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    MyChatComponent.prototype.subscribeToEventsHidenmes = function () {
        var _this = this;
        var sb = this.messageService.MyChatHidden$.subscribe(function (res) {
            if (res) {
                var index = _this.lstContact.findIndex(function (x) { return x.IdGroup == res.IdGroup; });
                if (index >= 0) {
                    if (_this.lstContact[index].LastMess[0].IdChat == res.IdChat) {
                        _this.lstContact[index].LastMess[0].isHiden = true;
                        _this.changeDetectorRefs.detectChanges();
                    }
                }
            }
        });
    };
    MyChatComponent.prototype.CheckCall = function (idGroup) {
        var index = this.lstContact.findIndex(function (x) { return x.IdGroup == idGroup; });
        if (index >= 0) {
            return true;
        }
        else {
            return false;
        }
    };
    MyChatComponent.prototype.EventSubcibeCallVideo = function () {
        var _this = this;
        this.presence.CallvideoMess.subscribe(function (res) {
            // console.log("CallVideo",res)
            if (res && _this.CheckCall(res.IdGroup) && res.UserName !== _this.userCurrent) {
                _this.CallVideoDialogEvent(res.isGroup, res.UserName, res.Status, res.keyid, res.IdGroup, res.FullName, res.Avatar, res.BGcolor);
            }
        });
    };
    MyChatComponent.prototype.CallVideoDialogEvent = function (isGroup, username, code, key, idgroup, fullname, img, bg) {
        var _this = this;
        var dl = { isGroup: isGroup, UserName: username, BG: bg, Avatar: img, PeopleNameCall: fullname, status: code, idGroup: idgroup, keyid: key, Name: fullname };
        var dialogRef = this.dialog.open(call_video_component_1.CallVideoComponent, {
            //  width:'800px',
            // height:'800px',
            data: { dl: dl },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                _this.presence.ClosevideoMess.next(undefined);
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    MyChatComponent.prototype.RefreshConverstionWhenDeleteMember = function () {
        var _this = this;
        this.conversationServices.refreshConversation.subscribe(function (res) {
            if (res) {
                var index = _this.lstContact.findIndex(function (x) { return x.IdGroup == res.IdGroup && x.UserId === res.UserId.data; });
                if (index >= 0) {
                    _this.lstContact.splice(index, 1);
                    _this.changeDetectorRefs.detectChanges();
                }
            }
        });
    };
    MyChatComponent.prototype.UpdateNewGroup = function () {
        var _this = this;
        this._ngZone.run(function () {
            _this.presence.NewGroupSource$.subscribe(function (res) {
                // console.log("RESSS",res)
                if (res && res.isGroup) {
                    var index = _this.lstContact.findIndex(function (x) { return x.IdGroup === res.IdGroup; });
                    if (index < 0) {
                        _this.lstContact.unshift(res);
                        _this.changeDetectorRefs.detectChanges();
                    }
                }
                else {
                    if (res && !res.isGroup) {
                        var index = _this.lstContact.findIndex(function (x) { return x.IdGroup === res.IdGroup; });
                        if (index < 0) {
                            _this.lstContact.unshift(res);
                            _this.changeDetectorRefs.detectChanges();
                        }
                    }
                }
            });
        });
    };
    MyChatComponent.prototype.CreaterGroupChat = function () {
        var _this = this;
        // this.dcmt.body.classList.add('header-fixed');
        var dialogRef = this.dialog.open(create_convesation_group_component_1.CreateConvesationGroupComponent, {
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                var data = _this.auth.getAuthFromLocalStorage();
                _this.presence.NewGroup(data.access_token, res[0], res[0]);
                // this.GetContact();
                // this.subscribeToEvents();
                // this.GetContact();
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    MyChatComponent.prototype.CreaterUserChat = function () {
        var _this = this;
        // this.dcmt.body.classList.add('header-fixed');
        var dialogRef = this.dialog.open(create_conversation_user_component_1.CreateConversationUserComponent, {
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                _this.electron_services.setIdGroup(res[0].IdGroup);
                // localStorage.setItem('chatGroup', JSON.stringify(res[0].IdGroup));
                _this.router.navigate(['Chat/Messages/' + res[0].IdGroup + '/null']);
                var data = _this.auth.getAuthFromLocalStorage();
                _this.presence.NewGroup(data.access_token, res[0], res[0]);
                // this.GetContact();
                // this.subscribeToEvents();
                // this.GetContact();
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    MyChatComponent.prototype.subscribeToEventsOffLine = function () {
        var _this = this;
        this._ngZone.run(function () {
            _this.presence.offlineUsers$.subscribe(function (res) {
                if (res) {
                    if (res.JoinGroup === "changeActive") {
                        _this.SetActive(res.UserId, true);
                    }
                    // else if(res[i].JoinGroup==="")
                    // {
                    //   this.SetActive(res[i].UserId,false)
                    // }
                    else {
                        _this.SetActive(res.UserId, false);
                    }
                }
            });
        });
    };
    MyChatComponent.prototype.subscribeToEvents = function () {
        var _this = this;
        this._ngZone.run(function () {
            _this.presence.onlineUsers$.subscribe(function (res) {
                console.log("onlineUsers", res);
                _this.lstUserOnline = res;
                console.log(" this.lstUserOnline", _this.lstUserOnline);
                setTimeout(function () {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].JoinGroup === "changeActive") {
                                _this.SetActive(res[i].UserId, true);
                            }
                            else {
                                _this.SetActive(res[i].UserId, false);
                            }
                        }
                    }
                }, 1000);
            });
        });
    };
    MyChatComponent.prototype.SetActive = function (item, active) {
        var _this = this;
        if (active === void 0) { active = true; }
        var index;
        setTimeout(function () {
            index = _this.lstContact.findIndex(function (x) { return x.UserId === item && x.isGroup === false; });
            if (index >= 0) {
                _this.lstContact[index].Active = active ? true : false;
                _this.changeDetectorRefs.detectChanges();
            }
        }, 500);
    };
    MyChatComponent.prototype.ngOnDestroy = function () {
        if (this._subscriptions) {
            this._subscriptions.forEach(function (sb) { return sb.unsubscribe(); });
        }
        // this.messageService.Newmessage.unsubscribe();
    };
    MyChatComponent.prototype.ScrollToTop = function () {
        this.scrollMeChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
    };
    __decorate([
        core_1.ViewChild('scrollMeChat', { static: false })
    ], MyChatComponent.prototype, "scrollMeChat");
    MyChatComponent = __decorate([
        core_1.Component({
            selector: 'app-my-chat',
            templateUrl: './my-chat.component.html',
            styleUrls: ['./my-chat.component.scss']
        })
    ], MyChatComponent);
    return MyChatComponent;
}());
exports.MyChatComponent = MyChatComponent;
