var wireframe = { };


wireframe.toggles = [ ];
wireframe.togglecount = 0;

wireframe.ToggleButton = function(toggleId, controlId) {
	wireframe.toggles.push(this);
	wireframe.togglecount++;
	
	this.toggleId = toggleId;
	this.controlId = controlId;
	
	this.stateOn = false;
	$(toggleId).addClass('toggleOff');
	var turnOnFunc = this.turnOn;
	$(toggleId).click($.proxy(turnOnFunc, this));

	/*
	$(toggleId).click(function() {
		if(!stateOn) {
			wireframe.turnOffButtons();
			stateOn = true;
			$(toggleId).removeClass('toggleOff');
			$(toggleId).addClass('toggleOn');
			$(controlId).show();
		}
	}); */
}
wireframe.ToggleButton.prototype.turnOff = function () {
	if(this.stateOn) {
		this.stateOn = false;
		$(this.toggleId).addClass('toggleOff');
		$(this.toggleId).removeClass('toggleOn');
		$(this.controlId).hide();
	}
}

wireframe.ToggleButton.prototype.turnOn = function () {
		if(!this.stateOn) {
			wireframe.turnOffButtons();
			this.stateOn = true;
			$(this.toggleId).removeClass('toggleOff');
			$(this.toggleId).addClass('toggleOn');
			$(this.controlId).show();
		}
}

wireframe.turnOffButtons = function() {

	for (var i = 0; i < wireframe.toggles.length; i++)  {
		var toggle = wireframe.toggles[i];
		toggle.turnOff();
	}

}



wireframe.context =  0;

wireframe.config = {
	canvasId: '#wf-canvas',
	controlId: '#wf-control-panel',
	
	toggles: {
		circleToggle: '#wf-circle-toggle',
		lineToggle: '#wf-line-toggle'	
	},
	
	controls: {
		colourChooser: '#wf-colour-chooser',
		circleControl: '#wf-circle-control',
		lineControl: '#wf-line-control',
	}
}


wireframe.setLineStyle = function() {
	// change this to rgb?? may be better
	//   example from MDN:
	//ctx.fillStyle = "rgb(255,165,0)";  
	//ctx.fillStyle = "rgba(255,165,0,1)";
	
	// other line styles:
	// lineWidth = value
	// lineCap = type
	// lineJoin = type
	// miterLimit = value
	
	var picker = new jscolor.color(this, {}); 
	var color = picker.toString();
	wireframe.context.strokeStyle = color;
}

wireframe.Circle =  function (r, l, x, y, n) {
	this.centreX = x;
	this.centreY = y;
	this.radius = r;
	this.length = l;
	this.number = n;
}

wireframe.Circle.prototype.draw = function() {
	for(var i = 0; i < this.number; i++) {
		var theta = Math.random() * Math.PI * 2;

		var rightAngle = Math.PI/2;

		var a = this.radius * Math.cos(theta);
		var b = this.radius * Math.sin(theta);
		var c = this.length * Math.cos(theta - rightAngle);
		var d = this.length * Math.sin(theta - rightAngle);
		var e = this.length * Math.cos(theta + rightAngle);
		var f = this.length * Math.sin(theta + rightAngle);

		var x1 = this.centreX + a + c;
		var x2 = this.centreX + a + e;
		var y1 = this.centreY + b + d;
		var y2 = this.centreY + b + f;
			
		wireframe.context.beginPath();
		wireframe.context.moveTo(x1, y1);
		wireframe.context.lineTo(x2, y2);
		wireframe.context.stroke();
	}
}


wireframe.symmetricRandom = function(x) {
	return Math.random() * x * 2 - x;
}

wireframe.LineCluster = function (x1, y1, x2, y2, width, density) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.width = width;
	this.density = density;
}
wireframe.LineCluster.prototype.draw = function() {
	
	var number = this.width * this.density;
	
	for (var i = 0; i < number; i++) {
		var lineX1 = this.x1 + wireframe.symmetricRandom(this.width);
		var lineY1 = this.y1 + wireframe.symmetricRandom(this.width);
		var lineX2 = this.x2 + wireframe.symmetricRandom(this.width);
		var lineY2 = this.y2 + wireframe.symmetricRandom(this.width);
	
		wireframe.context.beginPath();
		wireframe.context.moveTo(lineX1, lineY1);
		wireframe.context.lineTo(lineX2, lineY2);
		wireframe.context.stroke();
	}


}


wireframe.clickHandler = function(e) {
   var x = e.pageX - this.offsetLeft;
   var y = e.pageY - this.offsetTop;

   var newcircle = new wireframe.Circle(10, 10, x, y, 10);
   newcircle.draw();
}




window.onload = function() {
	var canvas = $(wireframe.config.canvasId)[0];  
	wireframe.context = canvas.getContext('2d'); 
	
	var circToggle = new wireframe.ToggleButton(wireframe.config.toggles.circleToggle,
												wireframe.config.controls.circleControl);
	var lineToggle = new wireframe.ToggleButton(wireframe.config.toggles.lineToggle,
												wireframe.config.controls.lineControl);
	
	
	var mycircle1 = new wireframe.Circle(50, 50, 100, 100, 140);
	mycircle1.draw();
	
	
	var mycircle2 = new wireframe.Circle(100, 30, 250, 200, 30);
	mycircle2.draw();
	
	
	var mycircle3 = new wireframe.Circle(200, 70, 500, 400, 140);
	mycircle3.draw();
	
	
	var myline = new wireframe.LineCluster(300, 200, 700, 550, 20, 0.5);
	myline.draw();

    $(wireframe.config.canvasId).click(wireframe.clickHandler);
    var colorChoose = $(wireframe.config.controls.colourChooser);
    colorChoose.change(wireframe.setLineStyle);


}
	
