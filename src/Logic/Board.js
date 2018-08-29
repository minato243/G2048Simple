/* Created by thaod on 7/24/2018.*/

var LEFT = 1;
var RIGHT = 2;
var UP = 3;
var DOWN = 4;

var Board = cc.Class.extend({

    matrix: [],
    oldMatrix: [],
    size: 4,
    emptyList: [],
    score: 0,
    isCanUndo: false,

    mergePosList:[],

    ctor: function (size) {
        this.size = size;
    },

    createNewMatrix: function(){
        this.matrix = [];
        this.oldMatrix = [];
        for (var i = 0; i < this.size; i++) {
            this.matrix.push([]);
            this.oldMatrix.push([]);
            for (var j = 0; j < this.size; j ++){
                this.matrix[i][j] = 0;
            }
        }
        this.initRandom();
        this.cloneMatrix();
        this.score = 0;
        this.isCanUndo = false;
    },

    initRandom: function () {
        var pos = this.createRandomPos();
        cc.log("initRandom [" + pos.x + " " + pos.y + "]");
        this.matrix[pos.x][pos.y] = 2;
        this.addNewNumber();
    },

    cloneMatrix: function(){
        this.oldMatrix = [];
        for (var i = 0; i < this.size; i ++){
            this.oldMatrix.push([]);

            for (var j = 0; j < this.size; j++){
                this.oldMatrix[i][j] = this.matrix[i][j];
            }
        }

    },

    addNewNumber: function () {
        var pos = this.getEmptyPos();
        cc.log("addNewNumber [" + pos.x + " " + pos.y + "]");
        if (pos.x == -1 && pos.y == -1) return pos;
        this.matrix[pos.x][pos.y] = 2;
        return pos;
    },

    createRandomPos: function () {
        var x = Math.floor(Math.random() * this.size);
        var y = Math.floor(Math.random() * this.size);

        return cc.p(x, y);
    },

    getEmptyPos: function () {
        var size = this.size;

        this.emptyList = [];
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (this.matrix[i][j] == 0 || this.matrix[i][j] === undefined) {
                    var pos = cc.p(i, j);
                    this.emptyList.push(pos);
                }
            }
        }

        var n = this.emptyList.length;
        if (n == size * size) return cc.p(-1, -1);
        var r = Math.floor(Math.random() * n);

        return this.emptyList[r];
    },

    moveAndAddNewNumber: function(dir){
        if(this.move(dir)){
            return this.addNewNumber();
        }
        return null;
    },

    move: function(direct){
        //cc.log("move "+direct);
        var tmp = this.oldMatrix;
        this.cloneMatrix();
        //cc.log("old matrix "+ this.getOldMatrixString());
        this.mergePosList = [];

        var hasMoved = false;
        switch (direct){
            case LEFT:
                hasMoved = this.moveLeft();
                break;
            case RIGHT:
                hasMoved = this.moveRight();
                break;
            case UP:
                hasMoved = this.moveUp();
                break;
            case DOWN:
                hasMoved = this.moveDown();
                break;
        }

        if(hasMoved){
            cc.log("isCanUndo");
            this.isCanUndo = true;
        } else{
            this.oldMatrix = tmp;
        }

        return hasMoved;
    },

    moveLeft: function () {
        cc.log("moveLeft");

        var size = this.size;
        var hasMoved = false;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (this.matrix[i][j] == 0 || this.matrix[i][j] == undefined) {
                    for (var k = j + 1; k < size; k++) {
                        if (this.matrix[i][k] != undefined && this.matrix[i][k] != 0) {
                            this.matrix[i][j] = this.matrix[i][k];
                            this.matrix[i][k] = 0;
                            //this.removeFromMergePosList(cc.p(i,k));
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if (this.matrix[i][j] != undefined && this.matrix[i][j] != 0) {
                    for (k = j + 1; k < size; k++) {
                        if (this.matrix[i][k] != undefined && this.matrix[i][k] != 0) {
                            if(this.matrix[i][k] == this.matrix[i][j]) {
                                this.matrix[i][j] += this.matrix[i][k];
                                this.matrix[i][k] = 0;
                                this.addToMergePosList(cc.p(i,j));
                                this.addScore(this.matrix[i][j]);
                                hasMoved = true;
                            }
                            break;
                        }
                    }
                }

            }
        }
        return hasMoved;
    },

    moveRight: function () {
        cc.log("moveRight");

        var size = this.size;
        var hasMoved = false;
        for (var i = 0; i < size; i++) {
            for (var j = size - 1; j >= 0; j--) {
                if (this.matrix[i][j] == 0 || this.matrix[i][j] == undefined) {
                    for (var k = j - 1; k >= 0; k--) {
                        if (this.matrix[i][k] != undefined && this.matrix[i][k] != 0) {
                            this.matrix[i][j] = this.matrix[i][k];
                            this.matrix[i][k] = 0;
                            //this.removeFromMergePosList(cc.p(i,k));
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if (this.matrix[i][j] != undefined && this.matrix[i][j] != 0) {
                    for (k = j - 1; k >= 0; k--) {
                        if (this.matrix[i][k] != undefined && this.matrix[i][k] != 0) {
                            if(this.matrix[i][k] == this.matrix[i][j]){
                                this.matrix[i][j] += this.matrix[i][k];
                                this.matrix[i][k] = 0;
                                this.addScore(this.matrix[i][j]);
                                this.addToMergePosList(cc.p(i,j));
                                hasMoved = true;
                            }
                            break;
                        }
                    }
                }

            }
        }


        return hasMoved;
    },

    moveUp: function () {
        cc.log("moveUp");
        var size = this.size;

        var hasMoved = false;
        for (var j = 0; j < size; j++) {
            for (var i = 0; i < size; i++) {
                if (this.matrix[i][j] == 0 || this.matrix[i][j] == undefined) {
                    for (var k = i + 1; k < size; k++) {
                        if (this.matrix[k][j] != undefined && this.matrix[k][j] != 0) {
                            this.matrix[i][j] = this.matrix[k][j];
                            this.matrix[k][j] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if (this.matrix[i][j] != undefined && this.matrix[i][j] != 0) {
                    for (k = i + 1; k < size; k++) {
                        if (this.matrix[k][j] != undefined && this.matrix[k][j] != 0) {
                            if(this.matrix[k][j] == this.matrix[i][j]){
                                this.matrix[i][j] += this.matrix[k][j];
                                this.matrix[k][j] = 0;
                                this.addScore(this.matrix[i][j]);
                                this.addToMergePosList(cc.p(i,j));
                                hasMoved = true;
                            }
                            break;
                        }
                    }
                }

            }
        }
        return hasMoved;
    },

    moveDown: function () {
        cc.log("moveDown");
        var size = this.size;

        var hasMoved = false;
        for (var j = 0; j < size; j++) {
            for (var i = size -1; i >=0; i--) {
                if (this.matrix[i][j] == 0 || this.matrix[i][j] == undefined) {
                    for (var k = i - 1; k >= 0; k--) {
                        if (this.matrix[k][j] != undefined && this.matrix[k][j] != 0) {
                            this.matrix[i][j] = this.matrix[k][j];
                            this.matrix[k][j] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if (this.matrix[i][j] != undefined && this.matrix[i][j] != 0) {
                    for (k = i - 1; k >= 0; k--) {
                        if (this.matrix[k][j] != undefined && this.matrix[k][j] != 0) {
                            if(this.matrix[k][j] == this.matrix[i][j]){
                                this.matrix[i][j] += this.matrix[k][j];
                                this.matrix[k][j] = 0;
                                this.addScore(this.matrix[i][j]);
                                this.addToMergePosList(cc.p(i,j));
                                hasMoved = true;
                            }
                            break;
                        }
                    }
                }

            }
        }
        return hasMoved;
    },

    undo: function(){
        if(this.isCanUndo){
            cc.log("can undo");
            this.matrix = this.oldMatrix;
            this.isCanUndo = false;
        } else {
            cc.log("can not undo");
        }
    },

    getMatrixString: function () {
        var size = this.size;

        var result = "";
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (this.matrix[i][j] != undefined) {
                    result += this.matrix[i][j] + ", ";
                } else result += "0, ";
            }
            result += "\n";
        }
        return result;
    },

    getOldMatrixString: function () {
        var size = this.size;

        var result = "";
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (this.oldMatrix[i][j] != undefined) {
                    result += this.oldMatrix[i][j] + ", ";
                } else result += "0, ";
            }
            result += "\n";
        }
        return result;
    },

    getScore: function () {
        return this.score;
    },

    getMaxNumber: function(){
        var maxNumber = 0;
        for (var i = 0; i < this.size; i ++){
            for (var j = 0; j < this.size; j ++){
                if(maxNumber < this.matrix[i][j]) maxNumber = this.matrix[i][j];
            }
        }

        return maxNumber;
    },

    addScore: function (num) {
        this.score += num;
    },

    canMove: function () {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.matrix[i][j] == 0) {
                    cc.log("can move at"+i +" "+ j);
                    return true;
                }
            }
        }

        for (i = 0; i < this.size; i++) {
            for (j = 0; j < this.size; j++) {
                if(j+1 < this.size && this.matrix[i][j] == this.matrix[i][j+1]) {
                    cc.log("can move right"+i +" "+ j);
                    return true;
                }
                if(i+1 < this.size && this.matrix[i][j] == this.matrix[i+1][j]) {
                    cc.log("can move down "+i +" "+ j);
                    return true;
                }
            }
        }

        this.isCanUndo = false;

        return false;
    },

    convertDataToSaveString: function(){
        var result = "";
        var size = this.size;

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (this.matrix[i][j] != undefined) {
                    result += this.matrix[i][j] + ",";
                } else result += "0,";
            }
            result += ".";
        }
        result +="_";

        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
                if (this.oldMatrix[i][j] != undefined) {
                    result += this.oldMatrix[i][j] + ",";
                } else result += "0,";
            }
            result += ".";
        }

        result += "_";
        result += this.score.toString();

        return result;
    },

    convertDataFromString: function(dataStr){
        cc.log("convertDataFromString dataStr="+ dataStr);
        if(dataStr == ""){
            cc.log("convertDataFromString error");
        } else {
            var dataStrArray = dataStr.split("_");
            var dataMatrixStr = dataStrArray[0];
            var dataOldMatrixStr = dataStrArray[1];
            var score = parseInt(dataStrArray[2]);
            if(typeof(score) != "number"  || isNaN(score)) score = 0;
            cc.log("convertDataFromString score="+ score);
            
            this.matrix = [];
            var dataArray = dataMatrixStr.split(".");
            for (var i = 0; i< dataArray.length; i ++){
                this.matrix.push([]);
                var data = dataArray[i].split(",");
                for (var j= 0; j < data.length; j ++ ){
                    this.matrix[i][j] = parseInt(data[j]);
                }
            }

            this.oldMatrix = [];
            dataArray = dataOldMatrixStr.split(".");
            for (i = 0; i< dataArray.length; i ++){
                this.oldMatrix.push([]);
                data = dataArray[i].split(",");
                for (j= 0; j < data.length; j ++ ){
                    this.oldMatrix[i][j] = parseInt(data[j]);
                }
            }

            this.score = score;
        }

        cc.log("convertDataFromString matrix ="+ this.getMatrixString());
    },

    addToMergePosList: function(pos){
        this.mergePosList.push(pos);
    },

    removeFromMergePosList: function(pos){
        var n = this.mergePosList.length;
        var isExist =false;
        for (var i = 0; i < n; i ++){
            var p = this.mergePosList[i];
            if(p.x == pos.x && p.y == pos.y){
                isExist = true;
                break;
            }
        }

        if(isExist) this.mergePosList.splice(i,1);

    }

});
