// Group 20
// Blandon Tang, Edison Mendoza, Heavenel Cerna, John Salazer, Ryan Doering, Teddy Kalp

// Client side code
/**
 * 
 */

const socket = io();

// Example of executing persitent code only on when a client connects
socket.on('connect', function() {
    console.log("This is something here");
    yeethaw();

    const $ = e => document.querySelector(e);
  
    const wrap1 = new coolTiltThing({
        element: $('.wrap--1'),
        tiltEffect: 'reverse'
    });
    const wrap2 = new coolTiltThing({
        element: $('.wrap--2'),
        tiltEffect: 'normal'
    });
    const wrap3 = new coolTiltThing({
        element: $('.wrap--3'),
        tiltEffect: 'reverse'
    });
    
});

// Example globalscope function - which pavol probably doesn't want us to do
function yeethaw(){
    console.log("yeethaw baby");
}

// Example of using a es6 class
class coolTiltThing {

    constructor({element, tiltEffect}) {
  
      this.element = element;
      this.container = this.element.querySelector(".container");
      this.size = [300, 360];
      [this.w, this.h] = this.size;
  
      this.tiltEffect = tiltEffect;
  
      this.mouseOnComponent = false;
  
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.defaultStates = this.defaultStates.bind(this);
      this.setProperty = this.setProperty.bind(this);
      this.init = this.init.bind(this);
  
      this.init();
    }
  
    handleMouseMove(event) {
      const {offsetX, offsetY} = event;
  
      let X;
      let Y;
  
      if (this.tiltEffect === "reverse") {
        X = ((offsetX - (this.w/2)) / 3) / 3;
        Y = (-(offsetY - (this.h/2)) / 3) / 3;
      }
  
      else if (this.tiltEffect === "normal") {
        X = (-(offsetX - (this.w/2)) / 3) / 3;
        Y = ((offsetY - (this.h/2)) / 3) / 3;
      }
  
      this.setProperty('--rY', X.toFixed(2));
      this.setProperty('--rX', Y.toFixed(2));
  
      this.setProperty('--bY', (80 - (X/4).toFixed(2)) + '%');
      this.setProperty('--bX', (50 - (Y/4).toFixed(2)) + '%');
    }
  
    handleMouseEnter() {
      this.mouseOnComponent = true;
      this.container.classList.add("container--active");
    }
  
    handleMouseLeave() {
      this.mouseOnComponent = false;
      this.defaultStates();
    }
  
    defaultStates() {
      this.container.classList.remove("container--active");
      this.setProperty('--rY', 0);
      this.setProperty('--rX', 0);
      this.setProperty('--bY', '80%');
      this.setProperty('--bX', '50%');
    }
  
    setProperty(p, v) {
      return this.container.style.setProperty(p, v);
    }
  
    init() {
      this.element.addEventListener('mousemove', this.handleMouseMove);
      this.element.addEventListener('mouseenter', this.handleMouseEnter);
      this.element.addEventListener('mouseleave', this.handleMouseLeave);
    }
  
}
  
