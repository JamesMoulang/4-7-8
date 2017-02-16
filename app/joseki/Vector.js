var applyTransformationMatrix = function(m1, m2) {
	var point = [];
	for (var i = 0; i < m1.length; i++) {
		point[i] = [];
		point[i][0] = 0;
		for (var j = 0; j < m1[i].length; j++) {
			point[i][0] += m1[i][j] * m2[j][0];
		}
	}

	return point;
}

class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	random() {
		return new Vector(
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5
		).normalised();
	}

	//Only works with 2d vectors.
	angleTo(v2) {
		return Math.atan2(v2.y - this.y, v2.x - this.x);
	}

	add(v2) {
		return new Vector(this.x + v2.x, this.y + v2.y, this.z + v2.z);
	}

	minus(v2) {
		return new Vector(this.x - v2.x, this.y - v2.y, this.z - v2.z);
	}

	times(s) {
		return new Vector(this.x * s, this.y * s, this.z * s);
	}

	divide(s) {
		return new Vector(this.x / s, this.y / s, this.z / s);
	}

	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	distance(v2) {
		return this.minus(v2).magnitude();
	}

	lerp(v2, t) {
		var direction = v2.minus(this);
		var distance = direction.magnitude() * t;
		return this.add(direction.normalised().times(distance));
	}

	normalised() {
		var mag = this.magnitude();
		if (mag == 0) {
			return new Vector();
		} else {
			return this.divide(this.magnitude());
		}
	}

	applyTransformationMatrix(matrix) {
		var point = [
			[this.x],
			[this.y],
			[this.z],
			[1]
		];

		var applied = applyTransformationMatrix(matrix, point);

		return new Vector(
			applied[3][0] == 0 ? 0 : applied[0][0] / applied[3][0], 
			applied[1][0] == 0 ? 0 : applied[1][0] / applied[3][0], 
			applied[2][0] == 0 ? 0 : applied[2][0] / applied[3][0]
		);
	}
}

export default Vector;