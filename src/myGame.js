var points = 0;
var ticks = 0;
var tank_x = 915;
var blist = null; // bullet list
var mlist = null; // misiles list
var speed = 2;
var right = false;
var left = false;
var space = false;
var shift = false;
var live = 1;


function bullet(x, y) // Constructor for a graphical element
{
    this.x = x;
    this.y = y;
}

function misile(x, y, img) // Constructor for a graphical element
{
    this.x = x;
    this.y = y;
    this.img = img;
}

class my_tank {
    constructor(x, y) {
        // this ==> permanente Daten zum Objekt
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 20;
    }
}

function start_game() {

    live = 3;
    document.getElementById("Start_Button").innerHTML = "Start Game";
    document.getElementById("Start_Button").disabled = true;

    document.getElementById("c1").width = document.getElementById("c1").width;

    console.log("user has started game.....");
    gameInterval = setInterval(cycle, 10); // cycle wird in jede 10ms aufgerufen; 

    /*
    blist = new Array(); // nun wird die Bullet-Liste erzeugt
    mlist = new Array(); // nun wird die Misile-Liste erzeugt
    */

    blist = [];
    mlist = [];

    /* random pic for misile */
    var image1 = new Image();
    var image2 = new Image();

    image1.src = "pic/angry_circle.png";
    image2.src = "pic/happy_circle.png"

    imglist = [image1, image2];

    var c1 = document.getElementById("c1");

    c1.setAttribute('tabindex', '0');
    c1.focus();

    c1.addEventListener('keydown', function(event) {
        event.preventDefault();
        console.log(event.key, event.keyCode);

        if (event.keyCode === 37) // LEFT
            left = true;
        if (event.keyCode === 39) // RIGHT
            right = true;
        if (event.keyCode === 32) // SPACE
            space = true;
        if (event.keyCode === 16) // SHIFT
            shift = true;
    });

    c1.addEventListener('keyup', function(event) {
        event.preventDefault();
        console.log(event.key, event.keyCode);

        if (event.keyCode === 37) { // LEFT
            left = false;
        }
        if (event.keyCode === 39) { // RIGHT
            right = false;
        }
        if (event.keyCode === 32) { // SPACE
            space = false;
        }
        if (event.keyCode === 16) { // SHIFT
            shift = false;
        }
    });
}

function stop_game() {

    clearInterval(gameInterval);
    console.log("The has been stopped by the user :(");
    document.getElementById("Start_Button").disabled = false;

}

function cycle() // alle 100ms aufgerufen; misiles erzeugen, neue positionen rechnen, in die liste schieben
{
    ticks++;

    var obj = document.getElementById("points-display");
    obj.innerHTML = points;

    var obj2 = document.getElementById("live");
    obj2.innerHTML = live;

    // create misiles
    if (ticks % 100 == 0) // erzeuge eine Misile 
    {
        var imgToDraw = imglist[Math.floor(Math.random() * imglist.length)];

        var x = Math.random() * 1830;
        var m = new misile(x, -20, imgToDraw); // misile erzeugen
        mlist.push(m); // und schmeissen sie in die Liste
        console.log("new misile created at x = " + x + " ....... ");
    }

    // move bullets 
    for (var i = 0; i < blist.length; i++) {
        var b = blist[i];
        if (b.y < 10)
            blist.remove(b); // wenn er schon ganz oben ist ==> aus der Liste löschen
        else
            b.y -= 10; // sonst nach oben fahren
    }

    // move misiles 
    for (var i = 0; i < mlist.length; i++) {
        var m = mlist[i];
        if (m.y > 599) // wenn ganz unten aus der Liste löschen
            mlist.remove(m);
        else
            m.y += 1; // nach unten
    }

    // jetzt alles neu zeichnen 
    draw_cycle();
}

