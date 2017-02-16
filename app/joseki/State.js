class State {
	constructor(key) {
		this.key = key;
		this.game = null;
	}

	enter(game) {
		this.game = game;
		console.log("entering state " + this.key);
	}

	_update() {
		if (this.game != null) {
			this.update();
		}
	}
	update() {
		
	}

	exit() {

	}
}

export default State;