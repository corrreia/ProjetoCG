const m4 = twgl.m4;
const gl = document.querySelector("canvas").getContext("webgl");

/*========================= CAPTURE MOUSE EVENTS ========================= */

var theta = 0,
	phi = 0;

var drag = false; // Drag status

var old_x, old_y;

var mouseDown = function (e) {
	// Mouse is pressed
	drag = true;
	(old_x = e.pageX), (old_y = e.pageY);
	e.preventDefault();
	return false;
};

var mouseUp = function (e) {
	// Mouse is released
	drag = false;
};

var mouseMove = function (e) {
	if (!drag) return false;
	(dX = ((e.pageX - old_x) * 2 * Math.PI) / canvas.width),
		(dY = ((e.pageY - old_y) * 2 * Math.PI) / canvas.height);
	theta += dX; // Update the angle
	phi += dY; // Update the angle
	(old_x = e.pageX), (old_y = e.pageY);
	e.preventDefault();
};

canvas.addEventListener("mousedown", mouseDown, false); // Mouse is pressed
canvas.addEventListener("mouseup", mouseUp, false); // Mouse is released
canvas.addEventListener("mouseout", mouseUp, false); // Mouse is out of canvas
canvas.addEventListener("mousemove", mouseMove, false);

//listeners for zooming

var zoom = 0;
var zoomMouseWheel = function (e) {
	if (e.deltaY > 0) {
		zoom += 0.1;
	} else {
		zoom -= 0.1;
	}
};

canvas.addEventListener("wheel", zoomMouseWheel, false);

/*========================= THE WHOLE PROGRAM ========================= */

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

const sphereBufferInfo = twgl.primitives.createSphereBufferInfo(gl, 1, 24, 24);

function degToRad(d) {
	return (d * Math.PI) / 180;
}

var fieldOfViewRadians = degToRad(70);

const sunTex = twgl.createTexture(gl, {
	src: "sun.jpeg",
});

const mercuryTex = twgl.createTexture(gl, {
	src: "mercury.jpeg",
});

const venusTex = twgl.createTexture(gl, {
	src: "venus.jpeg",
});

const earthTex = twgl.createTexture(gl, {
	src: "earth.jpeg",
});

const marteTex = twgl.createTexture(gl, {
	src: "marte.jpeg",
});

const jupiterTex = twgl.createTexture(gl, {
	src: "jupiter.jpeg",
});

const saturnoTex = twgl.createTexture(gl, {
	src: "saturno.jpeg",
});

const neptunoTex = twgl.createTexture(gl, {
	src: "neptuno.jpeg",
});

const uranoTex = twgl.createTexture(gl, {
	src: "urano.jpeg",
});

const moonTex = twgl.createTexture(gl, {
	src: "moon.jpeg",
});

const phobosTex = twgl.createTexture(gl, {
	src: "phobos.jpg",
});

const orbitTex = twgl.createTexture(gl, {
	src: "orbita.jpeg",
});

var objectsToDraw = [];
var planets = [];

//CONSTANTS ARE DEFINED HERE!!!

const rSun = 30;

const rEarthPreAstBelt = 7; // there are values for units before and after the asteroid belt
const rEarthPostAstBelt = 1.6; // to make the planets closer to the sun and not to far away.
// all the planets are rotating on the same axis for simplicity
const auPreAstBelt = 75;
const auPostAstBelt = 10;

const deltaJupiter = 100;  // this variable was a created as a conviniance to make the the gas planet closer to the sun

const hourForRotation = 40;
const hourForTranslaction = 10;

const earthMass = 100;

//* THESE ARE THE VALUES WE FOUND FOR THE BEST EXPERIENCE

var sun = {
	//first is awlays the sun
	uniforms: {
		u_texture: sunTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
		u_lightWorldPosition: [1, 8, -10],
		u_lightColor: [1, 0.8, 0.8, 1],
		u_ambient: [1, 1, 1, 1],
		u_specular: [1, 1, 1, 1],
		u_shininess: 50,
		u_specularFactor: 1,
	},
	radius: rSun,
	distance: 0,
	rotation: 648 * hourForRotation,
	mass: earthMass * 333000,
	orbitsArround: null,
};

planets.push(sun);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: sun.uniforms,
});

var mercury = {
	uniforms: {
		u_texture: mercuryTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 0.38 * rEarthPreAstBelt,
	distance: 0.387 * auPreAstBelt + rSun, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: 1407.5 * hourForRotation,
	mass: earthMass * 0.055,
	orbitsArround: sun,
};

planets.push(mercury);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: mercury.uniforms,
});

var venus = {
	uniforms: {
		u_texture: venusTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 0.95 * rEarthPreAstBelt,
	distance: 0.723 * auPreAstBelt + rSun, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: -5832.5 * hourForRotation,
	mass: earthMass * 0.815,
	orbitsArround: sun,
};

planets.push(venus);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: venus.uniforms,
});

