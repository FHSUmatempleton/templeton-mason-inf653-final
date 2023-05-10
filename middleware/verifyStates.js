const statesData = require('../model/statesData.json');

const verifyStates = () => {
    return (req, res, next) => {
      const codesArray = statesData.map(entry => entry.code);
      const result = codesArray.includes(req.params.state.toUpperCase());
      if (!result) return res.json({ 'message': 'Invalid state abbreviation parameter'})
      req.code = req.params.state.toUpperCase();
      next();
    }
}

module.exports = verifyStates;
