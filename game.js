const config = {

    type: Phaser.AUTO,

    width: 900,

    height: 500,

    parent: "game",

    physics: {

        default: "arcade",

        arcade: {

            gravity: {

                y: 900

            }

        }

    },

    scene: {

        preload,

        create,

        update

    }

};

const game = new Phaser.Game(config);

let player;

let ground;

let holdStart = 0;

let score = 0;

let scoreText;

function preload(){}

function create(){

    this.cameras.main.setBackgroundColor("#87CEEB");

    ground = this.add.rectangle(450,460,900,80,0x228B22);

    this.physics.add.existing(ground,true);

    player = this.add.rectangle(150,390,40,60,0xff0000);

    this.physics.add.existing(player);

    player.body.setCollideWorldBounds(true);

    this.physics.add.collider(player,ground);

    scoreText=this.add.text(20,20,"Score: 0",{

        fontSize:"30px",

        color:"#000"

    });

    const button=document.getElementById("jumpButton");

    button.addEventListener("mousedown",()=>{

        holdStart=Date.now();

    });

    button.addEventListener("mouseup",()=>{

        let hold=Date.now()-holdStart;

        jump(player,hold);

    });

}

function update(){

    if(player.x>850){

        player.x=150;

        score++;

        scoreText.setText("Score: "+score);

    }

    if(player.y>520){

        gameOver();

    }

}

function jump(player,hold){

    let power=Math.min(hold,1000);

    player.body.setVelocityY(-350-power*0.8);

    player.body.setVelocityX(220+power*0.5);

}

function gameOver(){

    alert("Game Over\nScore: "+score);

    location.reload();

}