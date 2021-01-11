Homeworks.aufgabe = 8;
// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// Benno Stäbler: kopiert vom 02-mouse Beispiel, erweitert um komplexe Bodies und in die bekannte Struktur gebracht
// Hier ist alles mit Classes codiert

let engine
let polySynth
let mouseConstraint
let ball
const Y_AXIS = 1;
const X_AXIS = 2;
// blocks are Block class instances/objects, which can react to balls and have attributes together with a Matter body
let blocks = []
// balls are just plain Matter bodys right now
let balls = []
// collisions are needed to save
let collisions = []
let layers = []
let domino
let isSmall = true;
let scaleFish = 0.07;
let sharkHit = 0;





class Block {
  constructor(type, attrs, options) {
    this.type = type
    this.attrs = attrs
    this.options = options
    this.hit = false
    this.options.plugin = { block: this, update: this.update }
    switch (this.type) {
      case 'rect':
        this.body = Matter.Bodies.rectangle(attrs.x, attrs.y, attrs.w, attrs.h, this.options)
        break
      case 'circle':
        this.body = Matter.Bodies.circle(attrs.x, attrs.y, attrs.s)
        break
      case 'points':
        let shape = Matter.Vertices.create(attrs.points, Matter.Body.create({}))
        this.body = Matter.Bodies.fromVertices(0, 0, shape, this.options)
        Matter.Body.setPosition(this.body, this.attrs)
        break
        case 'path':
          let path = document.getElementById(attrs.elem)
          if (null != path) {
            this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options)
            Matter.Body.setPosition(this.body, this.attrs)
          }
          break
    }
    Matter.World.add(engine.world, [this.body])
  }

  constrainTo(block) {
    let constraint
    if (block) {
      constraint = Matter.Constraint.create({
        bodyA: this.body,
        bodyB: block.body
      })
    } else {
      constraint = Matter.Constraint.create({
        bodyA: this.body,
        pointB: { x: this.body.position.x, y: this.body.position.y }
      })
    }
    Matter.World.add(engine.world, [constraint])
    constraints.push(constraint)
  }

  update(ball) {
      // polySynth.play('C4', 0.1, 0, 0.3);


      if (this.attrs.force) {
        Matter.Body.applyForce(ball, ball.position, this.attrs.force)
      }

if (this.attrs.isJellyfish){
  boingSound.play();
}
if (this.attrs.isStar){
  spinSound.play();
}

      if (!this.hit && this.attrs.chgStatic) {
           Matter.Body.setStatic(this.body, false)
         }
      if (this.body.angle >= PI/2 && this.attrs.chgStatic) {
           Matter.Body.setStatic(this.body, true)
           console.log('hugo')
         }
         this.hit = true
  }

  show() {
    fill(this.attrs.color)
    drawBody(this.body)
  }
}

function dominoStatic() {Matter.Body.setStatic(this.body, true);

}

function preload(){img = loadImage('background.png');}

