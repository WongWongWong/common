cm.ConfigCache = {};

cm.makeConfig = function(filename){

    var config = cm.ConfigCache[filename];

    if(config){
        return config;
    }

    config = new cm.ConfigLoader(filename);
    cm.ConfigCache[filename] = config;

    return config;
};

cm.ConfigLoader = cc.Class.extend({
    dataAry:null,
    size:0,
    ctor: function (filename) {
        this.dataAry = this.CSVToArray(filename);
    },
    CSVToArray:function( filename,strDelimiter ){
        var strData = cc.loader.getRes(filename);

    // Check to see if the delimiter is defined. If not,
    // then default to comma.
        strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
    // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
        var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
        var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ){

    // Since we have reached a new row of data,
    // add an empty row to our data array.
                arrData.push( [] );

            }


    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

    // We found a quoted value. When we capture
    // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                );

            } else {

    // We found a non-quoted value.
                var strMatchedValue = arrMatches[ 3 ];

            }


    // Now that we have our value string, let's add
    // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

    // Return the parsed data.
        var retData = new Array();
        var colData = new Array();
        var colLength = arrData[1].length;
        for(var j = 0;j<colLength;j++){
            colData.length = colData.push(arrData[1][j]);
        }
        for(var i = 2;i<arrData.length;i++){
            var row_str = arrData[i][0];
            if(!row_str){
                continue;
            }
            this.size++;
            var datas = new Array();
            for(var j = 0;j<arrData[i].length;j++){
                datas[colData[j]] = arrData[i][j];
            }
            retData[row_str] = datas;
        }
        return( retData );
    },
    getSize:function () {
        return this.size;
    },

    getRow:function (row) {
        return this.dataAry[row];
    },

    getData:function (row,col) {
        var rowData = this.dataAry[row];
        if(!rowData){
            return "";
        }
        return rowData[col] || "";
    },

    getString:function(row,col){
        return this.getData(row,col);
    },

    getNumber:function(row,col){
        return Number(this.getData(row,col)) || 0 ;
    },

    getInt:function(row,col){
        return Math.floor(this.getNumber(row,col));
    },

    getBool:function(row,col){
        var str = this.getData(row,col);
        if(str == "true"){
            return true;
        }
        if(str == "false"){
            return false;
        }

        if(str == "1")
        {
            return true;
        }

        return false;
    },

    getPoint:function (row,col) {

        var str = this.getString(row,col);

        if(!str){
            return null;
        }

        var data = str.split("|");
        return cc.p(Number(data[0]),Number(data[1]));
    },

    getPointGroups:function (row, col) {

        var str = this.getString(row,col);

        if(!str){
            return null;
        }

        var strs = str.split("#");

        var retAry = [];
        for(var i = 0 ;i < strs.length;i++){
            var ptstr = strs[i].split("|");
            var pt = cc.p(Number(ptstr[0]),Number(ptstr[1]));
            retAry.push(pt);
        }

        return retAry;
    },

    getSplit:function (row,col,separator) {
        var str = this.getString(row,col);

        if(!str){
            return [];
        }

        return str.split(separator);
    }
});