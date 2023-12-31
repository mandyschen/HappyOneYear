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

var title;
var titleText;

var player;
var platforms;
var walls;
var cursors;
var gameOver = false;
var text;
var items;
var collectItems = 0;
var collected = false;
var ponponcrab, hereditary, bracelet, pearl, boba, eeaao;
var envelope;

var me;
var heart;
var heartCount = 0;
var heartCountText;
var heartBounce;
var wasDown = false;
var collect;
var heartWalls;
var heartPlatforms;

var game = new Phaser.Game(config);

function preload(){
    this.load.image('title', 'assets/title.png');
    this.load.image('roomBg', 'assets/roomBg.png');
    this.load.image('letter', 'assets/letter.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('wall', 'assets/verticalPlatform.png');
    this.load.spritesheet('dude', 'assets/player.png', { frameWidth: 211, frameHeight: 443 });
    this.load.spritesheet('items', 'assets/items.png', { frameWidth: 186, frameHeight: 175 });
    this.load.spritesheet('rollGuy', 'assets/rollGuy.png', { frameWidth: 490, frameHeight: 495 });
    this.load.image('envelope', 'assets/envelope.png');
    this.load.image('heart', 'assets/heart.png');

    this.load.audio('bgMusic', ["assets/sound/roomMusic.mp3"]);
    this.load.audio('collect', ["assets/sound/collect.mp3"]);
}

function create(){
    cursors = this.input.keyboard.createCursorKeys();

    let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'roomBg')
    let scaleX = this.cameras.main.width / bg.width
    let scaleY = this.cameras.main.height / bg.height
    let scale = Math.max(scaleX, scaleY)
    bg.setScale(scale).setScrollFactor(0)

    platforms = this.physics.add.staticGroup();
    walls = this.physics.add.staticGroup();

    platforms.create(1200, 1350, 'ground').setScale(5).setAlpha(0).refreshBody();
    platforms.create(1200, 1350, 'ground').setScale(4).setAlpha(0).refreshBody();
    walls.create(450, 700, 'wall').setScale(2).setAlpha(0).refreshBody();
    walls.create(2075, 700, 'wall').setScale(2).setAlpha(0).refreshBody();
    walls.create(1900, 200, 'wall').setScale(1).setAlpha(0).refreshBody();
    walls.create(1800, 200, 'wall').setScale(1).setAlpha(0).refreshBody();
    walls.create(1750, 200, 'wall').setScale(1).setAlpha(0).refreshBody();

    items = this.physics.add.group();
    ponponcrab = items.create(800, 150, 'items').setFrame(0);
    hereditary = items.create(1500, 1175, 'items').setFrame(1);
    bracelet = items.create(2000, 1000, 'items').setFrame(2);
    pearl = items.create(1050, 750, 'items').setFrame(3);
    boba = items.create(525, 900, 'items').setFrame(4);
    eeaao = items.create(1600, 300, 'items').setFrame(5);

    envelope = items.create(1000, 1000, 'envelope'); // ENVELOPE
    envelope.disableBody(true, true);

    me = this.physics.add.sprite(1900, 350, 'rollGuy').setScale(0.9);

    this.anims.create({
        key: 'roll',
        frames: this.anims.generateFrameNumbers('rollGuy', { start: 0, end: 3 }),
        frameRate: 1,
        repeat: -1
    });

    player = this.physics.add.sprite(1250, 850, 'dude');

    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, walls);
    this.physics.add.collider(player, platforms);

    items.getChildren().forEach(function(sprite) {
            sprite.on("overlapstart", function() {
            sprite.setTint(0x2f8c0a);
            text.setText('Press SPACE to collect.');
        });
        sprite.on("overlapend", function() {
            sprite.clearTint();
            text.setText('');
        });
    }, this);

    this.physics.add.overlap(player, items, collectItem, null, this);

    bgMusic = this.sound.add("bgMusic", { loop: true });
    bgMusic.play();

    // heart stuff
    heartWalls = this.physics.add.staticGroup();
    heartWalls.create(200, 700, 'wall').setScale(3).setAlpha(0).refreshBody();
    heartWalls.create(2290, 700, 'wall').setScale(3).setAlpha(0).refreshBody();

    heartPlatforms = this.physics.add.staticGroup();
    heartPlatforms.create(1200, 1350, 'ground').setScale(5).setAlpha(0).refreshBody();
    heartPlatforms.create(1200, -20, 'ground').setScale(5).setAlpha(0).refreshBody();

    heart = this.physics.add.sprite(1300, 850, 'heart');
    heart.disableBody(true, true);

    this.physics.add.collider(heart, heartWalls);
    this.physics.add.collider(heart, heartPlatforms);

    this.physics.add.sprite(125, 1450, 'heart');
    heartCountText = this.add.text(200, 1425, 'x' + heartCount, { fontSize: '64px', fill: '#000' });

    this.physics.add.overlap(player, heart, playerHeart, null, this);

    text = this.add.text(425, 1400, 'Press SHIFT for a heart.', { fontSize: '64px', fill: '#000' });
    collect = this.sound.add('collect');

    // title page
    title = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'title').setInteractive();
    title.setScale(scale).setScrollFactor(0);
    titleText = this.add.text(1350, 1350, 'Click screen to start.', { fontSize: '64px', fill: '#000' });
}

