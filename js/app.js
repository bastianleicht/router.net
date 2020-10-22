/*
 *   Copyright (c) 2020 routerabfrage
 *   All rights reserved.
 *   https://github.com/routerabfrage/License
 */
// jshint esversion: 8
"use strict";

const lastUpdated = "20/10/2020 22:35 PM";

const qS = q => document.querySelector(q);

const video = qS('video');
const canvas = [qS('.top'), qS('.bot')];
const ctx = canvas.map(e => e.getContext('2d'));

let audioCtx, audioAnalyser, audioSource, bufferLength = 128, dataArray, width, height, initialized = false;

function initAudio() {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	audioAnalyser = audioCtx.createAnalyser();
	audioAnalyser.smoothingTimeConstant = 0.75;

	audioSource = audioCtx.createMediaElementSource(video);
	audioSource.connect(audioAnalyser);
	
	audioAnalyser.connect(audioCtx.destination);
	audioAnalyser.fftSize = 512;
	
	bufferLength = audioAnalyser.frequencyBinCount / 2;
	dataArray = new Uint8Array(bufferLength);
}

function draw() {
	if (initialized) {
		audioAnalyser.getByteFrequencyData(dataArray);
	}

	ctx.forEach(c => {
		c.clearRect(0, 0, width, height);
	});
	
	let barWidth = (width / bufferLength) / 2;

	for (let i = 0; i < bufferLength; i++) {
		let barHeight = initialized ? dataArray[i] : 0;

		ctx.forEach(c => c.fillStyle = 'rgb(0, 0, 0)');


		ctx[0].fillRect(i * 2 * barWidth, barHeight / 2, barWidth, height - barHeight / 2);
		ctx[1].fillRect(width - barWidth - (i * 2 * barWidth), 0, barWidth, height - barHeight / 2);
	}

	requestAnimationFrame(draw);
}

function resize() {
	if (window.innerWidth / window.innerHeight >= 16/9) {
		video.style.width = window.innerWidth + 'px';
		video.style.height = window.innerWidth * 9 / 16 + 'px';
	} else {
		video.style.height = window.innerHeight + 'px';
		video.style.width = window.innerHeight * 16 / 9 + 'px';
	}
	width = qS('img').clientWidth;
	height = qS('img').clientHeight;
	canvas.forEach(e => {
		e.setAttribute('width', width);
		e.setAttribute('height', height);
	});
}

resize();
window.addEventListener('resize', resize);
draw();
document.body.addEventListener('click', _ => {
	if (!initialized) {
		video.muted = false;
		initAudio();
		initialized = true;
		qS('.hint').style.display = 'none';
	}
});

//code für das anzeigen von Bildern in der Console
console.image = function (url, scale) {
	scale = scale || 1;
	var img = new Image();

	img.onload = function () {
		var dim = getBox(this.width * scale, this.height * scale);
		console.log("%c ", dim.style + "background: url(" + url + "); background-size: " + (this.width * scale) + "px " + (this.height * scale) + "px; color: transparent;");
	};

	img.src = url;
};

function getBox(width, height) {
	return {
		string: "+",
		style: "font-size: 1px; padding: 0 " + Math.floor(width / 2) + "px; line-height: " + height + "px;"
	};
}

//haha
console.image('res/pog.png', 1);
console.log("Hi there, mister! Thanks for visiting this website!\n\nIt is weird that you see this because nobody cares about the Console log. There is nothing special on this Website so don't even try anything!\n\nThis code is available on GitHub: \nhttps://github.com/routerabfrage/router.net \n\nLast Updated: " + lastUpdated);