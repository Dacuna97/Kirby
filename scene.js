function loadScenes(Q) {
    Q.scene("lostLife", function (stage) {
        Q.audio.stop();


        Q.state.p.health = 6;
        Q.state.p.powers = "normal";
        Q.clearStages();
        Q.stageScene('hud', 1);
        Q.stageScene('hudsElements', 2);
        Q.stageScene('level' + Q.state.get("level"));
        Q.audio.play('level1.mp3', {
            loop: true
        });

    });

    //************************************** */
    Q.scene("endGame", function (stage) {
        Q.audio.stop();
        Q.audio.play("gameOver.mp3");
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,

            fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            asset: "gameover.png",
            fill: "#CCCCCC",
        }));

        var label = container.insert(new Q.UI.Text({
            x: 10,
            y: -10 - button.p.h,
            label: stage.options.label
        }));

        button.on("click", function () {
            //           Q.audio.stop();
            Q.state.p.health = 6;
            Q.state.p.level = 1;
            Q.state.p.score = 0;
            Q.state.p.powers = "normal";
            Q.state.p.lives = 4;
            Q.clearStages();
            Q.stageScene('hud');
            Q.stageScene('hudsElements');
            Q.stageScene('level1');

        });
        Q.input.on('confirm', this, () => {
            Q.audio.stop();
            Q.state.p.health = 6;
            Q.state.p.level = 1;
            Q.state.p.score = 0;
            Q.state.p.powers = "normal";
            Q.state.p.lives = 4;
            Q.clearStages();
            Q.stageScene('hud', 1);
            Q.stageScene('hudsElements', 2);
            Q.stageScene('level1');
            Q.audio.play('level1.mp3', {
                loop: true
            });
            //              Q.audio.play('music_main.mp3', {
            //                loop: true
            //          });
        });
        container.fit(20);
    });

    Q.scene("winGame", function (stage) {
        Q.audio.stop();
        Q.audio.play("win.mp3");
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,

            fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            asset: "wingame.png",
            fill: "#CCCCCC",
        }));


        button.on("click", function () {
            //           Q.audio.stop();
            Q.state.p.health = 6;
            Q.state.p.level = 1;
            Q.state.p.score = 0;
            Q.state.p.powers = "normal";
            Q.state.p.lives = 4;
            Q.clearStages();
            Q.stageScene('hud');
            Q.stageScene('hudsElements');
            Q.stageScene('level1');

        });
        Q.input.on('confirm', this, () => {
            Q.audio.stop();
            Q.state.p.health = 6;
            Q.state.p.level = 1;
            Q.state.p.score = 0;
            Q.state.p.powers = "normal";
            Q.state.p.lives = 4;
            Q.clearStages();
            Q.stageScene('hud', 1);
            Q.stageScene('hudsElements', 2);
            Q.stageScene('level1');
            Q.audio.play('level1.mp3', {
                loop: true
            });
            //              Q.audio.play('music_main.mp3', {
            //                loop: true
            //          });
        });
        container.fit(20);
    });

    //   Q.compileSheets("mainTitle.png");
    Q.scene("mainTitle", function (stage) {


        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            w: Q.width,
            h: Q.height,
            fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({
            asset: 'mainKirby.png',
            x: 0,
            y: 0,
            fill: "#CCCCCC",
        }));

        Q.input.on('confirm', this, () => {
            Q.state.p.health = 6;
            Q.state.p.level = 1;
            Q.state.p.score = 0;
            Q.state.p.powers = "normal";
            Q.state.p.lives = 4;
            Q.audio.stop();
            Q.clearStages();
            Q.stageScene('hud', 1);
            Q.stageScene('hudsElements', 2);
            Q.stageScene('level1');
            Q.audio.play('level1.mp3', {
                loop: true
            });

        });

        container.fit(20);
    });



    Q.scene("hud", function (stage) {
        var container_hud = stage.insert(new Q.UI.Container({
            x: 124, // You can also set additional properties that can
            y: 202, // be overridden on object creation
            w: Q.width,
            h: 64,
        }));

        var button_hud = container_hud.insert(new Q.UI.Button({
            x: 0, // You can also set additional properties that can
            y: 0, // be overridden on object creation
            sheet: "hud"
        }));
        button_hud.on("click", function () {
            //Q.clearStages();
            //Q.stageScene("mainTitle");
        });
    });

    Q.scene("hudsElements", function (stage) {
        let array = [];
        array = Q.state.get("score").toString().split("");
        let size = array.length;
        for (let i = 0; i < 7 - size; i++) {
            array.unshift("0");
        }
        array.forEach((elem, index) => {

            stage.insert(new Q.NumberE({
                x: 75 + index * 8,
                y: 206,
                n: elem
            }));
        });

        stage.insert(new Q.KirbyE({
            x: 39,
            y: 190
        }));
        stage.insert(new Q.ScoreE({
            x: 39,
            y: 206
        }));
        stage.insert(new Q.LivesE({
            x: 193,
            y: 196
        }));
        stage.insert(new Q.HealthE({
            x: 95,
            y: 190
        }));
        stage.insert(new Q.NumberE({
            x: 211,
            y: 198,
            n: 0
        }));
        stage.insert(new Q.NumberE({
            x: 219,
            y: 198,
            n: Q.state.get("lives")
        }));
        stage.insert(new Q.PowerElem({
            x: 159,
            y: 198
        }));


    });

    Q.scene("level1", function (stage) {

        Q.stageTMX("kirbyBG.tmx", stage);
        // Create the player and add them to the stage
        stage.max_x = 878.400;
        stage.min_x = 180;
        stage.door_min = 975;
        stage.door_max = 982;
        var player = stage.insert(new Q.Player());
        stage.add("viewport").follow(player, {
            x: true,
            y: false
        });
        stage.insert(new Q.Enemy1({
            x: 200,
            y: 130
        }));
        stage.insert(new Q.EnemyAerial({
            x: 200,
            y: 60
        }));
        stage.insert(new Q.EnemySpark({
            x: 500,
            y: 130
        }));

        stage.insert(new Q.Enemy1({
            x: 700,
            y: 130
        }));



        // stage.viewport.scale=2;

    });
    Q.scene("level2", function (stage) {
        Q.stageTMX("kirbyBG2.tmx", stage);
        // Create the player and add them to the stage
        Q.state.p.powers = "normal";
        //Q.state.p.state = "";
        //Q.state.p.power = "";
        stage.max_x = 1146.700;
        stage.min_x = 131.700;
        stage.door_min = 1197.1;
        stage.door_max = 1202;
        var player = stage.insert(new Q.Player());
        stage.add("viewport").follow(player, {
            x: true,
            y: false
        });
        stage.insert(new Q.Enemy1({
            x: 200,
            y: 130
        }));
        stage.insert(new Q.EnemySpark({
            x: 600,
            y: 50
        }));
        stage.insert(new Q.EnemyAerial({
            x: 300,
            y: 50
        }));
        stage.insert(new Q.EnemyAerial({
            x: 1000,
            y: 60
        }));
        // stage.viewport.scale=2;
    });
}