function update(){
    me.anims.play('roll', true);
    title.on('pointerdown', function (pointer){
        title.destroy();
        titleText.destroy();
    });
    if (gameOver){
        return;
    }
    playerMove();

    items.getChildren().forEach(function(sprite) {
        var touching = !sprite.body.touching.none || sprite.body.embedded;
        var wasTouching = !sprite.body.wasTouching.none;

        if (touching && !wasTouching) sprite.emit("overlapstart");
        if ((!touching && wasTouching) || collected) sprite.emit("overlapend");
    }, this);

    if (cursors.shift.isDown){
        wasDown = true;
    }
    if(wasDown && cursors.shift.isUp){
        wasDown = false;
        heart.enableBody(true, Math.floor((player.x + me.x) / 2), Math.floor((player.y + me.y) / 2), true, true);
        heart.setDepth(5);
        heart.setScale(0.75);
        heart.setBounce(1);
        heart.setVelocity(800);    
    }
}

function playerHeart(player, heart){
    collect.play();
    heartCount++;
    heartCountText.setText("x" + heartCount);
    heart.disableBody(true, true);
}

function playerMove(){
    if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.setFlipX(false);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.setFlipX(true);
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown){
        player.setVelocityY(-160);
        player.anims.play('left', true);
    }
    else if (cursors.down.isDown){
        player.setVelocityY(160);
        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);
        player.setVelocityY(0);

        player.anims.play('turn');
    }
}

function collectItem(player, item){
    if(cursors.space.isDown){
        collected = true;
        item.x = 197;
        item.y = 220 + collectItems * 175;
        collectItems++;
        if(item == boba){
            window.open('./ArrowHero.html', '_blank').focus();
        }
        if(item == eeaao){
            window.open('./BasketWeave.html', '_blank').focus();
        }
        if(item == ponponcrab){
            window.open('./DateTrivia.html', '_blank').focus();
        }
        if(item == hereditary){
            window.open('./RunRunPurin.html', '_blank').focus();
        }
        if(item == pearl){
            window.open('./ChessTrivia.html', '_blank').focus();
        }
        if(item == bracelet){
            window.open('./MeTrivia.html', '_blank').focus();
        }
        if(item == envelope){
            envelope.destroy();
            let letter = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'letter')
            let scaleX = this.cameras.main.width / letter.width
            let scaleY = this.cameras.main.height / letter.height
            let scale = Math.max(scaleX, scaleY)
            letter.setScale(scale).setScrollFactor(0)
            this.add.text(950, 200, 'Dear Aidan,', { fontSize: '64px', fill: '#000' });

            this.add.text(950, 300, 'Happy one year! I', { fontSize: '64px', fill: '#000' });
            this.add.text(950, 400, 'hope you liked', { fontSize: '64px', fill: '#000' });
            this.add.text(950, 500, 'the game as much as', { fontSize: '64px', fill: '#000' });
            this.add.text(950, 600, 'I liked making it.', { fontSize: '64px', fill: '#000' });
            this.add.text(950, 700, 'I enjoyed this past', { fontSize: '64px', fill: '#000' });
            this.add.text(950, 800, 'year! Let\'s continue', { fontSize: '64px', fill: '#000' });
            this.add.text(950, 900, 'to have fun together.', { fontSize: '64px', fill: '#000' });

            this.add.text(1350, 1000, 'Love,', { fontSize: '64px', fill: '#000' });
            this.add.text(1350, 1100, 'Your GF', { fontSize: '64px', fill: '#000' });
        }

        if(collectItems == 6){
            envelope.enableBody(true, 1250, 850, true, true);
        }
        cursors.space.isDown = false;
        cursors.left.isDown = false;
        cursors.right.isDown = false;
        cursors.up.isDown = false;
        cursors.down.isDown = false;
    }
    else{
        collected = false;
    }
}