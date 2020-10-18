const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Api = require("twilio/lib/rest/Api");
const Test = mongoose.model("Test");
const requireUser = require("../middleware/requireUser");

router.get("/alltests", (req, res) => {
	Test.find()
		.sort("-createdAt")
		.then((test) => {
			res.json({ test });
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post("/addtest", (req, res) => {
	const { testId, testName, testDuration, noOfQuestions } = req.body;
	const test = new Test({
		testId,
		testName,
		testDuration: 60000 * testDuration,
		noOfQuestions,
	});
	test
		.save()
		.then((result) => {
			res.json({ message: "Test Created!" });
		})
		.catch((err) => {
			console.log(err);
		});
});

// router.put("/add-question", (req, res) => {
// 	const testId = req.body.testId;
// 	// Test.findOne({testId})
// 	const question = {
// 		questionNumber: req.body.questionNumber,
// 		questionImage: req.body.questionImage,
// 		correctOption: req.body.correctOption,
// 		questionType: req.body.questionType,
// 	};
// 	Test.findOneAndUpdate(
// 		{ testId: testId },
// 		{
// 			$push: { questions: question },
// 		},
// 		{
// 			new: true,
// 		}
// 	).exec((err, result) => {
// 		if (err) {
// 			return res.status(422).json({ error: err });
// 		} else {
// 			res.json(result);
// 		}
// 	});
// });

router.put("/add-question", (req, res) => {
	const { testId, questionType } = req.body;
	if (questionType == "SingleCorrect") {
		const { questionNumber, questionImage, correctOption } = req.body;
		const question = {
			questionImage: questionImage,
			correctOption: correctOption,
		};
		Test.findByIdAndUpdate(
			{ testId: testId },
			{
				$push: { questionNumber: questionNumber, questions: question, questionType: questionType },
			},
			{
				new: true,
			}
		).exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			} else {
				res.json(result);
			}
		});
	} else if (questionType == "MultipleCorrect") {
		const { questionNumber, questionImage, correctOptionOne, correctOptionTwo, correctOptionThree } = req.body;
		const question = {
			questionImage: questionImage,
			correctOptionOne: correctOptionOne,
			correctOptionTwo: correctOptionTwo,
			correctOptionThree: correctOptionThree,
		};
		Test.findByIdAndUpdate(
			{ testId: testId },
			{
				$push: { questionNumber: questionNumber, questions: question, questionType: questionType },
			},
			{
				new: true,
			}
		).exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			} else {
				res.json(result);
			}
		});
	} else if (questionType == "Numerical") {
		const { questionNumber, questionImage, answer } = req.body;
		const question = {
			questionImage: questionImage,
			answer: answer,
		};
		Test.findByIdAndUpdate(
			{ testId: testId },
			{
				$push: { questionNumber: questionNumber, questions: question, questionType: questionType },
			},
			{
				new: true,
			}
		).exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			} else {
				res.json(result);
			}
		});
	} else {
		res.status(404).json({ message: "Question Type not found!" });
	}
});

router.get("/showtest", (req, res) => {
	const testId = req.query.testid;
	// console.log(req.query)
	Test.findOne({ testId })
		.then((test) => {
			// console.log(test)
			if (test === null) {
				return res.status(422).json({ error: "Please enter valid Test ID" });
			} else {
				res.json({ test });
			}
		})
		.catch((err) => {
			return res.status(404).json({ error: "Test not found" });
		});
});

module.exports = router;
