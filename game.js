/*
Assignment: Javascript Assignment
Filename: game.html
@author: KITSANTAS FOTIOS (17421808)
Date: 30/04/17

Updated: Shitcoin Horse Racing by @eddieoz
Date: 25/05/2022
*/


function getKey(){
	var reader = new XMLHttpRequest()
	var path = 'key.json'
	reader.overrideMimeType("application/json");
	reader.open("GET", path);
	reader.onreadystatechange = (e) => {
		if (reader.readyState === XMLHttpRequest.DONE) {
			var status = reader.status;
			if (status === 0 || (status >= 200 && status < 400)) {
				var jsonResponse = JSON.parse(Http.responseText);
				cmcKey = jsonResponse.key;
				return(cmckey);
			}
		}

	}
}

function getCoins(){
	const Http = new XMLHttpRequest();
	const url='https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY='+cmcKey;
	Http.overrideMimeType("application/json");
	Http.open("GET", url);
	Http.setRequestHeader('Access-Control-Allow-Origin','*');
	Http.setRequestHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT, DELETE');
	Http.setRequestHeader('Access-Control-Allow-Headers','Origin, Content-Type, Accept, Authorization, X- Request-With');

	Http.onreadystatechange = (e) => {
  		//console.log(Http.responseText)
		if (Http.readyState === XMLHttpRequest.DONE) {
			var status = Http.status;
			if (status === 0 || (status >= 200 && status < 400)) {

				var jsonResponse = JSON.parse(Http.responseText);
				var select1 = document.getElementById('horse1coin');
				var select2 = document.getElementById('horse2coin');
				var select3 = document.getElementById('horse3coin');
				var select4 = document.getElementById('horse4coin');
				for (var i=0; i<=jsonResponse.data.length; i++){
					var element1 = new Option( jsonResponse.data[i].symbol , jsonResponse.data[i].symbol );
					var element2 = new Option( jsonResponse.data[i].symbol , jsonResponse.data[i].symbol );
					var element3 = new Option( jsonResponse.data[i].symbol , jsonResponse.data[i].symbol );
					var element4 = new Option( jsonResponse.data[i].symbol , jsonResponse.data[i].symbol );
					select1.appendChild(element1);
					select2.appendChild(element2);
					select3.appendChild(element3);
					select4.appendChild(element4);
				}
			} else {
				// Error
			}
		}
	}
	Http.send();

}

function getSpeed(horse,coin){
	const Http = new XMLHttpRequest();
	const url='https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol='+coin+'&CMC_PRO_API_KEY='+cmcKey;
	Http.overrideMimeType("application/json");
	Http.open("GET", url);
	Http.setRequestHeader('Access-Control-Allow-Origin','*');
	Http.setRequestHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT, DELETE');
	Http.setRequestHeader('Access-Control-Allow-Headers','Origin, Content-Type, Accept, Authorization, X- Request-With');
	Http.send();

	Http.onreadystatechange = (e) => {
		if(Http.readyState === XMLHttpRequest.DONE) {
			var status = Http.status;
			if (status === 0 || (status >= 200 && status < 400)) {

				var jsonResponse = JSON.parse(Http.responseText);
				coinData = Object.keys(jsonResponse.data)[0];
				quote = jsonResponse.data[coinData][0].quote;
				usdObj = Object.keys(quote)[0];
				usd = quote[usdObj]; 
				var list = [];
				list.push(usd.percent_change_1h);
				list.push(usd.percent_change_24h);
				list.push(usd.percent_change_7d);
				list.push(usd.percent_change_30d);
				list.push(usd.percent_change_90d);
				const random = Math.floor(Math.random() * list.length);
				speed = list[random]
				if (speed < 0){
					horse.speed = (100 - Math.abs(speed))/10
				} else {
					horse.speed = (Math.abs(speed) + 100)/10
				}
				console.log(horse.id, horse.coin, horse.speed, speed, list);
			} else {
				// Error
			}
		}
	}
}

