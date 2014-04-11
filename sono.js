var sono = { };

sono.context =  0;

sono.config = {
	canvasId: 'sono-canvas',
}

sono.ColorShift = function() {
  this.colors = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
};

sono.ColorShift.prototype.toRGB = function() {
  return "rgb(" + Math.floor(this.colors[0]) + "," + Math.floor(this.colors[1]) + "," + Math.floor(this.colors[2]) + ")";
};


sono.ColorShift.prototype.shiftIndex = function(index) {
  var step = 20;
  var delta = step * (Math.random() * 0.5 + 0.5);
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
  var fuzzyRadius = this.radius * (Math.random() * 0.2 + 0.8);
  var fuzzyLength = this.length * (Math.random() * 0.2 + 0.8);

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
    setTimeout(function() { _this.drawCurrentTheta(); }, 50);
  }
};


sono.symmetricRandom = function(x) {
	return Math.random() * x * 2 - x;
}

sono.LineCluster = function (x1, y1, x2, y2, width, density) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.width = width;
	this.density = density;
}
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


sono.clickHandler = function(e) {
   var x = e.pageX - this.offsetLeft;
   var y = e.pageY - this.offsetTop;

   var newcircle = new sono.Circle(10, 10, x, y, 10);
   newcircle.draw();
}

window.onload = function() {
  var canvas = document.getElementById(sono.config.canvasId);
	sono.context = canvas.getContext('2d'); 
  sono.context.canvas.width = window.innerWidth;
  sono.context.canvas.height = window.innerHeight;
	
	var mycircle1 = new sono.Circle(50, 50, 100, 100, 140);
	mycircle1.draw();

	var mycircle2 = new sono.Circle(100, 30, 250, 200, 30);
	mycircle2.draw();

	var mycircle3 = new sono.Circle(200, 70, 500, 400, 140);
	mycircle3.draw();

  canvas.addEventListener("click", sono.clickHandler);
}
	
