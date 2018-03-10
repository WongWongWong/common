/*
    垂直的摩擦组件
    包含
    极限之后回弹到目标极限
    预计添加:
    阻尼效果
*/
cm.scrollViewVertical = cc.Class.extend({
    speedList:[
        0.5,
        2,
        4,
    ],
    ctor: function () {
        this.posX_basic = 0;
        this.posY_basic = 0;
        this.minY_limit = 0;
        this.maxY_limit = 0;
        this.posX_Cur = 0;
        this.posY_Cur = 0;
        this.viewRoot = null;
        this.lenForAutoMove = 0;
        this.moveDistance = 0;
        this.onMoveCall = null;
        this.onEndCall = null;
        this.addSpeed = 0;
        this.lastY = 0;
    },

    init: function (touchPanel, posX_basic, posY_basic, minY_limit, maxY_limit, onBeginCall, onMoveCall, onEndCall) {
        this.viewRoot = new cc.Node();
        touchPanel.addChild(this.viewRoot);

        this.viewRoot.setPosition(cc.p(posX_basic, posY_basic));
        this.posX_basic = posX_basic;
        this.posY_basic = posY_basic;
        this.minY_limit = minY_limit;
        this.maxY_limit = maxY_limit;
        this.onMoveCall = onMoveCall;
        this.onEndCall = onEndCall;

        var cb_scrollBegan = function () {
         //   cc.log("Verticalscroll begin");
            this.removeUpdate();
            this.moveDistance = 0;
            this.posY_Cur = this.viewRoot.getPositionY() - this.posY_basic;
            this.viewRoot.stopAllActions();
            if (onBeginCall) {
                onBeginCall();
            }
            return true;
        }.bind(this);
        var cb_scrollMoved = function (movX, movY) {
            this.moveDistance = movY;
            //cc.log("move movY : " + movY);

            this.posY_Cur += movY;
            this.viewRoot.setPositionY(this.posY_basic + this.posY_Cur);
            if (onMoveCall) {
                onMoveCall(this.posY_Cur);
            }
            //print("[*] cb_scrollMoved "..this.posY_Cur .." | "..this.minY_limit.." | "..self.maxY_limit)
        }.bind(this);
        var cb_scrollEndle = function () {
        //    cc.log("Verticalscroll end");
            //计算回弹的数据
            this.lenForAutoMove = 0;
            if (this.posY_Cur > this.maxY_limit) {
                this.lenForAutoMove = this.posY_Cur - this.maxY_limit;
                this.posY_Cur = this.maxY_limit;
                this.moveDistance = 0;
                if (this.lenForAutoMove != 0) {
                    this.fitSprint();
                }
                if (onEndCall) {
                    onEndCall(this.posY_Cur);
                }
            }else if (this.posY_Cur < this.minY_limit) {
                this.lenForAutoMove = this.minY_limit - this.posY_Cur;
                this.posY_Cur = this.minY_limit;
                this.moveDistance = 0;
                if (this.lenForAutoMove != 0) {
                    this.fitSprint();
                }
                if (onEndCall) {
                    onEndCall(this.posY_Cur);
                }
            }else{
                var type = Math.floor(Math.abs(this.moveDistance)/50);
                if(type >= 2) type = 2;
                this.addSpeed = this.speedList[type];
                this.schedulercall = this.updateScroll.bind(this);
                this.viewRoot.schedule(this.schedulercall, 0.01);
            }
        }.bind(this);

        this.scrollView = new cm.scrollView();
        this.scrollView.init(touchPanel, cb_scrollBegan, cb_scrollMoved, cb_scrollEndle);
    },

    getRoot: function () {
        if (this.viewRoot) {
            return this.viewRoot;
        }
        else {
            cc.log("[-] pet getRoot = null");
            return null;
        }
    },
    resetPos: function () {
        this.posY_Cur = 0;
        this.viewRoot.stopAllActions();
        this.viewRoot.setPositionY(this.posY_basic + this.posY_Cur);
        this.lastY = 0;
    },

    clean: function () {
        this.removeUpdate();
        this.viewRoot.removeFromParent();
        if (this.scrollView) {
            this.scrollView.clean();
        }
        this.viewRoot = null;
    },

    fitLimit: function (minY_limit, maxY_limit) {

        this.minY_limit = minY_limit;
        this.maxY_limit = maxY_limit;
    },

    fitSprint: function () {
        var movTime = 0.01;
        movTime = this.lenForAutoMove / 2000;

        var armPoint = cc.p(this.posX_basic, this.posY_basic + this.posY_Cur);
        var moveTo = new cc.MoveTo(movTime, armPoint);
        this.viewRoot.runAction(moveTo);

        this.lenForAutoMove = 0;
    },

    setEnable: function (b) {
        this.scrollView.setEnable(b);
    },

    gotoPos: function (val) {
        this.lenForAutoMove = val;
        this.posY_Cur = val;
        this.fitSprint();
    },

    getPosYCur: function () {
        return this.posY_Cur;
    },

    setPosYCur:function (y) {
        this.posY_Cur = y;
        this.viewRoot.setPositionY(this.posY_basic + this.posY_Cur);
    },

    moveTo: function (y, time, endcall) {
        var call = function () {
            if (endcall) {
                endcall();
            }
        }
        this.posY_Cur = y;
        var armPoint = cc.p(this.posX_basic, this.posY_basic + this.posY_Cur);
        var moveTo = new cc.MoveTo(time, armPoint);
        var func = new cc.CallFunc(call);
        var seq = new cc.Sequence(moveTo, func);
        this.viewRoot.runAction(seq);
    },
    //用于惯性滑动
    updateScroll:function () {
        //cc.log("enter updateScroll   dt : "+dt);
        var movY = this.moveDistance;
        if(movY > 0) {
            movY -= this.addSpeed;
        }else{
            movY += this.addSpeed;
        }
        if(movY <= 0 && this.moveDistance >= 0) movY = 0;
        if(movY >= 0 && this.moveDistance <= 0) movY = 0;

        //cc.log("this.moveDistance : "+this.moveDistance);
        this.moveDistance = movY;
        var Min = this.minY_limit;
        var Max = this.maxY_limit;
        this.posY_Cur += this.moveDistance;
        if(this.posY_Cur >= Max){
            this.posY_Cur = Max;
            this.moveDistance = 0;
        }
        if(this.posY_Cur <= Min){
            this.posY_Cur = Min;
            this.moveDistance = 0;
        }

        this.viewRoot.setPositionY(this.posY_basic + this.posY_Cur);
        if (this.onMoveCall) {
            this.onMoveCall(this.posY_Cur);
        }
        if(movY == 0 || this.moveDistance == 0){
            this.moveDistance = 0;
            this.removeUpdate();
            if (this.onEndCall) {
                this.onEndCall(this.posY_Cur);
            }
            return;
        }
    },
    removeUpdate:function () {
        if(this.schedulercall) {
            this.viewRoot.unschedule(this.schedulercall);
            this.schedulercall = null;
        }
    },
    //用于拖动动态加载，移除一个，添加一个
    checkAddandDel:function (showNnm, maxNum, len, callback) {
        //参数  显示数量  总数量  每条宽度
        var showStartNum = 0, showEndNum = 0, delNum = 0;
        if (this.posY_Cur <= this.minY_limit){                      //到顶
            showStartNum = 1;
            showEndNum = showNnm;
            delNum = showNnm + 1;
        }else if(this.posY_Cur >= this.maxY_limit){                   //到底
            showStartNum = maxNum - showNnm + 1;
            showEndNum = maxNum + 1;
            delNum = showNnm;
        }else {
            if (this.lastY < this.posY_Cur) {                            //向上滑
                var num = Math.floor(this.posY_Cur / len);         //上去1个开始移除
                this.lastY = this.posY_Cur;
                if (num < 0 || num > maxNum - showNnm) return;

                var addNum = showNnm + num;

                showStartNum = num + 1;
                showEndNum = addNum + 1;
                delNum = num;
            } else if (this.lastY > this.posY_Cur) {                       //向下滑
                var num = maxNum - Math.floor((this.maxY_limit - this.posY_Cur) / len) + 1;   //下去两个才开始移除
                this.lastY = this.posY_Cur;
                if (num <= showNnm || num > maxNum) return;

                var addNum = num - showNnm;

                showStartNum = addNum;
                showEndNum = num;
                delNum = num;
            }
        }
        if(showStartNum == 0 && showEndNum == 0 && delNum == 0) return;
        if(callback)
            callback(showStartNum, showEndNum, delNum);
    }
});