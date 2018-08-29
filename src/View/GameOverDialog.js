/**
 * Created by thaod on 7/29/2018.
 */


/*Created by thaod on 7/29/2018. */

var GameOverDialog = BasePopupDialog.extend({
    callBackFunc: null,
    acceptCallBack: null,

    acceptButton: null,
    cancelButton: null,
    numberLabel: null,
    scoreLabel: null,
    newRecordLabel: null,

    bgImage: null,
    playLayer: null,

    ctor: function(){
        cc.log("new GameOverDialog");
        this._super();
        var layer = ccs.load(res.GameOverDialog_json);
        this.addChild(layer.node);
        this.bgImage = layer.node.getChildByName("bgImage");
        var bgImage = this.bgImage;
        var bgMessage = bgImage.getChildByName("bg_message");
        this.scoreLabel = bgMessage.getChildByName("lb_score");
        this.numberLabel = bgMessage.getChildByName("lb_number");
        this.newRecordLabel = bgMessage.getChildByName("lb_new_record");

        this.acceptButton = bgImage.getChildByName("btn_accept");
        this.acceptButton.addTouchEventListener(this.onAcceptClick, this);
        this.cancelButton = bgImage.getChildByName("btn_cancel");
        this.cancelButton.addTouchEventListener(this.onCancelClick, this);

    },

    startDialog: function(score, maxNumber, playLayer){
        this.playLayer = playLayer;

        this.scoreLabel.setString("SCORE: "+ score.toString());
        this.numberLabel.setString(maxNumber.toString());

        if(score > GameDataMgr.gameDataMgrInstance.highScore){
            this.newRecordLabel.setVisible(true);
        } else {
            this.newRecordLabel.setVisible(false);
        }

        if(this.getParent() != null) {
            this._removeFromParent();
        }
        ScreenMgr.getInstance().currentScreen.addChild(this, LAYER_DIALOG);
    },

    _removeFromParent: function(){
        //if(this.callBackFunc != null){
        //    this.callBackFunc.execute();
        //    this.callBackFunc.release();
        //}
        this._super();
    },


    setCallBackFunc: function(callBackFunc){
        this.callBackFunc = callBackFunc;
        if(this.callBackFunc != null) this.callBackFunc.retain();
    },


    onAcceptClick: function(sender, controlEvent){
        cc.log("onAcceptClick");
        Utility.setScaleWhenTouchButton(sender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            SoundManager.playClickSound();
            this.playLayer.createNewGame();
            this.closeDialog();
        }
    },

    onCancelClick: function(sender, controlEvent){
        Utility.setScaleWhenTouchButton(sender, controlEvent);
        if(controlEvent == ccui.Widget.TOUCH_ENDED){
            this.closeDialog();
            ScreenMgr.screenMgrInstance.changeScreen(MENU_SCREEN);
        }
    }

});

GameOverDialog.gameOverDialogInstance = null;

GameOverDialog.getInstance = function(){
    if(GameOverDialog.gameOverDialogInstance == null){
        GameOverDialog.gameOverDialogInstance = new GameOverDialog();
        GameOverDialog.gameOverDialogInstance.retain();
    }
    return GameOverDialog.gameOverDialogInstance;
};

GameOverDialog.destroyInstance = function(){
    if(GameOverDialog.gameOverDialogInstance != null){
        GameOverDialog.gameOverDialogInstance.release();
        GameOverDialog.gameOverDialogInstance = null;
    }
};
