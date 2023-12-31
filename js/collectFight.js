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

var fullBossHealth = 30;
var bossHealth = fullBossHealth;
var fullPlayerHealth = 3;
var playerHealth = fullPlayerHealth;

var playerLost = false;
var playerWon = false;

var stars;
var starSpeed = 700;
var starGap = 800;
var bombs;
var bombSpeed = 900;
var bombGap = 1300;
var cursors;
var timer = 0;
var timer2 = 0;
var basket;
var basketSpeed = 600;
var boss;
var bossName;
var walls;

var hurt;

var playerLost2 = false;
var playerWon2 = false;

var bossHp;

var game = new Phaser.Game(config);

function preload(){
    this.load.image('fightBg', 'assets/fightBg.png');
    this.load.image('bgFrame', 'assets/fightBgFrame.png');
    this.load.image('basket', 'assets/basket.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('boss', 'assets/bosses/everything.png');
    this.load.image('bossName', 'assets/bosses/everythingTitle.png');
    this.load.image('win', 'assets/bosses/win.png');
    this.load.image('lose', 'assets/bosses/lose.png');
    this.load.image('wall', 'assets/verticalPlatform.png');

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
    bgFrame.setDepth(1);

    bossName = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bossName');
    bossName.setScale(scale).setScrollFactor(0);
    bossName.setDepth(1);


    ground = this.physics.add.sprite(1550, 1400, 'ground');
    ground.setScale(10,10);
    ground.alpha = 0;

    cursors = this.input.keyboard.createCursorKeys();

    boss = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'boss');
    boss.setScale(scale).setScrollFactor(0);

    basket = this.physics.add.sprite(1550, 1175, 'basket');
    basket.setScale(0.75);

    stars = this.physics.add.group();
    var star = stars.create(1272, 0, 'star');
    star.setScale(0.5);

    bombs = this.physics.add.group();
    var bomb = bombs.create(1600, 0, 'bomb');
    bomb.setScale(0.75);

    hurt = this.sound.add("hurt", { loop: false });
    bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.5 });

    bgMusic.play();

    this.physics.add.overlap(basket, stars, hitStar, null, this);
    this.physics.add.overlap(basket, bombs, hitBomb, null, this);
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
    hearts.setDepth(2);

    bossHp = this.add.text(250, 100, 'HP:' + bossHealth, { fontSize: '64px', fill: '#000' }).setDepth(12);

}

function update(time, delta){
    bossHp.setText('HP:' + bossHealth);
    if (playerWon){
        boss.setTint(0xFF0000);
        text = this.add.text(600, 15, 'Press SPACE to return.', { fontSize: '64px', fill: '#000' });
        text.setDepth(5);
        bossName.destroy();
        win = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'win');
        let scaleX = this.cameras.main.width / win.width;
        let scaleY = this.cameras.main.height / win.height;
        let scale = Math.max(scaleX, scaleY);
        win.setScale(scale).setScrollFactor(0);
        win.setDepth(1);
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
        text.setDepth(5);
        bossName.destroy();
        lose = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'lose');
        let scaleX = this.cameras.main.width / lose.width;
        let scaleY = this.cameras.main.height / lose.height;
        let scale = Math.max(scaleX, scaleY);
        lose.setScale(scale).setScrollFactor(0);
        lose.setDepth(1);
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

    if (cursors.left.isDown){
        basket.setVelocityX(basketSpeed * -1);
    }
    else if (cursors.right.isDown){
        basket.setVelocityX(basketSpeed);
    }

    stars.setVelocityY(starSpeed);

    timer += delta;
    while (timer > starGap) {
        timer -= starGap;
        addStar();
    }

    bombs.setVelocityY(bombSpeed);

    timer2 += delta;
    while (timer2 > bombGap) {
        timer2 -= bombGap;
        addBomb();
    }
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
    var x = Phaser.Math.Between(1250, 1900);

    var star = stars.create(x, 0, 'star');
    star.setScale(0.5);
}

function hitStar(basket, star){
    star.destroy();
    bossHealth--;
    if(bossHealth < 1){
        playerWon = true;
    }
}

function addBomb(){
    var x = Phaser.Math.Between(1250, 1900);

    var bomb = bombs.create(x, 0, 'bomb');
    bomb.setScale(0.75);
}

function hitBomb(basket, bomb){
    bomb.destroy();
    playerHurt(basket, bomb);
}
