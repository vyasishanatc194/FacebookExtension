//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || 
window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
window.msIDBKeyRange

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var FBDB;
var tableName = "facebookTable";
var tableName1 = "facebookGroupsTable";
var request = window.indexedDB.open("newDatabaseFacebook", 1);
var CURRENTDATE = new Date();

request.onerror = function(event) {
  console.log("error: in IndexedDB");
};

request.onsuccess = function(event) {
  FBDB = request.result;
  console.log("success: "+ FBDB);
};

request.onerror = function(event) {
  console.log("error: ");
  Location.reload();
};

request.onupgradeneeded = function(event) {
  var db = event.target.result;
  db.createObjectStore(tableName, {keyPath: 'id'} );
  db.createObjectStore(tableName1, {keyPath: "id"});
}

var preDefinedRelationships = [ 
	'Single',
	'In a relationship',
	'Engaged',
	'Married',
	'Civil partnership',
	'Domestic partnership',
	'An open relationship',
	'Complicated',
	'Separated',
	'Divorced',
	'Widowed',
];

function addSearchBar(tblnm){
	var searchTab = '<div id="searchFrom">'+
					'<input type="text" id="byName" placeholder="Search By Firstname Or Lastname" />'+
					'<select id="byGender"><option value="null">Select Gender</option>'+
					'<option value="male">Male</option><option value="female">Female</option>'+
					'</select>'+
					'<select id="byAge">'+
					'</select>'+
					'</select>'+
					'<select id="byRelationship">'+
					'</select>'+
					'<input type="button" data-value="'+tblnm+'" id="doSearch" value="Search"/></div><hr/>';
    $("#context").prepend(searchTab);

    $("#byAge").empty();
    $("#byAge").append('<option value="null">Select Age</option>');
    for (var i = 1; i <= 150; i++) {
    	$("#byAge").append('<option value="'+i+'">'+i+'</option>');
	}

	$("#byRelationship").empty();
	$("#byRelationship").append('<option value="null">Select Relationship</option>');
	for (var i = 0; i < preDefinedRelationships.length; i++) {
		$("#byRelationship").append('<option value="'+preDefinedRelationships[i].toLowerCase()+'">'+preDefinedRelationships[i].toLowerCase()+'</option>');
	}

    $('#doSearch').on('click', function(){
      var tblnm = $(this).attr('data-value');
      var FLname = $("#byName").val();
      var Gender = $("#byGender").val();
      var Age = $("#byAge").val();
      var Relationship = $("#byRelationship").val();
      	if (FLname === '' && Gender === 'null' && Age === 'null' && Relationship === 'null'){
      		welcomeToAllFrineds(true);
      	} else {
      		dosearching(FLname, Gender, Age, Relationship, tblnm);
  		}
    });
}

function addSearchBarGrp(tblnm){
	var searchTab = '<div id="searchFrom">'+
					'<input type="text" id="byName" placeholder="Search By Firstname Or Lastname" />'+
					'<select id="byGender"><option value="null">Select Gender</option>'+
					'<option value="male">Male</option><option value="female">Female</option>'+
					'</select>'+
					'<select id="byAge">'+
					'</select>'+
					'</select>'+
					'<select id="byRelationship">'+
					'</select>'+
					'<input type="button" data-value="'+tblnm+'" id="doSearchGrp" value="Search"/></div><hr/>';
    $("#context").prepend(searchTab);

    $("#byAge").empty();
    $("#byAge").append('<option value="null">Select Age</option>');
    for (var i = 1; i <= 150; i++) {
    	$("#byAge").append('<option value="'+i+'">'+i+'</option>');
	}

	$("#byRelationship").empty();
	$("#byRelationship").append('<option value="null">Select Relationship</option>');
	for (var i = 0; i < preDefinedRelationships.length; i++) {
		$("#byRelationship").append('<option value="'+preDefinedRelationships[i].toLowerCase()+'">'+preDefinedRelationships[i].toLowerCase()+'</option>');
	}

    $('#doSearchGrp').on('click', function(){
	  var tblnm = $(this).attr('data-value');
      var FLname = $("#byName").val();
      var Gender = $("#byGender").val();
      var Age = $("#byAge").val();
      var Relationship = $("#byRelationship").val();
      if (FLname === '' && Gender === 'null' && Age === 'null' && Relationship === 'null'){
      		welcomeToGrps(true);
      	} else {
      		dosearchingInGrp(FLname, Gender, Age, Relationship, tblnm);
  		}
    });
}