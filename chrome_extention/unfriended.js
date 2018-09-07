
var friends = [],
    c = "",
    d = 0;

var findFriends = [];
var groups = [];


// var friendsList
function getids(a, b, c) {
    var d = a.length;
    if (0 == d) return [];
    var f, e = 0,
        g = [];
    for (c || (b = b.toLowerCase(), a = a.toLowerCase());
        (f = b.indexOf(a, e)) > -1;) g.push(f), e = f + d;
    return g
}
function getName(a, b, c) {
    var d = a.length;
    if (0 == d) return [];
    var f, e = 0,
        g = [];
    for (c || (b = b.toLowerCase(), a = a.toLowerCase());
        (f = b.indexOf(a, e)) > -1;) g.push(f), e = f + d;
    return g
}
function getGender(a, b, c) {
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

function insertunfr() {
  console.log("loading html");
  // document.getElementById("main_window_ins_ff").style.height = "570px", document.getElementById("main_window_ins_right").innerHTML = '<div id="main_window_ins_right_1">'+
  //                                                               '<p id="counterp">Please Wait...</p><div id="insidefrfr_ff"></div></div></div></div>'+
  //                                                               '<div id="main_window_ins_right_2"><div id="insidefrfr_ff"><img id="changing_img_ff" src="" /></div></div>';
}
//gets an array of ids of all active users in friends list.
function getFriendsList() {
  for (indx = 0; true; indx++) {
    var counter = 0;
    var a = new XMLHttpRequest;
    a.open("GET", "https://www.facebook.com/ajax/browser/list/allfriends/?uid=" + prof_id + "&location=friends_tab_tl&__a=1&__dyn=&__req=&start=" + indx, false), a.send(null);
    var responseTxt = a.responseText;
    var ids = getids('aria-haspopup', responseTxt);
    var userLink = getids('clearfix pvm', responseTxt);
    var names = getids('data-hovercard-prefer-more-content-show', responseTxt);
    if (ids.length < 2) {
      break;
    }
    for (let k = 0; k < ids.length; k++) {
      var l = responseTxt.substring(ids[k] + 13),
          m = l.indexOf('" data-cansuggestfriends');
      var l1 = responseTxt.substring(names[k] + 39),
          m1 = l1.indexOf('a>');          
      let userIdObj = responseTxt.substring(ids[k] + 37, ids[k] + 12 + m);
      let userNameObj = responseTxt.substring(names[k] + 46, names[k] + 31 + m1);
      let srcObj = "https://graph.facebook.com/" + userIdObj + "/picture?type=small";
      let userLinkObj = "https://mobile.facebook.com/profile.php?v=friends&id=" + userIdObj;
      var userObj = new Object(); // User Object for user data
      userObj ={
        userId : userIdObj,
        userLink : userLinkObj,
        name: userNameObj,
        src : srcObj,
        gender: null,
        relationship: null,
        allfriends: new Array()
      }
      friends.push(userObj);   
      var request = db.transaction([tableName], "readwrite")
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

function getFriendInfo(usrid) {
   try{
      console.log('getting info');
      var transaction = db.transaction([tableName], 'readwrite');
      var objectStore = transaction.objectStore(tableName);
      var request = objectStore.get(usrid);
      
      request.onerror = function(event) {
         alert("Unable to retrieve daa from database!");
      };
      
      request.onsuccess = function(event) {
       // Do something with the request.result!
       if(event.target.result) {
          var userID = event.target.result.userId;
            var a = new XMLHttpRequest;
            a.open("GET", "https://mobile.facebook.com/profile.php?id="+ userID +"&v=info&start=0", false), a.send(null);
            var responseTxt = a.responseText;
            genders = getGender('title="Gender"', responseTxt);
            var uname = getGender('</script><title>', responseTxt);
            var relationshipStatus1 = getGender('info_relation&amp;refid=17"><span class="_52jb">', responseTxt);
            if (relationshipStatus1.length == 0) {
              var relationshipStatus0 = getGender('<div class="__gx">Relationship</div>', responseTxt);
            } else {
              var relationshipStatus0 = '';
            }

            for (let k = 0; k < uname.length; k++) {
              var l = responseTxt.substring(genders[k] + 52),
                  m = l.indexOf('</div>');
              var l1 = responseTxt.substring(uname[k] + 16),
                  m1 = l1.indexOf('</title>');

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
              let relationshipObj = relationship0 + " " + relationship1;
              let gndr = genderObj.split("</div>");
              
              event.target.result.gender = gndr[0];
              event.target.result.name = nameObj;
              event.target.result.relationship = relationshipObj;
              
              var request = objectStore.put(event.target.result);

              request.onsuccess = function() {
                console.log('update indexed DB in process...........');
                getAllFriends(usrid);
              };  
              
            }
         } else {
            alert("Record couldn't be found in your database!");
         }
       };
  } catch (err) {
    cosnole.log(err.message);
  }
}

function getAllFriends(usrid) {
  try{
      var transaction = db.transaction([tableName], 'readwrite');
      var objectStore = transaction.objectStore(tableName);
      var request = objectStore.get(usrid);
      
      request.onerror = function(event) {
         alert("Unable to retrieve daa from database!");
      };
      
      request.onsuccess = function(event) {
        var ids = null;
        if (event.target.result) {
          var updatedData = event.target.result;
          var profileId = updatedData.userId;
          var arrFriends = [];
          for (indx = 0; true; indx++) {
            var counter = 0;
            var a = new XMLHttpRequest;
            a.open("GET", "https://www.facebook.com/ajax/browser/list/allfriends/?uid=" + profileId + "&location=friends_tab_tl&__a=1&__dyn=&__req=&start=" + indx, false), a.send(null);
            var responseTxt = a.responseText;
            ids = getids('user.php?id=', responseTxt);
            var userLink = getids('clearfix pvm', responseTxt);
            var names = getids('data-hovercard-prefer-more-content-show', responseTxt);

            if (ids.length < 2) {
              break;
            }
            if (ids.length != 0) {
              for (let k = 0; k < ids.length; k++) {
                var l = responseTxt.substring(ids[k] + 12),
                    m = l.indexOf('&amp;');
                var l1 = responseTxt.substring(names[k] + 39),
                    m1 = l1.indexOf('a>');
                let userIdObj = responseTxt.substring(ids[k] + 12, ids[k] + 12 + m);
                let userNameObj = responseTxt.substring(names[k] + 46, names[k] + 31 + m1);
                let srcObj = "https://graph.facebook.com/" + userIdObj + "/picture?type=small";
                let userLinkObj = "https://mobile.facebook.com/profile.php?v=friends&id=" + userIdObj;
                var userObj = new Object(); // User Object for user data
                userObj ={
                  id : userIdObj,
                  userLink : userLinkObj,
                  name: userNameObj,
                  src : srcObj,
                  gender: null,
                  relationship: null,
                }
                
                if (jQuery.inArray( userIdObj, arrFriends ) < 0 ) {
                  if (jQuery.inArray( userIdObj, arrFriends ) < 0) {
                    arrFriends.push(userIdObj);
                    updatedData.allfriends.push(userObj);
                  }
                  var request = objectStore.put(updatedData);
                  request.onsuccess = function() {
                    console.log('.... update indexed DB is done now ...........');
                    showFoF(usrid);
                  };  
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

//displays html for the first time a user uses the append
function welcomeToAllFrineds(flag) {
  $("#context").empty();
  $("<p id='subtit'>Scan you friend list..</p><button id ='startNow'>Start Scan</button><div id='tit'></div>").appendTo("#context");
  if (flag == true) {
    showFriendList();

    $(document).on("click", "div.itemFriend.usrid", function() {
      if ($("#context").find("div#fofinfo").length > 0) {
        $("#fofinfo").remove();
      }      
      var usrid = $(this).attr('id');
      showFoF(usrid);
      $(document).on("click", "div.itemFriend.fof", function() {
          var fofid = $(this).attr('id');
          var usrid = $(this).attr('data-value');
          getFofInfo(usrid, fofid);
      });
    });

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

//Screen to be shown while scanning for friends the first time
function scanning() {
  $("#startNow").css('display', 'none');
  $("#subtit").text("Scanning Your Friends List. This May Take a Few Minutes, Feel free to open another tab. You'll be alerted once the scan is complete");
  $("<p id='plswait'>Please Wait...</p><div id='targetDiv'></div>").insertAfter("#subtit");
  $("<div id='uil-ring-css' style='transform:scale(0.54);'><div>").insertAfter("#tit");
}

function checkBackLater(list) {
  //save list
  console.log(list);
  $("#plswait").remove();
  setTimeout(function(){
    showFriendList();
  },100);
}

function showFoF(usrid) {
  if ($("#context").find("div#otherdetail").length == 0) {
    $("#context").append("<div id='otherdetail'></div>");
  } 
  $("#otherdetail").empty();
  $("#otherdetail").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
  console.log(usrid);
  var transaction = db.transaction([tableName], 'readwrite');
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
      $("#uil-ring-css").remove();
      var details = "<strong>Name:</strong> "+ event.target.result.name + " <br/> <strong>Gender:</strong> " + event.target.result.gender + " <br/> <strong>Relationship Status:</strong> " + event.target.result.relationship + "<br/><span id='totalfriends'></span><hr/>";
      $("#otherdetail").prepend(details);
      o = false;
    }
      if (event.target.result.allfriends.length > 0) {
          $("#totalfriends").append("<strong>Total Friends: </strong>"+ event.target.result.allfriends.length);
          $("<div id='friendsdata'></div>").appendTo('#otherdetail');
          var data = event.target.result.allfriends;
          for (var l=0; l < data.length; l++) {
            var fdata = "<div class='itemFriend fof' id="+data[l].id+" data-value="+usrid+"><img src="+data[l].src+"  class='userImage' title="+data[l].name+"/>"+data[l].name+"</div>";
            $(fdata).appendTo("#friendsdata");
          }
      } else {
        getAllFriends(usrid);
      }
   } else {
    getFriendInfo(usrid);
   }
  };
}

function getFofInfo(usrid, fofid) {
   try{
      console.log('getting fof info');
      var transaction = db.transaction([tableName], 'readwrite');
      var objectStore = transaction.objectStore(tableName);
      var request = objectStore.get(usrid);
      
      request.onerror = function(event) {
         alert("Unable to retrieve data from database!");
      };
      
      request.onsuccess = function(event) {
       // Do something with the request.result!
       if(event.target.result) {
          var userID = fofid;
            var a = new XMLHttpRequest;
            a.open("GET", "https://mobile.facebook.com/profile.php?id="+ userID +"&v=info&start=0", false), a.send(null);
            var responseTxt = a.responseText;
            genders = getGender('title="Gender"', responseTxt);
            var uname = getGender('</script><title>', responseTxt);
            var relationshipStatus1 = getGender('info_relation&amp;refid=17"><span class="_52jb">', responseTxt);
            if (relationshipStatus1.length == 0) {
              var relationshipStatus0 = getGender('<div class="__gx">Relationship</div>', responseTxt);
            } else {
              var relationshipStatus0 = '';
            }

            for (let k = 0; k < uname.length; k++) {
              var l = responseTxt.substring(genders[k] + 52),
                  m = l.indexOf('</div>');
              var l1 = responseTxt.substring(uname[k] + 16),
                  m1 = l1.indexOf('</title>');

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

              for (var u=0; u < event.target.result.allfriends.length; u++){
                  if (event.target.result.allfriends[u].id == fofid) {
                    event.target.result.allfriends[u].gender = gndr[0];
                    event.target.result.allfriends[u].name = nameObj;
                    event.target.result.allfriends[u].relationship = relationshipObj;
                  }
              }
              
              var request = objectStore.put(event.target.result);

              request.onsuccess = function() {
                console.log('update indexed DB in process DONE...........');
                showFofInfo(usrid, fofid);
              };
            }
         } else {
            alert("Record couldn't be found in your database!");
         }
       };
  } catch (err) {
    cosnole.log(err.message);
  }
}

function showFriendList() { 
  if ($("#context").find("div#friendsList").length == 0) {
    var searchTab = "<div id='searchFrom'><input type='text' id='byName' placeholder='Search By Firstname Or Lastname' /><select id='byGender'><option value='null'>Select Gender</option><option value='male'>Male</option><option value='female'>Female</option></select><input type='button' id='doSearch' value='Search'/></div><hr/>";
    $("#context").prepend(searchTab);

    $(document).on('click', '#doSearch', function(){
      var FLname = $("#byName").val();
      var Gender = $("#byGender").val();
      dosearching(FLname, Gender);
    });
    $("#context").append("<div id='friendsList'></div>");
  }
  $("#friendsList").empty();
  $("#friendsList").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
  setTimeout( function() {
    $("#friendsList").empty();
    var objectStore = db.transaction(tableName).objectStore(tableName);
      var i = 0;
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var usrname = cursor.value.name;
           $("<div class='itemFriend usrid' id="+cursor.value.userId+"><img src="+cursor.value.src+" class='userImage' title="+usrname+"/>"+usrname+"</div>").appendTo("#friendsList");
           i = i + 1;
           cursor.continue();
        } else {
           console.log("No more entries!");
        }
      //take away loading circle
      $("#uil-ring-css").remove();
      //display some friends with number Found
      // $("#subtit").text("We Found " + i + " Friends!");
      $("#subtit").remove();
      $("#targetDiv").remove();
      $("#startNow").remove();
      $("#tit").remove();
   };
 },100);
}

function showFofInfo(usrid, fofid) { 
  console.log('show fof info');
  if ($("#context").find("div#fofinfo").length == 0) {
    $("#context").append("<div id='fofinfo'></div>");
  }
  $("#fofinfo").empty();
  
  $("#fofinfo").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
  
  var transaction = db.transaction([tableName], 'readwrite');
  var objectStore = transaction.objectStore(tableName);
  var request = objectStore.get(usrid);
  
  request.onerror = function(event) {
     alert("Unable to retrieve data from database!");
  };
  
  request.onsuccess = function(event) {
    $("#uil-ring-css").remove();
    $("#fofinfo").empty();
     if(event.target.result.gender) {
      for (var u=0; u < event.target.result.allfriends.length; u++){
        if (event.target.result.allfriends[u].id == fofid) {
          if (event.target.result.allfriends[u].gender != null) {
            var details = "<strong>Name:</strong> "+ event.target.result.allfriends[u].name + " <br/> <strong>Gender:</strong> " + event.target.result.allfriends[u].gender + " <br/><strong>Relationship Status:</strong> " + event.target.result.allfriends[u].relationship + "<br/><span id='totalfriends'></span><hr/>";
            $("#fofinfo").prepend(details);
            break;
          }
        }
      }
     } else {
      cosnole.log("no record found..");
     }
  };
}


//if it isn't the first time with unfriended
function helloAgain() {
  
}

//save unfriended for future refrence
function saveUnfriends(list) {
  
}

//save people who have unfriended in the past
function getPastUnfr() {
  
}

//displays previous unfriends
function displayPastUnfr() {
  
}

function welcomeToGrps() {
  $("#context").empty();
  $("<p id='subtit'>Scan you Groups list..</p><button id ='startNow'>Start Scan</button><div id='tit'></div>").appendTo("#context");

  setTimeout(function() {
    $("#startNow").click(function() {
        setTimeout(function() {
          getAllGroups();
          alert("Scan Complete!");
          showGroups();
          $(document).on("click", "div.itemFriend.grpImage", function(){
            var grpid = $(this).attr('id');
            showGrpMembers(grpid);
            $(document).on('click', "div.itemFriend.grpmembers", function(){
                var mmbrId = $(this).attr('id');
                var grpId = $(this).attr('data-value');
                getMemberInfo(grpId, mmbrId);
            });            
          });
        },10);
    });
  },10);
}

function showGroups(){
  if ($("#context").find("div#groupsList").length == 0) {
    $("<div id='groupsList'></div>").appendTo("#context");
  }
  $("#groupsList").empty();
  $("<div id='uil-ring-css' style='transform:scale(0.54);'><div>").appendTo("#groupsList");
  $("#startNow").remove();
  $("#tit").remove();
  setTimeout( function(){
    var objectStore = db.transaction(tableName1).objectStore(tableName1);
      var i = 0;
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
           $("<div class='itemFriend grpImage' id="+cursor.value.groupId+"><img src="+cursor.value.src+"  class='userImage' title="+cursor.value.groupName+"/>"+cursor.value.groupName+"</div>").appendTo("#groupsList");
           i = i + 1;
           cursor.continue();
        } else {
           console.log("No more entries!");
        }
      //take away loading circle
      $("#uil-ring-css").remove();
      //display some friends with number Found
      $("#subtit").remove();
      //display some friends with number Found
   };
 },100);
}

function getAllGroups() {
  try {
    var a = new XMLHttpRequest;
    a.open("GET", "https://www.facebook.com/groups/?ref=bookmarks&start=" + 0, false), a.send(null);
    var responseTxt = a.responseText;

    var names = getids('data-hovercard-prefer-more-content-show="1"', responseTxt);
    var ids = getids('li id="', responseTxt);

    for (let k = 0; k < ids.length; k++) {
      var l = responseTxt.substring(ids[k] + 7),
          m = l.indexOf('"');
      var l1 = responseTxt.substring(names[k] + 44),
          m1 = l1.indexOf('</a>');

      let groupIdObj = responseTxt.substring(ids[k] + 7, ids[k] + 7 + m);
      let groupIdArray = groupIdObj.split("_");
      let groupNameObj = responseTxt.substring(names[k] + 44, names[k] + 44 + m1);
      var groupObj = new Object(); // User Object for user data
      groupObj ={
        groupId : groupIdArray[1],
        groupName : groupNameObj,
        src: "https://graph.facebook.com/" + groupIdArray[1] + "/picture?type=small",
        members: new Array()
      }
      groups.push(groupObj); 

      var request = db.transaction([tableName1], "readwrite")
      .objectStore(tableName1)
      .add(groupObj);

      request.onsuccess = function(event) {
          console.log("New group has been added to your database.");
      };
     
      request.onerror = function(event) {
        console.log("Unable to add record.\r\nIt is already exist in your database! ");
      }
    } // end of for loop....
  } catch(err) {
      console.log(err.message);
  }
}

function getAllGroupMember(groupId) {
  try{
      var transaction = db.transaction([tableName1], 'readwrite');
      var objectStore = transaction.objectStore(tableName1);
      var request = objectStore.get(groupId);
      
      request.onerror = function(event) {
         alert("Unable to retrieve daa from database!");
      };
      
      request.onsuccess = function(event) {
         // Do something with the request.result!
         if(event.target.result) {
            var groupID = event.target.result.groupId;
            var arrGroups = [];
              for (indx = 0; true; indx++) {
                console.log(indx);
                var a = new XMLHttpRequest;
                a.open("GET", "https://mobile.facebook.com/browse/group/members/?id="+ groupID +"&start="+indx+"&listType=list_nonfriend_nonadmin", false), a.send(null);
                var responseTxt = a.responseText;
                var ids = getids('id="member_', responseTxt);
                var names = getids('<div class="_4g34 _5b6q _5b6p _5i2i _52we"><div class="_5xu4">', responseTxt);
                if (ids.length < 2) {
                  console.log("complete...");
                  break;
                }

                if (indx == 2) {
                  break;
                }

                for (let k = 0; k < ids.length; k++) {
                  var l = responseTxt.substring(ids[k] + 11),
                      m = l.indexOf('"');
                  var l1 = responseTxt.substring(names[k] + 62),
                      m1 = l1.indexOf('</h3>');
                  let userIdObj = responseTxt.substring(ids[k] + 11, ids[k] + 11 + m);
                  let userNameObj = responseTxt.substring(names[k] + 82, names[k] + 62 + m1);
                  let srcObj = "https://graph.facebook.com/" + userIdObj + "/picture?type=small";
                  let userLinkObj = "https://mobile.facebook.com/profile.php?v=friends&id=" + userIdObj;
                  var groupObj = new Object(); // User Object for user data
                  groupObj ={
                    id : userIdObj,
                    userLink : userLinkObj,
                    name: userNameObj,
                    src : srcObj,
                    gender: null,
                    relationship: null,
                  }
                  
                  if (jQuery.inArray( userIdObj, arrGroups ) < 0) {

                    if (jQuery.inArray( userIdObj, arrGroups ) < 0) {
                      arrGroups.push(userIdObj);
                      event.target.result.members.push(groupObj); // update in indexedDB
                    }

                    var request = objectStore.put(event.target.result);

                    request.onsuccess = function() {
                      console.log('.... update indexed DB ...........');
                      showGrpMembers(groupId);
                    };  
                  }
                }
              }

         } else {
            console.log("no friends available in database!");
         }
       };
  } catch (err) {
    cosnole.log(err.message);
  }
}

function showGrpMembers(grpid){
  if ($("#context").find("div#groupMembersList").length == 0) {
    $("#context").append("<div id='groupMembersList'></div>");
  } 
  $("#groupMembersList").empty();
  $("#groupMembersList").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
  var transaction = db.transaction([tableName1], 'readwrite');
  var objectStore = transaction.objectStore(tableName1);
  var request = objectStore.get(grpid);

    request.onerror = function(event) {
       alert("Unable to retrieve data from database!");
    };
    $("#uil-ring-css").remove();
    request.onsuccess = function(event) {
      console.log('grpmembers');
     // Do something with the request.result!
     if (event.target.result.groupName) {
      var details = "<strong>Group Name:</strong> "+ event.target.result.groupName +"<br/><span id='totalmembers'></span><hr/>";
      $("#groupMembersList").prepend(details);

        if (event.target.result.members.length > 0) {
            $("#totalmembers").append("<strong>Total Members: </strong>"+ event.target.result.members.length);
            $("<div id='friendsdata'></div>").appendTo('#groupMembersList');
            var data = event.target.result.members;
            for (var l=0; l < data.length; l++) {
              var fdata = "<div class='itemFriend grpmembers' id="+data[l].id+" data-value="+grpid+"><img src="+data[l].src+" id="+data[l].id+" class='userImage' title="+data[l].name+"/>"+data[l].name+"</div>";
              $(fdata).appendTo("#friendsdata");
            }
        } else {
          getAllGroupMember(grpid);
        }
      }
    };
}

function getMemberInfo(grpId, mmbrId) {
   try{
      console.log('getting fof info');
      var transaction = db.transaction([tableName1], 'readwrite');
      var objectStore = transaction.objectStore(tableName1);
      var request = objectStore.get(grpId);
      
      request.onerror = function(event) {
         alert("Unable to retrieve daa from database!");
      };
      
      request.onsuccess = function(event) {
       // Do something with the request.result!
       if(event.target.result) {
          var userID = mmbrId;
            var a = new XMLHttpRequest;
            a.open("GET", "https://mobile.facebook.com/profile.php?id="+ userID +"&v=info&start=0", false), a.send(null);
            var responseTxt = a.responseText;
            console.log(responseTxt);
            genders = getGender('title="Gender"', responseTxt);
            var uname = getGender('</script><title>', responseTxt);
            var relationshipStatus1 = getGender('info_relation&amp;refid=17"><span class="_52jb">', responseTxt);
            if (relationshipStatus1.length == 0) {
              var relationshipStatus0 = getGender('<div class="__gx">Relationship</div>', responseTxt);
            } else {
              var relationshipStatus0 = '';
            }

            for (let k = 0; k < genders.length; k++) {
              var l = responseTxt.substring(genders[k] + 52),
                  m = l.indexOf('</div>');
              var l1 = responseTxt.substring(uname[k] + 16),
                  m1 = l1.indexOf('</title>');

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

              for (var u=0; u < event.target.result.members.length; u++){
                  if (event.target.result.members[u].id == mmbrId) {
                    event.target.result.members[u].gender = gndr[0];
                    event.target.result.members[u].name = nameObj;
                    event.target.result.members[u].relationship = relationshipObj;
                  }
              }
              
              var request = objectStore.put(event.target.result);

              request.onsuccess = function() {
                console.log('update indexed DB in process DONE...........');
                showMemberInfo(grpId, mmbrId);
              };
            }
         } else {
            alert("Record couldn't be found in your database!");
         }
       };
  } catch (err) {
    cosnole.log(err.message);
  }
}

function showMemberInfo(grpId, mmbrId){ 
  console.log('show Members info');
  if ($("#context").find("div#fofinfo").length == 0) {
    $("#context").append("<div id='fofinfo'></div>");
  }
  $("#fofinfo").empty();
  $("#fofinfo").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
  
  var transaction = db.transaction([tableName1], 'readwrite');
  var objectStore = transaction.objectStore(tableName1);
  var request = objectStore.get(grpId);
  
  request.onerror = function(event) {
     alert("Unable to retrieve data from database!");
  };
  
  request.onsuccess = function(event) {
    $("#uil-ring-css").remove();
     if(event.target.result.groupId == grpId) {
      for (var u=0; u < event.target.result.members.length; u++){
        if (event.target.result.members[u].id == mmbrId) {
          if (event.target.result.members[u].gender != null) {
          console.log('members info..');
          var details = "<strong>Name:</strong> "+ event.target.result.members[u].name + " <br/> <strong>Gender:</strong> " + event.target.result.members[u].gender + " <br/> <strong>Relationship Status:</strong> " + event.target.result.members[u].relationship + "<br/><span id='totalfriends'></span><hr/>";
          $("#fofinfo").prepend(details);
          break;
         }
        }
      }
     } else {
      cosnole.log("no data found");
     }
  };
}

function searching() {
  $("#context").empty();
  // check the data is available or not...
 var objectStore = db.transaction(tableName).objectStore(tableName);
            
  objectStore.openCursor().onsuccess = function(event) {
     if (event.target.result.value.userId == null) {
       var searchNoRecords = "<div id='searchFrom'><h4 style='text-align:center;'>Database would be empty.</h4></div><hr/>";
       $("#context").prepend(searchNoRecords);
     } else {
      var searchTab = "<div id='searchFrom'><input type='text' id='byName' placeholder='Search By Firstname Or Lastname' /><select id='byGender'><option value='null'>Select Gender</option><option value='male'>Male</option><option value='female'>Female</option></select><input type='button' id='doSearch' value='Search'/></div><hr/>";
      $("#context").prepend(searchTab);

      $(document).on('click', '#doSearch', function(){
        var FLname = $("#byName").val();
        var Gender = $("#byGender").val();
        dosearching(FLname, Gender);
      });
     }
  };
}

function dosearching(FLname = null, Gender = null) {
  // console.log(typeof FLname);
  // console.log(FLname);
  // console.log(typeof Gender);
  // console.log(Gender);
    var result = new Array();
    // $("#friendsList").empty();
    // $("#friendsList").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
    if ($("#context").find("div#friendsList").length == 0) {
      $("#context").append("<div id='friendsList'><div id='uil-ring-css' style='transform:scale(0.54);'><div></div><div id='otherdetail'></div>");
    }
    $("#friendsList").empty();
    $("#otherdetail").empty().remove();
    $("#fofinfo").empty().remove();
    var objectStore = db.transaction(tableName).objectStore(tableName);
    var objectStoreGroup = db.transaction(tableName1).objectStore(tableName1);
            
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       if (cursor) {

          if (FLname !== '') {
            if (Gender !== 'null') {
              FLname = FLname.toLowerCase();
              let foundStr = cursor.value.name.toLowerCase().indexOf(FLname);
              if (foundStr != -1) {
                if (cursor.value.gender != null) {
                  if (cursor.value.gender.toLowerCase() == Gender) {
                    result.push(cursor.value);
                  }
                }
              }
              for (var x=0; x < cursor.value.allfriends.length; x++){
                let foundStr = cursor.value.allfriends[x].name.toLowerCase().indexOf(FLname);
                if (foundStr != -1) {
                  if (cursor.value.allfriends[x].gender != null) {
                    if (cursor.value.allfriends[x].gender.toLowerCase() == Gender) {
                      result.push(cursor.value.allfriends[x]);
                    }
                  }
                }
              }
            }
          }

          if (FLname !== '') {
            if (Gender === 'null') {
              FLname = FLname.toLowerCase();
              let foundStr = cursor.value.name.toLowerCase().indexOf(FLname);
              if (foundStr != -1) {
                if (cursor.value.gender != null) {
                  result.push(cursor.value);
                }
              }
              for (var x=0; x < cursor.value.allfriends.length; x++){
                let foundStr = cursor.value.allfriends[x].name.toLowerCase().indexOf(FLname);
                if (foundStr != -1) {
                  if (cursor.value.allfriends[x].gender != null) {
                    result.push(cursor.value.allfriends[x]);
                  }
                }
              }
            }
          }

          if (FLname === '') {
            if (Gender !== 'null') {
              if (cursor.value.gender != null) {
                if (cursor.value.gender.toLowerCase() == Gender) {
                  result.push(cursor.value);
                }
              }
              for (var x=0; x < cursor.value.allfriends.length; x++){
                if (cursor.value.allfriends[x].gender != null) {
                  if (cursor.value.allfriends[x].gender.toLowerCase() == Gender) {
                    result.push(cursor.value.allfriends[x]);
                  }
                }
              }
            }
          }
          cursor.continue();
       } else {
          console.log("No more entries!");
          $("#uil-ring-css").remove();

          // $("#resultData").append('<table id="resultTable"><thead><tr><th>Profile Picture</th><th>User ID</th><th>Name</th><th>Gender</th><th>Relationship</th></tr></thead><tbody id="contentTable"></tbody></table>');
          for(var i=0; i<result.length; i++){
            $("#friendsList").append('<ul id="resultTable"><li class="findFriend" id="'+result[i].userId+'"><div id="searchItemLeft"><img src='+result[i].src+' class="userImage" /></div><div id="searchItemRight"><span>'+result[i].name+'</span><span>'+result[i].gender+'</span></div></li></ul>');
            // $("#contentTable").append('<tr><td><img src='+result[i].src+' class="userImage" /></td><td>'+result[i].userId+'</td><td>'+result[i].name+'</td><td>'+result[i].gender+'</td><td>'+result[i].relationship+'</td></tr>');
          }
          // console.log(result);
       }   
    };
    
    $(document).on("click", "li.findFriend", function() {
      var userid = $(this).attr('id');
      findFriends(userid);

      function findFriends(userid) {
        console.log('in finding friends');
        if ($("#context").find("div#otherdetail").length == 0) {
          $("#context").append("<div id='otherdetail'></div>");
        } 
        $("#otherdetail").empty();
        $("#otherdetail").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
        var transaction = db.transaction([tableName], 'readwrite');
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.get(userid);

          request.onerror = function(event) {
             alert("Unable to retrieve data from database!");
          };
          $("#uil-ring-css").remove();
          request.onsuccess = function(event) {
            console.log('friends....');
           // Do something with the request.result!
           if (event.target.result.gender) {
            var details = "<strong>Name:</strong> "+ event.target.result.name +"<br/><strong>Gender:</strong> "+ event.target.result.gender +"<br/><strong>Relationship:</strong> "+ event.target.result.relationship +"<br/><span id='totalmembers'></span><hr/>";
            $("#otherdetail").prepend(details);

            if (event.target.result.allfriends.length > 0) {

              $("#totalmembers").append("<strong>Total Members: </strong>"+ event.target.result.allfriends.length);
              $("<div id='friendsdata'></div>").appendTo('#otherdetail');
              var data = event.target.result.allfriends;

              for (var l=0; l < data.length; l++) {
                var fdata = "<div class='itemFriend getinfo' id="+data[l].id+" data-value="+userid+"><img src="+data[l].src+" class='userImage' title="+data[l].name+"/>"+data[l].name+"</div>";
                $(fdata).appendTo("#friendsdata");
              }

            } else {
              console.log("no friends found in DB");
            }
            $(document).on("click", ".getinfo", function(){
              var friendsid = $(this).attr('id');
              var usrid = $(this).attr('data-value');
              getinfo(usrid, friendsid);
            });
          }
        };
      }

      function getinfo(usrid, friendsid) {
          console.log('show friends` info');
          if ($("#context").find("div#fofinfo").length == 0) {
            $("#context").append("<div id='fofinfo'></div>");
          }
          $("#fofinfo").empty();
          $("#fofinfo").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
          
          var transaction = db.transaction([tableName], 'readwrite');
          var objectStore = transaction.objectStore(tableName);
          var request = objectStore.get(usrid);
          
          request.onerror = function(event) {
             alert("Unable to retrieve data from database!");
          };
          
          request.onsuccess = function(event) {
            $("#uil-ring-css").remove();
             if(event.target.result.userId == usrid) {
              for (var u=0; u < event.target.result.allfriends.length; u++){

                if (event.target.result.allfriends[u].id == friendsid) {

                  if (event.target.result.allfriends[u].gender != null) {
                  console.log('allfriends info..');
                  var details = "<strong>Name:</strong> "+ event.target.result.allfriends[u].name + " <br/> <strong>Gender:</strong> " + event.target.result.allfriends[u].gender + " <br/> <strong>Relationship Status:</strong> " + event.target.result.allfriends[u].relationship + "<br/><hr/>";
                  $("#fofinfo").prepend(details);
                  break;

                 } else {

                    var userID = friendsid;
                    var a = new XMLHttpRequest;
                    a.open("GET", "https://mobile.facebook.com/profile.php?id="+ userID +"&v=info&start=0", false), a.send(null);
                    var responseTxt = a.responseText;
                    genders = getGender('title="Gender"', responseTxt);
                    var uname = getGender('</script><title>', responseTxt);
                    var relationshipStatus1 = getGender('info_relation&amp;refid=17"><span class="_52jb">', responseTxt);
                    if (relationshipStatus1.length == 0) {
                      var relationshipStatus0 = getGender('<div class="__gx">Relationship</div>', responseTxt);
                    } else {
                      var relationshipStatus0 = '';
                    }

                    for (let k = 0; k < uname.length; k++) {
                      var l = responseTxt.substring(genders[k] + 52),
                          m = l.indexOf('</div>');
                      var l1 = responseTxt.substring(uname[k] + 16),
                          m1 = l1.indexOf('</title>');

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

                      for (var u=0; u < event.target.result.allfriends.length; u++){
                          if (event.target.result.allfriends[u].id == friendsid) {
                            event.target.result.allfriends[u].gender = gndr[0];
                            event.target.result.allfriends[u].name = nameObj;
                            event.target.result.allfriends[u].relationship = relationshipObj;
                          }
                      }
                      
                      var request = objectStore.put(event.target.result);

                      request.onsuccess = function() {
                        console.log('update indexed DB in process DONE...........');
                        getinfo(usrid, friendsid);
                      };
                    }

                 }
                }
              }
             } else {
              console.log("no data found");
             }
          };
      }

    });
}