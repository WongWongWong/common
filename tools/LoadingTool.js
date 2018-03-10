cm.LoadingTool = cc.Class.extend({
    resources:[],
    percentcall:null,
    endcall:null,

    ctor:function (resources) {
        this.resources = resources || [];
    },

    initFunc:function (percentcall, endcall) {
        this.percentcall = percentcall;
        this.endcall = endcall;
    },

    runLoad:function(){
        cc.loader.load(this.resources,this.schedule.bind(this),this.complete.bind(this));
    },

    schedule:function (result, count, loadedCount) {
        var percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        if(this.percentcall){
            this.percentcall(percent,loadedCount,count);
        }
    },

    complete:function () {
        this.schedule(true,1,1);
        if(this.endcall){
            this.endcall();
        }
    },

    clean:function () {
        this.resources = [];
        this.percentcall = null;
        this.endcall = null;
    }
});