import Joseki from '../joseki';

class Menu extends Joseki.State {
	constructor() {
		super('menu');
	}

	update() {
		this.game.state.switchState('main');
	}
}

export default Menu;