function draw_cycle() {

    if (live > 0) {

        var c = document.getElementById("c1");
        c.width = c.width; // alles neu zeichnen ==> Löschen

        // 1.draw tank
        var ctx = c.getContext("2d"); // get context 

        // zeichne Tank auf eine aktuelle Position (tank_x)
        var imgtank = new Image();
        imgtank.src = "pic/tank.gif";
        ctx.drawImage(imgtank, tank_x, 550, 60, 50);

        // 2. draw bullets 
        for (var i = 0; i < blist.length; i++) {
            var b = blist[i];

            var imgbullet = new Image();
            imgbullet.src = "pic/bullet.gif"
                //ctx.fillStyle = "#00f";
            ctx.drawImage(imgbullet, b.x, b.y, 10, 40);
        }

        // 3. draw misiles 
        for (var i = 0; i < mlist.length; i++) {

            var m = mlist[i];

            if (m.img == imglist[0])
                ctx.drawImage(m.img, m.x, m.y, 50, 50);
            else
                ctx.drawImage(m.img, m.x, m.y, 25, 25);

            if (intersection(m.x, m.y, 35, 35, tank_x, 550, 60, 50)) // Überschneidung zwischen tank und missile
            {
                if (m.img == imglist[0]) {

                    console.log("I've been hit");
                    mlist.splice(i, 1);
                    if (live == 0)
                        live = 0;
                    else
                        live--;
                } else {
                    console.log("Life added");
                    mlist.splice(i, 1);
                    if (live <= 5)
                        live++;
                    else
                        live = 5;
                }
            }
        }

        //Überschneidung zwischen bullets und missiles
        for (var i = 0; i < blist.length; i++) {

            var b = blist[i]; // das i-te bullet aus der Liste holen

            for (var j = 0; j < mlist.length; j++) {

                var m = mlist[j]; // das i-te missile aus der Liste holen

                if (intersection(b.x, b.y, 3, 5, m.x, m.y, 50, 50)) {
                    if (m.img == imglist[0]) {
                        mlist.splice(j, 1);
                        blist.splice(i, 1);
                        points++;
                    }
                }
            }
        }

        //Tank bewegen
        if (right & shift)
            tank_x += speed * 5;
        else if (right)
            tank_x += speed;

        if (left & shift)
            tank_x -= speed * 5;
        else if (left)
            tank_x -= speed;

        // bullet beim Tank erzeugen
        if (space) {
            console.log("create bullet at position " + tank_x);

            var b = new bullet(tank_x + 28, 530); // bullet erzeugen
            if (bullet) {
                space = false;
            }
            blist.push(b); // und schmeissen sie in die Liste
        }

        // verhindern dass das tank aus dem Canvas geht
        if (tank_x < 0)
            tank_x = 0;

        if (tank_x + 60 > c1.width)
            tank_x = c1.width - 60;

    } else {
        gameover();
    }
}

function gameover() {

    clearInterval(gameInterval);
    points = 0;
    ctx = document.getElementById("c1").getContext("2d");
    document.getElementById("c1").width = document.getElementById("c1").width;
    ctx.textAlign = "center";
    ctx.font = "30px Georgia";
    ctx.fillText("GAME OVER", document.getElementById("c1").width / 2, document.getElementById("c1").height / 2);
    console.log("Game over. Stopping the game now...")
    document.getElementById("Start_Button").disabled = false;
    document.getElementById("Start_Button").innerHTML = "Restart";

}

// custom array.remove function
Array.prototype.remove = function(item) {
    var deleted;
    var index = 0;
    while ((index = this.indexOf(item, index)) != -1) {
        deleted = this.splice(index, 1);
    }
    if (deleted) {
        return deleted[0];
    }
}

function intersection(r1_x, r1_y, r1_w, r1_h, r2_x, r2_y, r2_w, r2_h) {
    if (r1_x + r1_w < r2_x)
        return false; // r2 rechts von r1 ==> keine Überschneidung

    if (r2_x + r2_w < r1_x)
        return false; // r2 links von r1 

    if (r1_y + r1_h < r2_y)
        return false; // r1 Über r2

    if (r2_y + r2_h < r1_y)
        return false; // r2 Über r1

    return true;
}