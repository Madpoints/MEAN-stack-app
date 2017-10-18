var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');


module.exports.reviewsGetAll = function(req, res) {
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var response = {
				status: 200,
				message: hotel.reviews
			};

			if (err) {
				console.log("Error finding reviews");
				response.status = 500;
				response.message = err;
			} 
				
			res
				.status(200)
				.json(response.message);
	});
};

module.exports.reviewsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var review = hotel.reviews.id(reviewId)
			var response = {
				status: 200,
				message: review
			};

			if (err) {
				console.log("Error finding review");
				response.status = 500;
				response.message = err;
			} else if (!review) {
				response.status = 404;
				response.message = {
					"message" : "Review ID not found"
				};	
			}

			res
				.status(response.status)
				.json(response.message);
	});
};

var _addReview = function(req, res, hotel) {

	hotel.reviews.push({
		name: req.body.name,
		rating: parseInt(req.body.rating, 10),
		review: req.body.review
	});

	hotel.save(function(err, hotelUpdated) {
		if (err) {
			res
				.status(500)
				.json(err);
		} else {
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.length -1]);
		}	
	});

};

module.exports.reviewsAddOne = function(req, res) {

	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var response = {
				status: 200,
				message: []
			};

			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;
			} else if (!hotel) {
				console.log("Hotel ID not found in database", hotelId);
				response.status = 404;
				response.message = {
					"message": "Hotel ID not found " + hotelId
				};
			}

			if (hotel) {
				_addReview(req, res, hotel);
			} else {
				res
				.status(200)
				.json(response.message);
			}
	});
};

module.exports.reviewsUpdateOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec(function(err, hotel) {
			var review = hotel.reviews.id(reviewId);
			var response = {
				status: 200,
				message: review
			};

			if (err) {
				console.log("Error finding hotel");
				response.status = 500;
				response.message = err;
			} else if (!review) {
				response.status = 404;
				response.message = {
					"message" : "Reviews not found"
				};	
			}

			if (response.status !== 200){
				res
					.status(response.status)
					.json(response.message);	
			} else {
				review.name = req.body.name;
				review.rating = req.body.rating;
				review.review = req.body.review;
			}

			hotel.save(function(err, reviewUpdated) {
				if (err) {
					res
						.status(500)
						.json(err);
				} else {
					res
						.status(204)
						.json();
				}
			});
		});
};