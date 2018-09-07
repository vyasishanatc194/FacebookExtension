
var friends = [],
    c = "",
    d = 0;

var allFriends = [];
var groups = [];


function getDataFromFB(a, b, c) {
    var d = a.length;
    if (0 == d) return [];
    var f, e = 0,
        g = [];
    for (c || (b = b.toLowerCase(), a = a.toLowerCase());
        (f = b.indexOf(a, e)) > -1;) g.push(f), e = f + d;
    return g
}

function h(friends) {
    for (var b = {}, c = 0; c < friends.length; c++) b[friends[c]] = !0;
    var d = [];
    for (var e in b) d.push(e);
    return d
}

function checkBackLater(list) {
  //save list
  $("#plswait").remove();
  setTimeout(function(){
    showFriendList();
  },100);
}

//Screen to be shown while scanning for friends the first time
function scanning() {
  $("#startNow").css('display', 'none');
  $("#subtit").text("Scanning Your Friends List. This May Take a Few Minutes, Feel free to open another tab. You'll be alerted once the scan is complete");
  $("<p id='plswait'>Please Wait...</p>").insertAfter("#subtit");
  $("<div id='uil-ring-css' style='transform:scale(0.54);'><div>").insertAfter("#tit");
}

//displays html for the first time a user uses the append
function welcomeToAllFrineds(flag) {
  doEmpty();
  $("#context").empty();
  $("<p id='subtit'>Scan you friend list..</p><button id ='startNow'>Start Scan</button><div id='tit'></div>").appendTo("#context");
  if (flag == true) {

    showFriendList();

    flag = false;
  } else {
    setTimeout(function() {
      $("#startNow").click(function() {
          scanning();
          setTimeout(function() {
            getFriendsList();
            alert("Scan Complete!");
            checkBackLater(friends);
          },10);
      });
    },10);
  }
}


function showFriendList() { 
	if ($("#context").find("div#box1").length == 0) {
    $("#context").append("<div id='box1'></div>");
 	}	
	$("#box1").empty();
	$("#box1").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
	setTimeout( function() {
    $("#box1").empty();

    var objectStore = FBDB.transaction(tableName).objectStore(tableName);
      	var i = 0;
      	objectStore.openCursor().onsuccess = function(event) {
	        var cursor = event.target.result;
	        if (cursor) {
	          var usrname = cursor.value.name;
	           $("<div class='itemFriend usrid' id="+cursor.value.id+" data-value="+cursor.value.parentId+"><img src="+cursor.value.src+" class='userImage' title="+usrname+"/>"+usrname+"</div>").appendTo("#box1");
	           i = i + 1;
	           cursor.continue();
	        } else {
	           console.log("No more entries!");
             $(".usrid").on("click", function() {
                var usrid = $(this).attr('id');
                var parentid = $(this).attr('data-value');
                showFrirendsDetail(usrid, parentid);
              });
	           //take away loading circle
		      $("#uil-ring-css").remove();
		      $("#subtit").remove();
		      $("#startNow").remove();
		      $("#tit").remove();

	        if (i > 0) { addSearchBar(tableName); } else { $("#box1").remove(); }
	        }
    	};
 	},100);
}

//gets an array of ids of all active users in friends list.
function getFriendsList() {
  for (indx = 0; true; indx++) {
    var counter = 0;
    var a = new XMLHttpRequest;
    a.open("GET", "https://www.facebook.com/ajax/browser/list/allfriends/?uid=" + prof_id + "&location=friends_tab_tl&__a=1&__dyn=&__req=&start=" + indx, false), a.send(null);
    var responseTxt = a.responseText;
    var ids = getDataFromFB('aria-haspopup', responseTxt);
    var userLink = getDataFromFB('clearfix pvm', responseTxt);
    var names = getDataFromFB('data-hovercard-prefer-more-content-show', responseTxt);
    if (ids.length < 2) {
      break;
    }
    for (let k = 0; k < ids.length; k++) {
      var l = responseTxt.substring(ids[k] + 13),
          m = l.indexOf('" data-cansuggestfriends');
      var l1 = responseTxt.substring(names[k] + 39),
          m1 = l1.indexOf('a>');          
      let idObj = responseTxt.substring(ids[k] + 37, ids[k] + 12 + m);
      let userNameObj = responseTxt.substring(names[k] + 46, names[k] + 31 + m1);
      let srcObj = "https://graph.facebook.com/" + idObj + "/picture?type=small";
      let userLinkObj = "https://mobile.facebook.com/profile.php?v=friends&id=" + idObj;
      var userObj = new Object(); // User Object for user data
      userObj ={
        id : idObj,
        userLink : userLinkObj,
        name: userNameObj,
        src : srcObj,
        gender: null,
        age: null,
        religious: null,
        relationship: null,
        allfriends: new Array(),
        parentId : null,
      }
 
      var request = FBDB.transaction([tableName], "readwrite")
      .objectStore(tableName)
      .add(userObj);

      request.onsuccess = function(event) {
          console.log("New record has been added to your database.");
      };
     
      request.onerror = function(event) {
        console.log("Unable to add record.\r\nIt is already exist in your database! ");
      }
    }
  }
}

