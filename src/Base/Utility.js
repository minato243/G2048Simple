var Utility = cc.Class.extend({

    ctor: function () {

    },

    setScaleWhenTouch: function (button) {
        button.addTouchEventListener(this.onTouch, this);
    },

    onTouch: function (pSender, event) {
        if (event == ccui.Widget.CONTROL_EVENT_TOUCH_DOWN) {
            pSender.setScale(1.1);
        }

        if (event == ccui.Widget.CONTROL_EVENT_TOUCH_UP_INSIDE
            || event == ccui.Widget.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE
            || event == ccui.Widget.CONTROL_EVENT_TOUCH_CANCEL) {
            pSender.setScale(1);
        }

    }


});

Utility.timeToString = function (time) {
    var date = new Date(time * 1000);
    // Hours part from the timestamp
    var hours = date.getUTCHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    if (hours == "0") var formattedTime = minutes.substr(-2) + ':' + seconds.substr(-2);
    else var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
};

Utility.instance = null;

Utility.getInstance = function () {
    if (Utility.instance == null) {
        Utility.instance = new Utility();
    }
    return Utility.instance;
};

Utility.setScaleWhenTouchButton = function (sender, controlEvent) {
    if (controlEvent == ccui.Widget.TOUCH_BEGAN) {
        sender.setScale(1.1);
    }
    if (controlEvent == ccui.Widget.TOUCH_CANCELED || controlEvent == ccui.Widget.TOUCH_ENDED) {
        sender.setScale(1);
    }
};

Utility.standardNumber = function (number) {
    var tmp = number;
    var result = "";
    if (tmp < 1000) {
        result += tmp;
        return result;
    }

    while (tmp > 0) {
        var b = tmp % 1000;
        tmp = Math.floor(tmp / 1000);
        if (tmp == 0 || b >= 100) result = b + "." + result;
        else if (b < 10) result = '00' + b + "." + result;
        else result = '0' + b + "." + result;
    }
    return result;
};

Utility.decodeString = function(data){
    var id = 1;
    var max = 127 + id;
    var n = data.length;
    cc.log("data = "+ data+", length = "+ n);
    var result = "";
    for (var i = 0; i < n; i++) {
        var ascii = data.charCodeAt(i);
        if (ascii < max) {
            ascii -= id;
            if (result == "")
                result = String.fromCharCode(ascii);
            else
                result += String.fromCharCode(ascii);
        } else {
            if (result == "")
                result = data.charAt(i);
            else
                result += data.charAt(i);
        }
    }
    return result;
};
