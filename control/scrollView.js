
cm.scrollView = cc.Class.extend({

    ctor:function() {
        this.reSet();
    },

    reSet:function() {
        this._listener = null;
        this._node = null;

        this._defScale = 1;

        this.posX_moved = 0;
        this.posY_moved = 0;

        this.cb_began = null;
        this.cb_moved = null;
        this.cb_Endle = null;

        this.doubleClick = 0;

        this.lastTouchTime = 0;
    },

    setEnable:function(b) {
        this._listener.setEnabled(b);
        if (b){ this.doubleClick = 0; }
    },

    containsPoint:function(point,rect) {
        if (point.x < rect.x){
            return false
        }
        if (point.x > rect.x + rect.width){
            return false
        }
        if (point.y < rect.y){
            return false
        }
        if (point.y > rect.y + rect.height){
            return false
        }
        return true;
    },

    onTouchBegin:function(touch,event) {
        var time = new Date();
        time = time.getTime();
        if(time - this.lastTouchTime < 200){
            return false;
        }

        var p = touch.getLocation();
        var rect = this.getNodeRect(this._node, this._defScale);

        if (!this._node.isVisible()) {
            return false
        }
        if (!this.containsPoint(p, rect)) {
            return false;
        }
        this.posX_moved = p.x;
        this.posY_moved = p.y;

        var able = false ;
        if (this.cb_began) {
            able = ( this.cb_began() !== false ); // 默认按下了
        }
        if(able)
            this.lastTouchTime = time;
        return able;
    },

    onTouchMove:function(touch,event) {
        var p = touch.getLocation();
        var rect = this.getNodeRect(this._node, this._defScale);
        if (!this.containsPoint(p, rect)) {
            return;
        }

        var sv_offsetX = this.posX_moved;
        var sv_offsetY = this.posY_moved;

        this.posX_moved = p.x;
        this.posY_moved = p.y;
        sv_offsetX = p.x - sv_offsetX ;
        sv_offsetY = p.y - sv_offsetY ;

        // if ( (sv_offsetX === 0 ) && (sv_offsetY === 0 )) {
        //     return
        // }
        if (this.cb_moved) {
            this.cb_moved(sv_offsetX, sv_offsetY);
        }
    },

    onTouchEnd:function(touch,event) {

        var p = touch.getLocation();
        this.posX_moved = p.x;
        this.posY_moved = p.y;

        if (this.cb_Endle) {
            this.cb_Endle();
        }
    },

    init:function(node,cb_began,cb_moved,cb_Endle) {
        this.clean();
        this._node = node;
        this._node.retain();

        this.cb_began = cb_began;
        this.cb_moved = cb_moved;
        this.cb_Endle = cb_Endle;
        this._defScale = node.getScale();

        this._listener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegin.bind(this),
            onTouchMoved: this.onTouchMove.bind(this),
            onTouchEnded: this.onTouchEnd.bind(this)
        }, node);
    },

    getNodeRect:function(node,defScale) {
        var rect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        //定义矩形
        var size = node.getContentSize();
        var worldPt = node.convertToWorldSpace(cc.p(0, 0));

        rect.x = worldPt.x;
        rect.y = worldPt.y;
        rect.width = size.width * defScale;
        rect.height = size.height * defScale;

        return rect;
    },

    clean:function() {
        if (this._node) {
            cc.eventManager.removeListener(this._listener);
            this._node.release();
        }
        this.reSet();
    }
});