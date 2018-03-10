/*
    水平的摩擦组件
    包含
    极限之后回弹到目标极限
    预计添加.
    阻尼效果
*/
cm.scrollViewHorizontal = cc.Class.extend({

    speedList:[
        0.5,
        2,
        4,
    ],

    ctor: function () {
        this.posX_basic = 0;
        this.posY_basic = 0;
        this.minX_limit = 0;
        this.maxX_limit = 0;
        this.posX_Cur = 0;
        this.posY_Cur = 0;
        this.viewRoot = null;
        this.lenForAutoMove = 0;
        this.moveDistance = 0;
        this.onMoveCall = null;
        this.onEndCall = null;
        this.addSpeed = 0;
        this.lastX = 0;
    },

    init: function (touchPanel, posY_basic, posX_basic, minX_limit, maxX_limit, BeginCall, moveCall, endCall) {

        this.viewRoot = new cc.Node();
        touchPanel.addChild(this.viewRoot);

        this.viewRoot.setPosition(cc.p(posX_basic, posY_basic));
        this.posX_basic = posX_basic;
        this.posY_basic = posY_basic;
        this.minX_limit = minX_limit;
        this.maxX_limit = maxX_limit;
        this.onMoveCall = moveCall;
        this.onEndCall = endCall;

        var cb_scrollBegan = function () {
            cc.log("Horizontalscroll begin");
            this.removeUpdate();
            this.moveDistance = 0;
            this.posX_Cur = this.viewRoot.getPositionX() - this.posX_basic;
            this.viewRoot.stopAllActions();
            if (BeginCall) {
                BeginCall();
            }
            return true;
        }.bind(this);
        var cb_scrollMoved = function (movX, movY) {
            this.moveDistance = movX;
            this.posX_Cur +=  movX;
            this.viewRoot.setPositionX(this.posX_basic + this.posX_Cur);
            if (moveCall) {
                moveCall(this.posX_Cur);
            }
            //print("[*] cb_scrollMoved "..this.posY_Cur .." | "..this.minX_limit.." | "..this.maxX_limit)
        }.bind(this);
        var cb_scrollEndle = function () {
            //计算回弹的数据
            cc.log("Horizontalscroll end");
            this.lenForAutoMove = 0;
            if (this.posX_Cur > this.maxX_limit) {
                this.lenForAutoMove = this.posX_Cur - this.maxX_limit;
                this.posX_Cur = this.maxX_limit;
                this.moveDistance = 0;
                if (this.lenForAutoMove != 0) {
                    this.fitSprint();
                }
                if (endCall) {
                    endCall(this.posX_Cur);
                }
            }else if (this.posX_Cur < this.minX_limit) {
                this.lenForAutoMove = this.minX_limit - this.posX_Cur;
                this.posX_Cur = this.minX_limit;
                this.moveDistance = 0;
                if (this.lenForAutoMove != 0) {
                    this.fitSprint();
                }
                if (endCall) {
                    endCall(this.posX_Cur);
                }
            }else{
                var type = Math.floor(Math.abs(this.moveDistance)/50);
                if(type >= 2) type = 2;
                this.addSpeed = this.speedList[type];
                //cc.log("this.addSpeed : "+this.addSpeed);
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
        this.posX_Cur = 0;
        this.viewRoot.stopAllActions();
        this.viewRoot.setPositionX(this.posX_basic + this.posX_Cur);
        this.lastX = 0;
    },

    clean: function () {
        this.removeUpdate();
        this.viewRoot.removeFromParent();
        if (this.scrollView) {
            this.scrollView.clean();
        }
        this.viewRoot = null;
    },

    fitLimit: function (minX_limit, maxX_limit) {
        this.minX_limit = minX_limit;
        this.maxX_limit = maxX_limit;
    },

    fitSprint: function () {
        var movTime = 0.01;
        movTime = this.lenForAutoMove / 2000;
        var armPoint = cc.p(this.posX_basic + this.posX_Cur, this.posY_Cur);
        var moveTo = new cc.MoveTo(movTime, armPoint);
        this.viewRoot.stopAllActions();
        this.viewRoot.runAction(moveTo);
        this.lenForAutoMove = 0;
    },
    setEnable: function (b) {
        this.scrollView.setEnable(b);
    },
    GotoPos: function (posX, time) {
        if (!time) {
            time = posX;
        }
        this.posX_Cur = posX;
        this.lenForAutoMove = time;
        this.fitSprint();
    },

    //用于惯性滑动
    updateScroll:function () {
        //cc.log("enter updateScroll   dt : "+dt);
        var movX = this.moveDistance;
        if(movX > 0) {
            movX -= this.addSpeed;
        }else{
            movX += this.addSpeed;
        }
        if(movX < 0 && this.moveDistance > 0) movX = 0;
        if(movX > 0 && this.moveDistance < 0) movX = 0;

        //cc.log("this.moveDistance : "+this.moveDistance);
        this.moveDistance = movX;
        var Min = this.minX_limit;
        var Max = this.maxX_limit;
        this.posX_Cur += this.moveDistance;
        if(this.posX_Cur >= Max){
            this.moveDistance = 0;
            this.posX_Cur = Max;
        }
        if(this.posX_Cur <= Min){
            this.moveDistance = 0;
            this.posX_Cur = Min;
        }

        this.viewRoot.setPositionX(this.posX_basic + this.posX_Cur);
        if (this.onMoveCall) {
            this.onMoveCall(this.posX_Cur);
        }
        if(movX == 0 || this.moveDistance == 0){
            this.moveDistance = 0;
            this.removeUpdate();
            if (this.onEndCall) {
                this.onEndCall(this.posX_Cur);
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
        if (this.posX_Cur >= this.maxX_limit) {                      //最左
            showStartNum = 1;
            showEndNum = showNnm;
            delNum = showNnm + 1;
        } else if (this.posX_Cur <= this.minX_limit) {                   //最右
            showStartNum = maxNum - showNnm + 1;
            showEndNum = maxNum + 1;
            delNum = showNnm;
        } else {
            if (this.lastX > this.posX_Cur + 1) {                         //向左滑
                var num = Math.floor(Math.abs(this.posX_Cur) / len);         //
                this.lastX = this.posX_Cur;
                if (num < 0 || num > maxNum - showNnm) return;

                var addNum = showNnm + num;
                //cc.log("zuo  num : " + num + "  addNum : "+addNum);
                showStartNum = num + 1;
                showEndNum = addNum + 1;
                delNum = num;
            } else if (this.lastX < this.posX_Cur - 1) {                      //向右滑
                var num = maxNum - Math.floor((Math.abs(this.posX_Cur - this.minX_limit)) / len) + 1;   //
                this.lastX = this.posX_Cur;
                if (num <= showNnm || num > maxNum) return;

                var addNum = num - showNnm;
                //cc.log("you  num : " + num + "  addNum : "+addNum);
                showStartNum = addNum;
                showEndNum = num;
                delNum = num;
            }
        }
        if(showStartNum == 0 && showEndNum == 0 && delNum == 0) return;
        if (callback)
            callback(showStartNum, showEndNum, delNum);
    }
});