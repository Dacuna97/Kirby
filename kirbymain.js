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
            height: 234
        })
        // And turn on default input controls and touch input (for UI)
        .controls().touch().enableSound();



    Q.load("kirby.json,kirby.png,tiles.png,enemy1.png, enemy1.json, hud.png, hud.json,scoreElem.png, kirbyElem.png, enemy_spark.png, enemy_spark.json", function () {
        // Sprites sheets can be created manually
        Q.sheet("tiles", "tiles.png", {
            tilew: 32,
            tileh: 32
        });
        // Or from a .json asset that defines sprite locations
        //        Q.compileSheets("mario_small.png", "mario_small.json");
        Q.compileSheets("kirby.png", "kirby.json");
        Q.animations('player_anim', {
            run_right: {
                frames: [2, 3, 4, 5],
                rate: 1 / 15,
                flip: false,
                loop: true
            },
            run_left: {
                frames: [2, 3, 4, 5],
                rate: 1 / 15,
                flip: "x",
                loop: true
            },
            stand_right: {
                frames: [0, 1],
                rate: 1 / 2,
                flip: false
            },
            stand_left: {
                frames: [0, 1],
                rate: 1 / 2,
                flip: "x"
            },
            jump_right: {
                frames: [4],
                rate: 1 / 15,
                flip: false
            },
            jump_left: {
                frames: [4],
                rate: 1 / 15,
                flip: "x"
            },
            fall_right: {
                frames: [5],
                rate: 1 / 30,
                loop: false
            },
            fall_left: {
                frames: [5],
                rate: 1 / 30,
                loop: false
            },
            move_down: {
                frames: [6],
                rate: 1 / 15,
                loop: false
            },
            fly_right: {
                frames: [1, 2],
                rate: 1 / 1,
                flip: false,
            },
            fly_left: {
                frames: [1, 2],
                rate: 1 / 1,
                flip: "x",
            },
            start_swell_right: {
                frames: [8, 9],
                rate: 1 / 2,
                flip: false,
                loop: false
            },
            start_swell_left: {
                frames: [8, 9],
                rate: 1 / 2,
                flip: "x",
                loop: false
            },
            swell_right: {
                frames: [0],
                rate: 1 / 2,
                flip: false,
                loop: false
            },
            swell_left: {
                frames: [0],
                rate: 1 / 2,
                flip: "x",
                loop: false
            },
            start_fly_right: {
                frames: [0],
                rate: 1 / 1,
                loop: false,
                flip: false
            },
            start_fly_left: {
                frames: [0],
                rate: 1 / 1,
                loop: false,
                flip: "x"
            },
            kick_left: {
                frames: [0],
                rate: 0.1 / 1,
                loop: false,
                flip: "x"
            },
            kick_right: {
                frames: [0],
                rate: 0.1 / 1,
                loop: false,
                flip: false
            },
            eat_right: {
                frames: [0, 1, 2],
                rate: 1 / 8,
                flip: false,
                loop: true
            },
            eat_left: {
                frames: [0, 1, 2],
                rate: 1 / 8,
                flip: "x",
                loop: true
            },
            die: {
                frames: [12],
                rate: 1 / 5
            }
        });


        Q.Sprite.extend("Player", {
            init: function (p) {
                this._super(p, {
                    sprite: "player_anim",
                    sheet: "kirbyR", // Setting a sprite sheet sets sprite width and height
                    x: 180, // You can also set additional properties that can
                    y: -10, // be overridden on object creation
                    state: "",
                    power: "eat",
                    swell_time: 0,
                    reload: 0,
                    sensor: false
                });
                this.add('2d, platformerControls, animation, eat');

            },
            step: function (dt) {
                if (this.p.state === "flying")
                    this.p.vy /= 2;
                if(this.p.power==="fed")
                    this.p.vx/=3;
                this.p.reload -= dt;
                if (this.p.reload < 0)
                    this.p.reload = 0;
                this.p.vx /= 2;
                if (this.p.state != "dead") {
                    if (this.p.vy < 0 && this.p.state === "") { //jump
                        this.play("jump_" + this.p.direction);
                    } else if (this.p.vy > 0 && this.p.state === "") {
                        this.play("fall_" + this.p.direction);
                        //if dies
                        if (this.p.y > 580) {
                            this.play("die");
                            this.p.state = "dead";
                            Q.stageScene("endGame", 1, {
                                label: "You Died"
                            });
                        }
                    } else if (this.p.vx > 0 && this.p.vy == 0 && this.p.state === "") {
                        this.play("run_right");
                    } else if (this.p.vx < 0 && this.p.vy == 0 && this.p.state === "") {
                        this.play("run_left");
                    } else {
                        if (this.p.state === "")
                            this.play("stand_" + this.p.direction);
                        else
                        if (this.p.state === "flying")
                            this.play("fly_" + this.p.direction);
                    }
                } else {
                    this.p.vx = 0;
                }
                if (this.p.x >= 878.400 || this.p.x <= 180)
                    this.stage.unfollow();
                else
                    this.stage.follow(this, {
                        x: true,
                        y: false
                    });
                if (Q.inputs['down'] && this.p.state === "") {
                    this.p.state = "down";
                    this.play("move_down");
                } else if (this.p.state === "down" && !Q.inputs['down']) {
                    this.p.state = "";
                }



                this.swell_animation(dt);
                this.unswell_animation(dt);
                this.kick();

                //when Z or SPACE is pressed
                if (Q.inputs['fire']) {
                    //if Kirby is not flying and has not started swallowing air
                    if (this.p.state === "" && this.p.power != "fed") {
                        this.p.state = "swell"; //start swallowing animation
                    }
                    //check if flies higher than possible
                    if (this.p.state === "flying") {
                        if (this.p.y < 10) {
                            this.p.y = 10;
                        }
                        if (this.p.vy < -50) {
                            this.p.vy = -50;
                        } else {
                            this.p.vy -= 50;
                        }
                    }

                }

                if (Q.inputs['action']) {
                    if (this.p.state === "flying") {
                        this.p.swell_time = 0;
                        this.p.state = "unswell";
                    } else if ((this.p.state === "" || this.p.state === "attack") && this.p.reload === 0) {
                        this.attack(false);
                    }
                } else {
                    if (this.p.state === "attack") {
                        this.attack(true);
                    }
                }

                if (this.p.x >= 975 && this.p.x <= 982) {
                    if (Q.inputs['up']) {
                        if (Q.state.get("level") == 1) {
                            Q.state.inc("level", 1);
                            Q.stageScene('level2');
                        } else {
                            Q.stageScene("endGame", 1, {
                                label: "You Win"
                            });
                        }

                    }
                }

            },
            swell_animation: function (dt) {
                //animation of getting bigger done in 3 steps
                if (this.p.state === "swell") {
                    this.p.swell_time += dt; //add time to change from step to step in animation
                    if (this.p.swell_time < 1 / 10) { // first two frames of Kirby opening mouth
                        this.play("start_swell_" + this.p.direction);
                    }
                    if (this.p.swell_time >= 1 / 10 && this.p.swell_time < 2 / 10) {
                        // step of Kirby opening mouth, getting taller but not wider
                        this.p.sheet = "kirbySwell";
                        this.size(true);
                        this.play("swell_" + this.p.direction);
                    }
                    if (this.p.swell_time >= 2 / 10 && this.p.swell_time < 3 / 10) {
                        // step of Kirby with mouth open, taller and wider
                        this.p.sheet = "kirbyFly";
                        this.size(true);
                        this.play("start_fly_" + this.p.direction);
                    }
                    if (this.p.swell_time >= 3 / 10) {
                        //change state of animation from swallowing air to flying one where it only moves hands
                        this.p.state = "flying";
                        this.p.sheet = "kirbyFly";
                        this.size(true);
                    }

                }
            },
            unswell_animation: function (dt) {
                //same but when Kirby releases the air
                if (this.p.state === "unswell") {
                    this.p.swell_time += dt; //add time to change from step to step in animation
                    if (this.p.swell_time < 1 / 10) {
                        this.play("start_fly_" + this.p.direction);
                    }
                    if (this.p.swell_time >= 1 / 10 && this.p.swell_time < 2 / 10) {
                        this.p.sheet = "kirbySwell";
                        this.size(true);
                        this.play("swell_" + this.p.direction);
                    }
                    if (this.p.swell_time >= 2 / 10 && this.p.swell_time < 3 / 10) {
                        this.p.sheet = "kirbyR";
                        this.size(true);
                        this.play("start_swell_" + this.p.direction);
                    }
                    if (this.p.swell_time >= 3 / 10) {
                        this.p.state = "";
                        this.p.swell_time = 0;
                    }

                }

            },
            kick: function () {
                if ((this.p.state === "down" || this.p.state === "kick") && Q.inputs['action']) {
                    //kick
                    if (this.p.reload == 0) {
                        this.p.state = "kick"
                        this.p.sheet = 'kirbykick';
                        this.size(true);
                        //    $.when($.ajax()).then(function () {
                        this.play("kick_" + this.p.direction);
                        var aux = this;
                        if (this.p.direction === "left") {
                            this.p.vx -= 150;
                        } else {
                            this.p.vx += 150;
                        }
                        setTimeout(function () {
                            aux.p.state = "";
                            aux.p.sheet = 'kirbyR';
                            aux.p.reload = 0.1;
                        }, 300);

                    }
                }
            }

        });
        Q.component("enemy", {
            added: function () {
                this.entity.on("hit.sprite", function (collision) {
                    if (collision.obj.state === "attack") {
                        //    collision.distance += 16;
                    }
                    if (collision.obj.isA("Player") && collision.obj.p.state != "dead" && !this.p.dead) {
                        if (collision.obj.p.state === "attack" || collision.obj.p.state === "kick") {
                            if (collision.obj.p.power === "eat") {
                                this.p.dead = true;

                                if (this.p.x < collision.obj.p.x)
                                    this.p.vx = 100;
                                else
                                    this.p.vx = -100;


                                var aux = this;

                                collision.obj.p.sensor = true;
                                var aux2 = collision.obj;
                                this.del('aiBounce');
                                aux2.p.power = "fed";
                                setTimeout(function () {
                                    aux.destroy();
                                    aux2.p.sensor = false;


                                }, 200);
                            } else
                                this.destroy();
                        } else {
                            collision.obj.play("die");
                            collision.obj.p.state = "dead";
                            collision.obj.p.vy = -500;
                            collision.obj.del("platformerControls");
                            Q.stageScene("endGame", 1, {
                                label: "You Died"
                            });
                        }
                        //collision.obj.destroy();
                    }
                });
            }
        });
        Q.component("eat", {
            added: function () {
                this.entity.p.power = "eat";

            },
            extend: {
                attack: function (stop) {
                    if (!stop) {
                        this.del("platformerControls");
                        this.p.state = "attack";
                        this.p.sheet = "kirbyEat";
                        this.size(true);
                        this.play("eat_" + this.p.direction);
                    } else {
                        let direction = this.p.direction;
                        this.p.sheet = "kirbyR";
                        this.size(true);
                        this.add("platformerControls");
                        this.p.direction = direction;
                        this.play("stand_" + this.p.direction);
                        this.p.state = "";
                        if (this.p.power === "fed") {
                            this.del("eat");
                            this.add("fed");
                            this.p.sheet = "kirbyEat";
                            this.size(true);
                        }
                    }
                }
            }
        });
        Q.component("fed", {
            extend: {
                attack: function (stop) {
                    this.p.sheet = "kirbyR";
                    this.size(true);
                    this.play('start_swell_' + this.p.direction);
                    this.p.power = "eat";
                    this.del("fed");
                    this.add("eat");
                    aux.p.reload = 0.2;

                }
            }
        });
        Q.component("impact_enemy", { //change vy to vx and impact enemies should work
            move: function (dt) {
                if (this.p.move == 'left') {
                    this.p.dest = this.p.x - this.p.range;
                    this.p.move = 'taken_left';
                }
                if (this.p.move == 'right') {
                    this.p.dest = this.p.x + this.p.range;
                    this.p.move = 'taken_right';
                }
                if (this.p.x < this.p.dest && this.p.move == 'taken_left') {
                    this.p.x = this.p.dest;
                    this.p.move = 'right';
                } else if (this.p.x > this.p.dest && this.p.move == 'taken_left')
                    this.p.vx = -100;
                else if (this.p.x < this.p.dest && this.p.move == 'taken_right')
                    this.p.vx = 100;
                else if (this.p.x > this.p.dest && this.p.move == 'taken_right') {
                    this.p.x = this.p.dest;
                    this.p.move = 'left';
                }
                this.p.x += this.p.vx * dt;
                if (this.p.vx < 0)
                    this.play("move_left");
                else
                    this.play("move_right");
            }
        });


        Q.compileSheets("enemy1.png", "enemy1.json");

        Q.animations('enemy1_anim', {
            run_right: {
                frames: [0, 1],
                rate: 1 / 10,
                flip: false,
                loop: true
            },
            run_left: {
                frames: [0, 1],
                rate: 1 / 10,
                flip: "x",
                loop: true
            }
        });

        Q.Sprite.extend("Enemy1", {

            init: function (p) {

                this._super(p, {
                    sprite: "enemy1_anim",
                    sheet: "enemy1", // Setting a sprite sheet sets sprite width and height
                    x: p.x, // You can also set additional properties that can
                    y: p.y, // be overridden on object creation
                    vx: 40,
                    sensor: true,
                    dead: false
                });
                this.add('2d,aiBounce,enemy,animation');
            },
            step: function (dt) {
                if (!this.p.dead) {
                    if (this.p.vx > 0)
                        this.play("run_left");
                    else {
                        this.play("run_right");
                    }
                }
            }
        });


        //        Q.compileSheets("bloopa.png", "bloopa.json");
        Q.animations('bloopa_anim', {
            move_up: {
                frames: [0, 1],
                rate: 1 / 5,
                loop: true
            },
            move_down: {
                frames: [2],
                rate: 1 / 15,
                loop: false
            },
            die: {
                frames: [1],
                rate: 1 / 15,
                loop: false
            }
        });
        Q.Sprite.extend("Bloopa", {
            init: function (p) {
                this._super(p, {
                    sprite: "bloopa_anim",
                    sheet: "bloopa", // Setting a sprite sheet sets sprite width and height
                    x: p.x, // You can also set additional properties that can
                    y: p.y, // be overridden on object creation
                    vy: -10,
                    move: 'up',
                    dead: false,
                    range: p.range,
                    dest: 0
                });
                this.add('2d,aiBounce,enemy,animation');
            },

        });

        Q.compileSheets("enemy_spark.png", "enemy_spark.json");

        Q.animations('enemy_spark_anim', {
            move_right: {
                frames: [0, 1, 2],
                rate: 1 / 10,
                flip: "x",
                loop: true
            },
            move_left: {
                frames: [0, 1, 2],
                rate: 1 / 10,
                flip: false,
                loop: true
            }
        });
        Q.Sprite.extend("EnemySpark", {

            init: function (p) {
                this._super(p, {
                    sprite: "enemy_spark_anim",
                    sheet: "enemy_spark", // Setting a sprite sheet sets sprite width and height
                    x: p.x, // You can also set additional properties that can
                    y: p.y, // be overridden on object creation
                    vx: 40,
                    dead: false
                });
                this.add('2d,aiBounce,enemy,animation,tween');
            },
            step: function (dt) {
                if (this.p.vx > 0)
                    this.play("move_left");
                else {
                    this.play("move_right");
                }
            }
        });

        Q.compileSheets("scoreElem.png");
       
        Q.Sprite.extend("ScoreE",{
            init: function(p) {
                this._super(p, {
                    asset: "scoreElem.png",
                });
            }
        });
        Q.compileSheets("kirbyElem.png");
       
        Q.Sprite.extend("KirbyE",{
            init: function(p) {
                this._super(p, {
                    asset: "kirbyElem.png",
                  
                });
            }
        });

        //************************************** */
        Q.scene("endGame", function (stage) {
            //        Q.audio.stop('music_main.mp3');
            //      Q.audio.play('music_die.mp3');

            var container = stage.insert(new Q.UI.Container({
                x: Q.width / 2,
                y: Q.height / 2,

                fill: "rgba(0,0,0,0.5)"
            }));

            var button = container.insert(new Q.UI.Button({
                x: 0,
                y: 0,
                fill: "#CCCCCC",
                label: "Play Again"
            }));

            var label = container.insert(new Q.UI.Text({
                x: 10,
                y: -10 - button.p.h,
                label: stage.options.label
            }));

            button.on("click", function () {
                //           Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud');
                Q.stageScene('hudsElements');
                Q.stageScene('level1');
                Q.state.p.score = 0;
                //           Q.audio.play('music_main.mp3', {
                //             loop: true
                //       });
            });
            Q.input.on('confirm', this, () => {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('hudsElements', 2);
                Q.stageScene('level1');
                Q.state.p.score = 0;
                //              Q.audio.play('music_main.mp3', {
                //                loop: true
                //          });
            });
            container.fit(20);
        });

        //************not used***********//
        Q.scene("winGame", function (stage) {
            //          Q.audio.stop('music_main.mp3');
            //        Q.audio.play('music_level_complete.mp3');

            var container = stage.insert(new Q.UI.Container({
                x: Q.width / 2,
                y: Q.height / 2,
                fill: "rgba(0,0,0,0.5)"
            }));

            var button = container.insert(new Q.UI.Button({
                x: 0,
                y: 0,
                fill: "#CCCCCC",
                label: "Play Again"
            }));

            var label = container.insert(new Q.UI.Text({
                x: 10,
                y: -10 - button.p.h,
                label: stage.options.label
            }));

            button.on("click", function () {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud');
                Q.stageScene('level1');
                Q.state.p.score = 0;
                //              Q.audio.play('music_main.mp3', {
                //                loop: true
                //          });

            });
            Q.input.on('confirm', this, () => {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud');
                Q.stageScene('level1');
                Q.state.p.score = 0;
                //             Q.audio.play('music_main.mp3', {
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
                //           asset: 'mainTitle.png',
                x: 0,
                y: 0,
                fill: "#CCCCCC",
            }));

            button.on("click", function () {
                Q.clearStages();
                Q.stageScene('hud');
                Q.stageScene('hudsElements');
                Q.stageScene('level1');
                //           Q.audio.play('music_main.mp3', {
                //             loop: true
                //       });

            });

            Q.input.on('confirm', this, () => {
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('hudsElements', 2);
                Q.stageScene('level1');
                Q.audio.play('music_main.mp3', {
                    loop: true
                });
            });

            container.fit(20);
        });


        Q.compileSheets("hud.png", "hud.json");
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

        Q.scene("hudsElements", function(stage){
           
            stage.insert(new Q.KirbyE({x:39, y:190}));
            stage.insert(new Q.ScoreE({x:39, y:206}));
        });

        Q.scene("level1", function (stage) {
            Q.stageTMX("kirbyBG.tmx", stage);
            // Create the player and add them to the stage

            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player, {
                x: true,
                y: false
            });
            stage.insert(new Q.Enemy1({
                x: 250,
                y: 130
            }));
            stage.insert(new Q.EnemySpark({
                x: 500,
                y: 130
            }));
            //var hud = stage.insert(new Q.HUD({}));
            // stage.viewport.scale=2;
            
        });
        Q.scene("level2", function (stage) {
            Q.stageTMX("kirbyBG2.tmx", stage);
            // Create the player and add them to the stage

            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player, {
                x: true,
                y: false
            });
            // stage.viewport.scale=2;
        });
        Q.loadTMX("kirbyBG.tmx, kirbyBG2.tmx", function () {
            Q.state.reset({
                level: 1,
                score: 0
            });
            Q.stageScene("mainTitle");
        });

    });

}