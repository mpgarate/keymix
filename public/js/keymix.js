var CHAR = false;
var MARK = false;

var MAPPINGS = [];

function mapCharacter(e){
	var character = String.fromCharCode(e.keyCode);
	console.log(character);

	CHAR = character;

	document.removeEventListener('keypress', mapCharacter);
	document.addEventListener('click', mapClick);
}

function mapClick(e){
	if (e.target.nodeName === 'WAVE') {
		// add or remove a point
		MARK = wavesurfer.mark({
        	position: wavesurfer.getCurrentTime()
   		});

   		rememberMapping(CHAR, MARK);
	}
	document.removeEventListener('click', mapClick);
}

function beginKeyMapping(){
	CHAR = false;
	MARK = false;
	document.addEventListener('keypress', mapCharacter);
}

function rememberMapping(character, marker){
	MAPPINGS[character] = marker.position;
	console.log(MAPPINGS);

	displayMappings();
}

function displayMappings(){
	var keyMappings = $('#key-mappings');
	$(keyMappings).html("");

	for (var key in MAPPINGS){
		$(keyMappings).append(key + " : " + MAPPINGS[key]);
		$(keyMappings).append('<br>');
	}
}