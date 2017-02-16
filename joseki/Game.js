import _ from 'underscore';

import StateMachine from './StateMachine';
import Canvas from './Canvas';
import Vector from './Vector';

class Game {
	constructor(parentID, states, fps=30) {
		this.parentID = parentID;
		this.gamePadding = 64;
		this.width = 1024;
		this.height = 1024;

		this.fps = fps;
		this.timeScaleFPS = 30;
		this.idealFrameTime = 1000 / this.timeScaleFPS;
		this.delta = 0;

		this.backgroundColour = '#091431';
		this.justDestroyed = false;
		this.entities = [];
		this.state = new StateMachine(states, this);
		this.canvases = [];
		this.canvasIndex = 0;
		this.mousePos = new Vector(0, 0);
		this.mousedown = false;
		window.onresize = this.resizeCanvases.bind(this);
		document.onmouseover = this.onmousemove.bind(this);
		document.onmousemove = this.onmousemove.bind(this);
		document.onclick = this.onmouseclick.bind(this);
		document.onmousedown = this.onmousedown.bind(this);
		document.onmouseup = this.onmouseup.bind(this);
	}

	start(key) {
		this.state.switchState(key);
		this.paused = false;
		this.lastTimestamp = this.timestamp();
		this.loop();
	}

	timestamp() {
		return performance.now();
	}

	clearEntities() {
		_.each(this.entities, (e) => {
			e.destroy();
		})
	}

	loop() {
		var lastFrameTimeElapsed = this.timestamp() - this.lastTimestamp;
		this.delta = lastFrameTimeElapsed / this.idealFrameTime;
		this.update();
		this.render();
		this.lastTimestamp = this.timestamp();
		if (lastFrameTimeElapsed < this.idealFrameTime) {
			setTimeout(this.loop.bind(this), this.idealFrameTime - lastFrameTimeElapsed);
		} else {
			this.loop();
		}
	}

	getCanvas(key) {
		var canvas = _.findWhere(this.canvases, {key});
		if (typeof(canvas) !== 'undefined') {
			return canvas;
		} else {
			console.warn('No canvas with key ' + key);
			return null;
		}
	}

	update() {
		this.state.update();
		_.each(this.entities, (e) => {
			e._update();
		});
		if (this.justDestroyed) {
			this.entities = _.filter(this.entities, (e) => {
				return e.alive
			});
			this.justDestroyed = false;
		}
	}

	setBackgroundColour(colour) {
		this.backgroundColour = colour;
		_.each(this.canvases, (c) => {
			c.backgroundColour = this.backgroundColour;
		})
	}

	render() {
		_.each(this.canvases, (canvas) => {
			canvas.clear();
		});
		_.each(this.entities, (e) => {
			e._render();
		});
	}

	createCanvas(key) {
		var canvas = new Canvas(this.parentID, this.canvasIndex, key, this.gamePadding, this.gameWidth, this.gameHeight);
		canvas.backgroundColour = this.backgroundColour;
		this.canvasIndex++;
		this.canvases.push(canvas);
		return canvas;
	}

	resizeCanvases() {
		_.each(this.canvases, function(c) {
			c.resize();
		});
		this.render();
	}

	//Mouse input
	onmousemove(event) {
		this.mousePos = this.getCanvas('game').screenToWorld(event.clientX, event.clientY);
	}
	onmouseclick() {

	}
	onmousedown() {
		this.mousedown = true;
	}
	onmouseup() {
		this.mousedown = false;
	}
}

export default Game;