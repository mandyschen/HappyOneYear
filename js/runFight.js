
var config = {
    type: Phaser.AUTO,
    width: 2224,
    height: 1668,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var fullBossHealth = 125;
var bossHealth = fullBossHealth;
var fullPlayerHealth = 3;
var playerHealth = fullPlayerHealth;

var playerLost = false;
var playerWon = false;

var stars;
var roadDashes;
var starSpeed = 500;
var starGap = 300;
var bombs;
var bombSpeed = 500;
var bombGap = 900;
var bombs2;
var bombGap2 = 2000;
var bigBomb = 0;
var cursors;
var timer = 0;
var timer2 = 0;
var timer3 = 0;
var basket;
var basketSpeed = 400;
var boss;
var bossName;
var walls;
var runLeft = true;
var wantCenter = true;

var leftWasDown = false;
var rightWasDown = false;

var hurt;

var playerLost2 = false;
var playerWon2 = false;

var bossHp;

var game = new Phaser.Game(config);

function preload(){
    this.load.image('fightBg', 'assets/fightBg.png');
    this.load.image('bgFrame', 'assets/fightBgFrame.png');
    this.load.image('basket', 'assets/basket.png');
    this.load.image('star', 'assets/movement.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('boss', 'assets/bosses/hereditary.png');
    this.load.image('bossName', 'assets/bosses/hereditaryTitle.png');
    this.load.image('win', 'assets/bosses/win.png');
    this.load.image('lose', 'assets/bosses/lose.png');
    this.load.image('wall', 'assets/verticalPlatform.png');
    this.load.image('runGuy', 'assets/runGuy.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('roadDash', 'assets/roadDash.png');

    this.load.audio('hurt', ["assets/sound/hurt.mp3"]);
    this.load.audio('bgMusic', ["assets/sound/fightMusic.mp3"]);
    this.load.audio('failure', ["assets/sound/failure.mp3"]);
    this.load.audio('victory', ["assets/sound/victory.mp3"]);
}

function create(){
    let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fightBg');
    let scaleX = this.cameras.main.width / bg.width;
    let scaleY = this.cameras.main.height / bg.height;
    let scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    let bgFrame = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bgFrame');
    bgFrame.setScale(scale).setScrollFactor(0);
    bgFrame.setDepth(11);

    bossName = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bossName');
    bossName.setScale(scale).setScrollFactor(0);
    bossName.setDepth(12);

    this.add.image(1300, 700, 'road').setScale(0.75);
    this.add.image(1550, 700, 'road').setScale(0.75);
    this.add.image(1800, 700, 'road').setScale(0.75);

    ground = this.physics.add.sprite(1550, 1900, 'ground');
    ground.setScale(10,10);
    ground.alpha = 0;

    cursors = this.input.keyboard.createCursorKeys();

    boss = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'boss');
    boss.setScale(scale).setScrollFactor(0);

    basket = this.physics.add.sprite(1550, 1150, 'runGuy');
    basket.setScale(0.75);
    basket.setDepth(10);

    stars = this.physics.add.group();
    var star = stars.create(1550, 0, 'star');
    star.setAlpha(0);
    
    roadDashes = this.physics.add.group();
    roadDashes.create(1550, 0, 'roadDash').setScale(0.25);

    bombs = this.physics.add.group();
    var bomb = bombs.create(1550, 0, 'bomb');
    bomb.setScale(0.5);
    bomb.setDepth(10);

    // bombs2 = this.physics.add.group();
    // var bomb2 = bombs2.create(1600, 0, 'bomb');

    hurt = this.sound.add("hurt", { loop: false });
    bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.5 });

    bgMusic.play();

    this.physics.add.overlap(basket, stars, hitStar, null, this);
    this.physics.add.overlap(ground, roadDashes, destroyDash, null, this);
    this.physics.add.overlap(ground, bombs, destroyDash, null, this);
    this.physics.add.overlap(basket, bombs, hitBomb, null, this);
    // this.physics.add.overlap(basket, bombs2, hitBomb, null, this);
    // this.physics.add.overlap(ground, stars, playerHurt, null, this);

    walls = this.physics.add.staticGroup();
    walls.create(1100, 700, 'wall').setScale(2).setAlpha(0).refreshBody();
    walls.create(2060, 700, 'wall').setScale(2).setAlpha(0).refreshBody();
    walls.setDepth(9);

    this.physics.add.collider(basket, walls);

    hearts = this.physics.add.group({
        key: 'heart',
        repeat: fullPlayerHealth - 1,
        setXY: { x: 300, y: 1400, stepX: 200 }
    });
    hearts.setDepth(12);

    bossHp = this.add.text(250, 100, 'HP:' + bossHealth, { fontSize: '64px', fill: '#000' }).setDepth(12);

}

function destroyDash(ground, dash){
    dash.destroy();
}

function destroyBomb(ground, bomb){
    bomb.destroy();
}

