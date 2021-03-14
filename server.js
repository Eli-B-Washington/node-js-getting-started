const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//database connection
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://hvahobvcltvjgg:9d0f8e0eefaa897c79a4d5380793924691c9c6da11260d8bea8a0cb76a3e45c9@ec2-54-161-239-198.compute-1.amazonaws.com:5432/damrstam69ec9m?ssl=true";
const pool = new Pool({connectionString: connectionString});

const sql = "SELECT * FROM updates;"

pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }

    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(result.rows);
}); 

// views is directory for all template files
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');



app.get('/results', handleMath);


app.listen(port, function () {
	console.log('Node app is running on port', port);
});



function handleMath(request, response) {
	const postage = request.query.postage;
	const weight = Number(request.query.weight);
	// TODO: Here we should check to make sure we have all the correct parameters

	computeOperation(response, weight, postage);
}

function computeOperation(response, weight, postage) {
	postage = postage.toLowerCase();
	var result;

	if (postage == "stamped") {
		if (weight == 1) {
			result = weight * .55
		} else if (weight == 2) {
			result = .75;
		} else if (weight == 3) {
			result = .95;
		} else if (weight == 3.5) {
			result = 1.15;
		} else {
			result = "Sorry an incorrect Value was entered for the postage type";
		}
	} else if (postage == "metered") {
		if (weight == 1) {
			result = .51
		} else if (weight == 2) {
			result = .71;
		} else if (weight == 3) {
			result = .91;
		} else if (weight == 3.5) {
			result = 1.11;
		} else {
			result = "Sorry an incorrect Value was entered for the postage type";
		}
	} else if (postage == "flats") {
		if (weight <= 1) {
			result = 1.00
		} else if (weight <= 13) {
			result = 1 + (weight * .20) - .20;
		} else {
			result = "Sorry an incorrect Value was entered for the postage type";
		}

	} else if (postage == "first-class") {
		if (weight <= 5) {
			result = 4.00;
		} else if (weight <= 9) {
			result = 4.80;
		} else if (weight == 12) {
			result = 5.50;
		} else if (weight == 13) {
			result = 6.25;
		} else {
			result = "Sorry an incorrect Value was entered for the postage type";
		}

	}

	// Set up a JSON object of the values we want to pass along to the EJS result page
	const params = {
		weight: weight,
		postage: postage,
		result: result
	};

	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	response.render('results', params);
}







app.get('/getInfo', handleGetInfo);




function handleGetInfo(request, response) {
	var op = request.query.id;
	console.log(op);
	var op = 1;
	console.log(op);
	if (op == 1) {
		console.log("inside");
		const sql = "SELECT update FROM updates;"
		console.log(sql);
		pool.query(sql, function (err, res) {
			// If an error occurred...
			if (err) {
				console.log("Error in query: ");
				console.log(err);
			}

			// Log this to the console for debugging purposes.
			console.log("Back from DB with following results:");
			console.log(res.rows);
			var stringres = JSON.stringify(res.rows);
			var params = {
				op: op,
				res: stringres
			};
			response.render('final-project', params);
		});
	}
}



/*
function getInfo(request, response) {
	// First get the person's id
	const id = request.query.id;

	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getPersonFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
			const person = result[0];
			response.status(200).json(person);
		}
	});
}

// This function gets a person from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getInfoFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = "SELECT id, first, last, birthdate FROM person WHERE id = $1::int";

	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	const params = [id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

} 
*/