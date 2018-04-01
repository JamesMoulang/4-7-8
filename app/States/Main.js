import Joseki from '../joseki';
import Circle from '../joseki/Entities/Shapes/Circle';
import Vector from '../joseki/Vector';
import Maths from '../joseki/Maths';
import Sprite from '../joseki/Entities/Sprite';
import Audio from '../joseki/Audio';

const CIRCLE_STATES = {
	IN: 'IN',
	HOLD: 'HOLD',
	OUT: 'OUT'
};

class Main extends Joseki.State {
	constructor() {
		super('main');
		this.mouseSprite = null;
		this.mouseHintShowing = false;
		this.clickedOnce = false;
		this.inhaleStartTime = -1;
		this.mouseWasDown = false;
		this.central = null;
		this.outline = null;
		this.currentState = null;
		this.infoShowing = false;
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

	clickInfo() {
		this.infoShowing = !this.infoShowing;
		this.info.width = this.info.height = this.info.width * 0.8;
		if (this.infoShowing) {
			this.switchState(CIRCLE_STATES.IN);
		}
	}

	enter(game) {
		super.enter(game);
		window.game_initFullscreenListener(this.game.parentID);
		window.game_resizeCallback = this.game.resizeCanvases.bind(this.game);
		this.pivot = new Vector(
			this.game.width*0.5,
			this.game.height*0.5
		);
		this.switchState(CIRCLE_STATES.IN);

		this.info = new Sprite(
			this.game, 
			'game', 
			new Vector(
				this.game.width-64,
				64
			), 
			'info',
			64, 
			64,
			undefined,
			1
		);
		this.game.entities.push(this.info);

		this.infoSheet = new Sprite(
			this.game, 
			'game', 
			new Vector(
				this.game.width * 0.5,
				this.game.height * 0.5
			), 
			'infoSheet',
			512*1.5, 
			320*1.5,
			undefined,
			0
		);
		this.game.entities.push(this.infoSheet);
	}

	update() {
		if (this.currentState !== null && !this.infoShowing) {
			this.currentState.update();
		}

		if ((this.game.mouseclicked && 
			this.game.mousePos.distance(this.info.position) < this.info.width * 0.5) ||
			(this.infoShowing && this.game.mouseclicked)) {
			this.clickInfo();
		}

		this.info.width = this.info.height = Maths.lerp(
			this.info.width,
			0.1,
			64
		);

		this.infoSheet.alpha = Maths.lerp(
			this.infoSheet.alpha,
			0.1,
			this.infoShowing ? 1 : 0
		);
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

	boop() {
		if (this.boopCircle === null) {
			this.boopCircle = new Circle(
				this.game,
				'game',
				this.pivot,
				192,
				undefined,
				'#F0EBD8',
				0,
				1,
			);
			this.game.entities.push(this.boopCircle);

			// Show the mouse thing
			if (!this.clickedOnce) {
				if (this.mouseSprite === null) {
					this.mouseSprite = new Sprite(
						this.game, 
						'game', 
						new Vector(
							this.game.width * 0.5,
							this.game.height * 0.5 + 192 + 256
						), 
						'mouse',
						322 * 0.25, 
						472 * 0.25,
						undefined,
						0
					);
					this.game.entities.push(this.mouseSprite);
				}
			}
		} else {
			this.boopCircle.radius = 192;
			this.boopCircle.strokeAlpha = 1;
		}

		this.boopTime = this.game.timestamp() + 6000;
	}

	inEnter() {
		if (this.central === null) {
			this.central = new Circle(
				this.game,
				'game',
				this.pivot, 
				4,
				'#3E5C76'
			);
			this.game.entities.push(this.central);
		}

		if (this.outline === null) {
			this.outline = new Circle(
				this.game,
				'game',
				this.pivot, 
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
		this.boopTime = this.game.timestamp() + 4000;
		this.boopCircle = null;
	}
	inUpdate() {
		if (this.boopCircle !== null) {
			if (this.boopCircle.strokeAlpha > 0) {
				this.boopCircle.strokeAlpha = Maths.towardsValue(
					this.boopCircle.strokeAlpha,
					this.game.delta * 0.02,
					0
				);
				this.boopCircle.radius += this.game.delta * 2;
			}
		}

		if (this.game.timestamp() - this.stateStartTime > 250) {
			this.outlineLength = Maths.lerp(
				this.outlineLength,
				0.1,
				2 * Math.PI
			);
		}
		this.outline.endArc = this.outline.startArc + this.outlineLength;
		const toMouse = this.game.mousePos.minus(this.pivot);
		const distance = toMouse.magnitude();
		if (!this.game.mousedown && 
			this.game.mousePos.magnitude() !== 0 &&
			distance > this.outline.radius) {
			this.central.position = this.central.position.lerp(
				this.pivot.add(toMouse.normalised().times(32)),
				0.1
			);
		} else {
			this.central.position = this.central.position.lerp(
				this.pivot,
				0.1
			);
		}

		if (this.mouseSprite !== null) {
			if (this.clickedOnce) {
				this.mouseSprite.alpha = Maths.towardsValue(
					this.mouseSprite.alpha,
					this.game.delta * 0.05,
					0
				);
			} else {
				this.mouseSprite.alpha = Maths.towardsValue(
					this.mouseSprite.alpha,
					this.game.delta * 0.01,
					1
				);
			}
		}

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
					// Audio.play('reverse');
					this.mouseWasDown = true;
					this.clickedOnce = true;
					this.inhaleStartTime = this.game.timestamp();
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
			if (this.game.timestamp() > this.boopTime) {
				this.boop();
			}

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
		this.comp = 0;
	}
	holdUpdate() {
		let completion = Maths.clamp(
			(this.game.timestamp() - this.stateStartTime) / 7000,
			0,
			1
		);
		completion = Math.ceil(completion/(1/7)) * (1/7);
		this.comp = Maths.lerp(this.comp, 0.05, completion);
		if (this.comp > 0.999) {
			this.comp = 1;
		}
		this.outline.endArc = this.outline.startArc - Math.PI * 2 * (1-this.comp);
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
		// Audio.play('forward', 0.25);
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