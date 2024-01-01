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

var fullBossHealth = 100;
var bossHealth = fullBossHealth;
var fullPlayerHealth = 3;
var playerHealth = fullPlayerHealth;

var playerLost = false;
var playerWon = false;

var arrows;
var arrowSpeed = 450;
var arrowGap = 400;
var cursors;
var timer = 0;
var baseArrows;
var boss;
var bossName;

var hurt;

var playerLost2 = false;
var playerWon2 = false;

var bossHp;

var game = new Phaser.Game(config);

function preload(){
    this.load.image('fightBg', 'assets/fightBg.png');
    this.load.image('bgFrame', 'assets/fightBgFrame.png');
    this.load.image('baseArrows', 'assets/arrows.png');
    this.load.spritesheet('arrows', 'assets/arrows.png', { frameWidth: 184, frameHeight: 181 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('boss', 'assets/bosses/boba.png');
    this.load.image('bossName', 'assets/bosses/bobaTitle.png');
    this.load.image('win', 'assets/bosses/win.png');
    this.load.image('lose', 'assets/bosses/lose.png');

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

    baseArrows = this.physics.add.staticSprite(1550, 1100, 'baseArrows');

    arrows = this.physics.add.group();
    var arrow = arrows.create(1272, 0, 'arrows');
    arrow.direction = 'up';
    arrow.setFrame(0);

    hurt = this.sound.add("hurt", { loop: false });
    bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.5 });

    bgMusic.play();

    this.physics.add.overlap(baseArrows, arrows, hitArrow, null, this);
    this.physics.add.overlap(ground, arrows, playerHurt, null, this);

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

    arrows.setVelocityY(arrowSpeed);

    timer += delta;
    while (timer > arrowGap) {
        timer -= arrowGap;
        addArrow();
    }
}

function playerHurt(ground, arrow){
    var playerHearts = hearts.getChildren();
    playerHearts[playerHealth - 1].disableBody(true, true);

    arrow.destroy();
    playerHealth--;
    if(playerHealth < 1){
        playerLost = true;
    }

    baseArrows.setTint(0xf2a099);
    setTimeout(()=> {
        baseArrows.clearTint();}, 100); 

    hurt.play();
}

function addArrow(){
    var whichArrow = Phaser.Math.Between(0, 3);
    var x = 0;
    var direction = 'up';

    if(whichArrow == 0){
        x = 1272;
    }
    else if(whichArrow == 1){
        x = 1456;
        direction = 'down';
    }
    else if(whichArrow == 2){
        x = 1640;
        direction = 'left';
    }
    else{
        x = 1824;
        direction = 'right';
    }

    var arrow = arrows.create(x, 0, 'arrows');
    arrow.direction = direction;
    arrow.setFrame(whichArrow);
}

function hitArrow(baseArrows, arrow){
    if(arrow.y < 1000){
        return;
    }

    var accurateHit = false;
    if (cursors.left.isDown && arrow.direction == 'left'){
        accurateHit = true;
    }
    else if (cursors.right.isDown && arrow.direction == 'right'){
        accurateHit = true;
    }
    else if (cursors.up.isDown && arrow.direction == 'up'){
        accurateHit = true;
    }
    else if (cursors.down.isDown && arrow.direction == 'down'){
        accurateHit = true;  
    }

    if(accurateHit){
        arrow.destroy();
        bossHealth--;

        baseArrows.setTint(0xf5f50a);
                
        setTimeout(()=> {
            baseArrows.clearTint();}, 100); 
    }

    var falseHit = false;
    if (cursors.left.isDown && arrow.direction != 'left'){
        falseHit = true;
    }
    if (cursors.right.isDown && arrow.direction != 'right'){
        falseHit = true;
    }
    if (cursors.up.isDown && arrow.direction != 'up'){
        falseHit = true;
    }
    if (cursors.down.isDown && arrow.direction != 'down'){
        falseHit = true;  
    }

    if(falseHit){
        playerHurt(ground, arrow);
    }

    if(bossHealth < 1){
        playerWon = true;
    }
}