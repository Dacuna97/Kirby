function loadHUD(Q){
    Q.Sprite.extend("ScoreE", {
        init: function (p) {
            this._super(p, {
                asset: "scoreElem.png",
            });
        }
    });

  

    Q.Sprite.extend("KirbyE", {
        init: function (p) {
            this._super(p, {
                asset: "kirbyElem.png",

            });
        }
    });

   
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
                case "normal" /*|| "eat" */ :
                    this.play("pNormal");
                    break;
                case "spark":
                    this.play("pSpark");
                    break;
            }
        }
    });
}