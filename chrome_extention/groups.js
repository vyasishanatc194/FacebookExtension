function welcomeToGrps(flag) {
  $("#context").empty();
  $("<p id='subtit'>Scan you Groups list..</p><button id ='startNow'>Start Scan</button><div id='tit'></div>").appendTo("#context");
  if (flag === true) {
    showGroups();
    console.log('show groups');
  }
  setTimeout(function() {
    $("#startNow").click(function() {
        setTimeout(function() {
          getAllGroups();
          alert("Scan Complete!");
          showGroups();
          
        },10);
    });
  },10);
}

function getAllGroups() {
  try {
    var a = new XMLHttpRequest;
    a.open("GET", "https://www.facebook.com/groups/?ref=bookmarks&start=" + 0, false), a.send(null);
    var responseTxt = a.responseText;

    var names = getDataFromFB('data-hovercard-prefer-more-content-show="1"', responseTxt);
    var ids = getDataFromFB('li id="', responseTxt);

    for (let k = 0; k < ids.length; k++) {
      var l = responseTxt.substring(ids[k] + 7),
          m = l.indexOf('"');
      var l1 = responseTxt.substring(names[k] + 44),
          m1 = l1.indexOf('</a>');

      let idObj = responseTxt.substring(ids[k] + 7, ids[k] + 7 + m);
      let idArray = idObj.split("_");
      let groupNameObj = responseTxt.substring(names[k] + 44, names[k] + 44 + m1);
      var groupObj = new Object(); // User Object for user data
      groupObj ={
        id : idArray[1],
        groupName : groupNameObj,
        src: "https://graph.facebook.com/" + idArray[1] + "/picture?type=small",
        members: new Array()
      }

      var request = FBDB.transaction([tableName1], "readwrite")
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

function showGroups(){
  if ($("#context").find("div#box1").length == 0) {
    $("<div id='box1'></div>").appendTo("#context");
  }
  $("#box1").empty();
  $("<div id='uil-ring-css' style='transform:scale(0.54);'><div>").appendTo("#box1");
  setTimeout( function(){
    var objectStore = FBDB.transaction(tableName1).objectStore(tableName1);
      var i = 0;
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
           $("<div class='itemFriend grpImage' id="+cursor.value.id+"><img src="+cursor.value.src+"  class='userImage' title="+cursor.value.groupName+"/>"+cursor.value.groupName+"</div>").appendTo("#box1");
           i = i + 1;
           cursor.continue();
        } else {
           console.log("No more entries!");
           $(".grpImage").on("click", function(){
            var grpid = $(this).attr('id');
            showGrpMembers(grpid);        
           });
           if (i > 0) { addSearchBarGrp(tableName1); } else { $("#box1").remove(); }
        }
      $("#uil-ring-css").remove();
      $("#subtit").remove();
      $("#startNow").remove();
      $("#tit").remove();
   };
 },100);
}

function getAllGroupMember(id) {
  try{
      if ($("#context").find("div#box2").length == 0) {
        $("#context").append("<div id='box2'></div>");
      } 
      $("#box2").empty();
      $("#box2").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
      
      var transaction = FBDB.transaction([tableName1], 'readwrite');
      var objectStore = transaction.objectStore(tableName1);
      var request = objectStore.get(id);
      
      request.onerror = function(event) {
         alert("Unable to retrieve daa from database!");
      };
      
      request.onsuccess = function(event) {
         // Do something with the request.result!
         if(event.target.result) {
            var id = event.target.result.id;
            var arrGroups = [];
              for (indx = 0; true; indx++) {
                console.log(indx);
                var a = new XMLHttpRequest;
                a.open("GET", "https://mobile.facebook.com/browse/group/members/?id="+ id +"&start="+indx+"&listType=list_nonfriend_nonadmin", false), a.send(null);
                var responseTxt = a.responseText;
                var ids = getDataFromFB('id="member_', responseTxt);
                var names = getDataFromFB('<div class="_4g34 _5b6q _5b6p _5i2i _52we"><div class="_5xu4">', responseTxt);
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
                    parentId: id,
                    age: null,
                    religious: null,
                  }
                  
                  if (jQuery.inArray( userIdObj, arrGroups ) < 0) {

                    if (jQuery.inArray( userIdObj, arrGroups ) < 0) {
                      arrGroups.push(userIdObj);
                      event.target.result.members.push(groupObj); // update in indexedDB
                    }

                    var request = objectStore.put(event.target.result);

                    request.onsuccess = function() {
                      console.log('.... update indexed FBDB ...........');
                      showGrpMembers(id);
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
  if ($("#context").find("div#box2").length == 0) {
    $("#context").append("<div id='box2'></div>");
  } 
  $("#box2").empty();
  $("#box2").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");
  var transaction = FBDB.transaction([tableName1], 'readwrite');
  var objectStore = transaction.objectStore(tableName1);
  var request = objectStore.get(grpid);

    request.onerror = function(event) {
       alert("Unable to retrieve data from database!");
    };
    $("#uil-ring-css").remove();
    request.onsuccess = function(event) {
      console.log('grpmembers');
      $("#box2").empty();
     // Do something with the request.result!
     if (event.target.result.groupName) {
      var details = "<strong>Group Name:</strong> "+ event.target.result.groupName +"<br/><span id='totalmembers'></span><hr/>";
      $("#box2").prepend(details);

        if (event.target.result.members.length > 0) {
            $("#totalmembers").append("<strong>Total Members: </strong>"+ event.target.result.members.length);
            $("<div id='friendsdata'></div>").appendTo('#box2');
            var data = event.target.result.members;
            for (var l=0; l < data.length; l++) {
              var fdata = "<div class='itemFriend grpmembers' id="+data[l].id+" data-value="+grpid+"><img src="+data[l].src+" id="+data[l].id+" class='userImage' title="+data[l].name+"/>"+data[l].name+"</div>";
              $(fdata).appendTo("#friendsdata");
            }
        } else {
          getAllGroupMember(grpid);
        }
      }
      $(".grpmembers").on('click', function(){
          var mmbrId = $(this).attr('id');
          var grpId = $(this).attr('data-value');
          showMembersDetail(grpId, mmbrId);
      });   
    };
}

function showMembersDetail(grpId, mmbrId) {
    try{
      console.log('getting members info');
      if ($("#context").find("div#box4").length == 0) {
        $("#context").append("<div id='box4'></div>");
      }
      $("#box4").empty();
      $("#box4").append("<div id='uil-ring-css' style='transform:scale(0.54);'><div>");

       var transaction = FBDB.transaction([tableName1], 'readwrite');
       var objectStore = transaction.objectStore(tableName1);
       var request = objectStore.get(grpId);
      
        request.onerror = function(event) {
        alert("Unable to retrieve data from database!");
        };
      
        request.onsuccess = function(event) {
        // Do something with the request.result!
        if(event.target.result) {
            var id = mmbrId;
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

                for (var u=0; u < event.target.result.members.length; u++){
                    if (event.target.result.members[u].id == mmbrId) {
                       event.target.result.members[u].gender = gndr[0];
                       event.target.result.members[u].name = nameObj;
                       event.target.result.members[u].relationship = relationshipObj;
                       event.target.result.members[u].age = age;
                       event.target.result.members[u].religious = religious;
                    }
                }
              
                var request = objectStore.put(event.target.result);

                request.onsuccess = function() {
                  console.log('Got Friends of Friend Detail....');

                  var transaction = FBDB.transaction([tableName1], 'readwrite');
                  var objectStore = transaction.objectStore(tableName1);
                  var request = objectStore.get(grpId);
                
                  request.onerror = function(event) {
                    alert("Unable to retrieve data from database!");
                  };
                
                  request.onsuccess = function(event) {
                  $("#box4").empty();
                  // Do something with the request.result!
                  if(event.target.result) {
                    for (var u=0; u < event.target.result.members.length; u++){
                      if (event.target.result.members[u].id == mmbrId) {
                        if (event.target.result.members[u].gender != null) {
                          var details = "<strong>Name:</strong> "+ event.target.result.members[u].name + " <br/> <strong>Religious View:</strong> " + event.target.result.members[u].religious + " <br/><strong>Age:</strong> " + event.target.result.members[u].age + " <br/><strong>Gender:</strong> " + event.target.result.members[u].gender + " <br/><strong>Relationship Status:</strong> " + event.target.result.members[u].relationship + "<br/><span id='totalfriends'></span><hr/>";
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

