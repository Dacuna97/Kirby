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



    Q.load("kirby.json,kirby.png,tiles.png,enemy1.png, enemy1.json, hud.png, hud.json, numbers.png, numbers.json, powers.png, powers.json, health.png, health.json,scoreElem.png, kirbyElem.png, livesElem.json, livesElem.png, enemy_spark.png, enemy_spark.json, star.png, star.json", function () {
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
                loop: true
            },
            fly_left: {
                frames: [1, 2],
                rate: 1 / 1,
                flip: "x",
                loop: true
            },
            start_swell_right: {
                frames: [7, 8],
                rate: 1 / 30,
                trigger: "swell_anim",
                flip: false,
                loop: false
            },
            start_swell_left: {
                frames: [7, 8],
                rate: 1 / 30,
                trigger: "swell_anim",
                flip: "x",
                loop: false
            },
            swell_right: {
                frames: [0],
                rate: 1 / 20,
                flip: false,
                trigger: "start_fly",
                loop: false
            },
            swell_left: {
                frames: [0],
                rate: 1 / 20,
                flip: "x",
                trigger: "start_fly",
                loop: false
            },
            start_fly_right: {
                frames: [0],
                rate: 1 / 20,
                loop: false,
                next: "fly_right",
                flip: false
            },
            start_fly_left: {
                frames: [0],
                rate: 1 / 20,
                loop: false,
                next: "fly_left",
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
            },
            shoot_star_right: {
                frames: [0, 1],
                rate: 1 / 10,
                flip: false,
                loop: false,
                next: "stand_right",
                trigger: "shoot"
            },
            shoot_star_left: {
                frames: [0, 1],
                rate: 1 / 10,
                flip: "x",
                loop: false,
                next: "stand_left",
                trigger: "shoot"
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
                    power: "",
                    swell_time: 0,
                    reload: 0,
                    sensor: false,
                    invincible: 0
                });
                this.add('2d, platformerControls, animation, eat');
                Q.input.on("fire", this, "fly");
                this.on("shoot", this, "shootStar");
                this.on("swell_anim", this, "swell_animation")
                this.on("start_fly", this, "start_fly_animation");
            },
            fly: function () {
                //if Kirby is not flying and has not started swallowing air
                if (this.p.state === "" && this.p.power != "fed") {
                    //start swallowing animation
                    this.play("start_swell_" + this.p.direction, 1);
                }
                //check if flies higher than possible
                else if (this.p.state === "flying") {
                    this.p.gravity = 0.15;
                    if (this.p.vy < -50) {
                        this.p.vy = -50;
                    } else {
                        this.p.vy -= 70;
                    }
                }
            },
            swell_animation: function () {
                // step of Kirby opening mouth, getting taller but not wider
                this.p.sheet = "kirbySwell";
                this.size(true);
                this.play("swell_" + this.p.direction, 1);
            },
            start_fly_animation: function () {
                // step of Kirby with mouth open, taller and wider
                this.p.sheet = "kirbyFly";
                this.size(true);
                this.play("start_fly_" + this.p.direction, 1);
                this.p.state = "flying";
            },
            shootStar: function () {
                let offset = 0;
                let speed = 0;
                if (this.p.direction === "right") {
                    offset = this.p.w;
                    speed = 100;
                } else {
                    offset = this.p.w * -1;
                    speed = -100;
                }
                this.stage.insert(new Q.Star({
                    x: this.p.x + offset,
                    y: this.p.y,
                    vx: speed
                }));
                this.del("fed");
                this.add("eat");
                this.p.reload = 0.2;
            },
            step: function (dt) {
                console.log(this.p.y);

                if (this.p.power === "fed")
                    this.p.vx /= 3;
                this.p.reload -= dt;
                if (this.p.reload < 0)
                    this.p.reload = 0;
                this.p.invincible -= dt;
                if (this.p.invincible < 0 && this.p.power != "fed") {
                    this.p.invincible = 0;
                    this.p.sensor = false;
                    this.add("platformerControls");
                }
                if (this.p.vy >= 0) {
                    this.p.vx /= 2;
                }
                if (this.p.state === "flying") {
                    this.play("fly_" + this.p.direction);
                    this.p.vx /= 2;
                    if (this.p.y < 10) {
                        this.p.y = 10;
                    }
                }
                else if (this.p.state != "dead") {
                    if (this.p.state != "attack") {
                        if (this.p.vy < 0 && this.p.state === "") { //jump
                            this.play("jump_" + this.p.direction);
                        } else if (this.p.vy > 0 && this.p.state === "") {
                            this.play("fall_" + this.p.direction);
                            //if dies
                            if (this.p.y > 580) {
                                this.play("die");
                                this.p.state = "dead";
                                Q.stageScene("endGame", 3, {
                                    label: "You Died"
                                });
                            }
                        } else if (this.p.vx > 0 && this.p.vy == 0) {
                            this.play("run_right");
                        } else if (this.p.vx < 0 && this.p.vy == 0) {
                            this.play("run_left");
                        } else if (Q.inputs['down']) {
                            this.p.state = "down";
                            this.play("move_down");
                        } else if (this.p.state === "down" && !Q.inputs['down']) {
                            this.p.state = "";
                        } else {
                            this.play("stand_" + this.p.direction);
                        }
                    } else {
                        this.play(this.p.power + "_" + this.p.direction);
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

                this.unswell_animation(dt);
                this.kick();




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
                            Q.stageScene("endGame", 3, {
                                label: "You Win"
                            });
                        }

                    }
                }

            },
            unswell_animation: function (dt) {
                
                //same but when Kirby releases the air
                if (this.p.state === "unswell") {
                    this.p.gravity = 1;
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
            },


        });
        Q.component("enemy", {
            added: function () {
                this.entity.on("bump.left,bump.right,bump.top,bump.bottom", function (collision) {
                    if (collision.obj.state === "attack") {
                        //    collision.distance += 16;
                    }
                    if (collision.obj.isA("Player") && collision.obj.p.state != "dead" && !this.p.dead) {
                        if (collision.obj.p.state === "attack" || collision.obj.p.state === "kick") {
                            if (collision.obj.p.power === "eat" && collision.obj.p.state != "kick") {
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
                            if (collision.obj.p.invincible === 0) {
                                Q.state.p.health = Q.state.get("health") - 1;

                                collision.obj.p.vy = -250;
                                if (collision.obj.p.direction === "left")
                                    collision.obj.p.vx = 250;
                                else
                                    collision.obj.p.vx = -250;
                                collision.obj.p.sensor = true;
                                collision.obj.del("platformerControls");
                                if (Q.state.get("health") == 0) {
                                    Q.state.p.lives = Q.state.get("lives") - 1;
                                    Q.stageScene("endGame", 1, {
                                        label: "You Died"
                                    });
                                    if (Q.state.get("lives") == 0) {
                                        collision.obj.play("die");
                                        collision.obj.p.state = "dead";
                                        collision.obj.p.vy = -500;
                                        collision.obj.del("platformerControls");
                                        Q.stageScene("endGame", 1, {
                                            label: "You Died"
                                        });
                                    }
                                }
                                collision.obj.p.invincible += 0.4;
                            }
                        }
                        //collision.obj.destroy();
                    }
                });
            }
        });
        Q.component("eat", {
            added: function () {
                this.entity.p.power = "eat";
                this.entity.p.sheet = "kirbyR";
                this.entity.size(true);
            },
            extend: {
                attack: function (stop) {
                    if (!stop) {
                        let direction = this.p.direction;
                        this.del("platformerControls");
                        this.p.state = "attack";
                        this.p.sheet = "kirbyEat";
                        this.p.direction = direction;
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
                            this.p.sheet = "kirbyFed";
                            this.size(true);
                        }
                    }
                }
            }
        });
        Q.component("fed", {
            extend: {
                attack: function (stop) {
                    this.p.sheet = "kirbyShootStar";
                    this.size(true);
                    this.play('shoot_star_' + this.p.direction, 1);

                }
            }
        });
        Q.compileSheets("star.png", "star.json");
        Q.animations('star_anim', {
            shoot: {
                frames: [0, 1, 2, 3],
                rate: 1 / 10,
                loop: true
            },
            collide: {
                frames: [4, 5, 6],
                rate: 1 / 10,
                trigger: "destroy",
                loop: false
            }
        });
        Q.Sprite.extend("Star", {

            init: function (p) {

                this._super(p, {
                    sprite: "star_anim",
                    sheet: "shoot", // Setting a sprite sheet sets sprite width and height
                    x: p.x, // You can also set additional properties that can
                    y: p.y, // be overridden on object creation
                    vx: p.vx,
                    gravity: 0
                });
                this.add('2d,animation');
                this.on("hit", function (collision) {
                    this.p.vx = 0;
                    this.play("collide", 1);
                    if (collision.obj.has("enemy")) {
                        collision.obj.destroy();
                    }
                });
                this.on("destroy", this, "destroyed");
            },
            destroyed: function () {
                this.destroy();
            },
            step: function (dt) {
                this.play("shoot");
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




        Q.compileSheets("enemy_spark.png", "enemy_spark.json");

        Q.animations('enemy_spark_anim', {
            move_right: {
                frames: [0, 1, 2],
                rate: 1 / 10,
                flip: false,
                loop: true
            },
            move_left: {
                frames: [0, 1, 2],
                rate: 1 / 10,
                flip: "x",
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
                    sensor: true,
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

        Q.Sprite.extend("ScoreE", {
            init: function (p) {
                this._super(p, {
                    asset: "scoreElem.png",
                });
            }
        });
        Q.compileSheets("kirbyElem.png");

        Q.Sprite.extend("KirbyE", {
            init: function (p) {
                this._super(p, {
                    asset: "kirbyElem.png",

                });
            }
        });
        Q.compileSheets("livesElem.png", "livesElem.json");
        Q.animations('lives_anim', {
            l: {
                frames: [0, 1],
                rate: 1 / 3,
                loop: false
            }
        })
        Q.Sprite.extend("LivesE", {
            init: function (p) {
                this._super(p, {
                    sheet: "lives",
                    sprite: "lives_anim"

                });
                this.add('animation,tween');
            },
            step: function (dt) {
                this.play("l");
            }
        });

        Q.compileSheets("health.png", "health.json");
        Q.animations('health_anim', {
            h6: {
                frames: [0, 1],
                rate: 1 / 3,
                loop: false
            },
            h5: {
                frames: [2, 3],
                rate: 1 / 3,
                loop: false
            },
            h4: {
                frames: [4, 5],
                rate: 1 / 3,
                loop: false
            },
            h3: {
                frames: [6, 7],
                rate: 1 / 3,
                loop: false
            },
            h2: {
                frames: [8, 9],
                rate: 1 / 3,
                loop: false
            },
            h1: {
                frames: [10, 11],
                rate: 1 / 3,
                loop: false
            },
            h0: {
                frames: [12],
                rate: 1 / 3,
                loop: false
            }
        })
        Q.Sprite.extend("HealthE", {
            init: function (p) {
                this._super(p, {
                    sheet: "health",
                    sprite: "health_anim"

                });
                this.add('animation,tween');
            },
            step: function (dt) {
                this.play("h" + Q.state.get("health"));
            }
        });


        Q.compileSheets("numbers.png", "numbers.json");
        Q.animations('numbers_anim', {
            n0: {
                frames: [0],
                rate: 1 / 3,
                loop: false
            },
            n1: {
                frames: [1],
                rate: 1 / 3,
                loop: false
            },
            n2: {
                frames: [2],
                rate: 1 / 3,
                loop: false
            },
            n3: {
                frames: [3],
                rate: 1 / 3,
                loop: false
            },
            n4: {
                frames: [4],
                rate: 1 / 3,
                loop: false
            },
            n5: {
                frames: [5],
                rate: 1 / 3,
                loop: false
            },
            n6: {
                frames: [6],
                rate: 1 / 3,
                loop: false
            },
            n7: {
                frames: [7],
                rate: 1 / 3,
                loop: false
            },
            n8: {
                frames: [8],
                rate: 1 / 3,
                loop: false
            },
            n9: {
                frames: [9],
                rate: 1 / 3,
                loop: false
            }
        })
        Q.Sprite.extend("NumberE", {
            init: function (p) {
                this._super(p, {
                    sheet: "number",
                    sprite: "numbers_anim",
                    n: p.n

                });
                this.add('animation,tween');
            },
            step: function (dt) {
                this.play("n" + this.p.n);
            }
        });


        Q.compileSheets("powers.png", "powers.json");
        Q.animations('powers_anim', {
            pNormal: {
                frames: [0],
                rate: 1 / 3,
                loop: false
            },
            pSpark: {
                frames: [1],
                rate: 1 / 3,
                loop: false
            }
        })
        Q.Sprite.extend("PowerElem", {
            init: function (p) {
                this._super(p, {
                    sheet: "powers",
                    sprite: "powers_anim"

                });
                this.add('animation,tween');
            },
            step: function (dt) {
                switch (Q.state.get("powers")) {
                    case "normal" /*|| "eat" */: this.play("pNormal");
                        break;
                    case "spark": this.play("pSpark");
                        break;
                }
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
                Q.state.p.health = 6;
                Q.clearStages();
                Q.stageScene('hud');

                Q.stageScene('hudsElements');
                Q.stageScene('level1');
                Q.state.p.level = 1;
                Q.state.p.score = 0;
                Q.state.p.powers = "normal";

                //           Q.audio.play('music_main.mp3', {
                //             loop: true
                //       });
            });
            Q.input.on('confirm', this, () => {
                Q.audio.stop();
                Q.state.p.health = 6;
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('hudsElements', 2);
                Q.stageScene('level1');
                Q.state.p.level = 1;
                Q.state.p.score = 0;
                Q.state.p.powers = "normal";
                //              Q.audio.play('music_main.mp3', {
                //                loop: true
                //          });
            });
            Q.state.p.health = 6;
            Q.stageScene('hud', 1);
            Q.stageScene('hudsElements', 2);
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
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
                Q.state.p.health = 6;
                Q.state.p.powers = "normal";
                //              Q.audio.play('music_main.mp3', {
                //                loop: true
                //          });

            });
            Q.input.on('confirm', this, () => {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
                Q.state.p.health = 6;
                Q.state.p.powers = "normal";
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

        Q.scene("hudsElements", function (stage) {
            let array = [];
            array = Q.state.get("score").toString().split("");
            let size = array.length;
            for(let i = 0; i < 7-size ; i++) {
                array.unshift("0");
            }
            array.forEach((elem,index) => {
               
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
                x: 500,
                y: 130
            }));


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
                score: 0,
                health: 6,
                powers: "normal",
                lives: 4
            });
            Q.stageScene("mainTitle");
        });

    });

}