function showFrirendsDetail(usrid, parentid = null) {
 	try{
    	console.log('getting info');
      doEmpty();
    	if ($("#context").find("div#box2").length == 0) {
  	     $("#context").append("<div id='box2'></div>");
	  	}
	  	$("#box2").empty();
	  	$("#box2").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");

      	var transaction = FBDB.transaction([tableName], 'readwrite');
      	var objectStore = transaction.objectStore(tableName);
      	var request = objectStore.get(usrid);
      
      	request.onerror = function(event) {
    	 	 alert("Unable to retrieve data from database!");
      	};
      
      	request.onsuccess = function(event) {
       		// Do something with the request.result!
       		if(event.target.result) {
          		var id = event.target.result.id;
            	var a = new XMLHttpRequest;
            	a.open("GET", "https://mobile.facebook.com/profile.php?id="+ id +"&v=info&start=0", false), a.send(null);
            	var responseTxt = a.responseText;
            	genders = getDataFromFB('title="Gender"', responseTxt);
              var birthYear = getDataFromFB('title="Birthday"><div class="lr"><div class="_5cdv r">', responseTxt);
              var religiousViews = getDataFromFB('title="Religious views"><div class="lr"><div class="_5cdv r">', responseTxt);
            	var uname = getDataFromFB('</script><title>', responseTxt);

            	var relationshipStatus1 = getDataFromFB('info_relation&amp;refid=17"><span class="_52jb">', responseTxt);
            	if (relationshipStatus1.length == 0) {
              		var relationshipStatus0 = getDataFromFB('<div class="__gx">Relationship</div>', responseTxt);
            	} else {
              		var relationshipStatus0 = '';
            	}

            for (let k = 0; k < uname.length; k++) {
              	var l = responseTxt.substring(genders[k] + 52),
            	  	m = l.indexOf('</div>');
              	var l1 = responseTxt.substring(uname[k] + 16),
                  	m1 = l1.indexOf('</title>');
                var l4 = responseTxt.substring(birthYear[k] + 54),
                    m4 = l4.indexOf('</div>');
                var l5 = responseTxt.substring(religiousViews[k] + 61),
                    m5 = l5.indexOf('</div>');

              	let relationship0 = '';
              	let relationship1 = '';
              	if (relationshipStatus0.length != 0) {
              		var l2 = responseTxt.substring(relationshipStatus0[k] + 186),
                  		m2 = l2.indexOf('</div>');
              		relationship0 = responseTxt.substring(relationshipStatus0[k] + 186, relationshipStatus0[k] + 186 + m2);
              	} else {
              		var l3 = responseTxt.substring(relationshipStatus1[k] + 48),              
                  		m3 = l3.indexOf('</h3></header>');
              		relationship1 = responseTxt.substring(relationshipStatus1[k] + 48, relationshipStatus1[k] + 48 + m3);    
              	}
              	let nameObj = responseTxt.substring(uname[k] + 16, uname[k] + 16 + m1);
              	let genderObj = responseTxt.substring(genders[k] + 52, genders[k] + 58 + m);

                let birthYearObj = responseTxt.substring(birthYear[k] + 54, birthYear[k] + 54 + m4);
                var age = '-';
                if (birthYearObj != '') {
                  let bdayYear = birthYearObj.split(" ");
                  age = CURRENTDATE.getFullYear() - bdayYear[2];
                }
              	let relationshipObj = relationship0 + " " + relationship1;
              	let gndr = genderObj.split("</div>");
                
                var religious = '-';
                let religiousViewsObj = responseTxt.substring(religiousViews[k] + 61, religiousViews[k] + 61 + m5);
                if ($(religiousViewsObj).length > 0) {
                  religious = $(religiousViewsObj)[0].innerText;
                } else if ($(religiousViewsObj).length == 0) {
                  religious = religiousViewsObj;
                } else {
                  religious = '-';
                }

              	event.target.result.gender = gndr[0];
              	event.target.result.name = nameObj;
              	event.target.result.relationship = relationshipObj;
                event.target.result.age = age;
                event.target.result.religious = religious;
              
              	var request = objectStore.put(event.target.result);

              	request.onsuccess = function() {
                	console.log('Got the details of friend....');
  			    	    $("#box2").empty();

              	 	var transaction = FBDB.transaction([tableName], 'readwrite');
      				  	var objectStore = transaction.objectStore(tableName);
      				  	var request = objectStore.get(usrid);
      				  
      				  	request.onerror = function(event) {
      				     	alert("Unable to retrieve data from database!");
      				  	};
      				  
      				  	request.onsuccess = function(event) {
        			    	var o = true;
        				   	// Do something with the request.result!
        				   	if(event.target.result.gender) {
        					    if (o == true) {
        			     	 		var details = "<strong>Name:</strong> "+ event.target.result.name + " <br/> <strong>Religious View:</strong> " + event.target.result.religious + " <br/><strong>Age:</strong> " + event.target.result.age + " <br/><strong>Gender:</strong> " + event.target.result.gender + " <br/> <strong>Relationship Status:</strong> " + event.target.result.relationship + "<br/><span id='totalfriends'></span><hr/><div id='box3'></div>";
        				      		$("#box2").prepend(details);
        				      		$("#box3").empty();
        				      		if (event.target.result.allfriends.length > 0){
        				        		showFofList(usrid);
        			       		 	} else {
        					      		var $btnGetFriend = "<button type='button' value="+event.target.result.id+" class='btnScanFriends' >Click here</button> to scan friends of "+event.target.result.name+"";
        					      		$("#box3").prepend($btnGetFriend);
        					      	}
        				      		o = false;
        				    	}
        				   	} else {
        				    	console.log("Error during getting information of friend");
        				   	}
                    $(".btnScanFriends").on('click', function() {
                      var usrid = $(this).val();
                      getFoFList(usrid);
                    });
    			  	    };
      		    };
        }
	 	} else {
      console.log("Record couldn't be found in your database!");
      $("#box2").empty();
      showFofDetail(usrid, parentid);
	 	}
   	};
  } catch (err) {
    cosnole.log(err.message);
  }
}

