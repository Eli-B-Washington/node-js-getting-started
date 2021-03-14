const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//database connection
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://lkebzixqtzurfr:fe76c3e49349722290ab6932ca3a0f2067644eb572225fb977ddc5347d566fb1@ec2-54-159-175-113.compute-1.amazonaws.com:5432/d2bfq2b6bdhj2q?ssl=true';
const pool = new Pool({connectionString: connectionString});

const sql = "SELECT * FROM updates;"

pool.query(sql, function(err, res) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        //console.log(err);
    }

    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(res.rows);
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







app.get('/handlegetInfo', handleGetInfo);

function handleGetInfo(request, response) {
	var op = request.query.id;
	console.log(op);
	var op = 1;
	console.log(op);
	if (op == 1) {
		console.log("inside");
		const sql = "SELECT note FROM updates;"
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
      console.log(params);
      
      response.send(res.rows);

		});
	}
}

