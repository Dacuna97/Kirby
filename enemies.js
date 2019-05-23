function loadEnemies(Q) {
    Q.component("enemy", {
        added: function () {
            this.entity.on("bump.left,bump.right,bump.top,bump.bottom", function (collision) {
                if (collision.obj.state === "attack") {
                    //    collision.distance += 16;
                }
                if (collision.obj.isA("Player") && collision.obj.p.state != "dead" && !this.p.dead) {
                    if (collision.obj.p.state === "attack" || collision.obj.p.state === "kick") {
                        if (collision.obj.p.power === "eat" || collision.obj.p.state === "kick") {
                            this.p.dead = true;
                            if (collision.obj.p.state === "attack") {
                                Q.state.inc("score", 300);
                            } else if (collision.obj.p.state === "kick") {
                                Q.state.inc("score", 50);
                            }
                            Q.stageScene('hudsElements', 2);

                            if (this.p.x < collision.obj.p.x)
                                this.p.vx = 100;
                            else
                                this.p.vx = -100;

                            if (collision.obj.p.state != "kick") {
                                var aux = this;

                                collision.obj.p.sensor = true;
                                var aux2 = collision.obj;
                                collision.obj.p.food = this.p.power;
                                this.del('aiBounce');
                                aux2.p.power = "fed";
                                setTimeout(function () {
                                    aux.kill();
                                    aux2.p.sensor = false;
                                }, 200);
                            } else
                                this.kill();
                        }
                    } else {
                        Q.audio.play("hit.mp3");
                        if (collision.obj.p.invincible === 0) {
                            Q.state.p.health = Q.state.get("health") - 1;

                            collision.obj.p.vy = -250;
                            if (collision.obj.p.x > this.p.x)
                                collision.obj.p.vx = 250;
                            else
                                collision.obj.p.vx = -250;
                            collision.obj.p.sensor = true;
                            collision.obj.del("platformerControls");
                            if (Q.state.get("health") == 0) {
                                Q.state.p.lives = Q.state.get("lives") - 1;  
                                Q.audio.stop("level1.mp3");	
                                Q.audio.play("miss_life.mp3");
                                collision.obj.p.state = "dead";
                                 var a = setTimeout(function(){Q.stageScene("lostLife", 3, {});}, 2900);
                                 
                                if (Q.state.get("lives") == 0) {
                                    clearTimeout(a);
                                    collision.obj.play("die");
                                    collision.obj.p.vy = -500;
                                    collision.obj.del("platformerControls");
                                    Q.stageScene("endGame", 3, {
                                        label: "You Died"
                                    });
                                }
                            }
                            collision.obj.p.invincible += 0.4;
                        }
                    }
                    //collision.obj.destroy();
                } else if (collision.obj.isA("Spark") && collision.obj.p.owner.isA("Player")){
                    this.destroy();
                    Q.state.inc("score", 300);
                }
            });
        }
    });
   
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
        kill: function () {
            this.destroy();
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


    Q.animations('enemy_aerial_anim', {
        fly_right: {
            frames: [0, 1],
            rate: 1 / 10,
            flip: false,
            loop: true
        },
        fly_left: {
            frames: [0, 1],
            rate: 1 / 10,
            flip: "x",
            loop: true
        }
    });

    Q.Sprite.extend("EnemyAerial", {
        init: function (p) {
            this._super(p, {
                sprite: "enemy_aerial_anim",
                sheet: "enemy_aerial", // Setting a sprite sheet sets sprite width and height
                x: p.x, // You can also set additional properties that can
                y: p.y, // be overridden on object creation
                vx: 40,
                vy: -40,
                rangeY: 10,
                gravity: 0
            });
            this.add("2d, aiBounce, animation, enemy");
            this.p.initialY = this.p.y;
        },
        kill: function () {
            this.destroy();
        },
        step: function (dt) {
            if (this.p.vx > 0) {
                this.play("fly_left");
            } else {
                this.play("fly_right");
            }

            if (this.p.y - this.p.initialY >= this.p.rangeY && this.p.vy > 0) {
                this.p.vy = -this.p.vy;
            }
            else if (-this.p.y + this.p.initialY >= this.p.rangeY && this.p.vy < 0) {
                this.p.vy = -this.p.vy;
            }
        }
    });



    

    Q.animations('enemy_spark_anim', {
        move_right: {
            frames: [0, 1, 2],
            rate: 1 / 5,
            flip: false,
            trigger: "jump",
            loop: false
        },
        move_left: {
            frames: [0, 1, 2],
            rate: 1 / 5,
            flip: "x",
            trigger: "jump",
            loop: false
        },
        attack: {
            frames: [3, 4],
            rate: 1 / 5,
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
                vx: 30,
                sensor: true,
                attack_time: 0,
                spark_counter: 0,
                stop_attack: false,
                distance_spark: 25,
                dead: false,
                power: "spark"
            });
            this.add('2d,aiBounce,enemy,animation,tween');
            this.on("jump", this, "jumpSpark");
        },
        kill: function () {
            let spark = Q("Spark");
            if (spark)
                spark.destroy();
            this.destroy();
        },
        jumpSpark: function () {
            this.p.vy = -200;
        },
        step: function (dt) {
            this.p.attack_time += dt;
            if (this.p.attack_time >= 4 && this.p.attack_time <= 6) {
                this.p.vx = 0;
                this.p.vy = 0;
                this.play("attack");
                if (this.p.spark_counter === 0) {
                    this.p.spark_counter++;
                    this.stage.insert(new Q.Spark({
                        x: this.p.x - this.p.distance_spark,
                        y: this.p.y,
                        offset: this.p.distance_spark,
                        owner: this
                    }));
                    Q.audio.play("spark.mp3", {loop: true});
                }
            } else if (this.p.attack_time > 6) {
                this.p.spark_counter = 0;
                this.p.stop_attack = true;
                this.p.attack_time = 0;
                this.p.direction === "right" ? this.p.vx = 30 : this.p.vx = -30;
                Q.audio.stop("spark.mp3");
            } else if (this.p.attack_time < 4) {
                if (this.p.vx > 0) {
                    this.play("move_left");
                } else {
                    this.play("move_right");
                }
                Q.audio.stop("spark.mp3");
            }
            
        }
    });

    
    Q.animations('spark_anim', {
        spark: {
            frames: [0, 1],
            rate: 1 / 25,
            loop: false,
            trigger: "move"
        }
    });

    Q.Sprite.extend("Spark", {

        init: function (p) {
            this._super(p, {
                sprite: "spark_anim",
                sheet: "spark", // Setting a sprite sheet sets sprite width and height
            });

            this.add('2d,animation');
            this.on("bump.left, bump.top, bump.right, bump.bottom", function (collision) {
                if (collision.obj.isA("Player") && !this.p.owner.isA("Player")) {
                    if (collision.obj.p.state === 'kick') {
                        collision.obj.p.state = '';
                        collision.obj.p.vx = 0;
                        collision.obj.p.vy = 0;
                    }
                    Q.audio.play("hit.mp3");
                    Q.state.p.health = Q.state.get("health") - 1;

                    collision.obj.p.vy = -250;
                    if (collision.obj.p.x > this.p.x)
                        collision.obj.p.vx = 250;
                    else
                        collision.obj.p.vx = -250;
                    collision.obj.p.sensor = true;
                    collision.obj.del("platformerControls");
                    if (Q.state.get("health") == 0) {
                        Q.state.p.lives = Q.state.get("lives") - 1;
                        Q.audio.stop("level1.mp3");	
                        Q.audio.play("miss_life.mp3");
                        collision.obj.p.state = "dead";
                       var a =  setTimeout(function(){Q.stageScene("lostLife", 3, {});}, 2900);
                        if (Q.state.get("lives") == 0) {
                            clearTimeout(a);
                            collision.obj.play("die");
                            collision.obj.p.state = "dead";
                            collision.obj.p.vy = -500;
                            collision.obj.del("platformerControls");
                            Q.stageScene("endGame", 3, {
                                label: "You Died"
                            });
                        }
                    }
                    collision.obj.p.invincible += 0.4;

                } else if (this.p.owner.isA("Player") && collision.obj.has("enemy")){
                    collision.obj.kill();
                }
            });
            this.on("move", this, "move_spark");
            this.p.owner_x = this.p.owner.p.x;
            this.p.owner_y = this.p.owner.p.y;
        },
        move_spark: function () {
            if (this.p.x < this.p.owner_x) {//it is left move to up
                this.p.y = this.p.owner_y - this.p.offset;
                this.p.x = this.p.owner_x;
            } else if (this.p.y != this.p.owner_y && this.p.x === this.p.owner_x) { //it is up, move to right
                this.p.x = this.p.owner_x + this.p.offset;
                this.p.y = this.p.owner_y;
            } else if (this.p.x > this.p.owner_x) { // it is right, move to left
                this.p.x = this.p.owner_x - this.p.offset;
                this.p.y = this.p.owner_y;
            }
        },
        step: function (dt) {
            this.play("spark");
            if( this.p.owner.has("enemy")  && this.p.owner.p.stop_attack){
                this.p.owner.p.stop_attack = false;
                this.destroy();  
            } else if (!this.p.owner.has("enemy") && this.p.owner.p.state != "attack") {
                this.destroy();
            }
        }
    });
}
