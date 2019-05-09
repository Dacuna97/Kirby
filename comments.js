/*Q.component("impact_enemy", { //change vy to vx and impact enemies should work
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
});*/
