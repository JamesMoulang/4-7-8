import Joseki from '../joseki';
import Circle from '../joseki/Entities/Shapes/Circle';
import Vector from '../joseki/Vector';
import Maths from '../joseki/Maths';

const CIRCLE_STATES = {
	IN: 'IN',
	HOLD: 'HOLD',
	OUT: 'OUT'
};

class Main extends Joseki.State {
	constructor() {
		super('main');
		this.inhaleStartTime = -1;
		this.mouseWasDown = false;
		this.central = null;
		this.outline = null;
		this.currentState = null;
		this.circleStates = {
			IN: {
				key: CIRCLE_STATES.IN,
				enter: this.inEnter.bind(this),
				update: this.inUpdate.bind(this),
				exit: this.inExit.bind(this)
			},
			HOLD: {
				key: CIRCLE_STATES.HOLD,
				enter: this.holdEnter.bind(this),
				update: this.holdUpdate.bind(this),
				exit: this.holdExit.bind(this)
			},
			OUT: {
				key: CIRCLE_STATES.OUT,
				enter: this.outEnter.bind(this),
				update: this.outUpdate.bind(this),
				exit: this.outExit.bind(this)
			}
		}
	}

	enter(game) {
		super.enter(game);
		this.switchState(CIRCLE_STATES.IN);
	}

	update() {
		if (this.currentState !== null) {
			this.currentState.update();
		}
	}

	switchState(key) {
		const nextState = this.circleStates[key];
		if (this.currentState === null || nextState.key !== this.currentState.key) {
			if (this.currentState !== null) {
				this.currentState.exit();
			}
			nextState.enter();
			this.currentState = nextState;
			this.stateStartTime = this.game.timestamp();
		}
	}

	inEnter() {
		if (this.central === null) {
			this.central = new Circle(
				this.game,
				'game',
				new Vector(
					this.game.width*0.5,
					this.game.height*0.5
				), 
				4,
				'#3E5C76'
			);
			this.game.entities.push(this.central);
		}

		if (this.outline === null) {
			this.outline = new Circle(
				this.game,
				'game',
				new Vector(
					this.game.width*0.5,
					this.game.height*0.5
				), 
				192,
				undefined,
				'#F0EBD8'
			);
			this.game.entities.push(this.outline);
		}
		this.outline.anticlockwise = false;
		this.outline.startArc = -Math.PI * 0.5;
		this.outline.endArc = -Math.PI * 0.5;
		this.outlineLength = 0;
	}
	inUpdate() {
		this.outlineLength = Maths.towardsValue(
			0,
			(this.game.timestamp() - this.stateStartTime) * 0.005,
			2 * Math.PI
		);
		this.outline.endArc = this.outline.startArc + this.outlineLength;
		const distance = this.game.mousePos.distance(this.outline.position);
		if (distance < this.outline.radius) {
			if (!this.game.mousedown) {
				this.mouseWasDown = false;
				this.central.radius = Maths.lerp(
					this.central.radius,
					0.1,
					16
				);
			} else {
				if (!this.mouseWasDown) {
					this.mouseWasDown = true;
					this.inhaleStartTime = this.game.timestamp();
					console.log(this.inhaleStartTime);
				}

				const completion = Maths.clamp(
					(this.game.timestamp() - this.inhaleStartTime) / 4000,
					0,
					1
				);
				this.central.radius = Maths.lerp(
					16,
					completion,
					192
				);

				if (completion === 1) {
					this.switchState(CIRCLE_STATES.HOLD);
				}
			}
		} else {
			this.central.radius = Maths.lerp(
				this.central.radius,
				0.1,
				Maths.clamp((1 - (distance / 1024)), 0, 1) * 8
			);
		}
	}
	inExit() {

	}

	holdEnter() {
		this.outline.startArc = Math.PI * 1.5;
		this.outline.endArc = this.outline.startArc - Math.PI * 2;
		this.outline.anticlockwise = true;
	}
	holdUpdate() {
		const completion = Maths.clamp(
			(this.game.timestamp() - this.stateStartTime) / 7000,
			0,
			1
		);
		console.log(completion);
		this.outline.endArc = this.outline.startArc - Math.PI * 2 * (1-completion);
		if (!this.game.mousedown) {
			this.mouseWasDown = false;
			this.switchState(CIRCLE_STATES.OUT);
		}
	}
	holdExit() {

	}

	outEnter() {

	}
	outUpdate() {
		this.outline.endArc = Maths.lerp(
			this.outline.endArc,
			0.1,
			this.outline.startArc
		);

		const completion = Maths.clamp(
			(this.game.timestamp() - this.stateStartTime) / 8000,
			0,
			1
		);
		this.central.radius = 192 - completion * 192;
		if (this.game.mousedown || completion === 1) {
			this.switchState(CIRCLE_STATES.IN);
		}
	}
	outExit() {

	}

	render() {
		super.render();
	}
}

export default Main;