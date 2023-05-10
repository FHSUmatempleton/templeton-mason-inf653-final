const State = require('../model/State');
const statesData = require('../model/statesData.json');

const getAllStates = async (req, res) => {
  // to do: print mongoStates
  
  let states = {};
  const contig = req.query?.contig;
  const mongoStates = await State.find();
  if (contig === 'true') {
    states = statesData.filter(st => st.code !== 'AL' && st.code !== 'HI');
  }
  else if (contig === 'false') {
    states = statesData.filter(st => st.code === 'AL' || st.code === 'HI');
  }
  else {
    states = statesData;
  }
  res.json(states);
}

const getState = async (req, res) => {
  // to do: print mongoState
  
  const state = statesData.filter(st => st.code === req.code);
  const mongoState = await State.findOne({ _stateCode: req.code }).exec();
  res.json(state);
}

const getFunfact = async (req, res) => {
  const state = await State.findOne({ _stateCode: req.code }).exec();
  res.json(state);
}

const getCapital = async (req, res) => {
  const state = statesData.filter(st => st.code === req.code);
  res.json({
    'state': state[0].state,
    'capital': state[0].capital_city
  });
}

const getNickname = async (req, res) => {
  const state = statesData.filter(st => st.code === req.code);
  res.json({
    'state': state[0].state,
    'nickname': state[0].nickname
  });
}

const getPopulation = async (req, res) => {
  const state = statesData.filter(st => st.code === req.code);
  res.json({
    'state': state[0].state,
    'population': state[0].population
  });
}

const getAdmission = async (req, res) => {
  const state = statesData.filter(st => st.code === req.code);
  res.json({
    'state': state[0].state,
    'admitted': state[0].admission_date
  });
}

const createFunfact = async (req, res) => {
  
}

const updateFunfact = async (req, res) => {
  if (!req?.body?.stateCode) {
    return res.status(400).json({ 'message': 'stateCode is required'});
  }
  const state = await State.findOne({ _stateCode: req.code }).exec();
  if (req.body?.funfact) state.funfact = req.body.funfact;
  const result = await state.save();
  res.json(result);
}

const deleteFunfact = async (req, res) => {
  
}

module.exports = {
  getAllStates,
  getState,
  getFunfact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  createFunfact,
  updateFunfact,
  deleteFunfact
}
