cm.TransitionAnim = cc.Class.extend({
    layer:null,
    midFun:null,
    endFun:null,
    parent:null,
    csbpath:null,
    animationIn:null,
    animationOut:null,
    loader:null,

    setCsbInfo:function (csbpath,animationIn,animationOut) {
        this.csbpath = csbpath;
        this.animationIn = animationIn;
        this.animationOut = animationOut;
    },

    init:function(parent,midFun,endFun){
        this.midFun = midFun;
        this.endFun = endFun;
        this.parent = parent;
    },

    //过度中间要左的事情
    TransitionEndFun:function () {
        if(this.endFun){
            this.endFun();
        }
        if(this.layer){
            this.layer.removeFromParent();
            this.layer = null;
        }
        if(this.loader){
            this.loader.getRoot().removeFromParent();
            this.loader = null;
        }
    },

    //过度切出
    runDefTransitionOut:function () {
        var fo = new cc.FadeTo(0.3,0);
        var callback = new cc.CallFunc(this.TransitionEndFun.bind(this));
        var ary = [fo,callback];
        var seq = new cc.sequence(ary);
        this.layer.runAction(seq);
    },

    //过渡中间要做的事情
    TransitionMidFun:function () {
        if (this.midFun){
            this.midFun();
        }

        if(!this.loader){
            this.runDefTransitionOut();
        }
        else{
            this.playCsbTransitionOut();
        }
    },

    //过度切入
    playAnim:function () {
        if(!this.csbpath){
            this.playDefTransitionIn();
        }
        else{
            this.playCsbTransitionIn();
        }
    },

    playDefTransitionIn:function () {
        if(this.layer){
            this.layer.removeFromParent();
            this.layer = null;
        }
        this.layer = new cc.LayerColor(cc.color(0,0,0,0));
        this.parent.addChild(this.layer);

        var fi = new cc.FadeTo(0.3,255);
        var callback = new cc.CallFunc(this.TransitionMidFun.bind(this));
        var ary = [fi,callback];
        var seq = new cc.Sequence(ary);
        this.layer.runAction(seq);
    },

    playCsbTransitionIn:function () {
        if(this.loader){
            this.loader.getRoot().removeFromParent();
            this.loader = null;
        }

        var winsize = cc.winSize;

        this.loader = new cm.CsbWidgetLoader(this.csbpath);
        var root = this.loader.getRoot();
        root.setPosition(cc.p(winsize.width/2,winsize.height/2));
        this.parent.addChild(root);
        this.loader.play(this.animationIn,false,this.TransitionMidFun.bind(this));
    },

    playCsbTransitionOut:function () {
        this.loader.play(this.animationOut,false,this.TransitionEndFun.bind(this));
    },

    release:function(){
        if(this.layer){
            this.layer.removeFromParent();
            this.layer = null;
        }
        if(this.loader){
            this.loader.getRoot().removeFromParent();
            this.loader = null;
        }
    }
});