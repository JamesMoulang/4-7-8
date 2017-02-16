import uid from 'uid';
import _ from 'underscore';

class Entity {
	constructor(game, canvas, position) {
		this.game = game;
		this.canvas = game.getCanvas(canvas);
		this.position = position;
		this.alive = true;
		this.id = uid();
	}

	destroy() {
		this.alive = false;
	}

	_update() {
		if (this.alive) {
			this.update();
		}
	}

	update() {

	}

	_render() {
		if (this.alive) {
			this.render();
		}
	}

	render() {

	}
}

export default Entity;