function update(time, delta){
    bossHp.setText('HP:' + bossHealth);
    if (playerWon){
        boss.setTint(0xFF0000);
        text = this.add.text(600, 15, 'Press SPACE to return.', { fontSize: '64px', fill: '#000' });
        text.setDepth(12);
        bossName.destroy();
        win = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'win');
        let scaleX = this.cameras.main.width / win.width;
        let scaleY = this.cameras.main.height / win.height;
        let scale = Math.max(scaleX, scaleY);
        win.setScale(scale).setScrollFactor(0);
        win.setDepth(12);
        this.physics.pause();
        playerWon = false;
        playerWon2 = true;
        bgMusic.stop();
        bgMusic = this.sound.add("victory", { loop: true });
        bgMusic.play();
        return;
    }
    if (playerLost){
        text = this.add.text(600, 15, 'Press SPACE to try again.', { fontSize: '64px', fill: '#000' });
        text.setDepth(12);
        bossName.destroy();
        lose = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'lose');
        let scaleX = this.cameras.main.width / lose.width;
        let scaleY = this.cameras.main.height / lose.height;
        let scale = Math.max(scaleX, scaleY);
        lose.setScale(scale).setScrollFactor(0);
        lose.setDepth(12);
        this.physics.pause();
        playerLost = false;
        playerLost2 = true;
        bgMusic.stop();
        bgMusic = this.sound.add("failure", { loop: true });
        bgMusic.play();
        return;
    }
    if (playerLost2 && cursors.space.isDown){
        location.reload();
    }
    if (playerWon2 && cursors.space.isDown){
        window.open('','_self').close()
    }

    if(cursors.left.isDown){
        leftWasDown = true;
    }
    else if(cursors.right.isDown){
        rightWasDown = true;
    }

    if(leftWasDown && cursors.left.isUp && basket.x > 1300){
        basket.x -= 250;
        leftWasDown = false;
    }
    if(rightWasDown && cursors.right.isUp && basket.x < 1800){
        basket.x += 250;
        rightWasDown = false;
    }

    stars.setVelocityY(starSpeed);
    roadDashes.setVelocityY(starSpeed);

    timer += delta;
    while (timer > starGap) {
        timer -= starGap;
        addStar();
        if(runLeft){
            basket.setFlipX(true);
            runLeft = false;
        }
        else{
            basket.setFlipX(false);
            runLeft = true;
        }
        
    }

    bombs.setVelocityY(bombSpeed);
    // bombs2.setVelocityY(bombSpeed);

    timer2 += delta;
    while (timer2 > bombGap) {
        timer2 -= bombGap;
        addBomb();
    }

    // timer3 += delta;
    // while (timer3 > bombGap2) {
    //     timer3 -= bombGap2;
    //     addBomb2();
    // }
}

function playerHurt(basket, bomb){
    var playerHearts = hearts.getChildren();
    playerHearts[playerHealth - 1].disableBody(true, true);

    bomb.destroy();
    playerHealth--;
    if(playerHealth < 1){
        playerLost = true;
    }

    basket.setTint(0xf2a099);
    setTimeout(()=> {
        basket.clearTint();}, 100); 

    hurt.play();
}

function addStar(){
    // var x = Phaser.Math.Between(1250, 1900);

    var star = stars.create(1575, 0, 'star');
    star.setAlpha(0);

    roadDashes.create(1300, 0, 'roadDash').setScale(0.25);
    roadDashes.create(1550, 0, 'roadDash').setScale(0.25);
    roadDashes.create(1800, 0, 'roadDash').setScale(0.25);
}

function hitStar(basket, star){
    star.destroy();
    bossHealth--;
    if(bossHealth < 1){
        playerWon = true;
    }
}

function addBomb(){
    // var x = Phaser.Math.Between(1250, 1900);
    var x = Phaser.Math.Between(0, 2);
    var y = 0;
    var x2 = Phaser.Math.Between(0, 2);
    var y2 = 0;

    if(x2 != x){
        if(x2 == 0){
            y2 = 1300;
        }
        else if(x == 1){
            y2 = 1550;
        }
        else{
            y2 = 1800;
        }

        var bomb = bombs.create(y2, 0, 'bomb');
        bomb.setScale(0.5);
        bomb.setDepth(10);
    }

    if(x == 0){
        y = 1300;
    }
    else if(x == 1){
        y = 1550;
    }
    else{
        y = 1800;
    }

    var bomb = bombs.create(y, 0, 'bomb');
    bomb.setScale(0.5);
    bomb.setDepth(10);
    bigBomb++;

    if(bigBomb == 3){
        bomb.setScale(1);
        bigBomb = 0;
    }
}

// function addBomb2(){
//     var x = Phaser.Math.Between(1250, 1900);

//     bombs2.create(x, 100, 'bomb');
// }

function hitBomb(basket, bomb){
    // bomb.destroy();
    playerHurt(basket, bomb);
}