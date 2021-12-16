"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.DetailMyChatComponent = void 0;
var core_1 = require("@angular/core");
var pagram_1 = require("../../../../ChatAppModule/models/pagram");
var scrolling_1 = require("@angular/cdk/scrolling");
var message_1 = require("src/app/ChatAppModule/models/message");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
var thanh_vien_group_component_1 = require("../thanh-vien-group/thanh-vien-group.component");
var insert_thanhvien_component_1 = require("../../insert-thanhvien/insert-thanhvien.component");
var edit_group_name_component_1 = require("../../edit-group-name/edit-group-name.component");
var ng_gallery_1 = require("ng-gallery");
var moment = require("moment-timezone");
var ngx_quill_1 = require("ngx-quill");
require("quill-mention");
var share_message_component_1 = require("../share-message/share-message.component");
var NotifyMess_1 = require("src/app/ChatAppModule/models/NotifyMess");
var peerjs_1 = require("peerjs");
var call_video_component_1 = require("../../call-video/call-video.component");
var expansion_1 = require("@angular/material/expansion");
var dang_ky_cuoc_hop_page_component_1 = require("../../JeeMetting/dang-ky-cuoc-hop-page/dang-ky-cuoc-hop-page.component");
var SeenMess_1 = require("src/app/ChatAppModule/models/SeenMess");
var DetailMyChatComponent = /** @class */ (function () {
    function DetailMyChatComponent(gallery, changeDetectorRefs, chatService, route, router, auth, dialog, _ngZone, layoutUtilsService, presence, messageService) {
        var _this = this;
        this.gallery = gallery;
        this.changeDetectorRefs = changeDetectorRefs;
        this.chatService = chatService;
        this.route = route;
        this.router = router;
        this.auth = auth;
        this.dialog = dialog;
        this._ngZone = _ngZone;
        this.layoutUtilsService = layoutUtilsService;
        this.presence = presence;
        this.messageService = messageService;
        this.tabs = ['Ảnh', 'File',];
        this.selected = new forms_1.FormControl(0);
        this.LstImagePanel = [];
        this.LstFilePanel = [];
        this.allfile = false;
        this.allfileImage = false;
        this.active_SeenMess = false;
        this.active_tagname = true;
        this.active_danhan = false;
        this.listtagname = [];
        this.isGroup = false;
        this.listReply = [];
        this.lstThamGia = [];
        this.tam = [];
        this.listTagGroupAll = [];
        this._lstChatMessMoreDetail = [];
        this.listChoseTagGroup = [];
        this.lisTagGroup = [];
        this.listInfor = [];
        this.list_reaction = [];
        this.isloading = false;
        this.acivepush = true;
        this.txttam = "";
        this.show = false;
        this.pageSize = 0;
        this.pageSizedetailbottom = 0;
        this.pageSizedetailtop = 4;
        this.lstChatMess = [];
        this.lstTagName = [];
        this.listMess = [];
        this.composing = false;
        this.loading = false;
        this.list_image = [];
        this.list_file = [];
        this.AttachFileChat = [];
        this.listFileChat = [];
        this.active = false;
        this.listreaction = [];
        this.peerList = [];
        this.panelOpenState = false;
        this._subscriptions = [];
        this.myFilesVideo = [];
        this.showEmojiPicker = false;
        this.sets = [
            'native',
            'google',
            'twitter',
            'facebook',
            'emojione',
            'apple',
            'messenger'
        ];
        // set = 'twitter';
        this.set = 'facebook';
        this.items = [];
        this.focusFunction = function (event) {
            if (event.oldRange == null && _this.listMess[_this.listMess.length - 1].UserName != _this.userCurrent) {
                var item = _this.ItemSeenMessenger();
                _this.messageService.SeenMessage(item);
            }
        };
        this.modules = {
            toolbar: false,
            mention: {
                mentionListClass: "ql-mention-list mat-elevation-z8",
                allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                showDenotationChar: false,
                // mentionDenotationChars: ["@", "#"],
                spaceAfterInsert: false,
                onSelect: function (item, insertItem) {
                    var index = _this.lstTagName.findIndex(function (x) { return x == item.id; });
                    if (index < 0) {
                        _this.lstTagName.push(item.id);
                    }
                    console.log("IIIIIIIIII", _this.lstTagName);
                    var editor = _this.editor.quillEditor;
                    insertItem(item);
                    // necessary because quill-mention triggers changes as 'api' instead of 'user'
                    editor.insertText(editor.getLength() - 1, "", "user");
                },
                renderItem: function (item, searchTerm) {
                    if (item.Avatar) {
                        return "\n      <div >\n\n      <img  style=\"    width: 30px;\n      height: 30px;\n      border-radius: 50px;\" src=\"" + item.Avatar + "\">\n      " + item.value + "\n\n\n\n      </div>";
                    }
                    else if (item.id !== "All") {
                        return "\n      <div style=\"    display: flex;\n      align-items: center;\" >\n\n        <div  style=\"     height: 30px;\n        border-radius: 50px;    width: 30px; ;background-color:" + item.BgColor + "\">\n        </div>\n        <span style=\" position: absolute;     left: 20px;  color: white;\">" + item.value.slice(0, 1) + "</span>\n        <span style=\" padding-left: 5px;\">  " + item.value + "</span>\n\n      </div>";
                    }
                    else {
                        return "\n      <div style=\"    display: flex;\n      align-items: center;\" >\n\n        <div  style=\"     height: 30px;\n        border-radius: 50px;    width: 30px; ;background-color:#F3D79F\">\n        </div>\n        <span style=\" position: absolute;     left: 20px;  color: white;\">@</span>\n        <span style=\" padding-left: 5px;\">" + item.note + "</span>\n        <span style=\" padding-left: 5px;\">  " + item.value + "</span>\n\n      </div>";
                    }
                },
                source: function (searchTerm, renderItem) {
                    var values = _this.lisTagGroup;
                    if (searchTerm.length === 0) {
                        renderItem(values, searchTerm);
                    }
                    else {
                        var matches_1 = [];
                        values.forEach(function (entry) {
                            if (entry.value.toLowerCase().replace(/\s/g, '').indexOf(searchTerm.toLowerCase()) !== -1) {
                                matches_1.push(entry);
                            }
                        });
                        renderItem(matches_1, searchTerm);
                    }
                }
            }
        };
        this.filteredFile = new rxjs_1.ReplaySubject(1);
        this.searchControl = new forms_1.FormControl();
        console.log('%c ContrustorDetail ', 'background: red; color: #bada55');
        this.peer = new peerjs_1["default"]();
        var dt = this.auth.getAuthFromLocalStorage();
        this.userCurrent = dt.user.username;
        this.UserId = dt['user']['customData']['jee-account']['userID'];
        this.Fullname = dt['user']['customData']['personalInfo']['Fullname'];
        this.Avataruser = dt['user']['customData']['personalInfo']['Avatar'];
        this.customerID = dt['user']['customData']['jee-account']['customerID'];
        this.isloading = false;
    }
    DetailMyChatComponent.prototype.RemoveVideos = function (index) {
        this.myFilesVideo.splice(index, 1);
        this.AttachFileChat.splice(index, 1);
        this.changeDetectorRefs.detectChanges();
        this.url = "";
    };
    DetailMyChatComponent.prototype.onSelectVideo = function (event) {
        var _this = this;
        var base64Str;
        var file = event.target.files && event.target.files;
        if (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.myFilesVideo.push(event.target.result);
                var metaIdx = _this.myFilesVideo[0].indexOf(';base64,');
                base64Str = _this.myFilesVideo[0].substr(metaIdx + 8);
                _this.AttachFileChat.push({ filename: file[0].name, type: file[0].type, size: file[0].size, strBase64: base64Str });
                _this.url = event.target.result;
            };
            reader.readAsDataURL(file[0]);
        }
        console.log("AttachFileChat", this.AttachFileChat);
    };
    DetailMyChatComponent.prototype.onSelectFile_PDF = function (event) {
        var _this = this;
        this.show = false;
        if (event.target.files && event.target.files[0]) {
            var filesAmountcheck = event.target.files[0];
            var file_name = event.target.files;
            var filesAmount = event.target.files.length;
            for (var i = 0; i < this.AttachFileChat.length; i++) {
                if (filesAmountcheck.name == this.AttachFileChat[i].filename) {
                    this.layoutUtilsService.showInfo("File đã tồn tại");
                    return;
                }
            }
            var _loop_1 = function (i_1) {
                reader = new FileReader();
                //this.FileAttachName = filesAmount.name;
                var base64Str;
                var cat;
                reader.onload = function (event) {
                    cat = file_name[i_1].name.substr(file_name[i_1].name.indexOf('.'));
                    if (cat.toLowerCase() === '.png' || cat.toLowerCase() === '.jpg') {
                        _this.list_image.push(event.target.result);
                        var metaIdx = _this.list_image[i_1].indexOf(';base64,');
                        base64Str = _this.list_image[i_1].substr(metaIdx + 8);
                        console.log("base64Str", base64Str);
                        _this.AttachFileChat.push({ filename: file_name[i_1].name, type: file_name[i_1].type, size: file_name[i_1].size, strBase64: base64Str });
                        // console.log('list imgage',this.list_image)
                    }
                    else {
                        _this.list_file.push(event.target.result);
                        if (_this.list_file[i_1] != undefined) {
                            var metaIdx = _this.list_file[i_1].indexOf(';base64,');
                        }
                        if (_this.list_file[i_1] != undefined) {
                            base64Str = _this.list_file[i_1].substr(metaIdx + 8);
                        }
                        _this.AttachFileChat.push({ filename: file_name[i_1].name, type: file_name[i_1].type, size: file_name[i_1].size, strBase64: base64Str });
                        _this.listFileChat.push({ filename: file_name[i_1].name, type: file_name[i_1].type, size: file_name[i_1].size, strBase64: base64Str });
                        // this.list_File_Edit.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size });
                    }
                    _this.changeDetectorRefs.detectChanges();
                };
                //  console.log('this.list_image_Edit',this.list_image_Edit)
                reader.readAsDataURL(event.target.files[i_1]);
            };
            var reader;
            for (var i_1 = 0; i_1 < filesAmount; i_1++) {
                _loop_1(i_1);
            }
        }
    };
    DetailMyChatComponent.prototype.RemoveChoseFile = function (index) {
        this.AttachFileChat.splice(index, 1);
        this.listFileChat.splice(index, 1);
        this.changeDetectorRefs.detectChanges();
    };
    DetailMyChatComponent.prototype.RemoveChoseImage = function (index) {
        this.list_image.splice(index, 1);
        this.AttachFileChat.splice(index, 1);
        this.changeDetectorRefs.detectChanges();
    };
    DetailMyChatComponent.prototype.showPT = function () {
        if (this.show) {
            this.show = false;
        }
        else {
            this.show = true;
        }
    };
    DetailMyChatComponent.prototype.toggleEmojiPicker = function () {
        this.showEmojiPicker = !this.showEmojiPicker;
    };
    DetailMyChatComponent.prototype.addEmoji = function (event) {
        var txttam = this.txttam;
        if (txttam === null) {
            txttam = '';
        }
        var text = "" + txttam + event.emoji.native;
        this.txttam = text;
        // this.showEmojiPicker = false;
    };
    DetailMyChatComponent.prototype.GetListThamGiaCuocHop = function (idgroup) {
        var _this = this;
        this.chatService.GetTaoUserTaoCuocHop(idgroup).subscribe(function (res) {
            _this.lstThamGia = res.data;
        });
    };
    DetailMyChatComponent.prototype.TaoCuocHop = function () {
        var _this = this;
        var dialogRef = this.dialog.open(dang_ky_cuoc_hop_page_component_1.DangKyCuocHopPageComponent, {
            data: this.lstThamGia
            // panelClass:'no-padding'
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                _this.GetInforUserChatwith(_this.id_Group);
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    DetailMyChatComponent.prototype.EditNameGroup = function (item) {
        var _this = this;
        var dialogRef = this.dialog.open(edit_group_name_component_1.EditGroupNameComponent, {
            width: '400px',
            data: item
            // panelClass:'no-padding'
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                _this.GetInforUserChatwith(_this.id_Group);
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    DetailMyChatComponent.prototype.HidenMess = function (IdChat, IdGroup) {
        var data = this.auth.getAuthFromLocalStorage();
        var _token = data.access_token;
        this.messageService.HidenMessage(_token, IdChat, IdGroup);
    };
    DetailMyChatComponent.prototype.ReplyMess = function (item) {
        this.listReply.push(item);
        // this.editor.focus()
        this.changeDetectorRefs.detectChanges();
    };
    DetailMyChatComponent.prototype.saverange = function (value) {
        //  console.log("Changed", value)
        if (value) {
            if (value.match(/<img/)) {
                value = value.replace(/<img(.*?)>/g, "");
            }
            value = value.replace("<p><br></p>", "");
            this.messageContent = value;
        }
        //  document.getElementById('content').textContent =value;
        if (value) {
            // if(value.indexOf("@")>=0)
            // {
            //   this.changeDetectorRefs.detectChanges();
            // }
            // else
            // {
            // }
            var data = this.auth.getAuthFromLocalStorage();
            var _token = data.access_token;
            this.messageService.Composing(_token, this.id_Group);
        }
        else {
            return;
        }
    };
    DetailMyChatComponent.prototype.ItemInsertMessenger = function (note) {
        var item = new message_1.Message();
        item.Content_mess = 'đã thêm';
        item.UserName = this.userCurrent;
        item.IdGroup = this.id_Group;
        item.IsDelAll = false;
        item.Note = note;
        item.isInsertMember = true;
        return item;
    };
    DetailMyChatComponent.prototype.sendInsertMessage = function (note) {
        this.isloading = false;
        var data = this.auth.getAuthFromLocalStorage();
        var _token = data.access_token;
        var item = this.ItemInsertMessenger(note);
        this.messageService.sendMessage(_token, item, this.id_Group).then(function () {
        });
    };
    DetailMyChatComponent.prototype.InsertThanhVienGroup = function () {
        var _this = this;
        var dialogRef = this.dialog.open(insert_thanhvien_component_1.InsertThanhvienComponent, {
            width: '500px',
            data: this.id_Group
            // panelClass:'no-padding'
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                var chuoi_1 = "";
                res.data.forEach(function (element) {
                    chuoi_1 = chuoi_1 + ',' + element.FullName;
                });
                _this.sendInsertMessage(chuoi_1.substring(1));
                _this.GetInforUserChatwith(_this.id_Group);
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    DetailMyChatComponent.prototype.LoadDataDetailDefaultMess = function (idGroup, IdChat) {
        var _this = this;
        var queryParams1 = new pagram_1.QueryParamsModelNewLazy('', '', '', 0, 50, false);
        this.chatService.GetMessDetailDefault(idGroup, IdChat, queryParams1).subscribe(function (res) {
            _this.listMess = res.data;
            console.log("ListMessDetail", _this.listMess);
            _this.loadDataListLayzyDetailBottom(0);
            var index = _this.listMess.findIndex(function (x) { return x.IdChat == _this.id_Chat; });
            _this.viewPort.scrollToIndex(index);
            _this._scrollToBottom();
            _this.changeDetectorRefs.detectChanges();
        });
    };
    DetailMyChatComponent.prototype.loadDataList = function () {
        // this.loading=true;
        var _this = this;
        var queryParams1 = new pagram_1.QueryParamsModelNewLazy('', '', '', 0, 50, false);
        var sb = this.chatService.GetListMess(queryParams1, "/chat/Get_ListMess?IdGroup=" + this.id_Group).subscribe(function (res) {
            _this.listMess = res.data;
            console.log('listMess', _this.listMess);
            _this.isloading = false;
            _this.changeDetectorRefs.detectChanges();
            // }
            setTimeout(function () {
                if (_this.listMess) {
                    _this.viewPort.scrollToIndex(_this.listMess.length - 1);
                    setTimeout(function () {
                        _this.viewPort.scrollTo({
                            bottom: 0,
                            behavior: 'auto'
                        });
                    }, 0);
                    setTimeout(function () {
                        _this.viewPort.scrollTo({
                            bottom: 0,
                            behavior: 'auto'
                        });
                    }, 50);
                }
            }, 1000);
        });
        this._subscriptions.push(sb);
    };
    //  scroll bottom add thêm item
    DetailMyChatComponent.prototype.appendItemsDetailBottom = function () {
        this.loadDataListLayzyDetailBottom(this.pageSizedetailbottom);
        // if(this.pageSizedetailbottom==0)
        // {
        //   this.loadDataListLayzyDetailBottom(this.pageSizedetailbottom);
        // }
        // else
        // {
        //    this.loadDataListLayzyDetailBottom(this.pageSizedetailbottom);
        // }
        this.changeDetectorRefs.detectChanges();
    };
    //  scroll top add thêm item
    DetailMyChatComponent.prototype.appendItemsDetailTop = function () {
        this.loadDataListLayzyDetailTop();
        this.changeDetectorRefs.detectChanges();
    };
    DetailMyChatComponent.prototype.loadDataListLayzyDetailBottom = function (page) {
        var _this = this;
        this.pageSizedetailbottom += 1;
        var queryParams1 = new pagram_1.QueryParamsModelNewLazy('', '', '', page, 10, false);
        var sb = this.chatService.GetListMessDetailBottom(queryParams1, "/chat/Get_ListMessDetailShowMoreBottom?IdGroup=" + this.id_Group + "&idchat=" + this.id_Chat).subscribe(function (res) {
            _this._lstChatMessMoreDetail = [];
            if (res.data != null && res.status === 1) {
                _this._lstChatMessMoreDetail = res.data;
                console.log('  res.data.', _this._lstChatMessMoreDetail);
                if (res.data) {
                    for (var i = 0; i < _this._lstChatMessMoreDetail.length; i++) {
                        _this.listMess = __spreadArrays(_this.listMess, [_this._lstChatMessMoreDetail[i]]);
                        _this.isloading = false;
                        _this.changeDetectorRefs.detectChanges();
                    }
                    console.log('listMess detail sau khi push', _this.listMess);
                }
                // let index=this.listMess.findIndex(x=>x.IdChat==this.id_Chat);
                // this.viewPort.scrollToIndex(index);
            }
        });
        if (this._lstChatMessMoreDetail.length > 0) {
            this.viewPort.scrollToIndex(this.listMess.length - 10, 'smooth');
            // this.viewPort.scrollTo({
            //   bottom: 40,
            // });
            // this._scrollToBottom();
        }
        this.changeDetectorRefs.detectChanges();
        this._subscriptions.push(sb);
        // return result;
    };
    DetailMyChatComponent.prototype.loadDataListLayzyDetailTop = function () {
        var _this = this;
        this.pageSizedetailtop += 1;
        var queryParams1 = new pagram_1.QueryParamsModelNewLazy('', '', '', this.pageSizedetailtop, 10, false);
        var sb = this.chatService.GetMessDetailDefault(this.id_Group, this.id_Chat, queryParams1).subscribe(function (res) {
            _this._lstChatMessMoreDetail = [];
            if (res.data != null && res.status === 1) {
                _this._lstChatMessMoreDetail = res.data.reverse();
                if (res.data) {
                    for (var i = 0; i < _this._lstChatMessMoreDetail.length; i++) {
                        _this.listMess = __spreadArrays([_this._lstChatMessMoreDetail[i]], _this.listMess);
                        _this.isloading = false;
                        _this.changeDetectorRefs.detectChanges();
                    }
                    // console.log('listMess detail sau khi push',this.listMess)
                }
            }
        });
        if (this._lstChatMessMoreDetail.length > 0) {
            this.scroll();
        }
        this.changeDetectorRefs.detectChanges();
        this._subscriptions.push(sb);
        // return result;
    };
    DetailMyChatComponent.prototype._scrollToBottom = function () {
        var _this = this;
        setTimeout(function () {
            _this.viewPort.scrollTo({
                bottom: 20,
                behavior: 'auto'
            });
        }, 0);
        setTimeout(function () {
            _this.viewPort.scrollTo({
                bottom: 20,
                behavior: 'auto'
            });
        }, 50);
    };
    DetailMyChatComponent.prototype.loadDataListLayzy = function (page) {
        var _this = this;
        this.isloading = true;
        var queryParams1 = new pagram_1.QueryParamsModelNewLazy('', '', '', page, 10, false);
        var sb = this.chatService.GetListMess(queryParams1, "/chat/Get_ListMess?IdGroup=" + this.id_Group).subscribe(function (res) {
            var _lstChatMessMore = [];
            if (res.data != null && res.status === 1) {
                _lstChatMessMore = res.data.reverse();
                console.log('  res.data.', _lstChatMessMore);
                if (res.data != null) {
                    for (var i = 0; i < _lstChatMessMore.length; i++) {
                        _this.listMess = __spreadArrays([_lstChatMessMore[i]], _this.listMess);
                        _this.isloading = false;
                        _this.changeDetectorRefs.detectChanges();
                    }
                }
                _this.viewPort.scrollToIndex(10, 'smooth');
            }
        });
        this.changeDetectorRefs.detectChanges();
        this._subscriptions.push(sb);
    };
    DetailMyChatComponent.prototype.scroll = function () {
        this.isloading = false;
        this.viewPort.scrollToIndex(10, 'smooth');
    };
    DetailMyChatComponent.prototype.appendItems = function () {
        this.pageSize += 1;
        this.loadDataListLayzy(this.pageSize);
        this.changeDetectorRefs.detectChanges();
    };
    // send leave mess group
    DetailMyChatComponent.prototype.ItemLeaveMessenger = function (content, note) {
        var item = new message_1.Message();
        item.Content_mess = content;
        item.UserName = this.userCurrent;
        item.IdGroup = this.id_Group;
        item.IsDelAll = true;
        item.Note = note;
        return item;
    };
    DetailMyChatComponent.prototype.sendLeaveMessage = function (mess, note) {
        this.isloading = false;
        var data = this.auth.getAuthFromLocalStorage();
        var _token = data.access_token;
        var item = this.ItemLeaveMessenger(mess, note);
        this.messageService.sendMessage(_token, item, this.id_Group).then(function () {
        });
    };
    DetailMyChatComponent.prototype.OpenThanhVien = function () {
        var _this = this;
        var noidung;
        var note;
        var dialogRef = this.dialog.open(thanh_vien_group_component_1.ThanhVienGroupComponent, {
            width: '500px',
            data: this.id_Group
        });
        dialogRef.afterClosed().subscribe(function (res) {
            console.log('AAAAa', res);
            if (res) {
                _this.GetInforUserChatwith(_this.id_Group);
                if (_this.UserId == res.data) {
                    noidung = 'đã rời';
                    _this.sendLeaveMessage(noidung, '');
                }
                else {
                    _this.chatService.GetUserById(res.data).subscribe(function (notedata) {
                        if (notedata) {
                            note = notedata.data[0].Fullname;
                            _this.sendLeaveMessage(noidung, note);
                        }
                    });
                    noidung = 'đã xóa ';
                }
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    DetailMyChatComponent.prototype.scrollHandler = function (event) {
        // this._isLoading$.next(true);
        this.isloading = false;
        if (this.id_Chat) {
            if (event.srcElement.scrollTop == 0) {
                // this.appendItems();
                // alert("top bằng 0")
                this.appendItemsDetailTop();
            }
            // console.log("event.target.offsetHeight",event.target.offsetHeight)
            // console.log("event.target.scrollTop",event.target.scrollTop)
            // console.log("event.target.scrollHeight",event.target.scrollHeight)
            // console.log("event.target.clientHeight",event.target.clientHeight)
            if (event.target.scrollHeight - event.target.scrollTop == event.target.clientHeight) {
                this.appendItemsDetailBottom();
            }
        }
        else {
            if (event.srcElement.scrollTop == 0) {
                this.appendItems();
            }
        }
    };
    DetailMyChatComponent.prototype.RouterLink = function (item) {
        window.open(item, "_blank");
    };
    DetailMyChatComponent.prototype.getClassHidenTime = function (item, idchat) {
        if (this.id_Chat) {
            if (item && this.id_Chat == idchat) {
                return 'HidenTime zoom-in-zoom-out';
            }
            else if (item) {
                return 'HidenTime';
            }
            else if (this.id_Chat == idchat) {
                return 'zoom-in-zoom-out';
            }
            else {
                return '';
            }
        }
        else {
            if (item) {
                return 'HidenTime';
            }
            else {
                return '';
            }
        }
    };
    DetailMyChatComponent.prototype.getClassReply = function (item) {
        if (item == this.userCurrent) {
            return 'reply';
        }
        else {
            return 'reply-user';
        }
    };
    DetailMyChatComponent.prototype.getClassUser = function (item, anh, file, video, content) {
        if (item == this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content)) {
            return 'curent';
        }
        else if (item !== this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content)) {
            return 'notcurent';
        }
        else {
            return '';
        }
    };
    DetailMyChatComponent.prototype.getShowMoreChat = function (item) {
        if (item !== this.userCurrent) {
            return ' chat right';
        }
        else {
            return ' chat';
        }
    };
    DetailMyChatComponent.prototype.getShowMoreChatLeft = function (item) {
        if (item == this.userCurrent) {
            return ' chat chatleft';
        }
        else {
            return ' chat chatright';
        }
    };
    DetailMyChatComponent.prototype.getClassTime = function (item) {
        if (item === this.userCurrent) {
            return 'timesent';
        }
        else {
            return 'timereplies';
        }
    };
    DetailMyChatComponent.prototype.getClassHiden = function (item, time) {
        if (item !== this.userCurrent && !time) {
            return 'hidenmess diff';
        }
        else if (item !== this.userCurrent && time) {
            return 'hidenmess timehidden';
        }
        else {
            return 'hidenmess';
        }
    };
    DetailMyChatComponent.prototype.getClass = function (item, key, keyinsert) {
        if (key === false && !keyinsert) {
            if (item === this.userCurrent) {
                return 'replies';
            }
            else {
                return 'sent';
            }
        }
        if (key) {
            return 'leaveGroup';
        }
        if (keyinsert) {
            return 'ImsertGroup';
        }
    };
    DetailMyChatComponent.prototype.getNameUser = function (val) {
        if (val) {
            var list = val.split(' ');
            return list[list.length - 1];
        }
        return "";
    };
    DetailMyChatComponent.prototype.getColorNameUser = function (fullname) {
        var name = this.getNameUser(fullname).substr(0, 1);
        var result = "#bd3d0a";
        switch (name) {
            case "A":
                result = "rgb(197, 90, 240)";
                break;
            case "Ă":
                result = "rgb(241, 196, 15)";
                break;
            case "Â":
                result = "rgb(142, 68, 173)";
                break;
            case "B":
                result = "#02c7ad";
                break;
            case "C":
                result = "#0cb929";
                break;
            case "D":
                result = "rgb(44, 62, 80)";
                break;
            case "Đ":
                result = "rgb(127, 140, 141)";
                break;
            case "E":
                result = "rgb(26, 188, 156)";
                break;
            case "Ê":
                result = "rgb(51 152 219)";
                break;
            case "G":
                result = "rgb(44, 62, 80)";
                break;
            case "H":
                result = "rgb(248, 48, 109)";
                break;
            case "I":
                result = "rgb(142, 68, 173)";
                break;
            case "K":
                result = "#2209b7";
                break;
            case "L":
                result = "#759e13";
                break;
            case "M":
                result = "rgb(236, 157, 92)";
                break;
            case "N":
                result = "#bd3d0a";
                break;
            case "O":
                result = "rgb(51 152 219)";
                break;
            case "Ô":
                result = "rgb(241, 196, 15)";
                break;
            case "Ơ":
                result = "rgb(142, 68, 173)";
                break;
            case "P":
                result = "rgb(142, 68, 173)";
                break;
            case "Q":
                result = "rgb(91, 101, 243)";
                break;
            case "R":
                result = "rgb(44, 62, 80)";
                break;
            case "S":
                result = "rgb(122, 8, 56)";
                break;
            case "T":
                result = "rgb(120, 76, 240)";
                break;
            case "U":
                result = "rgb(51 152 219)";
                break;
            case "Ư":
                result = "rgb(241, 196, 15)";
                break;
            case "V":
                result = "rgb(142, 68, 173)";
                break;
            case "X":
                result = "rgb(142, 68, 173)";
                break;
            case "W":
                result = "rgb(211, 84, 0)";
                break;
        }
        return result;
    };
    DetailMyChatComponent.prototype.GetInforUserChatwith = function (IdGroup) {
        var _this = this;
        var sb = this.chatService.GetInforUserChatWith(IdGroup).subscribe(function (res) {
            if (res) {
                _this.GetTagNameisGroup(res.data[0].isGroup);
                _this.listInfor = res.data;
                _this.isGroup = _this.listInfor[0].isGroup;
                _this.TenGroup = _this.listInfor[0].GroupName;
                _this.thanhviennhomn = _this.listInfor[0].ListMember.length;
                console.log('listInfor', _this.listInfor);
                _this.changeDetectorRefs.detectChanges();
            }
        });
        this._subscriptions.push(sb);
    };
    DetailMyChatComponent.prototype.setIntrvl = function () {
        var _this = this;
        setInterval(function () { return _this.isloading = false; }, 1000);
    };
    // ReconectGroup(){
    //   setInterval(() => this.messageService.connectToken(this.id_Group),1000);
    // }
    DetailMyChatComponent.prototype.GetTagNameisGroup = function (isGroup) {
        var _this = this;
        if (isGroup) {
            this.tam = [
                {
                    id: "All", note: "Nhắc cả nhóm ", value: "@All"
                }
            ];
        }
        else {
            this.tam = [];
        }
        var sb = this.chatService.GetTagNameGroup(this.id_Group).subscribe(function (res) {
            _this.lisTagGroup = _this.tam.concat(res.data);
            _this.listTagGroupAll = res.data;
            _this.changeDetectorRefs.detectChanges();
        });
        this._subscriptions.push(sb);
    };
    DetailMyChatComponent.prototype.GetImage = function (idgroup) {
        var _this = this;
        this.chatService.GetImage(idgroup).subscribe(function (res) {
            _this.LstImagePanel = res.data;
            _this.changeDetectorRefs.detectChanges();
        });
    };
    DetailMyChatComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.colornav = false;
        this.setIntrvl();
        var sb = this.route.params.subscribe(function (params) {
            _this.pageSize = 4;
            _this.listReply = [];
            _this.lstChatMess = [];
            _this.list_image = [];
            _this.AttachFileChat = [];
            _this.messageContent = '';
            _this.id_Group = +params.id;
            _this.id_Chat = +params.idchat;
            // this.presence.connectToken();
            _this.GetListThamGiaCuocHop(_this.id_Group);
            _this.GetInforUserChatwith(_this.id_Group);
            _this.messageService.connectToken(_this.id_Group);
            _this.GetImage(_this.id_Group);
            _this.LoadFile(_this.id_Group);
            // this.messageService.NhanMess();
            _this.subscribeToEventsNewMess();
            _this.subscribeToEventsLasttimeMess();
            _this.subscribeToEvents();
            _this.subscribeToEventsHidenmes();
            _this.subscribeToEventsComposing();
            _this.subscribeToEventsSendReaction();
            _this.subscribeToEventsSeenMess();
            if (_this.id_Chat) {
                _this.LoadDataDetailDefaultMess(_this.id_Group, _this.id_Chat);
            }
            else {
                _this.loadDataList();
            }
            _this.searchControl.valueChanges
                .pipe()
                .subscribe(function () {
                _this.filterBankGroups();
            });
            _this.GetListReaction();
            //  this.viewPort.scrollToIndex(this.listMess.length, 'smooth');
            _this.changeDetectorRefs.detectChanges();
        });
        this._subscriptions.push(sb);
    };
    //
    DetailMyChatComponent.prototype.subscribeToEventsHidenmes = function () {
        var _this = this;
        var sb = this.messageService.hidenmess.subscribe(function (res) {
            if (res) {
                var item = {
                    IdGroup: _this.id_Group, IdChat: res
                };
                _this.messageService.MyChatHidden$.next(item);
                var index = _this.listMess.findIndex(function (x) { return x.IdChat == res; });
                if (index >= 0) {
                    _this.listMess[index].IsHidenAll = true;
                    _this.changeDetectorRefs.detectChanges();
                }
            }
        });
    };
    DetailMyChatComponent.prototype.subscribeToEventsLasttimeMess = function () {
        var _this = this;
        var sb = this.messageService.lasttimeMess.subscribe(function (res) {
            if (res) {
                var index = _this.listMess.findIndex(function (x) { return x.IdChat == res.IdChat; });
                if (index >= 0 && res.IsFile) {
                    _this.listMess[index].isHidenTime = true;
                    _this.changeDetectorRefs.detectChanges();
                }
                else {
                    _this.loadDataList();
                }
                // this.loadDataList();
            }
            //  this.loadDataList();
        });
    };
    DetailMyChatComponent.prototype.subscribeToEventsComposing = function () {
        var _this = this;
        this._ngZone.run(function () {
            var sb = _this.messageService.ComposingMess.subscribe(function (res) {
                if (res) {
                    if (_this.UserId != res.UserId && _this.id_Group == res.IdGroup) {
                        _this.composing = true;
                        _this.composingname = res.Name;
                        setTimeout(function () {
                            _this.composing = false;
                        }, 3000);
                        _this.changeDetectorRefs.detectChanges();
                    }
                }
            });
            _this._subscriptions.push(sb);
        });
    };
    DetailMyChatComponent.prototype.subscribeToEventsNewMess = function () {
        var _this = this;
        this.composing = false;
        var sb = this.messageService.Newmessage.subscribe(function (res) {
            //  console.log("MMMMMMMMMMM",res)
            if (_this.listMess !== null) {
                if (_this.listMess.length > 0 && res.length > 0) {
                    var index = _this.listMess.findIndex(function (x) { return x.IdGroup == res[0].IdGroup; });
                    if (index >= 0) {
                        if (res.length > 0) {
                            _this.id_chat_notify = res[0].IdChat;
                            var index_1 = _this.listMess.findIndex(function (x) { return x.IdChat == res[0].IdChat; });
                            if (index_1 >= 0) {
                                return;
                            }
                            else {
                                _this._ngZone.run(function () {
                                    if (res.length > 0) {
                                        // this.lstChatMess.splice(0,1,res[0])
                                        _this.listMess = __spreadArrays(_this.listMess, [res[0]]);
                                        // this.lstChatMess==[];
                                        _this.viewPort.scrollToIndex(_this.listMess.length - 1, 'smooth');
                                        if (_this.listChoseTagGroup.length > 0) {
                                            var notify = _this.ItemNotifyMessenger(res[0].Content_mess, res[0].IdChat);
                                            _this.chatService.publishNotifi(notify).subscribe(function (res) {
                                            });
                                        }
                                        setTimeout(function () {
                                            _this.viewPort.scrollTo({
                                                bottom: 0,
                                                behavior: 'auto'
                                            });
                                        }, 0);
                                        setTimeout(function () {
                                            _this.viewPort.scrollTo({
                                                bottom: 0,
                                                behavior: 'auto'
                                            });
                                        }, 50);
                                        setTimeout(function () {
                                            _this.viewPort.scrollTo({
                                                bottom: 0,
                                                behavior: 'auto'
                                            });
                                        }, 100);
                                        setTimeout(function () {
                                            _this.viewPort.scrollTo({
                                                bottom: 0,
                                                behavior: 'auto'
                                            });
                                        }, 200);
                                        _this.changeDetectorRefs.detectChanges();
                                    }
                                    else {
                                        return;
                                    }
                                });
                            }
                        }
                    }
                }
            }
            else {
                if (res.length > 0) {
                    _this._ngZone.run(function () {
                        _this.lstChatMess.push(res[0]);
                        if (_this.lstChatMess.length > 0) {
                            _this.listMess = [];
                            _this.listMess = __spreadArrays(_this.listMess, [_this.lstChatMess[_this.lstChatMess.length - 1]]);
                            _this.lstChatMess == [];
                            _this.viewPort.scrollToIndex(_this.listMess.length - 1);
                            _this.changeDetectorRefs.detectChanges();
                        }
                    });
                }
                else {
                    return;
                }
            }
        });
        this._subscriptions.push(sb);
    };
    DetailMyChatComponent.prototype.subscribeToEvents = function () {
        var _this = this;
        this._ngZone.run(function () {
            _this.presence.onlineUsers$.subscribe(function (res) {
                if (res) {
                    setTimeout(function () {
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].JoinGroup === "changeActive") {
                                _this.SetActive(res[i].UserId, true);
                            }
                            else {
                                _this.SetActive(res[i].UserId, false);
                            }
                        }
                    }, 1000);
                }
            });
        });
    };
    DetailMyChatComponent.prototype.SetActive = function (item, active) {
        var _this = this;
        if (active === void 0) { active = true; }
        setTimeout(function () {
            var index = _this.listInfor.findIndex(function (x) { return x.UserId === item; });
            if (index >= 0) {
                _this.listInfor[index].Active = active ? 1 : 0;
                _this.changeDetectorRefs.detectChanges();
            }
        }, 500);
    };
    // send mess
    DetailMyChatComponent.prototype.ItemMessenger = function () {
        var item = new message_1.Message();
        item.Content_mess = this.messageContent.replace("<p><br></p>", "");
        item.UserName = this.userCurrent;
        item.IdGroup = this.id_Group;
        if (this.listReply.length > 0) {
            if (this.listReply[0].Content_mess === "") {
                item.Note = this.listReply[0].InfoUser[0].Fullname + ": Tệp đính kèm";
            }
            else {
                item.Note = this.listReply[0].InfoUser[0].Fullname + ":" + this.listReply[0].Content_mess;
            }
        }
        else {
            item.Note = "";
        }
        item.IsDelAll = false;
        item.IsVideoFile = this.url ? true : false;
        item.Attachment = this.AttachFileChat.slice();
        return item;
    };
    DetailMyChatComponent.prototype.NotifyTagName = function (content) {
        var _this = this;
        for (var i = 0; i < this.lstTagName.length; i++) {
            if (this.lstTagName[i] == "All") {
                this.listTagGroupAll.forEach(function (element) {
                    _this.listChoseTagGroup.push(element.id);
                });
            }
            else {
                var giatri = content.replace('/', "").indexOf("data-id=\"" + this.lstTagName[i]);
                console.log("Check giá tri", giatri);
                if (giatri > -1) {
                    this.listChoseTagGroup.push(this.lstTagName[i]);
                }
            }
        }
        console.log("listChoseTagGroup", this.listChoseTagGroup);
    };
    DetailMyChatComponent.prototype.ItemNotifyMessenger = function (content, idchat) {
        var item = new NotifyMess_1.NotifyMessage();
        item.TenGroup = this.TenGroup;
        item.Avatar = this.Avataruser;
        item.IdChat = idchat;
        item.IdGroup = this.id_Group;
        item.Content = content;
        item.ListTagname = this.listChoseTagGroup;
        return item;
    };
    DetailMyChatComponent.prototype.sendMessage = function () {
        var _this = this;
        // debugger
        this.txttam = "";
        this.messageContent = this.messageContent.replace("<p></p>", "");
        this.NotifyTagName(this.messageContent);
        if ((this.messageContent && this.messageContent != "" && this.messageContent != "<p><br></p>" && this.messageContent.length > 0) || this.AttachFileChat.length > 0) {
            this.isloading = false;
            var data = this.auth.getAuthFromLocalStorage();
            var _token = data.access_token;
            var item = this.ItemMessenger();
            this.messageService.sendMessage(_token, item, this.id_Group).then(function () {
                // this.messageContent="";
                // document.getElementById('content').textContent = '';
                _this.listChoseTagGroup = [];
                _this.lstTagName = [];
                _this.AttachFileChat = [];
                _this.list_file = [];
                _this.listFileChat = [];
                _this.list_image = [];
                _this.listReply = [];
                _this.myFilesVideo = [];
                _this.url = "";
                if (_this.id_Chat) {
                    _this.router.navigate(['Chat/Messages/' + _this.id_Group + '/null']);
                }
                // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
                setTimeout(function () {
                    _this.viewPort.scrollTo({
                        bottom: 0,
                        behavior: 'auto'
                    });
                }, 0);
                setTimeout(function () {
                    _this.viewPort.scrollTo({
                        bottom: 0,
                        behavior: 'auto'
                    });
                }, 50);
                _this.messageForm.reset();
            });
        }
    };
    DetailMyChatComponent.prototype.loadlightbox = function (id) {
        var index = this.listMess.findIndex(function (x) { return x.IdChat == id; });
        this.items = this.listMess[index].Attachment.map(function (item) {
            return {
                type: 'imageViewer',
                data: {
                    src: item.hinhanh,
                    thumb: item.hinhanh
                }
            };
        });
        /** Lightbox Example */
        // Get a lightbox gallery ref
        var lightboxRef = this.gallery.ref('lightbox');
        // Add custom gallery config to the lightbox (optional)
        lightboxRef.setConfig({
            imageSize: ng_gallery_1.ImageSize.Cover,
            thumbPosition: ng_gallery_1.ThumbnailsPosition.Bottom,
            itemTemplate: this.itemTemplate,
            gestures: false
        });
        // Load items into the lightbox gallery ref
        var ob = this.items;
        lightboxRef.load(this.items);
        this.changeDetectorRefs.detectChanges();
    };
    DetailMyChatComponent.prototype.DisplayTime = function (item) {
        var currentDate = new Date(new Date().toUTCString());
        var yearcr = currentDate.getFullYear();
        var monthcr = currentDate.getMonth();
        var daycr = currentDate.getDate();
        var d = item + 'Z';
        var date = new Date(d);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        if (year == yearcr && monthcr == month && daycr == day) {
            return hour + ':' + minute + ' Hôm nay';
        }
        else if (year == yearcr && monthcr == month && daycr - day == 1) {
            return hour + ':' + minute + ' Hôm qua';
        }
        else {
            var tz = moment.tz.guess();
            var d_1 = item + 'Z';
            var dec = moment(d_1);
            return dec.tz(tz).format(' HH:mm DD/MM/YYYY');
        }
    };
    DetailMyChatComponent.prototype.urlify = function (item) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return item.replace(urlRegex, function (url) {
            return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
        });
    };
    DetailMyChatComponent.prototype.onPaste = function (event) {
        var _this = this;
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        var blob = null;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (item.type.indexOf('image') === 0) {
                blob = item.getAsFile();
            }
        }
        // load image if there is a pasted image
        if (blob !== null) {
            var base64Str_1;
            var file_name = blob;
            var reader = new FileReader();
            reader.onload = function (evt) {
                // console.log(evt.target.result); // data url!
                _this.list_image.push(evt.target.result);
                var metaIdx = _this.list_image[0].indexOf(';base64,');
                base64Str_1 = _this.list_image[0].substr(metaIdx + 8);
                _this.AttachFileChat.push({ filename: file_name.name, type: file_name.type, size: file_name.size, strBase64: base64Str_1 });
                _this.changeDetectorRefs.detectChanges();
            };
            reader.readAsDataURL(blob);
        }
    };
    DetailMyChatComponent.prototype.GetListReaction = function () {
        var _this = this;
        this.chatService.getlist_Reaction().subscribe(function (res) {
            _this.list_reaction = res.data;
            _this.changeDetectorRefs.detectChanges();
        });
    };
    DetailMyChatComponent.prototype.SendReaction = function (idchat, type) {
        var dt = this.auth.getAuthFromLocalStorage();
        this.messageService.ReactionMessage(dt.access_token, this.id_Group, idchat, type);
    };
    DetailMyChatComponent.prototype.subscribeToEventsSendReaction = function () {
        var _this = this;
        this._ngZone.run(function () {
            var sb = _this.messageService.reaction.subscribe(function (res) {
                // console.log("REACTION",res)
                if (res) {
                    var index = _this.listMess.findIndex(function (x) { return x.IdChat == res.data[0].IdChat; });
                    if (index >= 0) {
                        _this.listMess[index].ReactionChat = res.data[0].ReactionChat.slice();
                        if (res.data[0].ReactionUser.CreateBy == _this.UserId) {
                            _this.listMess[index].ReactionUser = Object.assign(res.data[0].ReactionUser);
                        }
                        _this.changeDetectorRefs.detectChanges();
                    }
                }
            });
            _this._subscriptions.push(sb);
        });
    };
    DetailMyChatComponent.prototype.subscribeToEventsSeenMess = function () {
        var _this = this;
        this._ngZone.run(function () {
            var sb = _this.messageService.seenmess.subscribe(function (res) {
                if (res && res.status == 1) {
                    if (res.data[0].IdGroup === _this.id_Group && res.data[0].UserName !== _this.userCurrent) {
                        if (!_this.isGroup) {
                            _this.listMess[_this.listMess.length - 1].Seen.splice(0, 1, res.data[0]);
                        }
                        else {
                            // let vitri= this.listMess[this.listMess.length-1].Seen
                            // .findIndex(x=>x.username==res.data[0].UserName)
                            // console.log("AAAA",vitri)
                            // if(vitri<0)
                            // {
                            _this.listMess[_this.listMess.length - 1].Seen = res.data;
                            _this.changeDetectorRefs.detectChanges();
                            // }
                        }
                    }
                    // setTimeout(() => {
                    //   this.active_SeenMess=false;
                    // }, 600000);
                    // if(res.IdGroup)
                    // let index=this.listMess.findIndex(x=>x.IdChat==res.data[0].IdChat);
                    //   if(index>=0)
                    //   {
                    //     this.listMess[index].ReactionChat=res.data[0].ReactionChat.slice();
                    //     this.listMess[index].ReactionUser=Object.assign(res.data[0].ReactionUser);
                    //     this.changeDetectorRefs.detectChanges();
                    //   }
                }
            });
            _this._subscriptions.push(sb);
        });
    };
    DetailMyChatComponent.prototype.InsertRectionChat = function (idchat, type) {
        this.SendReaction(idchat, type);
    };
    DetailMyChatComponent.prototype.toggleWithGreeting = function (idChat, type) {
        var _this = this;
        this.chatService.GetUserReaction(idChat, type).subscribe(function (res) {
            _this.listreaction = res.data;
            _this.changeDetectorRefs.detectChanges();
        });
    };
    DetailMyChatComponent.prototype.ItemSeenMessenger = function () {
        var item = new SeenMess_1.SeenMessModel();
        item.Avatar = this.Avataruser;
        item.CreatedBy = this.UserId;
        item.CustomerId = this.customerID;
        item.Fullname = this.Fullname;
        item.id_chat = this.listMess[this.listMess.length - 1].IdChat;
        item.username = this.userCurrent;
        item.IdGroup = this.id_Group;
        return item;
    };
    DetailMyChatComponent.prototype.DeleteReply = function () {
        this.listReply = [];
    };
    DetailMyChatComponent.prototype.ChuyenTiepMess = function (item) {
        var _this = this;
        // this.dcmt.body.classList.add('header-fixed');
        var dialogRef = this.dialog.open(share_message_component_1.ShareMessageComponent, {
            width: '600px',
            data: { item: item }
        });
        dialogRef.afterClosed().subscribe(function (res) {
            if (res) {
                //   const data = this.auth.getAuthFromLocalStorage();
                // this.presence.NewGroup(data.access_token,res[0],res[0])
                _this.changeDetectorRefs.detectChanges();
            }
        });
    };
    // begin call video
    DetailMyChatComponent.prototype.CallVideoDialog = function (code, callName, img, bg) {
        var _this = this;
        var dl = { isGroup: this.isGroup, UserName: this.userCurrent, BG: bg, Avatar: img, PeopleNameCall: callName, status: code, idGroup: this.id_Group, keyid: null };
        var dialogRef = this.dialog.open(call_video_component_1.CallVideoComponent, {
            //  width:'800px',
            //    height:'800px',
            data: { dl: dl },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(function (res) {
            console.log("Tắt Cuộc gọi..gửi tin nhắn ", res);
            if (res) {
                var item = new message_1.Message();
                if (res.timecall.replace(/""/, "") == '"0:0"') {
                    res.status == 'call' ? item.Content_mess = "Đã lỡ cuộc gọi" : item.Content_mess = "Đã lỡ video call";
                }
                else {
                    res.status == 'call' ? item.Content_mess = "Cuộc gọi thoại" : item.Content_mess = "Video call";
                }
                item.UserName = res.UserName;
                item.IdGroup = _this.id_Group;
                item.isCall = true;
                item.Note = res.timecall.replace(/""/, "");
                item.IsDelAll = false;
                item.IsVideoFile = _this.url ? true : false;
                item.Attachment = _this.AttachFileChat.slice();
                var data = _this.auth.getAuthFromLocalStorage();
                var _token = data.access_token;
                _this.messageService.sendMessage(_token, item, _this.id_Group).then(function () {
                    // this.messageContent="";
                    // document.getElementById('content').textContent = '';
                    _this.listChoseTagGroup = [];
                    _this.lstTagName = [];
                    _this.AttachFileChat = [];
                    _this.list_file = [];
                    _this.listFileChat = [];
                    _this.list_image = [];
                    _this.listReply = [];
                    _this.myFilesVideo = [];
                    _this.url = "";
                    // if(this.id_Chat)
                    // {
                    //   this.router.navigate(['Chat/Messages/'+this.id_Group+'/null']);
                    // }
                    // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
                    setTimeout(function () {
                        _this.viewPort.scrollTo({
                            bottom: 0,
                            behavior: 'auto'
                        });
                    }, 0);
                    setTimeout(function () {
                        _this.viewPort.scrollTo({
                            bottom: 0,
                            behavior: 'auto'
                        });
                    }, 50);
                });
            }
        });
    };
    DetailMyChatComponent.prototype.screenShare = function () {
        this.shareScreen();
    };
    DetailMyChatComponent.prototype.shareScreen = function () {
        var _this = this;
        // @ts-ignore
        navigator.mediaDevices.getDisplayMedia({
            video: {
            // cursor: 'always'
            },
            audio: {
                echoCancellation: true
            }
        }).then(function (stream) {
            var videoTrack = stream.getVideoTracks()[0];
            videoTrack.onended = function () {
                _this.stopScreenShare();
            };
            var sender = _this.currentPeer.getSenders().find(function (s) { return s.track.kind === videoTrack.kind; });
            sender.replaceTrack(videoTrack);
        })["catch"](function (err) {
            console.log('Unable to get display media ' + err);
        });
    };
    DetailMyChatComponent.prototype.stopScreenShare = function () {
        var videoTrack = this.lazyStream.getVideoTracks()[0];
        var sender = this.currentPeer.getSenders().find(function (s) { return s.track.kind === videoTrack.kind; });
        sender.replaceTrack(videoTrack);
    };
    DetailMyChatComponent.prototype.ngOnDestroy = function () {
        console.log('%c DetailDestroy ', 'background: red; color: #bada55');
        if (this._subscriptions) {
            this._subscriptions.forEach(function (sb) { return sb.unsubscribe(); });
        }
        //  this.messageService.Newmessage.unsubscribe();
    };
    DetailMyChatComponent.prototype.loadlightboxImage = function () {
        this.items = this.LstImagePanel.map(function (item) {
            return {
                type: 'imageViewer',
                data: {
                    src: item.hinhanh,
                    thumb: item.hinhanh
                }
            };
        });
        /** Lightbox Example */
        // Get a lightbox gallery ref
        var lightboxRef = this.gallery.ref('lightbox');
        // Add custom gallery config to the lightbox (optional)
        lightboxRef.setConfig({
            imageSize: ng_gallery_1.ImageSize.Cover,
            thumbPosition: ng_gallery_1.ThumbnailsPosition.Bottom,
            itemTemplate: this.itemTemplate,
            gestures: false
        });
        // Load items into the lightbox gallery ref
        var ob = this.items;
        lightboxRef.load(this.items);
        this.changeDetectorRefs.detectChanges();
    };
    DetailMyChatComponent.prototype.Back = function () {
        this.allfile = false;
    };
    DetailMyChatComponent.prototype.selectTab = function (tabId) {
        var _this = this;
        this.allfile = true;
        setTimeout(function () {
            var _a;
            if ((_a = _this.staticTabs) === null || _a === void 0 ? void 0 : _a.tabs[tabId]) {
                _this.staticTabs.tabs[tabId].active = true;
            }
        }, 100);
    };
    DetailMyChatComponent.prototype.LoadFile = function (idgroup) {
        var _this = this;
        this.chatService.GetAllFile(idgroup)
            .subscribe(function (res) {
            _this.LstFilePanel = res.data;
            _this.filteredFile.next(_this.LstFilePanel.slice());
            _this.changeDetectorRefs.detectChanges();
        });
    };
    DetailMyChatComponent.prototype.filterBankGroups = function () {
        if (!this.list_file) {
            return;
        }
        // get the search keyword
        var search = this.searchControl.value;
        // const bankGroupsCopy = this.copyGroups(this.list_group);
        if (!search) {
            this.filteredFile.next(this.LstFilePanel.slice());
        }
        else {
            search = search.toLowerCase();
        }
        this.filteredFile.next(this.LstFilePanel.filter(function (bank) { return bank.filename.toLowerCase().indexOf(search) > -1; }));
    };
    DetailMyChatComponent.prototype.toogleNav = function (nav) {
        if (nav.opened) {
            this.colornav = true;
            nav.close();
        }
        else {
            this.colornav = false;
            nav.open();
        }
    };
    __decorate([
        core_1.ViewChild('myPopoverC', { static: true })
    ], DetailMyChatComponent.prototype, "myPopover");
    __decorate([
        core_1.ViewChild('messageForm')
    ], DetailMyChatComponent.prototype, "messageForm");
    __decorate([
        core_1.Input()
    ], DetailMyChatComponent.prototype, "id_Group");
    __decorate([
        core_1.Input()
    ], DetailMyChatComponent.prototype, "id_Chat");
    __decorate([
        core_1.ViewChild(scrolling_1.CdkVirtualScrollViewport)
    ], DetailMyChatComponent.prototype, "viewPort");
    __decorate([
        core_1.ViewChild('scrollMe')
    ], DetailMyChatComponent.prototype, "scrollMeChat");
    __decorate([
        core_1.ViewChild(expansion_1.MatAccordion)
    ], DetailMyChatComponent.prototype, "accordion");
    __decorate([
        core_1.HostListener('scroll', ['$event'])
    ], DetailMyChatComponent.prototype, "scrollHandler");
    __decorate([
        core_1.ViewChild('itemTemplate', { static: true })
    ], DetailMyChatComponent.prototype, "itemTemplate");
    __decorate([
        core_1.ViewChild(ngx_quill_1.QuillEditorComponent, { static: true })
    ], DetailMyChatComponent.prototype, "editor");
    __decorate([
        core_1.ViewChild('staticTabs', { static: false })
    ], DetailMyChatComponent.prototype, "staticTabs");
    DetailMyChatComponent = __decorate([
        core_1.Component({
            selector: 'app-detail-my-chat',
            templateUrl: './detail-my-chat.component.html',
            styleUrls: ['./detail-my-chat.component.scss'],
            animations: [expansion_1.matExpansionAnimations.bodyExpansion]
        })
    ], DetailMyChatComponent);
    return DetailMyChatComponent;
}());
exports.DetailMyChatComponent = DetailMyChatComponent;