function getFoFList(usrid) {
  try{
	if ($("#box2").find("div#box3").length == 0) {
	    $("#box2").append("<div id='box3'></div>");
  	} 
  	$("#box3").empty();
  	$("#box3").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");

  	var transaction = FBDB.transaction([tableName], 'readwrite');
  	var objectStore = transaction.objectStore(tableName);
  	var request = objectStore.get(usrid);
      
	  request.onerror = function(event) {
     	alert("Unable to retrieve data from database!");
  	};
      
  	request.onsuccess = function(event) {
        var ids = null;
        if (event.target.result.allfriends.length > 0){
        	showFofList(usrid);
        }
        else if (event.target.result) {
      		var updatedData = event.target.result;
      		var profileId = updatedData.id;
      		var arrFriends = [];
      		for (indx = 0; true; indx++) {
            	var counter = 0;
            	var a = new XMLHttpRequest;
            	a.open("GET", "https://www.facebook.com/ajax/browser/list/allfriends/?uid=" + profileId + "&location=friends_tab_tl&__a=1&__dyn=&__req=&start=" + indx, false), a.send(null);
            	var responseTxt = a.responseText;
            	ids = getDataFromFB('user.php?id=', responseTxt);
            	var userLink = getDataFromFB('clearfix pvm', responseTxt);
            	var names = getDataFromFB('data-hovercard-prefer-more-content-show', responseTxt);
            	
            	if (ids.length < 2) {
            		$("#box3").empty();
            		$("#box3").append(" Friends can't find. ");
              		break;
            	}
        		if (ids.length != 0) {
              		for (let k = 0; k < ids.length; k++) {
		                var l = responseTxt.substring(ids[k] + 12),
		                    m = l.indexOf('&amp;');
		                var l1 = responseTxt.substring(names[k] + 39),
		                    m1 = l1.indexOf('a>');
		                let idObj = responseTxt.substring(ids[k] + 12, ids[k] + 12 + m);
		                let userNameObj = responseTxt.substring(names[k] + 46, names[k] + 31 + m1);
		                let srcObj = "https://graph.facebook.com/" + idObj + "/picture?type=small";
		                let userLinkObj = "https://mobile.facebook.com/profile.php?v=friends&id=" + idObj;
		                var userObj = new Object(); // User Object for user data
		                userObj ={
		                  id : idObj,
		                  userLink : userLinkObj,
		                  name: userNameObj,
		                  src : srcObj,
		                  gender: null,
                      age: null,
                      religious: null,
		                  relationship: null,
		                  parentId : usrid,
		                }
                
		                if (jQuery.inArray( idObj, arrFriends ) < 0 ) {
		                  	if (jQuery.inArray( idObj, arrFriends ) < 0) {
		                    	arrFriends.push(idObj);
		                    	updatedData.allfriends.push(userObj);
		                  	}
		                  	var request = objectStore.put(updatedData);

		                  	request.onsuccess = function() {
			                    console.log('.... getting friends of friends ...........');
			                    showFofList(usrid);
	                		}
              			}
              		}
	            } else {
	              console.log('.... This id have no friends list as public. Update indexed DB is done now ...........');
	            }
          	}
          	arrFriends = [];
        } else {
          console.log("complete...");
        }
      };
    } catch (err) {
      cosnole.log(err.message);
    }
}


