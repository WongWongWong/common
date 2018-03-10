cm.StringUtil = {
    //输入一个数值 , 指定的字符,  指定位数   用于分隔数字
    //默认逗号，隔三位
    numShowWithComma:function (value, str, num) {
        if (!str)
            str = ",";
        if (!num)
            num = 3;
        var sepNum = "1";
        for (var i = 0; i < num; i++){
            sepNum = sepNum + "0";
        }
        if (value < Number(sepNum))
            return value+"";
        var willNum = Math.floor(value);
        var curNum = 0;
        var curStr = "";
        var selNum = 0;
        while (willNum > 0){
            curNum = willNum % Number(sepNum);
            curNum = Math.floor( curNum );
            var curBatStr = "";
            if (willNum >= Number(sepNum)) {
                if (curNum >= Number(sepNum) / 10) {
                    curBatStr = str;
                } else {
                    var zeroNum = 0;
                    var cutNum = 1;
                    while (cutNum < Number(sepNum) / 10) {
                        cutNum = cutNum * 10;
                        if (curNum < cutNum) {
                            zeroNum++;
                        }
                    }
                    var zeroStr = "";
                    for (var i = 1; i <= zeroNum; i++) {
                        zeroStr = zeroStr + "0";
                    }
                    curBatStr = str + zeroStr;
                }
            }
            curStr = curBatStr+curNum+curStr;
            willNum = Math.floor( willNum / Number(sepNum) );
        }
        return curStr;
    },

    replaceStr : function (str , strSource , dst ) {//替换字符
        return str.replace(strSource,dst);
    },

    numShowToTime:function (value) {
        return value;//"00000";
    },

    sub_toChatByNum:function (value , subNum ) {

        return value.substr(0,subNum);
    },

    numShowToTime_hour : function ( num_second , commaChar) {

        if ( !  commaChar ) {
            commaChar = ":";
        }

        var numHour = Math.floor( num_second / 3600 );

        var numL = Math.floor( num_second / 60 );
        var numR = Math.floor( num_second % 60 );
        if ( numL >= 60 ) {
            numL = Math.floor( numL % 60 );
        }

        //////////////////////////-//
        var strHour = "";
        if ( numHour < 10 ) {
            strHour = "0";
        }
        strHour = strHour + String(numHour);

        //////////////////////////-//
        var strL = "";
        if ( numL < 10 ) {
            strL = "0";
        }
        strL = strL + String(numL);

        //////////////////////////-//
        var strR = "";
        if ( numR < 10 ) {
            strR = "0";
        }
        strR = strR + String(numR);

        //////////////////////////-//
        var curStr = strHour + commaChar  + strL + commaChar + strR;
        return curStr;
    },

    stringToBytes:function(str) {
        var ch, st, re = [];
        for (var i = 0; i < str.length; i++ ) {
            ch = str.charCodeAt(i);  // get char
            st = [];                 // set up "stack"
            do {
                st.push( ch & 0xFF );  // push byte to stack
                ch = ch >> 8;          // shift value down by 1 byte
            }
            while ( ch );
            // add stack contents to result
            // done because chars have "wrong" endianness
            re = re.concat( st.reverse() );
        }
        // return an array of bytes
        return re;
    },

    pointToDistance:function (lon1, lat1, lon2, lat2) {
        var earth_radtus = 6378137;

        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var radLon1 = lon1 * Math.PI / 180.0;
        var radLon2 = lon2 * Math.PI / 180.0;

        if(radLat1 < 0 ){
            radLat1 = Math.PI / 2 + Math.abs(radLat1);
        }
        if(radLat1 > 0 ){
            radLat1 = Math.PI / 2 - Math.abs(radLat1);
        }
        if(radLon1 < 0 ){
            radLon1 = Math.PI * 2 - Math.abs(radLon1);
        }
        if(radLat2 < 0 ){
            radLat2 = Math.PI / 2 + Math.abs(radLat2);
        }
        if(radLat2 > 0 ){
            radLat2 = Math.PI / 2 - Math.abs(radLat2);
        }
        if(radLon2 < 0 ){
            radLon2 = Math.PI * 2 - Math.abs(radLon2);
        }

        var x1 = earth_radtus * Math.cos(radLon1) * Math.sin(radLat1);
        var y1 = earth_radtus * Math.sin(radLon1) * Math.sin(radLat1);
        var z1 = earth_radtus * Math.cos(radLat1);

        var x2 = earth_radtus * Math.cos(radLon2) * Math.sin(radLat2);
        var y2 = earth_radtus * Math.sin(radLon2) * Math.sin(radLat2);
        var z2 = earth_radtus * Math.cos(radLat2);

        var d = Math.sqrt((x1 - x2) *(x1 - x2) +(y1 - y2) *(y1 - y2) +(z1 - z2) *(z1 - z2));
        var theta = Math.acos((earth_radtus * earth_radtus + earth_radtus * earth_radtus - d * d) /(2 * earth_radtus * earth_radtus));
        var dis = theta * earth_radtus;

        return dis;
    },

    distanceOfMinePoint:function (lon2, lat2) {
        var tmpData = game.tempData;

        var dis = this.pointToDistance(tmpData.lon, tmpData.lat, lon2, lat2);
        // cc.log("[?] self position:" + tmpData.lon + "," + tmpData.lat + ",target position:" + lon2 + "," + lat2 + ". dis:" + dis)

        return this.disToStr(dis);
    },

    disToStr:function (dis) {
        var str;
        if(dis <= 100){
            str = Math.ceil(dis)+"m";
        }
        else if(dis > 100 && dis < 1000){
            str = (dis - dis%100)+"m";
        }
        else if(dis < 10000){
            var num = Math.ceil(dis/100)/10;
            str = num+"km";
        }
        else if(dis < 1000000){
            var num = Math.ceil(dis/1000);
            str = num+"km";
        }
        else{
            str = "";
        }

        return str;
    },

    ranMsgID: function ( csvName , pec ) {
        var config_yaoqing = cm.makeConfig( csvName );
        var giftNum = config_yaoqing.getSize();
        var numTotal = 0 ;
        var numList = [];
        for ( var i=1; i<= giftNum ;i++ ) {
            var num = config_yaoqing.getNumber(String(i) ,pec);
            numList.push(num);
            numTotal += num ;
        }
        var curNum = game.tempData.getRandomInt(0,numTotal);
        numTotal = 0 ;
        for ( var i in numList ) {
            numTotal += numList[i] ;
            if(curNum < numTotal){
                var order = Number(i) + 1 ;
                return String(order);
            }
        }
        cc.log("error not find");
        return giftNum ;
    },

    getConfigByID: function ( csvName , pec , ID ) {
        var config_yaoqing = cm.makeConfig( csvName );
        return config_yaoqing.getString( ID , pec ) ;
    },

    ranMsg: function (csvName , pec , strMain ) {


        var config_yaoqing = cm.makeConfig( csvName );
        var giftNum = config_yaoqing.getSize();
        var numTotal = 0 ;
        var numList = [];
        for ( var i=1; i<= giftNum ;i++ ) {
            var num = config_yaoqing.getNumber(String(i) ,pec);
            numList.push(num);
            numTotal += num ;
        }
        var strMsg = config_yaoqing.getString("1" , strMain );

        var curNum = game.tempData.getRandomInt(0,numTotal);
        numTotal = 0 ;
        for ( var i in numList ) {
            numTotal += numList[i] ;
            if(curNum < numTotal){
                var order = Number(i) + 1 ;
                strMsg = config_yaoqing.getString( String(order) , strMain );
                break;
            }
        }

        strMsg = strMsg.replace(/\/n/g,"\n");
        return strMsg ;
    },

    chkstrlen : function (str) {
        var strlen = 0;
        for(var i = 0;i < str.length; i++)
        {
            if(str.charCodeAt(i) > 255){ //如果是汉字，则字符串长度加2
                strlen += 1;
            }
            else{
                strlen += 0.5;
            }
        }
        return   strlen;
    }

    // getUtf8Table : function (str) {
    //
    //     var tb = []
    //     if ( !  str ) {
    //         return [ tb , 0 ] ;
    //     }
    //
    //     var index   = 0
    //     var chatNum = 0
    //     var len = string.len(str)
    //
    //     while (index < len)
    //     {
    //         chatNum = chatNum + 1
    //
    //         var offset = this.SubStringGetByteCount(str,index + 1)
    //         for ( var i = 1; i <=offset ;i ++ ) {
    //             tb[index + i] = chatNum
    //         }
    //         index = index+offset
    //     }
    //
    //     return [ tb , chatNum ];
    // },
    //
    // SubStringGetByteCount : function (str, indexStart ) {
    //     var curByte = str.charCodeAt(indexStart);
    //     var byteCount = 1;
    //     if ( !  curByte ) {
    //         byteCount = 0
    //     }else if ( curByte > 0 && curByte <= 127 ) {
    //         byteCount = 1
    //     }else if ( curByte>=192 && curByte<=223 ) {
    //         byteCount = 2
    //     }else if ( curByte>=224 && curByte<=239 ) {
    //         byteCount = 3
    //     }else if ( curByte>=240 && curByte<=247 ) {
    //         byteCount = 4
    //     }
    //     return byteCount;
    // },
};
