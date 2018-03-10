cm.ButtonMark = cc.Class.extend({
    ctor:function () {
        this.markary = [];
        this.counter = 0;
    },

    registerBtn:function(node,func) {
        if(!node){
            return;
        }
        this.counter++;
        node.counter = this.counter;

        this.markary[this.counter] = new cm.GameButton(node,func);

        return this.markary[this.counter];
    },

    removeBtn:function (node) {
        var counter = node.counter;
        if(!counter){
            return;
        }
        var btn = this.markary[counter];
        if(btn){
            btn.clean();
            delete this.markary[counter];
        }
    },

    setEnable:function (b) {
        for(var counter in this.markary){
            var btn = this.markary[counter];
            btn.setEnable(b);
        }
    },

    clean:function () {
        for(var counter in this.markary){
            var btn = this.markary[counter];
            btn.clean();
        }
        this.markary = [];
    }
});