function showFofList(usrid) {
	if ($("#box2").find("div#box3").length == 0) {
	    $("#box2").append("<div id='box3'></div>");
  	} 
  	$("#box3").empty();
  	$("#box3").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");

	var transaction = FBDB.transaction([tableName], 'readwrite');
	var objectStore = transaction.objectStore(tableName);
  	var request = objectStore.get(usrid);
	  
  	request.onerror = function(event) {
     	alert("Unable to retrieve data from database!");
  	};

	request.onsuccess = function(event) {
		var o = true;
		$("#box3").empty();
	  	if (event.target.result.allfriends.length > 0) {
	  		if (o == true) {
	  			$("#totalfriends").empty();
	      		$("#totalfriends").append("<strong>Total Friends: </strong>"+ event.target.result.allfriends.length);
	      		$("<div id='friendsdata'></div>").appendTo('#box3');
	      		o = false;
	      	}
	      	var data = event.target.result.allfriends;
	  		 for (var l=0; l < data.length; l++) {
	        	var fdata = "<div class='itemFriend fof' id="+data[l].id+" data-value="+usrid+"><img src="+data[l].src+"  class='userImage' title="+data[l].name+"/>"+data[l].name+"</div>";
	        	$(fdata).appendTo("#friendsdata");
	      	}
	  	} else {
	    	console.log("Error during getting friends' of friends");
	  	}
      $(".fof").on("click", function() {
          var usrid = $(this).attr('id');
          var parentid = $(this).attr('data-value');
          showFofDetail(usrid, parentid);
      });
  	};
}

