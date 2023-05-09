const verifyStates = (statesData) => {
	return (req, res, next) => {
		if (!req?.state)
			return res.sendStatus(400).json({ 'message': 'code is required.' });
		const stateCodesArray = JSON.parse(statesData).map((entry) => { return entry.code });
		const result = stateCodesArray.includes(req.state);
		if (!result)
			return res.sendStatus(204).json({ 'message': `No code matches ${req.state}.`});
		next();
	}
}

module.exports = verifyStates