/* Create a Javascript Object for a horse with 3 parameters: HTML ID, position x and y */
function Horse(id, x, y){
	this.element = document.getElementById(id);/*HTML element of the horse*/
	this.speed = Math.random()*10 + 10; /* Initiate a random speed for each horse, the greater speed, the faster horse. The value is between 10 and 20 */
	this.originX = x;/* Original X position */
	this.originY = y;/* Original Y position */
	this.x = x; /* Current X */
	this.y = y; /* Current Y */
	this.number = parseInt(id.replace(/[\D]/g, '')); /* Number of horse, number will be 1 or 2 or 3 or 4 */
	this.lap = 0; //Current lap of the horse
	this.coin = '';
	this.id = id;

	this.moveRight = function(){
		var horse = this; /* Assign horse to this object */

		/* Use setTimeout to have the delay in moving the horse */
		setTimeout(function(){
			// Move the horse to right 1vw
			horse.x ++;
			horse.element.style.left = horse.x +'vw';
			// console.log(horse.lap, actual_lap, num_lap)
			if (horse.lap+1 > actual_lap && actual_lap <= num_lap && horse.x > horse.originX + 6){
				actual_lap++;
				if (actual_lap == num_lap){
					document.getElementById('lap').innerText = 'Final';
				} else {
					document.getElementById('lap').innerText = actual_lap;
				}
				
			}
			
			// Check if goes through the start line, if horse runs enough number of laps and has pass the start line then stop
			if (horse.lap == num_lap && horse.x > horse.originX + 6){
				horse.arrive();
			}else{
				// Make decision to move Down or not
				// The width of the Down Road is 10wh, then the distance of each horse is 2.5vw (4 horses). The right position of the road is 82.5vw
				// Continue to move right if not reach the point to turn
				if (horse.x < 82.5 - horse.number*2.5){					
					horse.moveRight();
				}else{
					getSpeed(horse, horse.coin)
					// Change HTML class of horse to runDown
					horse.element.className = 'horse runDown';
					// Change the speed, will be random value from 10 to 20
					// horse.speed = Math.random()*10 + 10;
					horse.moveDown();
				}
			}

		}, 1000/this.speed);
	}

	/* Do the same for moveDown, moveLeft, moveUp */
	this.moveDown = function(){
		var horse = this;
		setTimeout(function(){
			horse.y ++;
			horse.element.style.top = horse.y +'vh';
			if (horse.y < horse.originY + 65){
				horse.moveDown();
			}else{
				horse.element.className = 'horse runLeft';
				getSpeed(horse, horse.coin)
				horse.moveLeft();
			}
		}, 1000/this.speed)
	}
	this.moveLeft = function(){
		var horse = this;
		setTimeout(function(){
			horse.x --;
			horse.element.style.left = horse.x +'vw';
			if (horse.x > 12.5 - horse.number*2.5){
				horse.moveLeft();
			}else{
				horse.element.className = 'horse runUp';
				getSpeed(horse, horse.coin)
				horse.moveUp();
			}
		}, 1000/this.speed)
	}
	this.moveUp = function(){
		var horse = this;
		setTimeout(function(){
			horse.y --;
			horse.element.style.top = horse.y +'vh';
			if (horse.y > horse.originY){
				horse.moveUp();
			}else{
				getSpeed(horse, horse.coin)
				horse.element.className = 'horse runRight';
				// Nearly finish the lap
				horse.lap ++;
				horse.moveRight();
			}
		}, 1000/this.speed)
	}

	/* Trigger the horse by run */
	this.run = function(coin){
		var horse = this;
		this.element.className = 'horse runRight';
		this.coin = coin;
		var speed = getSpeed(this, coin);
		actual_lap = 1;
		document.getElementById('lap').innerText = actual_lap;
		raceStart.play();
		setTimeout(function(){
			raceMusic.play();
			raceMusic.loop = true;
			raceHorses.play();
			raceHorses.loop = true;
			raceHorses.volume = 0.2;
			horse.moveRight(); 
		},6900)
		
	}
	this.arrive = function(){
		// Stop the horse run by change class to standRight
		this.element.className = 'horse standRight';
		this.lap = 0; // Reset the lap
		document.getElementById('lap').innerText = "--"
		/* Show the result */
		var tds = document.querySelectorAll('#results .result');//Get all table cell to display the result
		var positions = document.querySelectorAll('#results .position');
		// results.length is the current arrive position
		tds[results.length].className = 'result horse'+this.number;//The class of result look like: result horse1...
		
		pos = ['1st', '2nd', '3rd', '4th'];
		positions[results.length].innerText = pos[results.length]+' '+this.coin;

		// Push the horse number to results array, according the the results array, we know the order of race results
		results.push(this.number);

		// Win horse
		if (results.length == 1){
			raceMusic.pause();
			raceWin.play();
			setTimeout(function(){
				raceMusic.play();	
			},4500)
			
		}else if (results.length == 4){
			// All horse arrived, enable again the Start Button
			document.getElementById('start').disabled = false;
			horseSound.play();
			setTimeout(function(){
				horseNicker.play();
				raceMusic.pause();
				raceHorses.pause();
			}, 1500)
		}
	}
}

var num_lap = 1, actual_lap = 1, results = [], funds = 100, bethorse, amount;
var cmcKey = JSON.parse(data).key;

// Audios
var raceMusic = new Audio('media/zelda_horse_race.mp3');
var raceStart = new Audio('media/race-start.mp3');
var raceWin = new Audio('media/oot_horse_race_win.mp3');
var raceHorses = new Audio('media/horse_run_and_neh.mp3');
var horseSound = new Audio('media/horse_sound.mp3');
var horseNicker = new Audio('media/horse_nicker.mp3');



// Start the function when the document loaded
document.addEventListener("DOMContentLoaded", function(event) {

	getCoins();
	var horse1 = new Horse('horse1', 20, 4);
	var horse2 = new Horse('horse2', 20, 8);
	var horse3 = new Horse('horse3', 20, 12);
	var horse4 = new Horse('horse4', 20, 16);

	// Event listener to the Start button
	document.getElementById('start').onclick = function(){
		num_lap = parseInt(document.getElementById('num_lap').value);

		if (num_lap <= 0){
			alert('Number of lap must be greater than 1.');
		}else{

			/* Started the game */
			this.disabled = true;/* Disable the start button */
			var tds = document.querySelectorAll('#results .result');//Get all cells of result table.
			var positions = document.querySelectorAll('#results .position');
			pos = ['1st', '2nd', '3rd', '4th'];
			for (var i = 0; i < tds.length; i++) {
				tds[i].className = 'result'; // Reset the result.
				positions[i].innerText = pos[i];
			}

			results = []; // Results array is to save the horse numbers when the race is finished.
			horse1.run(document.getElementById('horse1coin').value);
			horse2.run(document.getElementById('horse2coin').value);
			horse3.run(document.getElementById('horse3coin').value);
			horse4.run(document.getElementById('horse4coin').value);
		}
	}
});
