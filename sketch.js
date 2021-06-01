var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var bg;



function preload(){
  trex_running =   loadAnimation("dino1.png", "dino2.png", "dino3.png");
  trex_collided = loadAnimation("dinoFall.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("blackCloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("reset.png");

  bg = loadImage("dinoBg.png")
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(displayWidth-1250, displayHeight-180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.3;
  
  ground = createSprite(displayWidth+200,displayHeight-150,400,20);
  ground.addImage("ground",groundImage);
  ground.scale=4;
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(200, 300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(200, 420);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.7;
  restart.scale = 0.140;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(displayWidth-1000,displayHeight-150,800,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bg);
  textSize(25);
  fill("white");
  stroke("black");
  strokeWeight(5);
  text("Score: "+ score, 650, 50);

  camera.position.x = trex.x;
  camera.position.y = displayHeight/2;
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= displayWidth-1000) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 90 === 0) {
    var cloud = createSprite(displayWidth-300,displayHeight-800,40,10);
    cloud.y = Math.round(random(20,140));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -2.5;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth-1500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(displayWidth-300,displayHeight-200,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle4);
              break;
      case 4: obstacle.addImage(obstacle5);
              break;
      case 5: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale=0.5;
    obstacle.lifetime = displayWidth-1500;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}