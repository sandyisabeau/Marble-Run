Homeworks.aufgabe = 8;
// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// Benno Stäbler: kopiert vom 02-mouse Beispiel, erweitert um komplexe Bodies und in die bekannte Struktur gebracht
// Hier ist alles mit Classes codiert

let engine
let polySynth
let mouseConstraint
// blocks are Block class instances/objects, which can react to balls and have attributes together with a Matter body
let blocks = []
// balls are just plain Matter bodys right now
let balls = []
// collisions are needed to save
let collisions = []
let catapult
let catapultSpacer
let constraint2
let domino
let constraint3


class Block {
  constructor(type, attrs, options) {
    this.type = type
    this.attrs = attrs
    this.options = options
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
    polySynth.play('C4', 0.1, 0, 0.3);
    if (this.attrs.force) {
      Matter.Body.applyForce(ball, ball.position, this.attrs.force)
    }
    if (domino.position.x >= 326 || this.attrs.chgStatic) {
      Matter.Body.setStatic(this.body, true)
    }
  }

  show() {
    fill(this.attrs.color)
    drawBody(this.body)
  }
}

function setup() {
  // enable sound
  polySynth = new p5.PolySynth()
  let canvas = createCanvas(windowWidth, windowHeight)

  // create an engine
  engine = Matter.Engine.create()

  blocks.push(new Block('rect',{ x: 7020, y: 250 , w: 75, h: 75, color: "DeepSkyBlue" }, { isStatic: true}))
  blocks.push(new Block('rect',{ x: 8025, y: 335, w: 75, h: 75, color: "DeepSkyBlue" }, { isStatic: true }))
  blocks.push(new Block('rect',{ x: 9040, y: 410, w: 75, h: 75, color: "lightgrey" }, { isStatic: false, frictionAir: 0 }))

  blocks.push(new Block('rect',{ x: 150 , y: 100 , w: 250, h: 35, color: "black" }, { isStatic: true, angle: PI/32, friction: 0 }))
  blocks.push(new Block('rect',{ x: 500 , y: 140 , w: 250, h: 35, color: "black" }, { isStatic: true, angle: PI/32, friction: 0 }))
  blocks.push(new Block('rect',{ x: 286 , y: 47 , w: 22, h: 100, color: "blue", chgStatic: false }, { isStatic: false, angle: PI/32, friction: 0}))
  blocks.push(new Block('rect',{ x: 620 , y: 75 , w: 20, h: 100, color: "blue" }, { isStatic: false, angle: PI/32, friction: 0 }))
  blocks.push(new Block('rect',{ x: 700, y: 450, w: 600, h: 35, color: "black" }, { isStatic: true, angle: -PI/64, friction: 0}))
  blocks.push(new Block('rect',{ x: 450, y: 780, w: 350, h: 35, color: "DeepSkyBlue"},{ isStatic: false}))
  blocks.push(new Block('rect',{ x: 450, y: 820, w: 20, h: 50, color: "black" }, { isStatic: true }))
  blocks.push(new Block('rect',{ x: 375, y: 850, w: 500, h: 20, color: "black" }, { isStatic: true }))
  blocks.push(new Block('rect',{ x: 380 , y: 138 , w: 250, h: 30, color: "black" }, { isStatic: true, angle: PI/32, friction: 0 }))

  blocks.push(new Block('rect',{ x: 400, y: 440, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))
  blocks.push(new Block('rect',{ x: 1000, y: 470, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))
  blocks.push(new Block('rect',{ x: 40, y: 120, w: 30, h: 80, color: "black" }, { isStatic: true, friction: 0}))

  // blocks.push(new Block('circle', { x: 10, y: 20, s: 10, color: 'blue' }, { isStatic: false }))
  // blocks.push(new Block('circle', { x: 100, y: 50, s: 40, color: 'blue' }, { isStatic: false }))
  //
  // create a body from points
  // let pts = [{ x: 0, y: 0 }, { x: 176, y: 15 }, { x: 174, y: 35 }, { x: 225, y: 40 }, { x: 227, y: 20 }, { x: 405, y: 35 }, { x: 402, y: 55 }, { x: 454, y: 60 }, { x: 455, y: 40 }, { x: 650, y: 60 }, { x: 647, y: 91 }, { x: 0, y: 35 }]
  // blocks.push(new Block('points', { x: 350, y: 100, points: pts, color: 'black' }, { isStatic: true}))

  //catapult
  let body = blocks[2].body
  let constraint = Matter.Constraint.create({
    bodyA: body,
    pointB: { x: body.position.x , y: body.position.y }
  });

  catapult = blocks[7].body;
  constraint2 = Matter.Constraint.create({
    pointA: {x: catapult.position.x, y: catapult.position.y},
    bodyB: catapult,
    stiffness: 1,
    length: 0
  });

    Matter.World.add(engine.world, [constraint, constraint2]);

    // balls and catapult spacer for limit
    catapultSpacer = blocks[8].body;
    Matter.World.add(engine.world, [catapultSpacer]);

    // ground
    ground = blocks[9].body;
    Matter.World.add(engine.world, [ground]);

    domino = blocks[5].body;
      constraint3 = Matter.Constraint.create({
        bodyA: domino,
        pointA: {x: -10, y: 50} ,
        pointB: {x: domino.position.x-11, y: domino.position.y+50} ,
    });

Matter.World.add(engine.world, [constraint3]);


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

    let ball = Matter.Bodies.circle(100, 50, 16, {
      restitution: 0.5,
      density: 0.1,
      friction: 0.0
    })
    Matter.World.add(engine.world, ball)
    balls.push(ball)
console.log(balls)


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
  background(255)
  noStroke()

  blocks.forEach(block => block.show())
  fill(255, 0, 255)
  balls.forEach(ball => drawBody(ball))

  stroke('green')
  engine.world.constraints.forEach((constraint, i) => {
    if (constraint.label == "Mouse Constraint") {
      drawMouse(mouseConstraint)
    } else {
      drawConstraint(constraint)
    }
  })
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
    case 32:
  engine.world.gravity.y = -engine.world.gravity.y;
balls[0].body.circleRadius = 30;
    break;}}
