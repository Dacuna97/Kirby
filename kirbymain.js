"use strict"
var game = function () {
    // Set up an instance of the Quintus engine and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = window.Q = Quintus({
        audioSupported: ['mp3', 'ogg']
    })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX,Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({
            scaleToFit: true,
            width: 247,
            height: 230
        })
        // And turn on default input controls and touch input (for UI)
        .controls().touch().enableSound();

    
    loadEnemies(Q);
    loadKirby(Q);
    loadHUD(Q);
    loadScenes(Q);


    Q.load(["intro.mp3", "introDraw.mp3", "hit.mp3", "level1.mp3",  "miss_life.mp3", "absorbing.mp3"], function(){});
    Q.loadTMX("kirbyBG.tmx, kirbyBG2.tmx, kirby.json,kirby.png,tiles.png,enemy1.png, gameover.png, wingame.png, mainKirby.png, enemy1.json, hud.png, hud.json, numbers.png, numbers.json, powers.png, powers.json, health.png, health.json,scoreElem.png, kirbyElem.png, livesElem.json, livesElem.png, enemy_spark.png, enemy_spark.json, star.png, star.json, spark.png, spark.json, cloud.png, cloud.json, enemy_aerial.png, enemy_aerial.json", function () {
        Q.compileSheets("enemy1.png", "enemy1.json");
        Q.compileSheets("enemy_aerial.png", "enemy_aerial.json");
        Q.compileSheets("enemy_spark.png", "enemy_spark.json");
        Q.compileSheets("spark.png", "spark.json");
        Q.compileSheets("kirby.png", "kirby.json");
        Q.compileSheets("star.png", "star.json");
        Q.compileSheets("cloud.png", "cloud.json");
        Q.compileSheets("scoreElem.png");
        Q.compileSheets("kirbyElem.png");
        Q.compileSheets("livesElem.png", "livesElem.json");
        Q.compileSheets("health.png", "health.json");
        Q.compileSheets("numbers.png", "numbers.json");
        Q.compileSheets("powers.png", "powers.json");
        Q.compileSheets("hud.png", "hud.json");
        // Sprites sheets can be created manually
        Q.sheet("tiles", "tiles.png", {
            tilew: 32,
            tileh: 32
        });
        Q.state.reset({
            level: 1,
            score: 0,
            health: 6,
            powers: "normal",
            lives: 4
        });
        
        Q.stageScene("mainTitle");

    });

}