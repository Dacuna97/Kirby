"use strict"
var game = function () {
    // Set up an instance of the Quintus engine and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = Quintus({
            audioSupported: ['mp3', 'ogg']
        })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX,Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({
            scaleToFit: true,
            width: 1200,
            height: 800
        })
        // And turn on default input controls and touch input (for UI)
        .controls().touch().enableSound();



    Q.load("kirby.json,kirby.png,tiles.png", function () {
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
                rate: 1 / 15
            },
            run_left: {
                frames: [15, 16, 17],
                rate: 1 / 15
            },
            stand_right: {
                frames: [0],
                rate: 1 / 5
            },
            stand_left: {
                frames: [14],
                rate: 1 / 5
            },
            jump_right: {
                frames: [4],
                rate: 1 / 15
            },
            jump_left: {
                frames: [18],
                rate: 1 / 15
            },
            fall_right: {
                frames: [6],
                rate: 1 / 30,
                loop: false
            },
            fall_left: {
                frames: [20],
                rate: 1 / 30,
                loop: false
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
                    x: 50, // You can also set additional properties that can
                    y: 380, // be overridden on object creation
                    dead: false
                });
                this.add('2d, platformerControls, animation');
            },
            step: function (dt) {
                if (!this.p.dead) {
                    if (this.p.vy < 0) { //jump
                        this.p.y -= 2;
                        this.play("jump_" + this.p.direction);
                    } else if (this.p.vy > 0) {
                        this.play("fall_" + this.p.direction);
                        //if dies
                        if (this.p.y > 580) {
                            this.play("die");
                            this.p.dead = true;
                            Q.stageScene("endGame", 1, {
                                label: "You Died"
                            });
                        }
                    } else if (this.p.vx > 0 && this.p.vy == 0) {
                        this.play("run_right");
                    } else if (this.p.vx < 0 && this.p.vy == 0) {
                        this.play("run_left");
                    } else {
                        this.play("stand_" + this.p.direction);
                    }
                } else {
                    this.p.vx = 0;
                }
            }
        });
        Q.component("enemy", {
            added: function () {
                this.entity.on("bump.left,bump.right,bump.bottom", function (collision) {

                    if (collision.obj.isA("Player") && !collision.obj.p.dead) {
                        collision.obj.play("die");
                        collision.obj.p.dead = true;
                        collision.obj.p.vy = -500;
                        collision.obj.del("platformerControls");
                        Q.stageScene("endGame", 1, {
                            label: "You Died"
                        });

                        //collision.obj.destroy();
                    }
                });
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
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
     //           Q.audio.play('music_main.mp3', {
       //             loop: true
         //       });
            });
            Q.input.on('fire', this, () => {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
  //              Q.audio.play('music_main.mp3', {
    //                loop: true
      //          });
            });
            container.fit(20);
        });

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
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
  //              Q.audio.play('music_main.mp3', {
    //                loop: true
      //          });

            });
            Q.input.on('fire', this, () => {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
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
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
     //           Q.audio.play('music_main.mp3', {
       //             loop: true
         //       });

            });

            Q.input.on('fire', this, () => {
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.audio.play('music_main.mp3', {
                    loop: true
                });
            });

            container.fit(20);
        });
        Q.scene("hud", function (stage) {
            Q.UI.Text.extend("Score", {
                init: function (p) {
                    this._super({
                        label: "score: 0",
                        x: 50,
                        y: 0
                    });
                    Q.state.on("change.score", this, "score");
                },
                score: function (score) {
                    this.p.label = "score: " + score;
                },
            });
            stage.insert(new Q.Score());
        })
        Q.scene("level1", function (stage) {
            Q.stageTMX("kirbyBG.tmx", stage);
            // Create the player and add them to the stage

            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player, {
                x: true,
                y: false
            });
        });

        Q.loadTMX("kirbyBG.tmx", function () {
            Q.state.reset({
                score: 0
            });
            Q.stageScene("mainTitle");
        });

    });

}