var earth = {
	uniforms: {
		u_texture: earthTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: rEarthPreAstBelt,
	distance: auPreAstBelt + rSun, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: 23.9345 * hourForRotation,
	mass: 2000 * earthMass, //*this can be increased to the moon move faster (multiplied by 5000 gives a good result)
	orbitsArround: sun,
};

planets.push(earth);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: earth.uniforms,
});

var moon = {
	uniforms: {
		u_texture: moonTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 0.2724 * rEarthPreAstBelt,
	distance: 0.08 * auPreAstBelt + rEarthPreAstBelt, //*only adding earth radius for simplicity (teorically it should be 0.00257*auPreAstBelt + rEarthPreAstBelt)
	//translation will be calculated automatically based on distance
	rotation: 65.7 * hourForRotation,
	mass: earthMass * 0.0123,
	orbitsArround: earth,
};

planets.push(moon);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: moon.uniforms,
});

var mars = {
	uniforms: {
		u_texture: marteTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 0.53 * rEarthPreAstBelt,
	distance: 1.524 * auPreAstBelt + rSun, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: 24.6229 * hourForRotation,
	mass: earthMass * 0.107,
	orbitsArround: sun,
};

planets.push(mars);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: mars.uniforms,
});

var phobos = {
	uniforms: {
		u_texture: phobosTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 0.11 * rEarthPreAstBelt,
	distance: 0.08 * auPreAstBelt + 0.11 * rEarthPreAstBelt, //*only adding mars radius for simplicity (teorically it should be 0.00015*auPreAstBelt + rMarsPreAstBelt)
	//translation will be calculated automatically based on distance
	rotation: 7.65 * hourForRotation,
	mass: earthMass * 0.000001,
	orbitsArround: mars,
};

planets.push(phobos);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: phobos.uniforms,
});

var jupiter = {
	uniforms: {
		u_texture: jupiterTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 11.21 * rEarthPostAstBelt,
	distance: 5.203 * auPostAstBelt + rSun + deltaJupiter, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: 9.925 * hourForRotation,
	mass: earthMass * 317.8,
	orbitsArround: sun,
};

planets.push(jupiter);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: jupiter.uniforms,
});

var saturn = {
	uniforms: {
		u_texture: saturnoTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 9.45 * rEarthPostAstBelt,
	distance: 9.539 * auPostAstBelt + rSun + deltaJupiter, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: 10.656 * hourForRotation,
	mass: earthMass * 95.2,
	orbitsArround: sun,
};

planets.push(saturn);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: saturn.uniforms,
});

var uranus = {
	uniforms: {
		u_texture: uranoTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 4.01 * rEarthPostAstBelt,
	distance: 19.18 * auPostAstBelt + rSun + deltaJupiter, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: 17.24 * hourForRotation,
	mass: earthMass * 14.5,
	orbitsArround: sun,
};

planets.push(uranus);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: uranus.uniforms,
});

var neptune = {
	uniforms: {
		u_texture: neptunoTex,
		u_world: m4.identity(),
		u_viewInverse: m4.identity(),
		u_worldInverseTranspose: m4.identity(),
		u_worldViewProjection: m4.identity(),
	},
	radius: 3.88 * rEarthPostAstBelt,
	distance: 30.06 * auPostAstBelt + rSun + deltaJupiter, //only adding sun radius for simplicity
	//translation will be calculated automatically based on distance
	rotation: 16.11 * hourForRotation,
	mass: earthMass * 17.1,
	orbitsArround: sun,
};

planets.push(neptune);
objectsToDraw.push({
	programInfo: programInfo,
	bufferInfo: sphereBufferInfo,
	uniforms: neptune.uniforms,
});

requestAnimationFrame(drawScene);

var lastTime = 0;

