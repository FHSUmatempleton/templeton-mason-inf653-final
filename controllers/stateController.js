const State = require('../models/State');

const getAllStates = async (req, res) => {
	const states = await State.find();
	if (!states)
		return res.status(204).json({ 'message': 'No states found.' });
	res.json(states);
}

const getState = async (req, res) => {
	const state = await State.findOne({ _state: req.params.state }).exec();
	res.json(state);
}

module.exports = {
	getAllStates,
	getState
}
