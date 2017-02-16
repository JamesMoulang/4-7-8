import Vector from './Vector';

class Canvas {
	constructor(parent, zIndex, id, padding=32, gameWidth=1024, gameHeight=1024) {
		var div = document.getElementById(parent);
		this.scale = 1;
		this.padding = padding;
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;
		this.topLeft = new Vector(0, 0);
		this.key = id;
		var canv = document.createElement('canvas');
		canv.id = 'canvas_' + id;
		canv.style.zIndex = zIndex;
		div.appendChild(canv);

		this.backgroundColour = '#ffffff';
		this.canvas = canv;
		this.ctx = canv.getContext('2d');

		this.resize();
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		// Right.
		// padding is the actual screen padding. So how much space do we have to work with that isn't that?

		var actualPixelWidth = this.canvas.width - this.padding * 2;
		var actualPixelHeight = this.canvas.height - this.padding * 2;

		// So, what's the aspect ratio?
		var ratio = this.gameHeight / this.gameWidth;

		// Now set the scale so gameWidth fits into actualPixelWidth. Check height fits.
		this.scale = actualPixelWidth / this.gameWidth;
		var pixelGameWidth = this.gameWidth * this.scale;
		var pixelGameHeight = pixelGameWidth * ratio;
		if (pixelGameHeight > actualPixelHeight) {
			pixelGameHeight = actualPixelHeight;
			pixelGameWidth = pixelGameHeight / ratio;
			this.scale = pixelGameHeight / this.gameHeight;
		}

		var x = (window.innerWidth - pixelGameWidth) * 0.5;
		var y = (window.innerHeight - pixelGameHeight) * 0.5;

		this.topLeft = new Vector(x, y);
	}

	clear() {
		this.ctx.fillStyle = this.backgroundColour;
		this.ctx.globalAlpha = 1;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawCircle(_pos, radius=128, fillStyle, strokeStyle, fillAlpha=1, strokeAlpha=1, startArc=0, endArc=2*Math.PI, anticlockwise=false) {
		var pos = this.topLeft.add(_pos.times(this.scale));
		this.ctx.beginPath();
		this.ctx.arc(pos.x, pos.y, radius*this.scale, startArc, endArc, anticlockwise);

		if (typeof(fillStyle) !== 'undefined') {
			this.ctx.fillStyle = fillStyle;
			this.ctx.globalAlpha = fillAlpha;
			this.ctx.fill();
		}

		if (typeof(strokeStyle) !== 'undefined') {
			this.ctx.strokeStyle = strokeStyle;
			this.ctx.globalAlpha = strokeAlpha;
			this.ctx.stroke();
		}
	}

	screenToWorld(x, y) {
		return (new Vector(x, y).minus(this.topLeft)).times(1/this.scale);
	}

	getPos(_pos) {
		var pos = this.topLeft.add(_pos.times(this.scale));
		return pos;
	}

	drawEllipse(_pos, radiusX, radiusY, fillStyle, strokeStyle, fillAlpha=1, strokeAlpha=1) {
		var pos = this.getPos(_pos);
		this.ctx.beginPath();
		this.ctx.ellipse(
			pos.x, 
			pos.y, 
			radiusX*this.scale, 
			radiusY*this.scale, 
			0, 
			0, 
			2*Math.PI, 
			false
		);

		if (typeof(fillStyle) !== 'undefined') {
			this.ctx.fillStyle = fillStyle;
			this.ctx.globalAlpha = fillAlpha;
			this.ctx.fill();
		}

		if (typeof(strokeStyle) !== 'undefined') {
			this.ctx.strokeStyle = strokeStyle;
			this.ctx.globalAlpha = strokeAlpha;
			this.ctx.stroke();
		}
	}

	fillRect(_x=0, _y=0, _width=128, _height=128, colour='#ffffff', alpha=1) {
		var x = this.topLeft.x + _x * this.scale;
		var y = this.topLeft.y + _y * this.scale;
		var width = _width * this.scale;
		var height = _height * this.scale;

		this.ctx.fillStyle = colour;
		this.ctx.globalAlpha = alpha;
		this.ctx.fillRect(x, y, width, height);
	}

	drawLine(_x1=0, _y1=0, _x2=128, _y2=128, colour='#ffffff', alpha=1, lineWidth=8) {
		var x1 = this.topLeft.x + _x1 * this.scale;
		var y1 = this.topLeft.y + _y1 * this.scale;
		var x2 = this.topLeft.x + _x2 * this.scale;
		var y2 = this.topLeft.y + _y2 * this.scale;

		this.ctx.strokeStyle = colour;
		this.ctx.globalAlpha = alpha;
		this.ctx.lineWidth = lineWidth * this.scale;
		this.ctx.beginPath();
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		this.ctx.stroke();
	}
}

export default Canvas;