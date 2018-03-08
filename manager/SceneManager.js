cm.SceneManager = {
    curScene:null,                      //当前场景
    NextScene:null,                     //下一个场景

    touchLayer:null,                    //点击层
    sceneLayer:null,                    //场景层
    loadingLayer:null,                  //加载层
    transitionLayer:null,               //过度层
    maskLayer:null,                     //遮罩层

    transition:null,

    loadtool:null,
    isRunLoad:false,
    loadingview:null,

    scenestack:[],                          //场景堆栈
    deflastscene:null,                      //最后的场景

    TransitionEndFun:function(){
        if(this.isRunLoad){
            this.loadtool.runLoad();
        }
    },

    TransitionMidFun:function(){
        if(this.isRunLoad){
            this.initLoading();
            this.releaseCurScene();
        }
        else{
            this.runNextScene();
        }
    },

    initTransition:function () {
        if(this.transition){
            this.transition.release();
            this.transition = null;
        }

        this.transition = new cm.TransitionAnim();
        this.transition.init(this.transitionLayer,this.TransitionMidFun.bind(this),this.TransitionEndFun.bind(this));

        if(this.NextScene.ransitionInfo){
            var csbpath = this.NextScene.ransitionInfo.csbpath;
            var animationIn = this.NextScene.ransitionInfo.animationIn;
            var animationOut  = this.NextScene.ransitionInfo.animationOut;
            this.transition.setCsbInfo(csbpath,animationIn,animationOut)
        }
        else{
            this.transition.setCsbInfo(nil,nil,nil)
        }
    },

    runTransition:function(){
        this.transition.playAnim();
    },

    releaseCurScene:function(){
        if(this.curScene){
            this.curScene.removeScene();
        }
    },

    runNextScene:function(){
        this.releaseCurScene();

        if(this.NextScene){
            this.curScene = this.NextScene;
            this.NextScene = null;

            //预加载大图
            var plist = this.curScene.plist;
            if(plist){
                for(var index in plist){
                    var path = plist[index];
                    cc.spriteFrameCache.addSpriteFrames(path);
                }
            }

            //预加载exportjson
            var exportjson = this.curScene.exportjson;
            if(exportjson){
                for(var index in exportjson){
                    var path = exportjson[index];
                    ccs.armatureDataManager.addArmatureFileInfo(path);
                }
            }

            //清理所有节点
            this.hideLoadingView();
            this.sceneLayer.removeAllChildren();
            this.loadingLayer.removeAllChildren();

            this.curScene.initScene(this.sceneLayer);

            this.hideMask();
        }
        else{
            cc.error("NextScene is empty");
        }
    },

    reSetCurScene:function(midfunc){
        if(!this.curScene){
            return;
        }

        this.NextScene = this.curScene;

        this.releaseCurScene();

        if(midfunc){
            midfunc();
        }

        this.runNextScene();
    },

    setLoadingView:function (view) {
        this.loadingview = view;
    },

    initLoading:function(){
        if(!this.loadtool){
            var res = this.NextScene.getRes();
            this.loadtool = new cm.LoadingTool(res);
            this.loadtool.initFunc(this.setPercent.bind(this),this.loadingComplete.bind(this));
            this.showLoadingView();
        }
    },

    removeLoading:function () {
        if(this.loadtool){
            this.loadtool.clean();
            this.loadtool = null;
        }
    },

    showLoadingView:function () {
        if(this.loadingview){
            this.loadingview.show(this.loadingLayer);
            this.loadingview.setPercent(0);
            this.loadingview.setLabel("0%");
        }
    },

    hideLoadingView:function () {
        if(this.loadingview){
            this.loadingview.hide();
        }
    },

    loadingComplete:function(){
        this.removeLoading();
        this.isRunLoad = false;

        if(this.NextScene.isTransition){
            this.runTransition();
        }
        else {
            this.runNextScene();
        }
    },

    init:function(parent){
        this.touchLayer = new cc.Layer();
        parent.addChild(this.touchLayer,0);

        this.sceneLayer = new cc.Layer();
        parent.addChild(this.sceneLayer,1);

        this.loadingLayer = new cc.Layer();
        parent.addChild(this.loadingLayer,2);

        this.transitionLayer = new cc.Layer();
        parent.addChild(this.transitionLayer,3);

        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMove.bind(this),
            onTouchEnded: this.onTouchEnd.bind(this),
            onTouchCancelled: this.onTouchCancel.bind(this),
        };
        cc.eventManager.addListener(listener,this.touchLayer);

    },

    onTouchBegan:function(touch,event){
        if(this.curScene){
            var sceneIns = this.curScene.getScene();
            if(sceneIns){
                if(sceneIns.onTouchBegin){
                    return sceneIns.onTouchBegin(touch,event);
                }
            }
        }
        return false
    },

    onTouchMove:function(touch,event){
        if(this.curScene){
            var sceneIns = this.curScene.getScene();
            if(sceneIns){
                if(sceneIns.onTouchMove){
                    sceneIns.onTouchMove(touch,event);
                }
            }
        }
    },

    onTouchEnd:function(touch,event){
        if(this.curScene){
            var sceneIns = this.curScene.getScene();
            if(sceneIns){
                if(sceneIns.onTouchEnd){
                    sceneIns.onTouchEnd(touch,event);
                }
            }
        }
    },

    onTouchCancel:function(touch,event){
        if(this.curScene){
            var sceneIns = this.curScene.getScene();
            if(sceneIns){
                if(sceneIns.onTouchCancel){
                    sceneIns.onTouchCancel(touch,event);
                }
            }
        }
    },

    setNextScene:function(scene){
        this.showMask();
        this.addLastScene();

        this.gotoNextScene(scene);
    },

    gotoNextScene:function(scene){
        this.removeLoading();
        this.NextScene = scene;

        if(this.NextScene.isTransition){

            this.initTransition();

            this.isRunLoad = this.NextScene.isLoading;

            if(this.loadingview && this.loadingview.getIsShow() && this.isRunLoad){
                this.initLoading();
                this.delayRunLoad();
            }
            else{
                this.runTransition();
            }
        }
        else if(this.NextScene.isLoading){
            this.isRunLoad = true;
            this.initLoading();
            this.delayRunLoad();
            this.releaseCurScene();
        }
        else{
            this.runNextScene();
        }
    },

    delayRunLoad:function(){
        var delaytime = new cc.DelayTime(1/60);
        var func = function(){
            this.loadtool.runLoad();
        };
        var callfunc = new cc.CallFunc(func.bind(this));
        var ary = [
            delaytime,
            callfunc
        ];
        var seq = new cc.Sequence(ary);
        this.loadingLayer.runAction(seq);
    },

    onUpdate:function(dt){
        if(this.curScene){
            var sceneIns = this.curScene.getScene();
            if(sceneIns && sceneIns.update){
                sceneIns.update(dt);
            }
        }
    },

    setPercent:function(percent,curcount,totalcount){
        if(!this.loadingview){
            return;
        }

        this.loadingview.setLabel(percent.toString()+"%");
        this.loadingview.setPercent(percent);
    },

    enterBackground:function(){
        if(this.curScene){
            var sceneIns = this.curScene.getScene();
            if(sceneIns && sceneIns.enterBackground){
                sceneIns.enterBackground();
            }
        }
    },

    enterForeground:function(){
        if(this.curScene){
            var sceneIns = this.curScene.getScene();
            if(sceneIns && sceneIns.enterForeground){
                sceneIns.enterForeground();
            }
        }
    },

    getCurSceneBGM:function () {
        if (this.curScene){
            return this.curScene.bgmPath || "";
        }
       return "";
    },

    setDefLastScene:function(scene){
        this.deflastscene = scene;
    },

    addLastScene:function () {
        this.scenestack.length = this.scenestack.push(this.curScene);
    },

    backToLastScene:function () {
        var len = this.scenestack.length;
        var lastscene = null;
        if(len !== 0){
            lastscene = this.scenestack[len - 1];
        }
        else{
            lastscene = this.deflastscene;
        }

        if(!lastscene){
            cc.error("[*] the last scene is null");
        }
        else{
            this.gotoNextScene(lastscene);
        }

    },

    showMask:function (color) {
        console.log("[*] show scene mask");
        this.hideMask();
        this.maskLayer = cm.showMask(this.transitionLayer,4,color || cc.color(0,0,0,0),null,null,"SceneManager Mask");
    },

    hideMask:function () {
        if(this.maskLayer){
            this.maskLayer.removeFromParent();
            this.maskLayer = null;
        }
    }
};