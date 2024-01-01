
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
var a, b, c, d, e, f;
var textA, textA2, textB, textB2, textC, textC2, textD, textD2, textE, textE2, textF, textF2;
var question;
var clicked;
var totalCorrect = 0;
var numQuestions = 6;

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
    this.load.image('boss', 'assets/bosses/ponponcrab.png');
    this.load.image('bossName', 'assets/bosses/ponponcrabTitle.png');
    this.load.image('win', 'assets/bosses/win.png');
    this.load.image('lose', 'assets/bosses/lose.png');

    this.load.image('theater', 'assets/locations/movieTheater.avif');
    this.load.image('pacificRim', 'assets/locations/pacificRim.jpeg');
    this.load.image('pinballpete', 'assets/locations/pinball2.jpeg');
    this.load.image('sharetea', 'assets/locations/sharetea.jpeg');
    this.load.image('tasteKitchen', 'assets/locations/tasteKitchen.jpeg');
    this.load.image('union', 'assets/locations/union.avif');

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

    let frame = this.add.image(1025, 975, 'frame');
    frame.setScale(1.2).setScrollFactor(0);
    frame.setDepth(2);

    bossName = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bossName');
    bossName.setScale(scale).setScrollFactor(0);
    bossName.setDepth(1);

    cursors = this.input.keyboard.createCursorKeys();

    boss = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'boss');
    boss.setScale(scale).setScrollFactor(0);

    hurt = this.sound.add("hurt", { loop: false });
    bgMusic = this.sound.add("bgMusic", { loop: true });

    bgMusic.play();

    hearts = this.physics.add.group({
        key: 'heart',
        repeat: fullPlayerHealth - 1,
        setXY: { x: 300, y: 1400, stepX: 200 }
    });
    hearts.setDepth(2);

    question = this.add.image(1550, 400, 'theater');

    message = this.add.text(1175, 750, 'Where is this?', { fontSize: '64px', fill: '#000' });
    message.setDepth(5);

    textA = this.add.text(1100, 910, 'North', { fontSize: '45px', fill: '#000' });
    textA2 = this.add.text(1100, 970, 'Campus', { fontSize: '45px', fill: '#000' });
    textA.setDepth(4);
    textA2.setDepth(4);

    textB = this.add.text(1400, 910, 'Movie', { fontSize: '45px', fill: '#000' });
    textB2 = this.add.text(1400, 970, 'Theater', { fontSize: '45px', fill: '#000' });
    textB.setDepth(4);
    textB2.setDepth(4);

    textC = this.add.text(1700, 910, 'Union', { fontSize: '45px', fill: '#000' });
    textC2 = this.add.text(1700, 970, '', { fontSize: '45px', fill: '#000' });
    textC.setDepth(4);
    textC2.setDepth(4);

    textD = this.add.text(1100, 1110, 'Boba', { fontSize: '45px', fill: '#000' });
    textD2 = this.add.text(1100, 1170, 'Shop', { fontSize: '45px', fill: '#000' });
    textD.setDepth(4);
    textD2.setDepth(4);

    textE = this.add.text(1400, 1110, 'Target', { fontSize: '45px', fill: '#000' });
    textE2 = this.add.text(1400, 1170, '', { fontSize: '45px', fill: '#000' });
    textE.setDepth(4);
    textE2.setDepth(4);

    textF = this.add.text(1700, 1110, 'Library', { fontSize: '45px', fill: '#000' });
    textF2 = this.add.text(1700, 1170, '', { fontSize: '45px', fill: '#000' });
    textF.setDepth(4);
    textF2.setDepth(4);

    buttons = this.physics.add.group();

    a = buttons.create(1200, 950, 'button');
    b = buttons.create(1500, 950, 'button');
    c = buttons.create(1800, 950, 'button');
    d = buttons.create(1200, 1150, 'button');
    e = buttons.create(1500, 1150, 'button');
    f = buttons.create(1800, 1150, 'button');

    buttons.getChildren().forEach(function(sprite) {
        sprite.setDepth(3);
        sprite.answer = false;
    this.add.existing(sprite);
    sprite
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => sprite.setTint(0xf5f50a)) // hover
      .on('pointerout', () => sprite.clearTint()) // rest
      .on('pointerdown', () => activeButton(sprite)) //active
      .on('pointerup', () => {
        clickedButton(sprite);
        sprite.setTint(0x2f8c0a);
    });
    clickedButton(sprite);
    }, this);

    b.answer = true;

    fade = this.tweens.addCounter({
        from: 0,
        to: 255,
        duration: 10000,
        onUpdate: function (tween)
        {
            const value = Math.floor(tween.getValue());
            question.setTint(Phaser.Display.Color.GetColor(value, value, value));
            if(value == 255){
                playerHurt();
                totalCorrect++;
                nextQuestion();
            }
        }
    });

  }

function clickedButton(sprite) {
    if(clicked && !sprite.answer){
        playerHurt();
    }
    else if(clicked){
        totalCorrect++;
        if(totalCorrect == numQuestions){
            playerWon = true;
        }
        else{
            nextQuestion();
        }
    }
    clicked = false;
}

function activeButton(sprite) {
    sprite.setTint(0x2f8c0a);
    clicked = true;
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

    buttons.getChildren().forEach(function(sprite) {
        sprite.answer = false;
    }, this);

    if(totalCorrect == 1){
        q = ["Of Mice", "and Men", "Taste", "Kitchen", "Miss Kim", "", "Pacific", "Rim", "Aventura", "", "Tomokun", ""];
        d.answer = true;
        question.setTexture('pacificRim');
        question.setScale(2);
    }
    if(totalCorrect == 2){
        q = ["Pinball", "Pete", "B Dubs", "", "Zap Zone", "", "Art", "Museum", "North", "Campus", "Library", ""];
        a.answer = true;
        question.setTexture('pinballpete');
        question.setScale(0.6);
    }
    if(totalCorrect == 3){
        q = ["Tomokun", "", "No Thai", "", "Slurping", "Turtle", "Lan City", "", "Miss Kim", "", "Sharetea", ""];
        f.answer = true;
        question.setTexture('sharetea');
        question.setScale(0.3);
    }
    if(totalCorrect == 4){
        q = ["Slurping", "Turtle", "Tomokun", "", "Pacific", "Rim", "Taste", "Kitchen", "Aventura", "", "Lan City", ""];
        d.answer = true;
        question.setTexture('tasteKitchen');
        question.setScale(0.6);
    }
    if(totalCorrect == 5){
        q = ["Library", "", "North", "Campus", "Theater", "", "Art", "Museum", "Union", "", "Ross", "School"];
        e.answer = true;
        question.setTexture('union');
        question.setScale(0.5);
    }

    textA.setText(q[0]);
    textA2.setText(q[1]);
    textB.setText(q[2]);
    textB2.setText(q[3]);
    textC.setText(q[4]);
    textC2.setText(q[5]);
    textD.setText(q[6]);
    textD2.setText(q[7]);
    textE.setText(q[8]);
    textE2.setText(q[9]);
    textF.setText(q[10]);
    textF2.setText(q[11]);  
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
