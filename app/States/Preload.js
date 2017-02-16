import Joseki from '../joseki';

class Preload extends Joseki.State {
	constructor() {
		super('preload');
		this.loaded = false;
	}

	enter(game) {
		super.enter(game);
		this.loaded = true;

		this.game.createCanvas('game');
	}

	update() {
		if (this.loaded) {
			this.game.state.switchState('menu');
		}
	}
}

export default Preload;