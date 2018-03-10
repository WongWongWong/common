cm.BaseLoadingView = cc.Node.extend({
    isShow:false,
    ctor:function () {
        this._super();

    },

    setPercent:function(percent){

    },

    setLabel:function (str) {

    },

    show:function (parent) {
        this.isShow = true
        parent.addChild(this);
    },

    hide:function () {
        this.isShow = false
        this.removeFromParent();
    },

    getIsShow:function () {
        return this.isShow;
    }
});