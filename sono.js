var sono = { };

sono.context =  0;

sono.config = {
	canvasId: 'sono-canvas',
  drawDuration: 1000,
  fuzzyRadius: 0.1,
  fuzzyLength: 0.2,
  colorShiftStep: 10,
  colorShiftFuzziness: 0.5
}

sono.ColorShift = function() {
  this.colors = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
};

sono.ColorShift.prototype.toRGB = function() {
  return "rgb(" + Math.floor(this.colors[0]) + "," + Math.floor(this.colors[1]) + "," + Math.floor(this.colors[2]) + ")";
};


sono.ColorShift.prototype.shiftIndex = function(index) {
  var delta = sono.config.colorShiftStep * sono.upperRandom(sono.config.colorShiftFuzziness);
  if (Math.random() > 0.5) {
    delta = delta * -1;
  }

  var value = this.colors[index] + delta;

  if (value < 0) {
    value = 0;
  }
  else if (value > 255) {
    value = 255;
  }

  this.colors[index] = value;
};


sono.ColorShift.prototype.shift = function() {
  this.shiftIndex(0);
  this.shiftIndex(1);
  this.shiftIndex(2);
};



sono.Circle =  function (r, l, x, y, n) {
	this.centreX = x;
	this.centreY = y;
	this.radius = r;
	this.length = l;
	this.number = n;
};

sono.Circle.prototype.draw = function() {
  this.color = new sono.ColorShift();
  this.thetas = [];
  this.currentTheta = 0;
  this.delay = sono.config.drawDuration / this.number;
	for(var i = 0; i < this.number; i++) {
		this.thetas.push(Math.random() * Math.PI * 2);
  };

  this.thetas.sort();

  if (this.currentTheta < this.thetas.length) {
    this.drawCurrentTheta();
  }
};

sono.Circle.prototype.drawCurrentTheta = function() {
  var theta = this.thetas[this.currentTheta];

  var rightAngle = Math.PI/2;
  var fuzzyRadius = this.radius * sono.upperRandom(sono.config.fuzzyRadius);
  var fuzzyLength = this.length * sono.upperRandom(sono.config.fuzzyLength);

  var a = fuzzyRadius * Math.cos(theta);
  var b = fuzzyRadius * Math.sin(theta);
  var c = fuzzyLength * Math.cos(theta - rightAngle);
  var d = fuzzyLength * Math.sin(theta - rightAngle);
  var e = fuzzyLength * Math.cos(theta + rightAngle);
  var f = fuzzyLength * Math.sin(theta + rightAngle);

  var x1 = this.centreX + a + c;
  var x2 = this.centreX + a + e;
  var y1 = this.centreY + b + d;
  var y2 = this.centreY + b + f;
    
  sono.context.strokeStyle = this.color.toRGB();
  this.color.shift();
  sono.context.beginPath();
  sono.context.moveTo(x1, y1);
  sono.context.lineTo(x2, y2);
  sono.context.stroke();

  this.currentTheta++;
  if (this.currentTheta < this.thetas.length) {
    var _this = this;
    setTimeout(function() { _this.drawCurrentTheta(); }, this.delay);
  }
};


sono.symmetricRandom = function(x) {
	return Math.random() * x * 2 - x;
};

sono.rangeRandom = function(from, to) {
  return Math.random() * (to - from) + from;
};

sono.upperRandom = function(range) {
  return Math.random() * range + (1 - range);
};

sono.LineCluster = function (x1, y1, x2, y2, width, density) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.width = width;
	this.density = density;
};

sono.LineCluster.prototype.draw = function() {
	
	var number = this.width * this.density;
	
	for (var i = 0; i < number; i++) {
		var lineX1 = this.x1 + sono.symmetricRandom(this.width);
		var lineY1 = this.y1 + sono.symmetricRandom(this.width);
		var lineX2 = this.x2 + sono.symmetricRandom(this.width);
		var lineY2 = this.y2 + sono.symmetricRandom(this.width);
	
		sono.context.beginPath();
		sono.context.moveTo(lineX1, lineY1);
		sono.context.lineTo(lineX2, lineY2);
		sono.context.stroke();
	}
}

sono.randomCircle = function(x, y) {
  var buffer = 20.0;
  var radius = sono.rangeRandom(50, 200);
  var length = sono.rangeRandom(radius/4, radius/2);
  var n = Math.floor(radius);

  if (!defined(x)) {
    x = sono.rangeRandom(radius + buffer, sono.context.canvas.width - radius - buffer);
  }
  if (!defined(y)) {
    y = sono.rangeRandom(radius + buffer, sono.context.canvas.height - radius - buffer);
  }

  var newcircle = new sono.Circle(radius, length, x, y, n);
  newcircle.draw();

  setTimeout(function() { sono.randomCircle(); }, sono.rangeRandom(2000, 4000));
};

sono.centeredCircle = function() {
  var x = sono.context.canvas.width / 2.0;
  var y = sono.context.canvas.height / 2.0;

  var buffer = 20.0;
  var radius = sono.rangeRandom(10, Math.min(x, y) - buffer);
  var length = sono.rangeRandom(radius/4.0, radius/2.0);
  var n = Math.floor(radius/2.0);

  var newcircle = new sono.Circle(radius, length, x, y, n);
  newcircle.draw();

  setTimeout(function() { sono.centeredCircle(); }, sono.rangeRandom(500, 1000));
};


sono.clickHandler = function(e) {
  var radius = sono.rangeRandom(20, 200);
  var length = sono.rangeRandom(radius/4, radius/2);
  var x = e.pageX - this.offsetLeft;
  var y = e.pageY - this.offsetTop;
  var n = Math.floor(radius/2);

  var newcircle = new sono.Circle(radius, length, x, y, n);
  newcircle.draw();
}

window.onload = function() {
  var canvas = document.getElementById(sono.config.canvasId);
	sono.context = canvas.getContext('2d'); 
  sono.context.canvas.width = window.innerWidth;
  sono.context.canvas.height = window.innerHeight;

  canvas.addEventListener("click", sono.clickHandler);

  sono.centeredCircle();
}
	