function showFofDetail(usrid, parentid) {
   	try{
      console.log('getting fof info');
		  if ($("#context").find("div#box4").length == 0) {
	    	$("#context").append("<div id='box4'></div>");
	  	}
	  	$("#box4").empty();
	  	$("#box4").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");

    	 var transaction = FBDB.transaction([tableName], 'readwrite');
    	 var objectStore = transaction.objectStore(tableName);
  	   var request = objectStore.get(parentid);
      
      	request.onerror = function(event) {
    	 	alert("Unable to retrieve data from database!");
      	};
      
      	request.onsuccess = function(event) {
       	// Do something with the request.result!
       	if(event.target.result) {
          	var id = usrid;
            var a = new XMLHttpRequest;
            a.open("GET", "https://mobile.facebook.com/profile.php?id="+ id +"&v=info&start=0", false), a.send(null);
            var responseTxt = a.responseText;
            genders = getDataFromFB('title="Gender"', responseTxt);
            var uname = getDataFromFB('</script><title>', responseTxt);
            var relationshipStatus1 = getDataFromFB('info_relation&amp;refid=17"><span class="_52jb">', responseTxt);
            var birthYear = getDataFromFB('title="Birthday"><div class="lr"><div class="_5cdv r">', responseTxt);
            var religiousViews = getDataFromFB('title="Religious views"><div class="lr"><div class="_5cdv r">', responseTxt);
            if (relationshipStatus1.length == 0) {
          		var relationshipStatus0 = getDataFromFB('<div class="__gx">Relationship</div>', responseTxt);
            } else {
              	var relationshipStatus0 = '';
            }

            for (let k = 0; k < uname.length; k++) {
              	var l = responseTxt.substring(genders[k] + 52),
                  	m = l.indexOf('</div>');
              	var l1 = responseTxt.substring(uname[k] + 16),
                  	m1 = l1.indexOf('</title>');
                var l4 = responseTxt.substring(birthYear[k] + 54),
                    m4 = l4.indexOf('</div>');
                var l5 = responseTxt.substring(religiousViews[k] + 61),
                    m5 = l5.indexOf('</div>');

              	let relationship0 = '';
              	let relationship1 = '';
              	if (relationshipStatus0.length != 0) {
              		var l2 = responseTxt.substring(relationshipStatus0[k] + 186),
                  	m2 = l2.indexOf('</div>');
              		relationship0 = responseTxt.substring(relationshipStatus0[k] + 186, relationshipStatus0[k] + 186 + m2);
              	} else {
              		var l3 = responseTxt.substring(relationshipStatus1[k] + 48),              
                  		m3 = l3.indexOf('</h3></header>');    
              		relationship1 = responseTxt.substring(relationshipStatus1[k] + 48, relationshipStatus1[k] + 48 + m3);    
              	}

              	let genderObj = responseTxt.substring(genders[k] + 52, genders[k] + 58 + m);
              	let nameObj = responseTxt.substring(uname[k] + 16, uname[k] + 16 + m1);
              	let relationshipObj = relationship0 + " " + relationship1;
              	let gndr = genderObj.split("</div>");

                let birthYearObj = responseTxt.substring(birthYear[k] + 54, birthYear[k] + 54 + m4);
                var age = '-';
                if (birthYearObj != '') {
                  let bdayYear = birthYearObj.split(" ");
                  age = CURRENTDATE.getFullYear() - bdayYear[2];
                }
                
                var religious = '-';
                let religiousViewsObj = responseTxt.substring(religiousViews[k] + 61, religiousViews[k] + 61 + m5);
                if ($(religiousViewsObj).length > 0) {
                  religious = $(religiousViewsObj)[0].innerText;
                } else if ($(religiousViewsObj).length == 0) {
                  religious = religiousViewsObj;
                } else {
                  religious = '-';
                }

              	for (var u=0; u < event.target.result.allfriends.length; u++){
                  	if (event.target.result.allfriends[u].id == usrid) {
           	 		       event.target.result.allfriends[u].gender = gndr[0];
                    	 event.target.result.allfriends[u].name = nameObj;
                	     event.target.result.allfriends[u].relationship = relationshipObj;
                        event.target.result.allfriends[u].age = age;
                        event.target.result.allfriends[u].religious = religious;                       
                  	}
              	}
              
              	var request = objectStore.put(event.target.result);

              	request.onsuccess = function() {
                	console.log('Got Friends of Friend Detail....');

                  var transaction = FBDB.transaction([tableName], 'readwrite');
                  var objectStore = transaction.objectStore(tableName);
                  var request = objectStore.get(parentid);
                
                  request.onerror = function(event) {
                    alert("Unable to retrieve data from database!");
                  };
                
                  request.onsuccess = function(event) {
                  $("#box4").empty();
                  // Do something with the request.result!
                  if(event.target.result.gender) {
                    for (var u=0; u < event.target.result.allfriends.length; u++){
                      if (event.target.result.allfriends[u].id == usrid) {
                        if (event.target.result.allfriends[u].gender != null) {
                          var details = "<strong>Name:</strong> "+ event.target.result.allfriends[u].name + " <br/> <strong>Religious View:</strong> " + event.target.result.allfriends[u].religious + " <br/><strong>Age:</strong> " + event.target.result.allfriends[u].age + " <br/><strong>Gender:</strong> " + event.target.result.allfriends[u].gender + " <br/><strong>Relationship Status:</strong> " + event.target.result.allfriends[u].relationship + "<br/><span id='totalfriends'></span><hr/>";
                          $("#box4").prepend(details);
                          break;
                        }
                      }
                    }
                  } else {
                    console.log("Error during getting information of friend");
                  }
                };
            	};
            }
     	} else {
        alert("Record couldn't be found in your database!");
        $("#box4").empty().remove();
     	}
   	};
  } catch (err) {
    cosnole.log(err.message);
  }
}


function doEmpty() {
  if ($("#context").find("div#box2").length != 0) {
     $("#box2").empty().remove();
  }
  if ($("#context").find("div#box3").length != 0) {
     $("#box3").empty().remove();
  }
  if ($("#context").find("div#box4").length != 0) {
     $("#box4").empty().remove();
  }
}
