cm.RDNode = cc.Class.extend({
    ctor:function () {
        this._parent = null;
        this._child = [];
        this._unread = 0;
        this._msgtype = null;
        this._isopen = false;
    },

    _sendMsg:function () {
        if(!this._msgtype){
            return;
        }

        cm.MessageManager.sendOnceMessage(this._msgtype);
    },

    setIsOpen:function (b) {
        this._isopen = b;

        if(b){
            this._unread = 0;
        }
        this._sendMsg();
    },

    getIsOpen:function () {
        return this._isopen;
    },

    setMsgType:function (msgtype) {
        this._msgtype = msgtype;
    },

    addChild:function (child) {
        this._child.push(child);
    },

    setUnRead:function (num) {
        num = Number(num);
        this._unread = num;

        this._sendMsg();
    },

    getUnRead:function () {
        return this._unread;
    },

    addUnRead:function (num) {
        if(this._isopen){
            return;
        }

        if(typeof num == "undefined"){
            num = 1;
        }
        else{
            num = Number(num);
        }

        var cur = this.getUnRead();
        this.setUnRead(cur + num);
    },

    isShow:function () {
        if(this._unread > 0){
            return !this._isopen;
        }

        var len = this._child.length;

        for(var i = 0;i<len;i++){
            var child = this._child[i];
            if(child.isShow()){
                return true;
            }
        }

        return false;
    },
});