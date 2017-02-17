import Entity from '../Entity';
import Vector from '../Vector';

class Circle extends Entity {
	constructor(
		game, 
		canvas, 
		position, 
		key,
		width, 
		height,
		anchor = new Vector(0.5, 0.5),
		alpha = 1
	) {
		super(game, canvas, position);
		this.key = key;
		this.width = width;
		this.height = height;
		this.anchor = anchor;
		this.alpha = alpha;
	}

	render() {
		this.canvas.drawSprite(
			this.position, 
			this.key,
			this.width,
			this.height,
			this.anchor,
			this.alpha
		);
	}
}

export default Circle;