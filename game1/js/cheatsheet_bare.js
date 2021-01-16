let hugo1;
let hugo2 = 0;
let myNumber1 = 0;
let myNumber1a = 0.05;
let myText1 = "Hallo";
let myText2 = 'Hallo';
let myBoolean = true;
let myArray = [0, 'Hallo', true, 0.05, false];
let myObject = { name: 'Hugo', alter: 29, programmierer: true };
let myFunction = function() {
  console.log("Hallo");
}

let layer;

function init() {
  layer = document.getElementById('layer1');
  let uri = layer.namespaceURI;
  console.log("Innerhalb von init ist uri=", uri);
  let myElems = createPattern(layer, 20, 20, 5, '#FF00FF', 2);
  myElems[4].setAttribute('fill', 'lime');
  console.log(myElems[4]);
  svg = document.getElementById('svg');
  pt = svg.createSVGPoint();
  matrix = svg.getScreenCTM().inverse();
}

console.log("Fehler!", uri);

function createPattern(parent, width, count, gap, color, mode) {
  let elements = [];
  let newElem;
  let box = width + 2 * gap;
  let offset = -box * count / 2 + gap;
  let klecks, scale;
  if (mode == 2) {
    klecks = document.getElementById('klecks');
    scale = width * 1.5 / Math.max(klecks.getBBox().width, klecks.getBBox().height);
  }
  for (let col = 0; col < count; col++) {
    for (let row = 0; row < count; row++) {
      if (mode == 0) {
        newElem = createElement(parent, 'rect', { x: offset + row * box, y: offset + col * box, width: width, height: width, fill: color });
      } else {
        if (mode == 1) {
          newElem = createElement(parent, 'circle', { cx: offset + row * box + width / 2, cy: offset + col * box + width / 2, r: width / 2, fill: color });
        } else {
          newElem = cloneElement(parent, klecks, { transform: 'translate(' + (offset + row * box + width / 2) + ' ' + (offset + col * box + width / 2) + ') scale(' + scale + ' ' + scale + ')' });
          newElem.setAttribute('fill', color);
        }
      }
      elements.push(newElem);
    }
  }
  return elements;
}

function createElement(parent, type, attrList) {
  let elem = document.createElementNS(parent.namespaceURI, type);
  parent.appendChild(elem);
  for (attr in attrList) {
    elem.setAttribute(attr, attrList[attr]);
  }
  return elem;
}

function cloneElement(parent, elem, attrList) {
  let clone = elem.cloneNode(true);
  let place = createElement(parent, 'g', attrList);
  place.appendChild(clone);
  let wrap = createElement(parent, 'g', {});
  wrap.appendChild(place);
  return wrap;
}

function cursorPoint(evt) {
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(matrix);
}
