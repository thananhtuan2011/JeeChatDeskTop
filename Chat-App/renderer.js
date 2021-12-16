

const NOTIFICATION_TITLE = 'Title'
const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
const CLICK_MESSAGE = 'Notification clicked!'
function desktop_notify(data) {
console.log("Noty",data.detail)
let icon_notify="";
if(data.detail.isGroup)
{
    icon_notify="https://cdn.jee.vn/jee-chat/Icon/JeeChat.png"
}
else
{
    icon_notify=data.detail.avatar
}

new Notification(data.detail.title, { body: data.detail.message,
 icon:icon_notify })
 .onclick = () =>{
    //  console.log("chạy tới",data.detail.title)
     newMessageHandler(data)
 }
}


// event handler function
function newMessageHandler(e) {
   
    e.detail.myservice.notify$.next(e.detail); 
    // console.log(e.detail.myservice.getLanguage());
}
//adding listener to custom event.
