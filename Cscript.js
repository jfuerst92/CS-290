
document.getElementById("subEx").addEventListener("click", function(event){ //listener for insert

	var results = {}
	var base = "http://52.36.74.92:3000/insert" 
	//get info
    results.name = document.getElementById('name').value;
	//console.log(results.name);
    results.reps = document.getElementById('reps').value;
    results.weight = document.getElementById('weight').value;
    results.date = document.getElementById('date').value;
	if (document.getElementById('unit1').checked){ //test for checkmark bool val
		results.lbs = 1;
	}
	else{
		results.lbs = 0;
	}
    //results.lbs = document.getElementById('unit1').value;
	//console.log("This is what is sent:");
	//console.log(results);
   
	var req = new XMLHttpRequest();
    req.open("POST", base , true);
	console.log("POST request opened.");
	req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
		
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			//console.log(response);
			refresh(response);
			delEdit();
		}
		else{
			console.log("Error: " + req.statusText);
		}
	});
	req.send(JSON.stringify(results));
	event.preventDefault();
	//console.log("add request sent");
	
});
//This function adds functionality to each edit and delete button
function delEdit(){
	var edBtns = document.getElementsByClassName("edit");
	
	for (var i = 0; i < edBtns.length; i++){ //add event listener to each edit button
		
		edBtns[i].addEventListener('click', function(event){
			var results = {};
			var base = "http://52.36.74.92:3000/edit";
	
			results.name = document.getElementById('name').value;
			//console.log(results.name);
			results.reps = document.getElementById('reps').value;
			results.weight = document.getElementById('weight').value;
			results.date = document.getElementById('date').value;
			results.lbs = document.getElementById('unit1').value;
			results.id = this.id; //get the id as it is stored in edBtns[i];
			//console.log("This is the id:" + results.id);
			//console.log("This is what is sent:");
			//console.log(results);
			var req = new XMLHttpRequest();
			req.open("POST", base , true);
			//console.log("edit request opened.");
			req.setRequestHeader('Content-Type', 'application/json');
			req.addEventListener('load', function() {
		
				if(req.status >= 200 && req.status < 400){
					var response = JSON.parse(req.responseText);
					console.log(response);
					refresh(response); //refresh the list
					delEdit();
				}
			});
			req.send(JSON.stringify(results));
			event.preventDefault();
			//console.log("edit request sent");
		});
		
	}
	var delBtns = document.getElementsByClassName("del");
	for (var i = 0; i < delBtns.length; i++){
		
		delBtns[i].addEventListener('click', function(event){ //add an event listener for each delete button
			var results = {};
			var base = "http://52.36.74.92:3000/delete";
	
			results.id = this.id;
			console.log("This is the id:" + results.id);
			console.log("This is what is sent:");
			console.log(results);
			var req = new XMLHttpRequest();
			req.open("POST", base , true);
			console.log("delete request opened.");
			req.setRequestHeader('Content-Type', 'application/json');
			req.addEventListener('load', function() {
		
				if(req.status >= 200 && req.status < 400){
					var response = JSON.parse(req.responseText);
					console.log(response);
					refresh(response);
					delEdit();
				}
			});
			req.send(JSON.stringify(results));
			event.preventDefault();
			console.log("delete request sent");
		});
		
	}
}
function refresh(response){
	
	var new_tbody = document.createElement('tbody');
	new_tbody.id = 'tb';
	var old_tbody = document.getElementById('tb');
	
	for (var j = 0; j < response.length; j++){
		
		var nRow = document.createElement("tr");
		var id = response[j]["id"];
		hParams = ['name', 'reps', 'weight', 'date', 'lbs']
		for (var k = 0; k < 5; k++){
			var nCell = document.createElement("td");
			nCell.textContent = response[j][hParams[k]];
			nRow.appendChild(nCell);
		}
		
		var eForm = document.createElement('form'); //create form
		var edEntry = document.createElement('td'); //create cell
		var hid = document.createElement("input"); //hidden input
		hid.type = "hidden"; 
		hid.name = "id";
		//hid.id = "e" + j;
		hid.value = response[j].id;
		var lnk = document.createElement("a");
		lnk.href = "http://52.36.74.92:3000/edit?id=" + response[j].id;
		var edBtn = document.createElement("input");
		edBtn.type = "submit";
		edBtn.value = "Edit";
		edBtn.className = "edit";
		edBtn.id = response[j].id;
		eForm.appendChild(hid);
		eForm.appendChild(edBtn);
		edEntry.appendChild(eForm);
		nRow.appendChild(edEntry);
		
		var dForm = document.createElement('form');
		//form.setAttribute('method', "post");
		var delEntry = document.createElement("td")
		var hid2 = document.createElement("input");
		hid2.type = "hidden";
		hid2.name = "id";
		hid2.value = response[j].id;
		var delBtn = document.createElement("input");
		delBtn.type = "submit";
		delBtn.value = "Delete This"
		delBtn.className = "del"
		delBtn.id = response[j].id;
		dForm.appendChild(hid2);
		dForm.appendChild(delBtn);
		delEntry.appendChild(dForm);
		nRow.appendChild(delEntry);
		
		
		
		
		new_tbody.appendChild(nRow);
		
	}
	old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
	
}
