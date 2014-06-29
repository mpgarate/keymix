var CHAR = false;
var MARK = false;

var MAPPINGS = [];

function showOverlayContent(str,selector){
	var content_overlay = $('.content-overlay');
	$(content_overlay).addClass('overlay-visible');
	$(content_overlay).html('<' + selector + '>' + str + '</' + selector + '>');
	$(content_overlay).fadeTo(0, 0.5, function(){});
}

function fadeOutOverlay(){
	var content_overlay = $('.content-overlay');
	$(content_overlay).fadeTo('slow', 0, function(){
		$(content_overlay).toggleClass('overlay-visible');
		$(content_overlay).html('');
	});
}

function mapCharacter(e){
	var character = String.fromCharCode(e.keyCode);
	console.log(character);

	CHAR = character;

	$('.mapping-overlay').toggleClass('overlay-visible');
	showOverlayContent(CHAR,'h1');
	fadeOutOverlay();

	document.removeEventListener('keypress', mapCharacter);

	MARK = wavesurfer.mark({
    	position: wavesurfer.getCurrentTime()
		});

		rememberMapping(CHAR, MARK);
}

function beginKeyMapping(){
	CHAR = false;
	MARK = false;
	showOverlayContent('Press key to map.', 'h3');
	document.addEventListener('keypress', mapCharacter);
	$('.mapping-overlay').toggleClass('overlay-visible');
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
		var className = 'mapping-' + key;
		$(keyMappings).append('<div class="mapping ' + className + '"></div>');
		var thisDiv = $('.'+className);

		$(thisDiv).append(key + " : " + MAPPINGS[key].position.toFixed(2) + " seconds | ");
		$(thisDiv).append('<a href="javascript:void(0)" class="remove-mapping btn btn-xs btn-danger">remove</a>');
		$(thisDiv).data('mapping-key',key);
	}


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

	    }
	});
});