// text for notification
var icon = "";
var title = "Torrent";

// click handler
var torrentClick = function(evt){
    evt.preventDefault();
    var href = this.href;

    var message = "Torrent added:" + href.split('/').pop();

    if (window.webkitNotifications.checkPermission() == 0) {
        window.webkitNotifications.createNotification(icon, title, message).show();
    }else{
        window.webkitNotifications.requestPermission(function(){
            window.webkitNotifications.createNotification(icon, title, message).show();
        });
    }
    safari.self.tab.dispatchMessage("addTorrent", href);
};

// add handler to all torrent links
var links = document.querySelectorAll("a");
for (i in links){
    if (links[i] && links[i].getAttribute){
        var href = (links[i].getAttribute('href')+"").split('?').shift();
        if (href && (href.substring(0,7) === "magnet:" || href.substr(-8) === ".torrent")){
            links[i].removeEventListener("click", torrentClick, false);
            links[i].addEventListener("click", torrentClick, false);
        }
    }
}

// handle events from global
safari.self.addEventListener("message", function(msg){
    switch(msg.name){
        case "log": // handle global console logs
            return console.log("global:", msg.message);
        
        default: // unhandled
            return console.log("tab: " + msg.name, msg);
    }
}, false);
