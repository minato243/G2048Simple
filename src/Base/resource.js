var res = {
    MenuScene_json: "res/MenuScene.json",
    PlayScene_json: "res/PlayScene.json",
    MessageDialog_json: "res/MessageDialog.json",
    GameOverDialog_json: "res/GameOverDialog.json",

    menuImage: {type: "image", src: "res/menu.png"},
    menuPlist: {type: "plist", src: "res/menu.plist"},
    playImage: {type: "image", src: "res/play.png"},
    playPlist: {type: "plist", src: "res/play.plist"},
    bgModeImage1: {type: "image", src: "res/bg_mode_1.png"},

    clickSound: "res/sound/click_sound.mp3",
    pingPongSound: "res/sound/ping_pong.ogg",

    FONT_BRL_48: "res/BRLNSB_48.fnt",
    FONT_BRL_56: "res/BRLNSB_56.fnt",
    FONT_BRL_60: "res/BRLNSB_60.fnt"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
};
