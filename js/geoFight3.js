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

var cursors;
var timer = 0;
var timer2 = 0;
var gap = 10000;
var redLevel = 0;
var boss;
var bossName;
var walls;
var fade;

var buttons;
var lButtons;
var nButtons;
var a, b, c, d, e, f, g, h;
var one, two, three, four, five, six, seven, eight;
var textA, textA2, textB, textB2, textC, textC2, textD, textD2, textE, textE2, textF, textF2;
var question;
var clicked;
var totalCorrect = 0;
var numQuestions = 12;

var oneCorrect = false;

var message;

var hurt;

var playerLost2 = false;
var playerWon2 = false;

var game = new Phaser.Game(config);

function preload(){
    this.load.image('fightBg', 'assets/fightBg.png');
    this.load.image('bgFrame', 'assets/fightBgFrame.png');
    this.load.image('frame', 'assets/locations/frame.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('button', 'assets/button.png');
    this.load.image('lButton', 'assets/letButton.png');
    this.load.image('nButton', 'assets/numButton.png');
    this.load.image('boss', 'assets/bosses/pearl.png');
    this.load.image('bossName', 'assets/bosses/pearlTitle.png');
    this.load.image('win', 'assets/bosses/win.png');
    this.load.image('lose', 'assets/bosses/lose.png');

    this.load.image('c1', 'assets/chess/chess1.jpg');
    this.load.image('c2', 'assets/chess/chess2.jpg');
    this.load.image('c3', 'assets/chess/chess3.jpg');
    this.load.image('c4', 'assets/chess/chess4.jpg');
    this.load.image('c5', 'assets/chess/chess5.jpg');
    this.load.image('c6', 'assets/chess/chess6.jpg');

    this.load.audio('hurt', ["assets/sound/hurt.mp3"]);
    this.load.audio('bgMusic', ["assets/sound/triviaMusic.mp3"]);
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

    // let frame = this.add.image(1025, 975, 'frame');
    // frame.setScale(1.2).setScrollFactor(0);
    // frame.setDepth(2);

    bossName = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bossName');
    bossName.setScale(scale).setScrollFactor(0);
    bossName.setDepth(1);

    cursors = this.input.keyboard.createCursorKeys();

    boss = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'boss');
    boss.setScale(scale).setScrollFactor(0);

    hurt = this.sound.add("hurt", { loop: false });
    bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.25 });

    bgMusic.play();

    hearts = this.physics.add.group({
        key: 'heart',
        repeat: fullPlayerHealth - 1,
        setXY: { x: 300, y: 1400, stepX: 200 }
    });
    hearts.setDepth(2);

    question = this.add.image(1550, 450, 'c1');
    question.setScale(0.5)

    message = this.add.text(1175, 825, 'Mate in one. Move piece to: ', { fontSize: '45px', fill: '#000' });
    message.setDepth(5);

    this.add.text(1170, 910, 'A B C D E F G H', { fontSize: '84px', fill: '#000' }).setDepth(4);
    this.add.text(1170, 1010, '1 2 3 4 5 6 7 8', { fontSize: '84px', fill: '#000' }).setDepth(4);

    lButtons = this.physics.add.group();
    nButtons = this.physics.add.group();

    a = lButtons.create(1200, 950, 'lButton');
    b = lButtons.create(1300, 950, 'lButton');
    c = lButtons.create(1400, 950, 'lButton');
    d = lButtons.create(1500, 950, 'lButton');
    e = lButtons.create(1600, 950, 'lButton');
    f = lButtons.create(1700, 950, 'lButton');
    g = lButtons.create(1800, 950, 'lButton');
    h = lButtons.create(1900, 950, 'lButton');

    one = nButtons.create(1200, 1050, 'nButton');
    two = nButtons.create(1300, 1050, 'nButton');
    three = nButtons.create(1400, 1050, 'nButton');
    four = nButtons.create(1500, 1050, 'nButton');
    five = nButtons.create(1600, 1050, 'nButton');
    six = nButtons.create(1700, 1050, 'nButton');
    seven = nButtons.create(1800, 1050, 'nButton');
    eight = nButtons.create(1900, 1050, 'nButton');

    lButtons.getChildren().forEach(function(sprite) {
        sprite.setDepth(3);
        sprite.answer = false;
        sprite.clicked = false;
        sprite.setScale(0.75)
    this.add.existing(sprite);
    sprite
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => hoverButton(sprite)) // hover
      .on('pointerout', () => outButton(sprite)) // rest
      .on('pointerdown', () => activeButton(sprite)) //active
      .on('pointerup', () => {
        clickedButton(sprite);
        sprite.setTint(0x2f8c0a);
    });
    clickedButton(sprite);
    }, this);

    nButtons.getChildren().forEach(function(sprite) {
        sprite.setDepth(3);
        sprite.clicked = false;
        sprite.answer = false;
        sprite.setScale(0.75)
    this.add.existing(sprite);
    sprite
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => hoverButton(sprite)) // hover
      .on('pointerout', () => outButton(sprite)) // rest
      .on('pointerdown', () => activeButton(sprite)) //active
      .on('pointerup', () => {
        clickedButton(sprite);
        sprite.setTint(0x2f8c0a);
    });
    clickedButton(sprite);
    }, this);

    c.answer = true;
    seven.answer = true;

    fade = this.tweens.addCounter({
        from: 255,
        to: 0,
        duration: 15000,
        onUpdate: function (tween)
        {
            const value = Math.floor(tween.getValue());
            question.setTint(Phaser.Display.Color.GetColor(value, value, value));
            if(value == 0){
                playerHurt();
                if(totalCorrect % 2 == 0){
                    totalCorrect += 2;
                }
                else{
                    totalCorrect += 1;
                }
                // totalCorrect += 2;
                nextQuestion();
            }
        }
    });

  }

