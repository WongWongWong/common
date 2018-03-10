cm.LocalSave = {
    saveData:function (key,object) {
        try {
            cc.sys.localStorage.setItem(key,JSON.stringify(object));
        }
        catch(e) {
            cc.log("[*] Save LocalSave Error: "+ e.name)
        }
    },

    getSaveData:function (key) {
        var data = null;
        try {
            var str = cc.sys.localStorage.getItem(key);
            if(str){
                data = JSON.parse(str);
            }
        }
        catch (e){
            cc.log("[*] Get LocalSave Error: "+ e.name);
        }

        return data;
    },

    saveString:function (key, val) {
        try {
            cc.sys.localStorage.setItem(key,""+val);
        }
        catch(e) {
            cc.log("[*] Save LocalSave Error Key: "+ key+",Value:"+val);
        }
    },

    getString:function (key) {
        var val = null;
        try {
            val = cc.sys.localStorage.getItem(key);
        }
        catch (e){
            cc.log("[*] Get LocalSave Error Key: "+ key);
        }

        return val;
    },

    saveNumber:function (key,val) {
        if(!cc.isNumber(val)){
            cc.log("[*] save LocalSave Number Error Key: "+ key+",Value:"+val);
            return;
        }

        var keyname = key + "_INT";
        var numstr = val.toString();
        this.saveString(keyname,numstr);
    },

    getNumber:function (key,defval) {
        if(!defval){
            defval = 0;
        }

        var keyname = key + "_INT";
        var str = this.getString(keyname);
        if(!str){
            return defval;
        }

        var num = Number(str);
        if(!cc.isNumber(num)){
            return defval;
        }

        return num;
    },

    saveBool:function (key, val) {
        var keyname = key+"_BOOL";
        var bstr = val ? "1" : "0";
        this.saveString(keyname,bstr);
    },

    getBool:function (key, defval) {
        if(!defval){
            defval = false;
        }

        var keyname = key+"_BOOL";
        var str = this.getString(keyname);
        if(!str){
            return defval;
        }

        return str == "1";
    },

    saveObject:function (key,object) {
        var str = JSON.stringify(object);
        this.saveString(key+"_Objcet",str);
    },

    getObject:function (key) {
        var str = this.getString(key+"_Objcet");
        if(!str || str === "undefined"){
            return null;
        }

        return JSON.parse(str);
    }
};