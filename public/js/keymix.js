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
	console.log(marker);
	MAPPINGS[character] = marker;
	console.log(MAPPINGS);

	displayMappings();
}

function removeMapping(key){

	MAPPINGS[key].remove();
	delete MAPPINGS[key];
	console.log('removing mapping: ' + key);
	console.log(MAPPINGS);
	displayMappings();
}

function sortMappings(){
	var sortable = [];

	for (var key in MAPPINGS){
		sortable.push([key,MAPPINGS[key]]);
	}

	sortable.sort(function(a,b){
		console.log('sorting');
		console.log(a[1]);
		return a[1].percentage - b[1].percentage;
	});

	return sortable;
}

function displayMappings(){
	var sortedMappings = sortMappings();

	var keyMappings = $('#key-mappings');
	$(keyMappings).html("");

	for (var i = 0; i < sortedMappings.length; i++){
		var key = sortedMappings[i][0];
		$(keyMappings).append(key + " : " + MAPPINGS[key].position.toFixed(2) + " seconds | ");
		$(keyMappings).append('<a href="javascript:void(0)" class="remove-mapping">remove</a>');
		$(keyMappings).append('<br>');
	}

	$(keyMappings).data('mapping-key',key);

	$('.remove-mapping').click(function(){
		var key = $(this).parent().data('mapping-key');
		removeMapping(key);
	});

}

wavesurfer.on('ready', function () {
	document.addEventListener('keypress', function (e) {
		var character = String.fromCharCode(e.keyCode);
	    if (character in MAPPINGS) {
	        e.preventDefault();


	        var percentage = MAPPINGS[character].percentage;

        	wavesurfer.seekTo(percentage);
        	console.log('seek to ' + percentage)
        	//wavesurfer.playPause();

	    } else {
	    	console.log('got here: ' + character);
	    	console.log(MAPPINGS);
	    }
	});
});