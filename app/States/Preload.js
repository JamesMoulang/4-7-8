import Joseki from '../joseki';
import Audio from '../joseki/Audio';

class Preload extends Joseki.State {
	constructor() {
		super('preload');
		this.loaded = false;
	}

	enter(game) {
		super.enter(game);
		this.game.loadImage('mouse', '/mouse.png');
		this.game.loadImage('info', '/info.png');
		this.game.loadImage('infoSheet', '/infoSheet.png');
		Audio.load('forward', '/forward.wav');
		Audio.load('reverse', '/reverse.wav');
		this.game.createCanvas('game');

		var canvas = document.getElementById('canvas_game');
		canvas.addEventListener('tap', game.onmousedown.bind(game));
		canvas.addEventListener('touchmove', game.onmousemove.bind(game));
		canvas.addEventListener('touchend', game.onmouseup.bind(game));
	}

	update() {
		if (this.game.imagesLoading === 0 && Audio.loadingCount === 0) {
			this.game.state.switchState('menu');
		}
	}
}

export default Preload;