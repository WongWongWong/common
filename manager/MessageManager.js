cm.MessageManager = {
    funcMap:[],
    sendList:[],
    keyMap:[],

    regEventSingle:function( msgID , cbFunc ){
        this.removeEvent( msgID );
        if(cbFunc){
            this.registerEvent( msgID , cbFunc );
        }
    },

    registerEvent:function(typenum,func){
        var list = this.funcMap[typenum];

        list = list || [];

        list.length = list.push(func);
        this.funcMap[typenum] = list;
    },

    removeEvent:function (typenum,func) {
        var funcList = this.funcMap[typenum];

        if(funcList){
            if(!func){
                this.funcMap[typenum] = null;
            }
            else{
                for(var i = 0;i<funcList.length;i++){
                    var f = funcList[i];
                    if(f === func){
                        funcList.splice(i,1);
                        break;
                    }
                }
            }
        }
    },

    sendMessage:function (typenum, object) {
        cc.log("[*] MessageManager sendMsg : "+ typenum);
        if(this.funcMap[typenum]){
            var sendData = {
                typenum:typenum,
                param:object
            };
            this.sendList.push(sendData);
        }
    },

    sendOnceMessage:function (typenum,object) {
        if(!this.funcMap[typenum] || this.keyMap[typenum]){
            return;
        }

        this.keyMap[typenum] = true;
        this.sendMessage(typenum,object);
    },

    sendQuickMessage:function (typenum, object) {
        cc.log("[*] MessageManager sendMsg : "+ typenum);
        if(this.funcMap[typenum]){
            var funcList = this.funcMap[typenum];
            if(funcList){
                for(var key in funcList){
                    var func = funcList[key];
                    if(func){
                        func(object);
                    }
                }
            }
        }
    },

    _cpyFuncList:function (list) {
        var newlist = [];
        for(var i in list){
            newlist.push(list[i]);
        }

        return newlist;
    },

    _getFunc:function (func,list) {
        for(var index in list){
            if(func === list[index]){
                return func;
            }
        }

        return null;
    },

    update:function (dt) {
        var semdlist = this.sendList;
        this.sendList = [];
        this.keyMap = [];
        for(var key in semdlist){
            var data = semdlist[key];
            var funcList = this._cpyFuncList(this.funcMap[data.typenum]);
            if(funcList){
                for(var index in funcList){
                    var func = this._getFunc(funcList[index],this.funcMap[data.typenum]);
                    if(func){
                        func(data.param);
                    }
                }
            }
        }
    }
};