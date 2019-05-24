function loadKirby(Q) {
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
            loop: true
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
            rate: 1 / 3,
            loop: false,
            trigger: "reset",
            flip: "x"
        },
        kick_right: {
            frames: [0],
            rate: 1 / 3,
            loop: false,
            trigger: "reset",
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
            frames: [0, 1, 2, 3],
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
        },
        spark_attack: {
            frames: [1, 2],
            rate: 1 / 10,
        },
        enter_door: {
            frames: [0, 1],
            rate: 1 / 5,
            loop: false,
            trigger: "enter"
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
                invincible: 0,
                food: "",
            });
            this.add('2d, platformerControls, animation,eat');
            this.add(Q.state.p.power)
            Q.input.on("fire", this, "fly");
            Q.input.on("action", this, "check_action");
            Q.input.on("down", this, "check_down");
            this.on("shoot", this, "shootStar");
            this.on("swell_anim", this, "swell_animation")
            this.on("start_fly", this, "start_fly_animation");
            this.on("reset", this, "reset_kirby");
            this.on("enter", this, "enter_door");
        },
        reset_kirby: function () {
            this.p.state = "";
            this.p.sheet = "kirbyR";
            this.size(true);
        },
        check_down: function () {
            if (this.p.power != "fed") {
                if (this.p.state === "")
                    this.p.state = "down";
            } else {
                this.del("fed");
                if (this.p.food) {
                    this.add(this.p.food);
                    this.p.food = "";
                } else {
                    this.add("eat");
                }
                this.reset_kirby();

            }
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
                    this.p.vy = -70;
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
            Q.audio.play("shoot.mp3");
            this.stage.insert(new Q.Star({
                x: this.p.x + offset,
                y: this.p.y,
                vx: speed
            }));
            this.del("fed");
            this.add("eat");
            this.reset_kirby();
            this.p.reload = 0.2;
        },
        step: function (dt) {
            if (this.p.state === "flying") {
                this.play("fly_" + this.p.direction);
                this.p.vx /= 2;
                if (this.p.y < 10) {
                    this.p.y = 10;
                }
            } else if (this.p.state === "kick" && this.p.reload > 0) {
                if (this.p.direction === "left") {
                    this.p.vx -= 300;
                } else {
                    this.p.vx += 300;
                }
            } else if (this.p.state != "dead") {
                if (this.p.state != "attack") {
                    if (this.p.vy < 0 && this.p.state === "") { //jump
                        this.play("jump_" + this.p.direction);
                    } else if (this.p.vy > 0 && this.p.state === "") {
                        this.play("fall_" + this.p.direction);
                        //if dies
                        if (this.p.y > 580) {
                            this.play("die");
                            this.p.state = "dead";
                            Q.audio.stop("level1.mp3");
                            Q.audio.play("miss_life.mp3");
                            setTimeout(function () {
                                Q.stageScene("lostLife", 3, {});
                            }, 2900);
                        }
                    } else if (this.p.vx > 0 && this.p.vy == 0) {
                        this.play("run_right");
                    } else if (this.p.vx < 0 && this.p.vy == 0) {
                        this.play("run_left");
                    } else if (this.p.state === "down") {
                        if (!Q.inputs["down"]) {
                            this.p.state = "";
                        } else {
                            this.play("move_down");
                        }
                    } else {
                        this.play("stand_" + this.p.direction);
                    }
                } else {
                    if (this.p.power === "eat" || this.p.power === "fed") {
                        this.play(this.p.power + "_" + this.p.direction);
                    }

                }
            } else {
                //animation of death here
                this.p.sheet = "kirbyDie";
                this.play("die");
                this.p.vx = 0;
            }
            if (this.p.power === "fed")
                this.p.vx /= 3;
            this.p.reload -= dt;
            if (this.p.reload < 0)
                this.p.reload = 0;
            this.p.invincible -= dt;
            if (this.p.invincible < 0 && this.p.power != "fed" && this.p.state != "dead") {
                this.p.invincible = 0;
                this.p.sensor = false;
                let aux = this.p.direction;
                this.add("platformerControls");
                this.p.direction = aux;
            }
            if (this.p.vy >= 0) {
                this.p.vx /= 2;
            }

            if (this.p.x >= this.stage.max_x || this.p.x <= this.stage.min_x)
                this.stage.unfollow();
            else
                this.stage.follow(this, {
                    x: true,
                    y: false
                });

            this.unswell_animation(dt);
            //this.kick();

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

            if (this.p.x >= this.stage.door_min && this.p.x <= this.stage.door_max) {
                if (Q.inputs['up']) {
                    this.p.vy = 0;
                    this.p.sheet = "kirbyDoor";
                    this.play("enter_door", 1);
                }
            }

        },
        enter_door: function () {
            if (Q.state.get("level") == 1) {
                Q.state.inc("level", 1);
                Q.stageScene('level2');
            } else {
                Q.stageScene("winGame", 3, {
                    //label: "You Win"
                });
            }
        },
        check_action: function () {
            if ((this.p.state === "down" || this.p.state === "kick") && this.p.vy == 0) {
                this.p.sheet = "kirbyKick";
                this.p.state = "kick";
                this.play("kick_" + this.p.direction, 1);
                this.p.reload = 0.33;
            } else if (this.p.state === "flying" || this.p.state === "unswell") {
                let offset = 0;
                let speed = 0;
                if (this.p.direction === "right") {
                    offset = this.p.w + 10;
                    speed = 50;
                } else {
                    offset = (this.p.w + 10) * -1;
                    speed = -50;
                }
                Q.audio.play("cloud.mp3");
                this.stage.insert(new Q.Cloud({
                    x: this.p.x + offset / 1.5,
                    y: this.p.y,
                    vx: speed,
                    direction: this.p.direction
                }));
            }
        },
        unswell_animation: function (dt) {

            //same but when Kirby releases the air
            if (this.p.state === "unswell") {
                this.p.vx = 0;
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


    });

    Q.component("eat", {
        added: function () {
            this.entity.p.power = "eat";
        },
        extend: {
            attack: function (stop) {
                if (this.p.vy == 0) {
                    if (!stop) {
                        let direction = this.p.direction;
                        this.del("platformerControls");
                        this.p.state = "attack";
                        this.p.sheet = "kirbyEat";
                        this.p.direction = direction;
                        this.size(true);
                        this.play("eat_" + this.p.direction);
                        //      if(Q.audio.active["absorbing.mp3"])
                        Q.audio.play("absorbing.mp3");
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
                        Q.audio.stop("absorbing.mp3");
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
    Q.component("spark", {
        added: function () {
            this.entity.p.power = "spark";
            this.entity.p.spark_counter = 0;
            this.entity.p.distance_spark = 25;
            Q.state.p.powers = "spark";
        },
        extend: {
            attack: function (stop) {
                if (!stop) {
                    let direction = this.p.direction;
                    this.p.state = "attack";
                    this.del("platformerControls");
                    this.p.spark_counter++;
                    this.p.vy = 0;
                    this.p.vx = 0;
                    this.p.sheet = "kirbySpark";
                    this.size(true);
                    this.p.direction = direction;
                    this.play("spark_attack");
                    if (this.p.spark_counter === 1) {
                        this.stage.insert(new Q.Spark({
                            x: this.p.x - this.p.distance_spark,
                            y: this.p.y,
                            offset: this.p.distance_spark,
                            owner: this
                        }));
                        Q.audio.play("spark.mp3", {
                            loop: true
                        });
                    }
                } else {
                    this.p.spark_counter = 0;
                    let direction = this.p.direction;
                    this.p.power = "eat";
                    this.p.sheet = "kirbyR";
                    this.size(true);
                    this.add("platformerControls");
                    this.p.direction = direction;
                    this.play("stand_" + this.p.direction);
                    this.p.state = "";
                    Q.audio.stop("spark.mp3");
                }
            }
        },
    });
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
                    Q.state.inc("score", 100);
                    collision.obj.kill();
                    Q.stageScene('hudsElements', 2);
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

    Q.animations('cloud_anim', {
        shoot_right: {
            frames: [0],
            rate: 1,
            loop: true,
            flip: false
        },
        shoot_left: {
            frames: [0],
            rate: 1,
            loop: true,
            flip: "x"
        }
    });
    Q.Sprite.extend("Cloud", {
        init: function (p) {
            this._super(p, {
                sprite: "cloud_anim",
                sheet: "cloud",
                x: p.x,
                y: p.y,
                vx: p.vx,
                time: 0,
                gravity: 0,
                direction: p.direction
            });
            this.add('2d, animation');
            this.on("hit", function (collision) {
                this.p.vx = 0;
                this.destroy();
                if (collision.obj.has("enemy")) {
                    Q.state.inc("score", 100);
                    collision.obj.kill();
                    Q.stageScene('hudsElements', 2);
                }
            });
        },
        step: function (dt) {
            this.play("shoot_" + this.p.direction);
            this.p.time += dt;
            if (this.p.time >= 1) {
                this.destroy();
            }
        }

    });
}