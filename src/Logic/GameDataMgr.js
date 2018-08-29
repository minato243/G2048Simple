/**
 * Created by thaod
 */

var GAME_DATA_KEY = "game_data";
var HIGH_SCORE_KEY = "game_high_score";

var GameDataMgr = cc.Class.extend({
    mode: 1,
    currentLevel: 0,
    highScore: 0,
    usedUndo: false,

    ctor: function(){
        this.mode = 1;
        this.loadHighScore();
    },

    nextMode: function(){
        this.mode = (this.mode + 1) % NUM_MODE;
        this.loadHighScore();
    },

    previousMode: function(){
        this.mode = (this.mode + NUM_MODE - 1) %NUM_MODE;
        this.loadHighScore();
    },

    resetData: function(){
        this.currentLevel = 0;
    },

    gameOver: function(){
        cc.log("game over");
    },

    loadData: function(mode){
        var gameDataStr = GameDataMgr.getCache(GAME_DATA_KEY+mode.toString(), "");
        return gameDataStr;
    },

    saveData: function(mode, dataStr){
        GameDataMgr.saveCache(GAME_DATA_KEY+mode.toString(), dataStr);
    },

    saveHighScore: function(){
        GameDataMgr.saveCache(HIGH_SCORE_KEY+this.mode, this.highScore);
    },

    updateHighScore: function(score){
        if(score > this.highScore){
            this.highScore = score;
            this.saveHighScore();
        }
    },

    loadHighScore: function(){
        this.highScore = GameDataMgr.getCache(HIGH_SCORE_KEY+ this.mode, 2048);
    }


});

GameDataMgr.gameDataMgrInstance = null;
GameDataMgr.TAG = "G2048";
GameDataMgr.createInstance = function(){
    if(GameDataMgr.gameDataMgrInstance == null){
        GameDataMgr.gameDataMgrInstance = new GameDataMgr();
    }

    return GameDataMgr.gameDataMgrInstance;
};

GameDataMgr.saveCache = function(key, value){
    var jsonKey = JSON.stringify(key);
    var jsonValue = JSON.stringify(value);
    cc.sys.localStorage.setItem(jsonKey, jsonValue);
    cc.log(GameDataMgr.TAG+"saveCache[key = "+ key+",value = "+value+ "]");
};

GameDataMgr.getCache = function(key, defaultValue){
    var jsonKey = JSON.stringify(key);
    var jsonValue = cc.sys.localStorage.getItem(jsonKey);
    if(jsonValue == null || jsonValue == undefined || jsonValue =="")
        return defaultValue;
    var value = defaultValue;
    try{
        value = JSON.parse(jsonValue);
    } catch(e){
        cc.log(GameDataMgr.TAG + " JsonParseException");
    }
    cc.log(GameDataMgr.TAG+" getCache[key = "+ key+",value = "+value+ "]");
    return value;
};