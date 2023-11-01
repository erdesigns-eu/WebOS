/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

import { Background } from "./Index";

/**
 * Default options for the Mesh animation
 * @constant {Object} defaultOptions
 * @property {string} particleColor The color of the particles
 * @property {string} lineColor The color of the lines
 * @property {number} particleAmount The amount of particles
 * @property {number} defaultSpeed The default speed of the particles
 * @property {number} variantSpeed The variant speed of the particles
 * @property {number} defaultRadius The default radius of the particles
 * @property {number} variantRadius The variant radius of the particles
 * @property {number} linkRadius The radius of the lines
 */
const defaultOptions = {
  particleColor: "rgb(200,200,200)",
  lineColor: "rgb(200,200,200)",
  particleAmount: 50,
  defaultSpeed: 1,
  variantSpeed: 1,
  defaultRadius: 2,
  variantRadius: 2,
  linkRadius: 300,
  backgroundColor: "rgba(0, 0, 0)"
};

type MeshOptions = typeof defaultOptions;

/**
 * The Particle class
 * @class Particle
 * @description The class that represents a particle
 * @private
 */
class Particle {
  #x              : number                    = 0;              // The x and y coordinates of the particle
  #y              : number                    = 0;              // The x and y coordinates of the particle
  #speed          : number                    = 0;              // The speed of the particle
  #directionAngle : number                    = 0;              // The direction angle of the particle
  #color          : string                    = "";             // The color of the particle
  #radius         : number                    = 0;              // The radius of the particle
  #vector         : { x: number, y: number }  = { x: 0, y: 0 }; // The vector of the particle

  /**
   * Creates a new Particle instance
   * @param width The width of the canvas
   * @param height The height of the canvas
   * @param options The options for the particle
   * @constructor 
   */
  constructor(width: number, height: number, options: MeshOptions) {
    // Set the properties
    this.#x = Math.random() * width;
    this.#y = Math.random() * height;
    this.#speed = options.defaultSpeed + Math.random() * options.variantSpeed;
    this.#directionAngle = Math.floor(Math.random() * 360);
    this.#color = options.particleColor;
    this.#radius = options.defaultRadius + Math.random() * options.variantRadius;
    this.#vector = {
      x: Math.cos(this.#directionAngle) * this.#speed,
      y: Math.sin(this.#directionAngle) * this.#speed
    };
  }

  /**
   * Bounces the particle off the borders
   * @param width The width of the canvas
   * @param height The height of the canvas 
   */
  border(width: number, height: number): void {
    if (this.#x >= width || this.#x <= 0) { 
			this.#vector.x *= -1;
		}
		if (this.#y >= height || this.#y <= 0) {
			this.#vector.y *= -1;
		}
		if (this.#x > width)  this.#x = width;
		if (this.#y > height) this.#y = height;
		if (this.#x < 0) this.#x = 0;
		if (this.#y < 0) this.#y = 0;	
  }

  /**
   * Updates the particle
   * @param width The width of the canvas
   * @param height The height of the canvas
   */
  update(width: number, height: number): void {
    this.border(width, height); 
		this.#x += this.#vector.x; 
		this.#y += this.#vector.y;
  }

  /**
   * Draws the particle
   * @param context The canvas context
   */
  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(this.#x, this.#y, this.#radius, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = this.#color;
    context.fill();
  }

  /**
   * Gets the x coordinate of the particle
   * @returns {number} The x coordinate of the particle
   */
  get x(): number {
    return this.#x;
  }

  /**
   * Gets the y coordinate of the particle
   * @returns {number} The y coordinate of the particle
   */
  get y(): number {
    return this.#y;
  }

}

/**
 * The Mesh Background class
 * @class Mesh
 * @description The class that represents the Mesh background animation
 * @extends Background
 */
class Mesh extends Background {

  #options    : MeshOptions         = defaultOptions; // The options for the animation
  #particles  : any[]               = [];             // The particles
  #rgb        : number[]            = [];             // The rgb values of the color

  /**
   * Creates a new Background instance
   * @param canvas The canvas element
   * @param context The canvas context
   * @constructor 
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, options?: { particleColor?: string, lineColor?: string, particleAmount?: number, defaultSpeed?: number, variantSpeed?: number, defaultRadius?: number, variantRadius?: number, linkRadius?: number, backgroundColor?: string }) {
    // Call the super constructor
    super(canvas, context);
    // Set the options
    this.#options = { ...defaultOptions, ...options };
    // Set the rgb values
    this.#rgb = this.#options.lineColor.match(/\d+/g) || Array(3).fill(0);
    // Clear the particles array
    this.#particles = [];
    // Initialize the particles
    for (let i = 0; i < this.#options.particleAmount; i++) {
      this.#particles.push(new Particle(this.canvas!.width, this.canvas!.height, this.#options));
    }
  }

  /**
   * Starts the animation
   * @override
   */
  start(): void {
    // Call the super method
    super.start();
    // Draw the animation
    window.requestAnimationFrame(this.draw.bind(this));
  }

  /**
   * Stops the animation
   * @override
   */
  stop(): void {
    // Call the super method
    super.stop();
    // Clear the canvas
    this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
  }

  /**
   * Draws the animation
   * @override
   */
  draw(): void {
    if (this.active) {
      window.requestAnimationFrame(this.draw.bind(this));
    } else {
      // Clear the canvas
      this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
      return;
    }
    
    // Check the distance between two particles
    const checkDistance = (x1: number, y1: number, x2: number, y2: number): number => { 
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // Get the particles
    const linkPoints = (particle: Particle, particles: any[]) => { 
      for (let i = 0; i < particles.length; i++) {
        const distance = checkDistance(particle.x, particle.y, particles[i].x, particles[i].y);
        const opacity  = 1 - distance / this.#options.linkRadius;
        if (opacity > 0) { 
          this.context!.lineWidth = 0.5;
          this.context!.strokeStyle = `rgba(${this.#rgb[0]}, ${this.#rgb[1]}, ${this.#rgb[2]}, ${opacity})`;
          this.context!.beginPath();
          this.context!.moveTo(particle.x, particle.y);
          this.context!.lineTo(particles[i].x, particles[i].y);
          this.context!.closePath();
          this.context!.stroke();
        }
      }
    }
    
    // Clear the canvas
    this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Set the background color
    this.context!.fillStyle = this.#options.backgroundColor;
    // Draw the background
    this.context!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Draw the particles
    for (let i = 0; i < this.#particles.length; i++){
      this.#particles[i].update(this.canvas!.width, this.canvas!.height);
      this.#particles[i].draw(this.context!);
    }
    // Link the particles
    for (let i = 0; i < this.#particles.length; i++){
      linkPoints(this.#particles[i], this.#particles);
    }
  }

  /**
   * Sets the options for the animation
   * @override
   */
  setOptions(options: any): void {
    // Set the options
    this.#options = { ...defaultOptions, ...options };
    // Set the rgb values
    this.#rgb = this.#options.lineColor.match(/\d+/g) || Array(3).fill(0);
    // Clear the particles array
    this.#particles = [];
    // Initialize the particles
    for (let i = 0; i < this.#options.particleAmount; i++) {
      this.#particles.push(new Particle(this.canvas!.width, this.canvas!.height, this.#options));
    }
    // Restart the animation if it's active
    if (this.active) {
      this.stop();
      this.start();
    }
  }

  /**
   * Gets the options for the animation
   * @override
   */
  getOptions(): any {
    // Return the options
    return this.#options;
  }

}

// Export the Mesh class
export { Mesh };