function setup() {

  biteSound = loadSound("bite.mp3");
  airSound = loadSound("air.mp3");
  bubblesSound = loadSound("bubbles.mp3");
  boingSound = loadSound("boing.mp3");
  spinSound = loadSound("spin.mp3");
airSound.setVolume(0.5);
biteSound.setVolume(0.5);
bubblesSound.setVolume(0.5);
boingSound.setVolume(0.5);
spinSound.setVolume(0.5);




  // enable sound
  polySynth = new p5.PolySynth()
  let canvas = createCanvas(windowWidth, 4000)

//ball Bild
   ballImg = loadImage('ball.png');
// blurryview Bild
  viewImg = loadImage("view.png");
  backgroundImg = loadImage("background.png")
  // teeth Bild
  teethImg = loadImage("teeth.png")
  //shark Bild
  sharkleftImg = loadImage("sharkleft.png")
  sharkrightImg = loadImage("sharkright.png")


  // create an engine
  engine = Matter.Engine.create()
//aufzug1
  blocks.push(new Block('rect',{ x: 120, y: 650 , w: 20, h: 75, color: "DeepSkyBlue" }, { isStatic: true}))
  blocks.push(new Block('rect',{ x: 320, y: 650 , w: 20, h: 75, color: "DeepSkyBlue" }, { isStatic: true}))
  blocks.push(new Block('rect',{ x: 170, y: 705 , w: 200, h: 20, color: "DeepSkyBlue" }, { isStatic: true}))

// blöcke ganz oben
  blocks.push(new Block('rect',{ x: 150 , y: 95 , w: 250, h: 22, color: "black" }, { isStatic: true, angle: PI/32, friction: 0.5 }))
  blocks.push(new Block('rect',{ x: 427 , y: 120 , w: 90, h: 22, color: "black" }, { isStatic: true, angle: PI/32, friction: 0.5 }))
//dominos
  blocks.push(new Block('rect',{ x: 290 , y: 50 , w: 22, h: 100, color: "blue", chgStatic: true }, { isStatic: true, angle: PI/32, friction: 0}))
  blocks.push(new Block('rect',{ x: 490 , y: 66 , w: 22, h: 100, color: "blue", chgStatic: true }, { isStatic: true, angle: PI/32, friction: 0}))
  blocks.push(new Block('rect',{ x: 690 , y: 84 , w: 22, h: 100, color: "blue", chgStatic: true}, { isStatic: true, angle: PI/32, friction: 0}))

  //obere schwarze blöcke
  blocks.push(new Block('rect',{ x: 633 , y: 141 , w: 90, h: 22, color: "black" }, { isStatic: true, angle: PI/32, friction: 0.5 }))

  blocks.push(new Block('rect',{ x: 700, y: 450, w: 600, h: 35, color: "black" }, { isStatic: true, angle: -PI/64, friction: 0}))
  blocks.push(new Block('rect',{ x: 380 , y: 136 , w: 580, h: 20, color: color(255,255,255,0) }, { isStatic: true, angle: PI/32, friction: 0 }))
  blocks.push(new Block('rect',{ x: 400, y: 440, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))
  blocks.push(new Block('rect',{ x: 1000, y: 420, w: 30, h: 200, color: "black" }, { isStatic: true, friction: 0}))
  blocks.push(new Block('rect',{ x: 40, y: 220, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))

// zähne
  let pts1 = [{ x: 0, y: 0 }, { x: 900, y: 0 }, { x: 900, y: 100 }, { x: 600, y: 40 }, { x: 600, y: 100 }, { x: 300, y: 40 }, { x: 300, y: 100 }, { x: 1, y: 40 }]
  let pts2 = [{ x: 0, y: 0 }, { x: 300, y: -100 }, { x: 300, y: -40 }, { x: 600, y: -100 }, { x: 600, y: -40 }, { x: 900, y: -100 }, { x: 900, y: -40 }, { x: 0, y: 0 }]
  blocks.push(new Block('points', { x: 500, y: 900, points: pts1, color:"transparent" }, { isStatic: true}))
  blocks.push(new Block('points', { x: 700, y: 1100, points: pts2, color: "transparent" }, { isStatic: true}))
  blocks.push(new Block('rect',{ x: 40, y: 910, w: 30, h: 100, color: "transparent" }, { isStatic: true, friction: 0}))
  blocks.push(new Block('rect',{ x: 240, y:1100, w: 30, h: 100, color: "transparent" }, { isStatic: true, friction: 0}))
// block links neben quallen
  blocks.push(new Block('rect',{ x: 140, y:1350, w: 300, h: 35, color: "black" }, { isStatic: true, friction: 0, angle: PI/32}))
// quallen
  blocks.push(new Block('path', { x: 350, y: 1500, elem: 'jellyfish', scale: 0.6, color: 'violet', force: { x: 0.0, y: -1.0 }, isJellyfish: true }, { isStatic: true, friction: 0.1, restitution: 3000 }))
  blocks.push(new Block('path', { x: 480, y: 1700, elem: 'jellyfish', scale: 0.6, color: 'violet', force: { x: 0.0, y: -1.0 }, isJellyfish: true }, { isStatic: true, friction: 0.1, restitution: 3000 }))
// stern
 blocks.push(new Block('path', { x: 710, y: 1900, elem: 'star', scale: 0.6, color: 'orange' , isStar: true}, { isStatic: false}))
// blöcke unterm stern
blocks.push(new Block('rect',{ x: 700, y: 2350, w: 600, h: 35, color: "black" }, { isStatic: true, angle: -PI/64, friction: 0}))
blocks.push(new Block('rect',{ x: 400, y: 2340, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))
blocks.push(new Block('rect',{ x: 1000, y: 2270, w: 30, h: 200, color: "black" }, { isStatic: true, friction: 0}))

blocks.push(new Block('rect',{ x: 220, y: 2100, w: 600, h: 35, color: "black" }, { isStatic: true, angle: PI/32, friction: 0}))
blocks.push(new Block('rect',{ x: 10, y: 2100, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))
blocks.push(new Block('rect',{ x: 500, y: 2170, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))
// aufzug 2
blocks.push(new Block('rect',{ x: 120, y: 2550 , w: 20, h: 75, color: "DeepSkyBlue" }, { isStatic: true}))
blocks.push(new Block('rect',{ x: 320, y: 2550 , w: 20, h: 75, color: "DeepSkyBlue" }, { isStatic: true}))
blocks.push(new Block('rect',{ x: 170, y: 2605 , w: 200, h: 20, color: "DeepSkyBlue" }, { isStatic: true}))
// rutsche
blocks.push(new Block('path', { x: 820, y: 3100, elem: 'rutsche', scale: 2.5, color: 'green' }, { isStatic: true, friction: 0.001 }))
// blocks.push(new Block('rect',{ x: 720, y: 3300 , w: 1500, h: 50, color: "green" }, { isStatic: true, angle: -PI/4}))
// blöcke beim hai
blocks.push(new Block('rect',{ x: 140, y:3950, w: 300, h:35, color: "black" }, { isStatic: true, friction: 0, angle: PI/32}))
blocks.push(new Block('rect',{ x: 10, y:3820, w: 30, h: 550, color: "black" }, { isStatic: true, friction: 0, angle: PI/32}))

blocks.push(new Block('rect',{ x: 940, y:3950, w: 300, h: 35, color: "black" }, { isStatic: true, friction: 0, angle: PI/32}))
blocks.push(new Block('rect',{ x: 1240, y:3950, w: 300, h: 120, color: "black" }, { isStatic: true, friction: 0}))
blocks.push(new Block('rect',{ x: 810, y:3920, w: 30, h: 350, color: "black" }, { isStatic: true, friction: 0, angle: PI/32}))
// neuer block ganz oben
blocks.push(new Block('rect',{ x: 920 , y: 165 , w: 250, h: 22, color: "black" }, { isStatic: true, angle: PI/32, friction: 0.5 }))
blocks.push(new Block('rect',{ x: 275 , y: 195 , w: 500, h: 35, color: "black" }, { isStatic: true, angle: PI/32, friction: 0.5 }))


    domino = blocks[5].body;
      constraint = Matter.Constraint.create({
        bodyA: domino,
        pointA: {x: -10, y: 50} ,
        pointB: {x: domino.position.x-11, y: domino.position.y+50} ,
    });

Matter.World.add(engine.world, [constraint]);

    domino2 = blocks[6].body;
      constraint2 = Matter.Constraint.create({
        bodyA: domino2,
        pointA: {x: -10, y: 50} ,
        pointB: {x: domino2.position.x-11, y: domino2.position.y+50} ,
    });

Matter.World.add(engine.world, [constraint2]);

    domino3 = blocks[7].body;
      constraint3 = Matter.Constraint.create({
        bodyA: domino3,
        pointA: {x: -10, y: 50} ,
        pointB: {x: domino3.position.x-11, y: domino3.position.y+50} ,
    });

Matter.World.add(engine.world, [constraint3]);

star = blocks[21].body;
      constraint4 = Matter.Constraint.create({
        bodyA: star,
        pointB: {x: star.position.x, y: star.position.y},
    });

Matter.World.add(engine.world, [constraint4]);


  // setup mouse
  let mouse = Matter.Mouse.create(canvas.elt)
  let mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  mouseConstraint = Matter.MouseConstraint.create(engine, mouseParams)
  mouseConstraint.mouse.pixelRatio = pixelDensity()
  Matter.World.add(engine.world, mouseConstraint)

  // create ball

  ball = Matter.Bodies.circle(100, 50, 22.4, {
      restitution: 0.1,
      density: 0.1,
      friction: 0
    })
    Matter.World.add(engine.world, ball)
    balls.push(ball)



  // Process collisions - check whether ball hits a Block object
  Matter.Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs
    pairs.forEach((pair, i) => {
      if (balls.includes(pair.bodyA)) {
        collide(pair.bodyB, pair.bodyA)

      }
      if (balls.includes(pair.bodyB)) {
        collide(pair.bodyA, pair.bodyB)
      }
    })
    // check for collision between Block and ball
    function collide(bodyBlock, bodyBall) {
      // check if bodyBlock is really a body in a Block class
      if (bodyBlock.plugin && bodyBlock.plugin.block) {
        // remember the collision for processing in 'beforeUpdate'
        collisions.push({ hit: bodyBlock.plugin.block, ball: bodyBall })
        console.log('hit')
        console.log(domino.position.x)

      }
    }
  })

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
    // process collisions at the right time
    collisions.forEach((collision, i) => {
      // "inform" blocks: got hit by a ball
      collision.hit.update(collision.ball)
    });
    collisions = []
  })

  // double the gravity
  // engine.world.gravity.y = 2
  // run the engine automatically
  // Matter.Engine.run(engine)
  // start the engine on mouse click
  canvas.mousePressed(startEngine);

  document.addEventListener('keyup', onKeyUp)
}

function onKeyUp(evt) {
  switch (evt.key) {
    case ' ':
      startEngine()
      evt.preventDefault()
      break
  }
}

function startEngine() {
  if (0 == engine.timing.timestamp) {
    Matter.Engine.run(engine)
    userStartAudio()
  }
}

function draw() {
  //hintergrund
    image(backgroundImg,0,0,windowWidth,4000);
// setGradient(0, 0, windowWidth, 5000, color(0,153,153), color(0,51,102), Y_AXIS);

   noStroke();
scrollFollow(ball);
drawSprite(ball, ballImg,scaleFish);




//aufzug 1 bewegung
    Matter.Body.setPosition(blocks[0].body, {x: 320 +Math.sin(frameCount/100)* 300, y: 650})
    Matter.Body.setPosition(blocks[1].body, {x: 520 +Math.sin(frameCount/100)* 300, y: 650})
    Matter.Body.setPosition(blocks[2].body, {x: 420 +Math.sin(frameCount/100)* 300, y: 690})

  blocks.forEach(block => block.show())

//aufzug 2 bewegung
    Matter.Body.setPosition(blocks[28].body, {x: 320 +Math.sin(frameCount/100)* 300, y: 2550})
    Matter.Body.setPosition(blocks[29].body, {x: 520 +Math.sin(frameCount/100)* 300, y: 2550})
    Matter.Body.setPosition(blocks[30].body, {x: 420 +Math.sin(frameCount/100)* 300, y: 2590})



  push();
  noFill();
  balls.forEach(ball => drawBody(ball))
  pop();


// ball wird von hai gefressen
if ((ball.position.x > 250 && ball.position.y > 3900)&&(ball.position.x < 300 && ball.position.y < 4000)){
  scaleFish = 0
  sharkHit = sharkHit+1
  if (sharkHit ==1){
  biteSound.play();
}
  setTimeout(sharkEat,1000)
}

function sharkEat(){
Matter.Body.setPosition(ball, {x:1000, y:3600});
  scaleFish =0.05;
sharkleftImg = sharkrightImg;}


  stroke('green')
  engine.world.constraints.forEach((constraint, i) => {
    if (constraint.label == "Mouse Constraint") {
      drawMouse(mouseConstraint)
    } else {
      drawConstraint(constraint)
    }
  })

image(teethImg,10, 580,1200,800);
image(sharkleftImg,300, 3700,600,400);
image(viewImg,ball.position.x-2850,ball.position.y-1600);

}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    let pos = mouseConstraint.body.position
    let offset = mouseConstraint.constraint.pointB
    let m = mouseConstraint.mouse.position
    stroke(0, 255, 0)
    strokeWeight(2)
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y)
  }
}

