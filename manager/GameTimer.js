cm.GameTimer = {
    timerlist:[],

    registerTimer:function (timeid,time,callback,loopcount) {
        if(!this.timerlist[timeid]){
            this.timerlist[timeid] = [];
        }

        var data = {
            timeid:timeid,
            time: time,
            curtime: time,
            callback: callback,
            loop:loopcount || 1
        };

        this.timerlist[timeid].push(data);
    },

    removeTimer:function (timeid,callback) {
        if(!this.timerlist[timeid]){
            return;
        }

        if(!callback){
            this.timerlist[timeid] = [];
        }

        var datalist = this.timerlist[timeid];
        for(var index in datalist){
            var data = datalist[index];
            if(callback === data.callback){
                datalist.splice(index,1);
                break;
            }
        }
    },

    update:function (dt) {
        var dellist = [];
        for(var i in this.timerlist){
            var list = this.timerlist[i];

            for(var index in list){
                var data = list[index];

                var curtime = data.curtime - dt;
                if (curtime <= 0){
                    if(data.callback){
                        data.callback(Math.abs(curtime)+data.time);
                    }

                    // -1为无限循环
                    if(data.loop !== -1){
                        data.loop--;
                    }

                    if(data.loop === 0){
                        dellist.push(data);
                    }
                    else{
                        data.curtime = data.time;
                    }
                }
                else{
                    data.curtime = curtime;
                }
            }
        }

        //删除
        for(var index in dellist){
            var data = dellist[index];
            this.removeTimer(data.timeid,data.callback);
        }
    }
};