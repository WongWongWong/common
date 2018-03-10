cm.GameButton = cc.Class.extend({
    ctor: function (node, call) {
        this.reSet();
        if (node && call) {
            this.init(node, call);
        }
    },

    reSet: function () {
        this._listener = null;
        this._node = null;
        this._callback = null;
        this._beginCall = null;
        this._defScale = 1;
        this._touchEnable = true;
        this._actionTag = 12987;
        this.TempRect = null;
        this.scaleenable = true;

        this.isRunning = false;

        this.isVisible = false;
        this.touchEndEff = null;
        this.ImageScale = null;
        this.BtnActionScale = 0.7;
        this.clipping = null;
        this._holdcall = null;
        this.lasttime = 0;
        this.schedulercall = null;
    },

    init: function (node, callback) {
        this.clean();
        this._node = node;
        this._node.retain();
        this._callback = callback;
        this.isVisible = true;
        node.setScaleY( node.getScaleX() );
        this._defScale = node.getScale();
        this.ImageScale = this._defScale;
        this._listener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                return this.onTouchBegan(touch,event);
            }.bind(this),
            onTouchMoved: function(touch, event){
                this.onTouchMoved(touch,event);
            }.bind(this),
            onTouchEnded: function(touch, event){
                this.onTouchEnded(touch,event);
            }.bind(this),
        }, node);
    },
    getRoot: function () {
        return this._node ;
    },

    clean: function () {
        if (this._node) {
            cc.eventManager.removeListener(this._listener);
            this._node.setScale(this._defScale);
            this._node.release();
        }
        this.reSet();
    },

    onTouchBegan: function (touch, event) {
        if(!this.bool_canDoubleClick){
            var time = new Date() - 0;
            if(time - this.lasttime < 500){
                return false;
            }
        }

        if (!this._node.isVisible() || !this.isVisible) {
            return false;
        }
        if (!this._touchEnable) {
            return false;
        }
        var p = touch.getLocation();
        var rect = this.getNodeRect(this._node, this._defScale);
        if (!this.containsPoint(p, rect)) {
            return false;
        }
        this.TempRect = rect;
        //缩小动画
        this.runShrink();
        if(this._beginCall){
            this._beginCall();
        }
        this.lasttime = time;

        if(this._holdcall){
            this.schedulercall = this.update.bind(this);
            cc.director.getRunningScene().schedule(this.schedulercall, 0.16);
        }
        return true
    },
    onTouchMoved: function (touch, event) {
        var p = touch.getLocation();
        if (this.TempRect) {
            if (!this.containsPoint(p, this.TempRect)) {
                //todo放大动画
                this.runMagnify();
                this.TempRect = null;
            }
        }
    },
    onTouchEnded: function (touch, event) {
        this.schedulercall && cc.director.getRunningScene().unschedule(this.schedulercall);
        this.schedulercall = null;
        if(this._holdcall && this._callback ){
            this._callback()
        }

        if (!this.TempRect) {
            return;
        }

        //todo放大动画
        this.runMagnify();

        var p = touch.getLocation();
        //检测矩形
        if (this.clipping) {
            if (!this.containsPoint(p, this.clipping)) {
                cc.log("[*] touch not in clipping");
                return;
            }
        }

        if (this.containsPoint(p, this.TempRect)) {
            //SoundTool.playEff(gamemusic.btn_click);
            if (this._callback && !this._holdcall) {
                this._callback()
            }
        }
        this.TempRect = null;
    },

    getNodeRect: function (node, defScale) {
        var rect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        //定义矩形
        var size = node.getContentSize();
        var worldPt = node.convertToWorldSpace(cc.p(0, 0));
        var scale = defScale;
        rect.x = worldPt.x;
        rect.y = worldPt.y;
        rect.width = size.width * scale;
        rect.height = size.height * scale;

        return rect
    },

    resetScale: function () {
        // if (this._node) {
        //     this._node.setScale(this._defScale);
        // }
        this.runMagnify();
    },
    isEnable:function () {
        return this._touchEnable;
    },
    setEnable: function (b) {
        this._touchEnable = b ;
        // this.resetScale();
        this.runMagnify();
    },
    setVisible: function (b) {
        if (this._node) {
            this._node.setVisible(b);
            this.isVisible = b;
        }
    },
    setBeginCall: function (call) {
        this._beginCall = call;
    },

    containsPoint: function (point, rect) {
        if (point.x > rect.x && point.y > rect.y &&
            point.x < rect.x + rect.width && point.y < rect.y + rect.height) {
            return true;
        }
        return false;
    },

    setCanDoubleClick: function () {
        this.bool_canDoubleClick = true ;
    },

    //缩小动画
    runShrink: function () {
        if (this.scaleenable && this._node) {
            // this._node.stopActionByTag(this._actionTag);
            // var st = new cc.ScaleTo(0.05, this.ImageScale * this.BtnActionScale);
            // this._node.runAction(st);
            this._node.setScale(this.ImageScale * this.BtnActionScale);
        }
    },

    //放大动画
    runMagnify: function () {
        if (this.scaleenable && this._node) {
            // this._node.stopActionByTag(this._actionTag)
            // var st = new cc.ScaleTo(0.05, this.ImageScale);
            // this._node.runAction(st);
            this._node.setScale(this.ImageScale);
        }
    },

    setScaleEnable: function (b) {
        this.scaleenable = b;
        if(!b){
            this.runMagnify();
        }
    },

    safeRelease: function (node) {
        if (node) {
            node.release();
        }
    },

    setDefScale:function(touchscale, imgscale) {
        this._defScale = touchscale;
        if(!imgscale) {
            this.ImageScale = touchscale;
        }
    },

    setImageScaleValue:function(imgscale) {
        this.ImageScale = imgscale;
    },

    resetState:function() {
        this.runMagnify();
    },

    setClipping:function(x,y,width,height) {
        this.clipping = cc.rect(x, y, width, height);
    },

    setBtnActionScale:function(val) {
        this.BtnActionScale = val;
    },
    setSwallowTouches:function (b) {
        this._listener.swallowTouches = b;
    },
    update:function(dt) {
        this._holdcall && this._holdcall(dt);
    },
    setBtnHoldCall : function (call) {
        this._holdcall = call;
    }
});