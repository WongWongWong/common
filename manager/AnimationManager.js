cm.AnimationManager = {
    ActionTag:1008611,
    run:function(object,name,isLoop,func,filePath)
    {
        var action = null;
        if (filePath !== "" )
        {
            action = this.bind(object,filePath);
        }
        if (!action){
            return null;
        }
        action.gotoFrameAndPause(0);
        if (name === ""){
            action.gotoFrameAndPlay(0,isLoop);
        }else{
            action.play(name,isLoop);
        }
        if (func)
        {
            action.setLastFrameCallFunc(func);
        }
        return action;
    },
    getAction:function(filePath){
        var action = ccs.actionTimelineCache.createAction(filePath);
        action.setTag(this.ActionTag);
        return action;
    },
    bind:function (object,filePath) {
        var action = this.getAction(filePath);
        if( action ) {
            object.runAction(action)
            action.gotoFrameAndPause(0)
        }
        return action;
    },
    stop:function (node) {
        if (!node){
            return;
        }
        node.stopActionByTag(this.ActionTag);
    },

    stopAnim:function (object,name,filePath) {
        this.stop(object);
        var action = null;
        if (filePath !== ""){
            action = this.bind(object,filePath);
        }
        if (!action ){
            return;
        }

        if ( !name ) {
            action.gotoFrameAndPause(0);
        }
        else{
            var atStartFrame = action.getStartFrame(name);
            action.gotoFrameAndPause(atStartFrame);
        }
    }

};