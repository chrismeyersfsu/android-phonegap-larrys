
function typeOf(obj) {
  if ( typeof(obj) == 'object' ) {
    if (obj.length)
      return 'array';
    else
      return 'object';
    } else
  return typeof(obj);
}

function sortObj(arr){
	// Setup Arrays
	var sortedKeys = new Array();
	var sortedObj = {};

	// Separate keys and sort them
	for (var i in arr){
		sortedKeys.push(i);
	}
	sortedKeys.sort();

	// Reconstruct sorted obj based on keys
	for (var i in sortedKeys){
		sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
	}
	return sortedObj;
}

function imageToggleFade() {
	var veg = $(this).attr('id');
	var state = $(this).jqmData('state');
	if (state == false) {
		$('#'+veg).fadeTo(200,1);
		state = true;
	} else {
		$('#'+veg).fadeTo(200, .25);
		state = false;
	}
	$(this).jqmData("state", state);
}