function clickedButton(sprite) {
    if(clicked && !sprite.answer){
        console.log(clicked);
        console.log(sprite.answer);
        playerHurt();
    }
    else if(clicked){
        totalCorrect++;
        if(totalCorrect == numQuestions){
            playerWon = true;
        }
        else{
            if(oneCorrect){
                oneCorrect = false;
                nextQuestion()
            }
            else{
                oneCorrect = true;
                
            }
        }
    }
    clicked = false;
}

function activeButton(sprite) {
    sprite.setTint(0x2f8c0a);
    clicked = true;
    sprite.clicked = true;
}

function outButton(sprite){
    if(!sprite.clicked){
        sprite.clearTint();
    }
    else{
        return;
    }
}

function hoverButton(sprite){
    if(!sprite.clicked){
        sprite.setTint(0xf5f50a);
    }
    else{
        return;
    }
}

function update(time, delta){
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
        fade.stop();
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
        fade.stop();
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
}

function nextQuestion(){
    fade.restart();

    lButtons.getChildren().forEach(function(sprite) {
        sprite.answer = false;
        sprite.clicked = false;
        sprite.clearTint();
    }, this);

    nButtons.getChildren().forEach(function(sprite) {
        sprite.answer = false;
        sprite.clicked = false;
        sprite.clearTint();
    }, this);

    if(totalCorrect == 2){
        four.answer = true;
        b.answer = true;
        question.setTexture('c2');
    }
    if(totalCorrect == 4){
        eight.answer = true;
        f.answer = true;
        question.setTexture('c3');
    }
    if(totalCorrect == 6){
        eight.answer = true;
        h.answer = true;
        question.setTexture('c4');
    }
    if(totalCorrect == 8){
        six.answer = true;
        c.answer = true;
        question.setTexture('c5');
    }
    if(totalCorrect == 10){
        eight.answer = true;
        e.answer = true;
        question.setTexture('c6');
    }
}

function playerHurt(){
    var playerHearts = hearts.getChildren();
    playerHearts[playerHealth - 1].disableBody(true, true);

    playerHealth--;
    if(playerHealth < 1){
        playerLost = true;
    }

    question.setTint(0xf2a099);
    setTimeout(()=> {
        question.clearTint();}, 100); 

    hurt.play();
}