// Draw the scene.
function drawScene(time) {
	twgl.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

	gl.clearColor(0, 0, 0, 1); //Background
	// Clear the canvas AND the depth buffer.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Compute the projection matrix
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var projection = m4.perspective(fieldOfViewRadians, aspect, 0.5, 1500);

	// Compute the camera's matrix using look at.
	var cameraPosition = [100, 600, 1]; //[-100, 10, -50]
	var target = [0, 0, 0];
	var up = [0, 1, 0];
	var camera = m4.lookAt(cameraPosition, target, up);

	//make use of THETA and PHI to rotate the camera
	document.getElementById("camera").innerHTML =
		"Camera: theta " + theta + " phi " + phi + " zoom " + zoom;
	//m4.rotateY(camera, THETA, camera);
	//m4.rotateX(camera, PHI, camera);

	// Make a view matrix from the camera matrix.
	var view = m4.inverse(camera);
	var viewProjection = m4.multiply(projection, view);

	//calculate fps and display it on the screen
	var fps = 1000 / (time - lastTime); //1000ms / (time - lastTime) = fps
	lastTime = time;
	fps = Math.round(fps);
	document.getElementById("fps").innerHTML = "FPS: " + fps;

	// Compute the matrices for each planet
	planets.forEach(function (planet) {
		const uni = planet.uniforms;
		const world = uni.u_world;

		if (planet.orbitsArround != null) {
			//if it is not a star
			//draw a line with radius = planet.distance arround planet.orbitsArround
			const radius = planet.radius;
			const axisDistance = planet.distance; //distance between the center of the planet and the center whatever it orbits arround
			const rotationalPeriod = 1 / planet.rotation; // inverse if the frequency
			//orbital period can be calculated from the axisDistance
			const G = 6.67408 * Math.pow(10, -11); //gravitational constant
			const orbitalPeriod =
				1 /
				Math.sqrt(
					Math.pow(axisDistance, 3) /
						(G * (planet.orbitsArround.mass + planet.mass))
				);

			m4.identity(world);

			//get the cordinates of the planet it orbits arround as a array
			const orbitsArround = planet.orbitsArround.uniforms.u_world;
			const orbitsArroundCordinates = [
				orbitsArround[12],
				orbitsArround[13],
				orbitsArround[14],
			];

			m4.translate(world, orbitsArroundCordinates, world); //translate the planet to the cordinates of the planet it orbits arround
			m4.rotateY(
				world,
				time * orbitalPeriod * hourForTranslaction,
				world
			); //rotate the planet around the planet it orbits arround (orbital period)
			m4.translate(world, [axisDistance, 0, 0], world); //translate the planet to the distance of the planet it orbits arround
			m4.rotateY(world, time * rotationalPeriod, world); //rotate the planet around its own axis (rotational period)
			m4.scale(world, [radius, radius, radius], world); //scale the planet to its radius

			m4.transpose(
				m4.inverse(world, uni.u_worldInverseTranspose),
				uni.u_worldInverseTranspose
			);
			m4.multiply(viewProjection, uni.u_world, uni.u_worldViewProjection);

			//createTorusBufferInfo(gl, radius, thickness, radialSubdivisions, bodySubdivisions, startAngleopt, endAngleopt)
			const orbitBufferInfo = twgl.primitives.createTorusBufferInfo(
				gl,
				axisDistance,
				0.15,
				50,
				3
			); //!this is not efficient and causes stuttering (maybe use a line instead of a torus)
			const orbitWorld = m4.identity();
			m4.translate(orbitWorld, orbitsArroundCordinates, orbitWorld);
			const orbitWorldViewProjection = m4.multiply(
				viewProjection,
				orbitWorld
			);
			const orbitUniforms = {
				u_texture: orbitTex,
				u_world: orbitWorld,
				u_viewInverse: view,
				u_worldViewProjection: orbitWorldViewProjection,
			};

			twgl.setBuffersAndAttributes(gl, programInfo, orbitBufferInfo);
			twgl.setUniforms(programInfo, orbitUniforms);
			twgl.drawBufferInfo(gl, orbitBufferInfo);
		} else {
			//is a star, draw it in the center
			const radius = planet.radius;
			const rotationalPeriod = 1 / planet.rotation;

			m4.identity(world);
			m4.scale(world, [radius, radius, radius], world);
			m4.rotateY(world, time * rotationalPeriod, world);
			m4.translate(world, [0, 0, 0], world);

			m4.transpose(
				m4.inverse(world, uni.u_worldInverseTranspose),
				uni.u_worldInverseTranspose
			);
			m4.multiply(viewProjection, uni.u_world, uni.u_worldViewProjection);
		}
	});

	// ------ Draw the objects --------

	var lastUsedProgramInfo = null;
	var lastUsedBufferInfo = null;

	objectsToDraw.forEach(function (object) {
		var programInfo = object.programInfo;
		var bufferInfo = object.bufferInfo;
		var bindBuffers = false;

		if (programInfo !== lastUsedProgramInfo) {
			lastUsedProgramInfo = programInfo;
			gl.useProgram(programInfo.program);

			// We have to rebind buffers when changing programs because we
			// only bind buffers the program uses. So if 2 programs use the same
			// bufferInfo but the 1st one uses only positions the when the
			// we switch to the 2nd one some of the attributes will not be on.
			bindBuffers = true;
		}

		// Setup all the needed attributes.
		if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
			lastUsedBufferInfo = bufferInfo;
			twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
		}

		// Set the uniforms.
		twgl.setUniforms(programInfo, object.uniforms);

		// Draw
		gl.drawElements(
			gl.TRIANGLES,
			bufferInfo.numElements,
			gl.UNSIGNED_SHORT,
			0
		);
	});
 

	requestAnimationFrame(drawScene);
}
