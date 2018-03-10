cm.CsbWidgetLoader = cc.Class.extend({
    path: null,
    root: null,
    panel: null,
    actiontag:1231235,
    ctor: function (filename) {
        if (filename) {
            this.loadCsb(filename);
        }
    },

    loadCsb: function (filename) {
        this.path = filename;

        this.root = ccs.csLoader.createNode(filename);

        if (this.root) {
            this.panel = this.root.getChildren()[0];
        }
        else{
            cc.error("[*] load csb path "+filename+" not exists!");
        }
    },

    initWithNode: function (node, filename) {
        this.path = filename;

        this.root = node;
        if (this.root) {
            this.panel = this.root.getChildren()[0];
        }
        else{
            cc.error("[*] load csb path "+filename+" not exists!");
        }

    },

    seekNodeByName:function(root,name){
        return cm.CsbWidgetLoader.seekNodeByName(root,name);
    },

    getWidget:function(name){
        return this.seekNodeByName(this.root,name);
    },

    getRoot:function(){
        return this.root;
    },

    getPath:function(){
        return this.path;
    },

    play:function(name,loop,endcall){
        this.stop();

        var action = this.getAction();
        this.panel.runAction(action);
        action.gotoFrameAndPause(0);
        action.play(name,loop || false);

        var lastframefunc = function(){
            if (endcall){
                endcall();
                endcall = null;
            }
            action.clearLastFrameCallFunc();
        };

        action.setLastFrameCallFunc(lastframefunc);

        return action;
    },

    stop:function(){
        this.panel.stopActionByTag(this.actiontag);
    },

    stopAnim:function(name){

        this.stop();
        var action = this.getAction();
        this.panel.runAction(action);

        var index = 0 ;
        if ( name ) {
            index = action.getStartFrame(name);
        }
        action.gotoFrameAndPause(index);
    },

    getAction:function(){
        var action = ccs.actionTimelineCache.createAction(this.path);
        action.setTag(this.actiontag);

        return action;
    },

    gotoFrameAndPlay:function(index,endcall){
        this.stop();
        var action = this.getAction();

        action.gotoFrameAndPlay(index,false);

        var lastframefunc = function(){
            if (endcall){
                endcall();
            }
        };

        action.setLastFrameCallFunc(lastframefunc);
        this.panel.runAction(action);
    },

    gotoFrameAndPause:function(index){
        this.stop();
        var action = this.getAction();
        this.panel.runAction(action);
        action.gotoFrameAndPause(index);
    },

    playAndRemove:function(name,call){
        var self = this;
        var endcall = function(){
            self.root.removeFromParent();
            if (call){
                call();
            }
        };

        this.play(name,false,endcall);
    },

    getTime_animLen:function(name){
        var action = this.getAction();
        var animInfo = action.getAnimationInfo(name) ;
        var len = 0 ;
        if (animInfo){
            var speed = (1/60) * action.getTimeSpeed();
            len = ( animInfo.endIndex - animInfo.startIndex ) * speed ;
        }
        return len
    },

    setVisible:function(b){
        this.root.setVisible(b);
    },

    getPanel:function () {
        return this.panel;
    },

    setPosition:function (pt) {
        if(this.root){
            this.root.setPosition(pt);
        }
    },

    removeFromParent:function (b) {
        if(this.root){
            this.root.removeFromParent(b);
        }
    }
});

cm.CsbWidgetLoader.seekNodeByName = function (root,name) {
    if (!root){
        return null;
    }

    var rootname = root.getName();
    if(rootname === name){
        return root;
    }

    var arrayRootChildren = root.getChildren();
    for (var i = 0; i < arrayRootChildren.length; i++) {
        var child = arrayRootChildren[i];
        if (child){
            var res = cm.CsbWidgetLoader.seekNodeByName(child,name);
            if (res){
                return res;
            }
        }
    }

    return null;
};