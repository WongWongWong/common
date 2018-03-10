cm.MessageMark = cc.Class.extend({
    ctor:function () {
        this.markary = [];
    },

    registerMessage:function(msgtype,func) {
        this.markary[msgtype] = func;
        cm.MessageManager.registerEvent(msgtype,func);
    },

    removeMessage:function (msgtype) {
        var func = this.markary[msgtype];
        cm.MessageManager.removeEvent(msgtype,func);
        //删除一个元素并不改变顺序
        delete this.markary[msgtype];
    },

    clean:function () {
        for(var msgtype in this.markary){
            var func = this.markary[msgtype];
            cm.MessageManager.removeEvent(Number(msgtype),func);
        }
        this.markary = [];
    }
});