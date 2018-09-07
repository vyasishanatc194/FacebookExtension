function dosearching(FLname = null, Gender = null, Age = null, Relationship =null, TableName = null) {
  console.log('searching in Friends..');
	var result = new Array();
	if ($("#context").find("div#box1").length == 0) {
      $("#context").append("<div id='box1'><div id='uil-ring-css' style='transform:scale(0.54);'><div></div><div id='box2'></div>");
    }
    $("#box1").empty();
    doEmpty();
    var objectStore = FBDB.transaction(TableName).objectStore(TableName);

    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       if (cursor) {

          if (FLname !== '') {
            FLname = FLname.toLowerCase();
            let foundStr = cursor.value.name.toLowerCase().indexOf(FLname);
            if (foundStr != -1) {
                result.push(cursor.value);
            }
            for (var x=0; x < cursor.value.allfriends.length; x++){
              let foundStr = cursor.value.allfriends[x].name.toLowerCase().indexOf(FLname);
              if (foundStr != -1) {
                result.push(cursor.value.allfriends[x]);
              }
            }
          }

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

          if (Age !== 'null') {
            if (cursor.value.age != null) {
              if (cursor.value.age == Age) {
                result.push(cursor.value);
              }
            }
            for (var x=0; x < cursor.value.allfriends.length; x++){
              if (cursor.value.allfriends[x].age != null) {
                if (cursor.value.allfriends[x].age == Age) {
                  result.push(cursor.value.allfriends[x]);
                }
              }
            }
          }

          if (Relationship !== '') {
            let foundStr = cursor.value.relationship.toLowerCase().indexOf(Relationship);
            if (foundStr != -1) {
                result.push(cursor.value);
            }
            for (var x=0; x < cursor.value.allfriends.length; x++){
              let foundStr = cursor.value.allfriends[x].relationship.toLowerCase().indexOf(Relationship);
              if (foundStr != -1) {
                result.push(cursor.value.allfriends[x]);
              }
            }
          }

          cursor.continue();
       } else {
      		console.log("No more entries!");

          var Fresult = finalSearch(result, FLname, Gender, Age, Relationship);

      		$("#box1").empty();

          if (Fresult.length > 0){
            var uniqueResult = {};
            Fresult.forEach(function(item){
              uniqueResult[item.id] = item;
            });

            $.each(uniqueResult, function (i, item) {
              $("<div class='itemFriend usrid' id="+item.id+" data-value="+item.parentId+"><img src="+item.src+" class='userImage' title="+item.name+"/>"+item.name+"</div>").appendTo("#box1");
            });
            
            $(".usrid").on("click", function() {
              var usrid = $(this).attr('id');
              var parentid = $(this).attr('data-value');
              showFrirendsDetail(usrid, parentid);
            });
          } else {
            $("#box1").append("<p>No records found</p>");
          }
       	}   
    };
}

function dosearchingInGrp(FLname = null, Gender = null, Age = null, Relationship =null, TableName = null) {
  console.log('searching in group..');
  var result = new Array();
  if ($("#context").find("div#box1").length == 0) {
      $("#context").append("<div id='box1'><div id='uil-ring-css' style='transform:scale(0.54);'><div></div><div id='box2'></div>");
    }
    $("#box1").empty();
    doEmpty();
    var objectStore = FBDB.transaction(TableName).objectStore(TableName);

    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       if (cursor) {

          var members = cursor.value.members;
          for (var i=0; i < members.length; i++) {

            if (FLname !== '') {
                FLname = FLname.toLowerCase();
                let foundStr = members[i].name.toLowerCase().indexOf(FLname);
                if (foundStr != -1) {
                    result.push(members[i]);
                }
            }

            if (Gender !== 'null') {
              if (members[i].gender != null) {
                if (members[i].gender.toLowerCase() == Gender) {
                  result.push(members[i]);
                }
              }
            }

            if (Age !== 'null') {
            if (members[i].age != null) {
                if (members[i].age == Age) {
                  result.push(members[i]);
                }
              }
            }

            if (Relationship !== '') {
              let foundStr = members[i].relationship.toLowerCase().indexOf(Relationship);
              if (foundStr != -1) {
                  result.push(members[i]);
              }
            }

          }

          
          cursor.continue();
       } else {
          console.log("No more entries!");

          var Fresult = finalSearch(result, FLname, Gender, Age, Relationship);

          $("#box1").empty();

         if (Fresult.length > 0){
            var uniqueResult = {};
            Fresult.forEach(function(item){
              uniqueResult[item.id] = item;
            });

            $.each(uniqueResult, function (i, item) {
              $("<div class='itemFriend usrid' id="+item.id+" data-value="+item.parentId+"><img src="+item.src+" class='userImage' title="+item.name+"/>"+item.name+"</div>").appendTo("#box1");
            });
            
            $(".usrid").on("click", function() {
              var usrid = $(this).attr('id');
              var parentid = $(this).attr('data-value');
              showFrirendsDetail(usrid, parentid);
            });
          } else {
            $("#box1").append("<p>No records found</p>");
          }   
        }   
    };
}