function drawConstraint(constraint) {
  let posA = { x: 0, y: 0 }
  if (constraint.bodyA) {
    posA = constraint.bodyA.position
  }
  let posB = { x: 0, y: 0 }
  if (constraint.bodyB) {
    posB = constraint.bodyB.position
  }
  line(
    posA.x + constraint.pointA.x,
    posA.y + constraint.pointA.y,
    posB.x + constraint.pointB.x,
    posB.y + constraint.pointB.y
  )
}

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    body.parts.filter((part, i) => i > 0).forEach((part, i) => {
      drawVertices(part.vertices)
    })
  } else {
    if (body.type == "composite") {
      body.bodies.forEach((body, i) => {
        drawVertices(body.vertices)
      })
    } else {
      drawVertices(body.vertices)
    }
  }
}

function drawVertices(vertices) {
  beginShape()
  vertices.forEach((vert, i) => {
    vertex(vert.x, vert.y)
  })
  endShape(CLOSE)
}



function keyPressed(){
  switch (keyCode) {
// Taste C
    case 67:
  engine.world.gravity.y = -engine.world.gravity.y;
  if (engine.world.gravity.y < 0){
    airSound.play()
  }
  if (engine.world.gravity.y > 0){
    bubblesSound.play()
  }


  if (isSmall) {
       Matter.Body.scale(balls[0], 1.25, 1.25);
       scaleFish=(0.07*1.25);
     } else {
       Matter.Body.scale(balls[0], 0.8, 0.8);
       scaleFish=(0.07);
     }
     isSmall = !isSmall; // toggle isSmall variable
   }
    }

    function scrollFollow(matterObj) {
      if (insideViewport(matterObj) == false) {
        const $element = $('html, body');
        if ($element.is(':animated') == false) {
          $element.animate({
            scrollLeft: ball.position.x,
            scrollTop: ball.position.y-windowHeight/3
          }, 1000);
        }
      }
    }

    function insideViewport(matterObj) {
  const x = matterObj.position.x;
  const y = matterObj.position.y+200;
  const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;
  const pageYOffset  = window.pageYOffset || document.documentElement.scrollTop;
  if (x >= pageXOffset && x <= pageXOffset + windowWidth &&
      y >= pageYOffset && y <= pageYOffset + windowHeight) {
    return true;
  } else {
    return false;
  }
}

// function setGradient(x, y, w, h, c1, c2, axis) {
//   noFill();
//
//
//   if (axis === Y_AXIS) {
//     // Top to bottom gradient
//     for (let i = y; i <= y + h; i++) {
//       let inter = map(i, y, y + h, 0, 1);
//       let c = lerpColor(c1, c2, inter);
//       stroke(c);
//       line(x, i, x + w, i);
//     }
//   } else if (axis === X_AXIS) {
//     // Left to right gradient
//     for (let i = x; i <= x + w; i++) {
//       let inter = map(i, x, x + w, 0, 1);
//       let c = lerpColor(c1, c2, inter);
//       stroke(c);
//       line(i, y, i, y + h);
//     }
//   }
// }

function drawSprite(body, img,scaleSprite) {
  const pos = body.position;
  const angle = body.angle;
  const size = body.circleRadius
  push();
  translate(pos.x, pos.y);
  rotate(angle);
  scale(scaleSprite);
  imageMode(CENTER);
  image(img, 0, 0);
  pop();
}
