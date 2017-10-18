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