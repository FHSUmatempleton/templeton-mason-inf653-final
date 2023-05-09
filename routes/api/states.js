const express = require('express');
const router = express.Router();
const stateController = require('../../controllers/stateController');
const statesData = require('../../models/statesData.json');
const verifyStates = require('../../middleware/verifyStates');

router.route('/')
	.get(stateController.getAllStates);
	
router.route('/:state')
	.get(verifyStates(statesData), stateController.getState);

module.exports = router;
