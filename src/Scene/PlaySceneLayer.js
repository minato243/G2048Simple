/**
 * Created by thaod.
 */

var DRAG_DISTANCE = 30;

var PlaySceneLayer = cc.Layer.extend({

    bgImage: null,
    bgMode: null,
    restartButton: null,
    undoButton: null,
    pauseButton: null,
    scoreLabel: null,
    highScoreLabel: null,
    homeButton: null,
    soundOnButton: null,
    soundOffButton: null,

    board: null,
    bgNumberList: [],
    numberLabelList: [],

    savedData: "",

    curDir: 0,
    maxStepEffect: 0,
    scaleRate: 0,
    isMoving: false,
    isSpawning: false,

    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.initGui();
        this.addKeyBoardListener();
        //this.initData();
        this.addListener();

        return true;
    },

    initGui: function () {
        var layer = ccs.load(res.PlayScene_json);
        this.addChild(layer.node);

        this.bgImage = layer.node.getChildByName("bgImage");
        this.bgMode = this.bgImage.getChildByName("bg_mode");

        this.homeButton = this.bgImage.getChildByName("btn_home");
        this.soundOnButton = this.bgImage.getChildByName("btn_sound_on");
        this.soundOffButton = this.bgImage.getChildByName("btn_sound_off");
        this.restartButton = this.bgImage.getChildByName("btn_restart");
        this.undoButton = this.bgImage.getChildByName("btn_undo");
        this.pauseButton = this.bgImage.getChildByName("btn_pause");
        this.scoreLabel = this.bgImage.getChildByName("bg_score").getChildByName("lb_core");
        this.highScoreLabel = this.bgImage.getChildByName("bg_high_score").getChildByName("lb_high_score");

        this.homeButton.addTouchEventListener(this.onClickHome, this);
        this.soundOnButton.addTouchEventListener(this.onSoundOn, this);
        this.soundOffButton.addTouchEventListener(this.onSoundOff, this);
        this.undoButton.addTouchEventListener(this.onUndo, this);
        this.restartButton.addTouchEventListener(this.onRestart, this);
    },

    addListener: function () {
        var self = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            touchBeganPos: null,

            onTouchBegan: function (touch, event) {
                this.touchBeganPos = touch.getLocation();
                cc.log("onTouchBegan " + this.touchBeganPos.x + " " + this.touchBeganPos.y);
                return true;
            },

            onTouchEnded: function (touch, event) {
                var pos = touch.getLocation();
                cc.log("onTouchEnded (" + pos.x + " " + pos.y + "), touchBegan (" + this.touchBeganPos.x + " " + this.touchBeganPos.y + ")");

                var dX = pos.x - this.touchBeganPos.x;
                var dY = pos.y - this.touchBeganPos.y;
                if (dX > DRAG_DISTANCE || dX < -DRAG_DISTANCE
                    || dY > DRAG_DISTANCE || dY < -DRAG_DISTANCE) {
                    if (Math.abs(dX) > Math.abs(dY)) {
                        if (dX > DRAG_DISTANCE) self.showMoveEffect(RIGHT);
                        else self.showMoveEffect(LEFT);
                    } else {
                        if (dY > DRAG_DISTANCE) self.showMoveEffect(UP);
                        else self.showMoveEffect(DOWN);
                    }
                }
                return true;
            }

        });

        cc.eventManager.addListener(touchListener, this.bgMode);
    },

    addKeyBoardListener: function () {
        var self = this;
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                cc.log("PlayerScene.addKeyBoardListener keyCode = " + keyCode);
                if (keyCode == cc.KEY.backspace || keyCode == cc.KEY.back) {
                    self.onBackPress();
                } else if (keyCode == cc.KEY.home) {
                    //do something
                }
            }
        });

        cc.eventManager.addListener(keyboardListener, this);
    },

    initListNumber: function () {
        var mode = this.gameData.mode;
        var imageSize = IMAGE_SIZE[this.gameData.mode];
        this.bgMode.removeAllChildren();
        this.bgNumberList = [];
        this.numberLabelList = [];
        this.scaleRate = 0;
        for (var i = 0; i < this.board.size; i++) {
            this.bgNumberList.push([]);
            for (var j = 0; j < this.board.size; j++) {
                var numberBgImage = cc.Sprite.create("#item/bg_2.png");
                numberBgImage.setPosition(cc.p(POS_X[mode][j], POS_Y[mode][this.board.size - i - 1]));
                this.bgMode.addChild(numberBgImage);
                this.bgNumberList[i].push(numberBgImage);
                if (this.scaleRate == 0)
                    this.scaleRate = imageSize / numberBgImage.getContentSize().width;
                numberBgImage.setScale(this.scaleRate);
                numberBgImage.setVisible(false);
            }
        }
    },

    initData: function () {
        this.gameData = GameDataMgr.gameDataMgrInstance;
        this.board = new Board(GAME_MATRIX_SIZE[this.gameData.mode]);
        this.savedData = this.gameData.loadData(this.gameData.mode);
        if (this.savedData == "") {
            this.board.createNewMatrix();
            this.initListNumber();
            this.updateData();
        } else {
            MessageDialog.destroyInstance();
            var acceptCallBack = cc.callFunc(this.loadData, this);
            var rejectCallBack = cc.callFunc(this.createNewGame, this);
            MessageDialog.getInstance().startDialog(acceptCallBack, rejectCallBack, "Continue the last one\n or start new game?");
            MessageDialog.messageDialogInstance.setAcceptLabel("Continue");
            MessageDialog.messageDialogInstance.setCancelLabel("New game");
        }

        this.soundOnButton.setVisible(SoundManager.instance.status);
        this.soundOffButton.setVisible(!SoundManager.instance.status);
    },

    loadData: function () {
        this.board.convertDataFromString(this.savedData);
        this.initListNumber();
        this.updateData();
    },

    createNewGame: function () {
        this.board.createNewMatrix();
        this.initListNumber();
        this.updateData();
    },

    updateData: function () {
        var spriteFrameName = "res/bg_mode_" + (this.gameData.mode + 1) + ".png";
        cc.log("updateData " + spriteFrameName);
        var sprite = cc.Sprite.create(spriteFrameName);
        this.bgMode.setSpriteFrame(sprite.getSpriteFrame());

        this.highScoreLabel.setString(this.gameData.highScore.toString());

        for (var i = 0; i < this.board.size; i++) {
            for (var j = 0; j < this.board.size; j++) {
                this.bgNumberList[i][j].stopAllActions();
                this.bgNumberList[i][j].setPosition(cc.p(POS_X[this.gameData.mode][j], POS_Y[this.gameData.mode][this.board.size - i - 1]));
                if (this.board.matrix[i][j] == undefined || this.board.matrix[i][j] == 0) {
                    this.bgNumberList[i][j].setVisible(false);
                } else {
                    this.bgNumberList[i][j].setVisible(true);
                    this.bgNumberList[i][j].setSpriteFrame(this.getSpriteFrameNameForNumber(this.board.matrix[i][j]));
                    this.bgNumberList[i][j].setScale(this.scaleRate);
                }
            }
        }

        this.scoreLabel.setString(this.board.score.toString());

        this.checkGameOver();
    },

    gameOver: function () {
        cc.log("game Over");
        GameOverDialog.destroyInstance();
        GameOverDialog.getInstance().startDialog(this.board.score, this.board.getMaxNumber(), this);
        PlatformUtils.getInstance().updateLeaderBoard(this.gameData.mode, this.board.score);
        PlatformUtils.getInstance().showInterstitialAd();
        this.gameData.saveData(this.gameData.mode, "");
    },

    onClickHome: function (pSender, controlEvent) {
        cc.log("onHome");
        Utility.setScaleWhenTouchButton(pSender, controlEvent);

        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();
            this.onBackPress();
        }
    },

    onSoundOn: function (pSender, controlEvent) {
        cc.log("onSoundOn");
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();
            SoundManager.instance.setMusicOff();
            this.soundOffButton.setVisible(true);
            this.soundOnButton.setVisible(false);
        }
    },

    onSoundOff: function (pSender, controlEvent) {
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();
            SoundManager.instance.setMusicOn();
            this.soundOffButton.setVisible(false);
            this.soundOnButton.setVisible(true);
        }
    },

    onUndo: function (pSender, controlEvent) {
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();

            this.board.undo();
            this.updateData();

            cc.log(this.board.getMatrixString());
        }
    },

    onRestart: function (pSender, controlEvent) {
        Utility.setScaleWhenTouchButton(pSender, controlEvent);
        if (controlEvent == ccui.Widget.TOUCH_ENDED) {
            SoundManager.playClickSound();
            var acceptCallBack = cc.callFunc(this.startNewGame, this);
            MessageDialog.destroyInstance();
            MessageDialog.getInstance().startDialog(acceptCallBack, null, "Are you sure to restart?");
            MessageDialog.messageDialogInstance.setAcceptLabel("Restart");
            MessageDialog.messageDialogInstance.setCancelLabel("No");
        }
    },

    getSpriteFrameNameForNumber: function (number) {
        return "item/bg_" + number + ".png";
    },

    startNewGame: function () {
        this.board.createNewMatrix();
        this.updateData();
    },

    saveCurrentData: function () {
        this.gameData.saveData(this.gameData.mode, this.board.convertDataToSaveString());
        this.gameData.updateHighScore(this.board.score);
    },

    showMoveEffect: function (dir) {
        if (this.isMoving) {
            this.board.moveAndAddNewNumber(this.curDir);
            this.updateData();
            this.isMoving = false;
            cc.log("showMoveEffect error isMoving");
        } else if (this.isSpawning) {
            this.board.addNewNumber();
            this.updateData();
            this.isSpawning = false;
            cc.log("showMoveEffect error isSpawning");
        }
        else {
            this.isMoving = true;
            this.curDir = dir;
            this.maxStepEffect = 0;
            if (dir == LEFT) this.moveLeftEffect();
            else if (dir == RIGHT) this.moveRightEffect();
            else if (dir == UP) this.moveUpEffect();
            else if (dir == DOWN) this.moveDownEffect();
        }
    },

    moveLeftEffect: function () {
        var n = this.board.size;
        var matrix = this.board.matrix;

        this.maxStepEffect = 0;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var count = 0;
                var added = false;
                for (var k = 0; k < j; k++) {
                    if (matrix[i][k] == undefined || matrix[i][k] == 0) {
                        count++;
                        added = false;
                    } else if (matrix[i][k] == matrix[i][k + 1]) {
                        if (!added) {
                            count++;
                            added = true;
                        } else {
                            added = false;
                        }
                    } else {
                        added = false
                    }
                }
                if (this.maxStepEffect < count) this.maxStepEffect = count;
            }
        }
        if (this.maxStepEffect > 0) {
            for (i = 0; i < n; i++) {
                for (j = 0; j < n; j++) {
                    count = 0;
                    added = false;
                    for (k = 0; k < j; k++) {
                        if (matrix[i][k] == undefined || matrix[i][k] == 0) {
                            count++;
                            added = false;
                        } else if (matrix[i][k] == matrix[i][k + 1]) {
                            if (!added) {
                                count++;
                                added = true;
                            } else {
                                added = false;
                            }
                        } else {
                            added = false
                        }
                    }
                    if (count > 0) {
                        this.moveEffect(this.bgNumberList[i][j], i, j, LEFT, count);
                    }
                }
            }
        } else {
            this.moveEffectComplete();
        }

    },

    moveRightEffect: function () {
        var n = this.board.size;

        var matrix = this.board.matrix;

        this.maxStepEffect = 0;

        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var count = 0;
                var added = false;
                for (var k = n - 1; k > j; k--) {
                    if (matrix[i][k] == undefined || matrix[i][k] == 0) {
                        added = false;
                        count++;
                    } else if (matrix[i][k] == matrix[i][k - 1]) {
                        if (!added) {
                            added = true;
                            count++;
                        } else added = false;
                    } else {
                        added = false;
                    }
                }
                if (this.maxStepEffect < count) this.maxStepEffect = count;
            }
        }

        if (this.maxStepEffect > 0) {
            for (i = 0; i < n; i++) {
                for (j = 0; j < n; j++) {
                    count = 0;
                    added = false;
                    for (k = n - 1; k > j; k--) {
                        if (matrix[i][k] == undefined || matrix[i][k] == 0) {
                            added = false;
                            count++;
                        } else if (matrix[i][k] == matrix[i][k - 1]) {
                            if (!added) {
                                added = true;
                                count++;
                            } else added = false;
                        } else {
                            added = false;
                        }
                    }
                    if (count > 0) {
                        this.moveEffect(this.bgNumberList[i][j], i, j, RIGHT, count);
                    }
                }
            }
        } else {
            this.moveEffectComplete();
        }
    },

    moveUpEffect: function () {
        var n = this.board.size;
        var matrix = this.board.matrix;

        this.maxStepEffect = 0;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var count = 0;
                var added = false;
                for (var k = 0; k < i; k++) {
                    if (matrix[k][j] == undefined || matrix[k][j] == 0) {
                        count++;
                    } else if (matrix[k][j] == matrix[k + 1][j]) {
                        if (!added) {
                            count++;
                            added = true;
                        } else {
                            added = false;
                        }
                    } else {
                        added = false;
                    }
                }
                if (this.maxStepEffect < count) this.maxStepEffect = count;
            }
        }

        if (this.maxStepEffect > 0) {
            for (i = 0; i < n; i++) {
                for (j = 0; j < n; j++) {
                    count = 0;
                    added = false;
                    for (k = 0; k < i; k++) {
                        if (matrix[k][j] == undefined || matrix[k][j] == 0) {
                            count++;
                        } else if (matrix[k][j] == matrix[k + 1][j]) {
                            if (!added) {
                                count++;
                                added = true;
                            } else {
                                added = false;
                            }
                        } else {
                            added = false;
                        }
                    }
                    if (count > 0) {
                        this.moveEffect(this.bgNumberList[i][j], i, j, UP, count);
                    }
                }
            }
        } else {
            this.moveEffectComplete();
        }

    },

    moveDownEffect: function () {
        var n = this.board.size;
        var matrix = this.board.matrix;

        this.maxStepEffect = 0;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (matrix[i][j] == undefined || matrix[i][j] == 0) continue;

                var count = 0;
                var added = false;
                for (var k = n - 1; k > i; k--) {
                    if (matrix[k][j] == undefined || matrix[k][j] == 0) {
                        count++;
                        added = false;
                    } else if (matrix[k][j] == matrix[k - 1][j]) {
                        if (!added) {
                            count++;
                            added = true;
                        }
                        else added = false;
                    } else {
                        added = false;
                    }
                }
                if (this.maxStepEffect < count) this.maxStepEffect = count;
            }
        }

        if (this.maxStepEffect > 0) {
            for (i = 0; i < n; i++) {
                for (j = 0; j < n; j++) {
                    if (matrix[i][j] == undefined || matrix[i][j] == 0) continue;
                    count = 0;
                    added = false;
                    for (k = n - 1; k > i; k--) {
                        if (matrix[k][j] == undefined || matrix[k][j] == 0) {
                            count++;
                            added = false;
                        } else if (matrix[k][j] == matrix[k - 1][j]) {
                            if (!added) {
                                count++;
                                added = true;
                            }
                            else added = false;
                        } else {
                            added = false;
                        }
                    }
                    if (count > 0) {
                        this.moveEffect(this.bgNumberList[i][j], i, j, DOWN, count);
                    }
                }
            }
        } else {
            this.moveEffectComplete();
        }
    },

    moveEffect: function (icon, i, j, dir, numStep) {
        var mode = this.gameData.mode;

        if (dir == LEFT) j -= numStep;
        else if (dir == RIGHT) j += numStep;
        else if (dir == UP) i -= numStep;
        else i += numStep;
        var desPos = cc.p(POS_X[mode][j], POS_Y[mode][this.board.size - i - 1]);
        var moveTime = 0;
        if(mode > 2) moveTime = numStep * MOVE_EFFECT_TIME * GAME_MATRIX_SIZE[1]/GAME_MATRIX_SIZE[mode];
        else moveTime = numStep * MOVE_EFFECT_TIME * GAME_MATRIX_SIZE[1]/GAME_MATRIX_SIZE[mode];

        if (numStep == this.maxStepEffect)
            icon.runAction(cc.Sequence(cc.MoveTo(moveTime, desPos), cc.callFunc(this.moveEffectComplete, this)));
        else icon.runAction(cc.MoveTo(moveTime, desPos));
    },

    moveEffectComplete: function () {
        cc.log("moveEffectComplete");
        if (this.isMoving) {
            cc.log("moveEffectComplete isMoving");

            var moved = this.board.move(this.curDir);
            this.isMoving = false;
            this.updateData();
            if (moved) {
                var pos = this.board.addNewNumber();
                SoundManager.playMoveSound();
                this.spawnEffect(pos);
                this.mergeEffect();
            }

        }
    },

    spawnEffect: function (pos) {
        this.isSpawning = true;
        var i = pos.x;
        var j = pos.y;

        this.bgNumberList[i][j].stopAllActions();
        this.bgNumberList[i][j].setPosition(cc.p(POS_X[this.gameData.mode][j], POS_Y[this.gameData.mode][this.board.size - i - 1]));
        if (this.board.matrix[i][j] == undefined || this.board.matrix[i][j] == 0) {
            this.bgNumberList[i][j].setVisible(false);
        } else {
            this.bgNumberList[i][j].setVisible(true);
            this.bgNumberList[i][j].setSpriteFrame(this.getSpriteFrameNameForNumber(this.board.matrix[i][j]));
        }

        var action = cc.Sequence(cc.ScaleTo(0, 0.4 * this.scaleRate), cc.ScaleTo(SPAWN_EFFECT_TIME, this.scaleRate),
            cc.callFunc(this.spawnEffectComplete, this));
        this.bgNumberList[pos.x][pos.y].runAction(action);
    },

    spawnEffectComplete: function () {
        this.isSpawning = false;
        this.updateData();
        cc.log(this.board.getMatrixString());
    },

    mergeEffect: function () {
        var mergePostList = this.board.mergePosList;
        for (var i = 0; i < mergePostList.length; i++){
            var pos = mergePostList[i];
            var action = cc.Sequence(cc.ScaleTo(MERGE_EFFECT_TIME/2, 1.1 * this.scaleRate), cc.ScaleTo(MERGE_EFFECT_TIME, this.scaleRate));
            this.bgNumberList[pos.x][pos.y].runAction(action);
        }
    },

    mergeEffectComplete: function () {

    },

    checkGameOver: function () {
        if (!this.board.canMove()) {
            cc.log("can not move");
            this.gameOver();
        }
    },


    onBackPress: function () {
        this.saveCurrentData();
        this.gameData.updateHighScore(this.board.score);
        ScreenMgr.screenMgrInstance.changeScreen(MENU_SCREEN);
    }
});

PlaySceneLayer.playLayerInstance = null;

PlaySceneLayer.getInstance = function () {
    if (PlaySceneLayer.playLayerInstance == null) {
        PlaySceneLayer.playLayerInstance = new PlaySceneLayer();
        PlaySceneLayer.playLayerInstance.retain();
    }
    return PlaySceneLayer.playLayerInstance;
};