function finalSearch(result = null, FLname = null, Gender = null, Age = null, Relationship = null) {
  var finalResult = [];
  if (result.length > 0) {
     for (var i = 0; i < result.length ; i++) {

          if (FLname !== '' && Gender !== 'null' && Age !== 'null' && Relationship !== 'null') { // check for all
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (foundStr != -1 && result[i].gender != null && result[i].gender.toLowerCase() == Gender && result[i].age != null && result[i].age == Age && foundStr1 != -1) {
              finalResult.push(result[i]);
            }     
          }

          if (FLname !== '' && Gender !== 'null' && Age === 'null' && Relationship === 'null') { // check for name and gender
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            if (foundStr != -1 && result[i].gender != null && result[i].gender.toLowerCase() == Gender) {
              finalResult.push(result[i]);
            }  
          }

          if (FLname !== '' && Gender === 'null' && Age !== 'null' && Relationship === 'null') { // check for name and age
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            if (foundStr != -1 && result[i].age != null && result[i].age == Age) {
              finalResult.push(result[i]);
            }  
          }

          if (FLname !== '' && Gender === 'null' && Age === 'null' && Relationship !== 'null') { // check for name and relationship
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (foundStr != -1 && foundStr1 != -1) {
              finalResult.push(result[i]);
            }  
          }

          if (FLname === '' && Gender !== 'null' && Age !== 'null' && Relationship === 'null') { // check for gender and age
            if (result[i].gender != null && result[i].gender.toLowerCase() == Gender && result[i].age != null && result[i].age == Age) {
              finalResult.push(result[i]);
            }  
          }

          if (FLname === '' && Gender !== 'null' && Age === 'null' && Relationship !== 'null') { // check for gender and relationship
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (result[i].gender != null && result[i].gender.toLowerCase() == Gender && foundStr1 != -1) {
              finalResult.push(result[i]);
            }  
          }

          if (FLname === '' && Gender === 'null' && Age !== 'null' && Relationship !== 'null') { // check for gender and relationship
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (result[i].age != null && result[i].age == Age && foundStr1 != -1) {
              finalResult.push(result[i]);
            }  
          }

          if (FLname !== '' && Gender === 'null' && Age === 'null'  && Relationship === 'null') { // check only Name
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            if (foundStr != -1) {
              finalResult.push(result[i]);
            }  
          }
          if (FLname === '' && Gender !== 'null' && Age === 'null' && Relationship === 'null') { // check only gender
            if (result[i].gender != null && result[i].gender.toLowerCase() == Gender) {
              finalResult.push(result[i]);
            }  
          }
          if (FLname === '' && Gender === 'null' && Age !== 'null' && Relationship === 'null') { // check only age
            if (result[i].age != null && result[i].age == Age) {
              finalResult.push(result[i]);
            }  
          }
          if (FLname === '' && Gender === 'null' && Age === 'null'  && Relationship !== 'null') { // check only relationship
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (foundStr1 != -1) {
              finalResult.push(result[i]);
            }  
          }

          if (FLname !== '' && Gender !== 'null' && Age === 'null' && Relationship !== 'null') { // check for name and gender and relationship
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (foundStr != -1 && result[i].gender != null && result[i].gender.toLowerCase() == Gender && foundStr1 != -1) {
              finalResult.push(result[i]);
            }     
          }
          
          if (FLname !== '' && Gender !== 'null' && Age !== 'null' && Relationship === 'null') { // check for name and gender and age
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            if (foundStr != -1 && result[i].gender != null && result[i].gender.toLowerCase() == Gender && result[i].age != null && result[i].age == Age) {
              finalResult.push(result[i]);
            }     
          }

          if (FLname !== '' && Gender !== 'null' && Age !== 'null' && Relationship === 'null') { // check for name and Age and gender 
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            if (foundStr != -1 && result[i].age != null && result[i].age == Age && result[i].gender != null && result[i].gender.toLowerCase() == Gender) {
              finalResult.push(result[i]);
            }     
          }

          if (FLname !== '' && Gender === 'null' && Age !== 'null' && Relationship !== 'null') { // check for name and Age and relationship
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (foundStr != -1 && result[i].age != null && result[i].age == Age && foundStr1 != -1) {
              finalResult.push(result[i]);
            }     
          }

          if (FLname === '' && Gender !== 'null' && Age !== 'null' && Relationship !== 'null') { // check for gender and Age and relationship
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (result[i].gender != null && result[i].gender.toLowerCase() == Gender && result[i].age != null && result[i].age == Age && foundStr1 != -1) {
              finalResult.push(result[i]);
            }     
          }

          if (FLname !== '' && Gender === 'null' && Age !== 'null' && Relationship !== 'null') { // check for name and age and relationship
            FLname = FLname.toLowerCase();
            let foundStr = result[i].name.toLowerCase().indexOf(FLname);
            let foundStr1 = result[i].relationship.toLowerCase().indexOf(Relationship);
            if (foundStr != -1 && result[i].age != null && result[i].age == Age &&  foundStr1 != -1) {
              finalResult.push(result[i]);
            }     
          }
     }
  }
  return finalResult;
}