const statesData = require('../model/statesData.json');

const verifyStates = () => {
    return (req, res, next) => {
      if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
      const stateParam = req.params.state.toUpperCase();
      const codeArray = statesData.map(entry => entry.code);
      const result = codeArray.find(code => code === stateParam);
      if (!result) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
      req.code = stateParam;
      next();
    }
}

module.exports = verifyStates;
