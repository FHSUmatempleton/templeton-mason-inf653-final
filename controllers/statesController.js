const State = require('../model/State');
const statesData = require('../model/statesData.json');

const getAllStates = async (req, res) => {
  let stateList;
  
  const contig = req?.query?.contig;
  if (contig === 'true') {
    stateList = statesData.filter(st => st.code !== 'AK' && st.code !== 'HI');
  }
  else if (contig === 'false') {
    stateList = statesData.filter(st => st.code === 'AK' || st.code === 'HI');
  }
  else {
    stateList = statesData;
  }
  
  const mongoStateList = await State.find();
  // add funfacts from mongoStates to stateList
  stateList.forEach((st) => {
    const mongoStateInst = mongoStateList.find(mongoState => mongoState.stateCode === st.code);
    try {
      if (mongoStateInst) {
        st.funfacts = [...mongoStateInst.funfacts];
      }
    } catch (err) {
      console.log('funfact does not exist');
    }
  });
  
  res.json(stateList);
}

const getState = async (req, res) => {
  const state = statesData.filter(st => st.code === req.code);
  const mongoState = await State.findOne({ stateCode: req.code }).exec();
  let stateInst = state[0];
  try { // add mongo funfacts to state
    console.log(mongoState.funfacts.length);
    if (mongoState && mongoState.funfacts.length !== 0) {
      stateInst.funfacts = mongoState.funfacts;
    }
  } catch (err) {}
  res.json(stateInst);
}

const getFunfact = async (req, res) => {
  const state = statesData.filter(st => st.code === req.code);
  const mongoState = await State.findOne({ stateCode: req.code }).exec();
  console.log(mongoState);
  if (mongoState.funfacts.length === 0)
    return res.json({ 'message': `No Fun Facts found for ${state[0].state}` });

  const randomFunfact = mongoState.funfacts[Math.floor(Math.random() * mongoState.funfacts.length)];

  res.json({'funfact': randomFunfact});
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
    'population': state[0].population.toLocaleString('en-us')
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
  console.log(req.body);
  if (!req?.body?.funfacts) {
    console.log('State fun facts value required');
    return res.status(400).json({ 'message': 'State fun facts value required'});
  }
  
  if (!Array.isArray(req?.body?.funfacts)) {
    console.log('State fun facts value must be an array');
    return res.status(400).json({ 'message': 'State fun facts value must be an array' });
  }
  
  const mongoState = await State.findOne({ _stateCode: req.code }).exec();

  if (!mongoState) {
    // if there is no state on mongoDb...then create one
    try {
      const result = await State.create({
        'stateCode': req.code,
        'funfacts': req.body.funfacts
      });
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
    }
  } else {
    const allFunfact = [...mongoState.funfacts, ...req.body.funfacts];

    const update = await State.updateOne(
      {
        'stateCode': req.code,
        'funfacts': allFunfact
      }
    )
    mongoState.funfacts = allFunfact;
    const result = await State.findOne({ stateCode: req.code }).exec();
    res.status(201).json(result);
  }
}

const updateFunfact = async (req, res) => {
  if (!req?.body?.index) {
    console.log('State fun fact index value required');
    return res.status(400).json({ 'message': 'State fun fact index value required' });
  }
  if (!req?.body?.funfacts) {
    console.log('State fun fact value required');
    return res.status(400).json({ 'message': 'State fun fact value required' });
  }

  const state = statesData.filter(st => st.code === req.code);
  const mongoState = await State.findOne({ stateCode: req.code }).exec();

  try {
    const funfactIndex = req.body.index - 1;
    if (mongoState.funfacts.length < funfactIndex || funfactIndex < 0) {
      console.log(`No Fun Fact found at that index for ${state[0].state}`);
      return res.status(204).json({ 'message': `No Fun Fact found at that index for ${state[0].state}` });
    }
    let allFunfact = mongoState.funfacts;
    // update old funfact with new funfact
    allFunfact.splice(funfactIndex, 1, allFunfact);
  
    mongoState.funfacts = allFunfact;
    const update = await State.updateOne(
      {
        'stateCode': req.code,
        'funfacts': allFunfact
      }
    );
    const result = await State.findOne({ stateCode: req.code }).exec();

    res.json(result);
  } catch (err) {
    console.log(`No Fun Facts found for ${state[0].state}`);
    return res.status(404).json({ 'message': `No Fun Facts found for ${state[0].state}` });
  }
}

const deleteFunfact = async (req, res) => {
  if (!req?.body?.index) {
    console.log('State fun fact index value required');
    return res.status(400).json({ 'message': 'State fun fact index value required' });
  }
  
  const state = statesData.filter(st => st.code === req.code);
  const mongoState = await State.findOne({ stateCode: req.code }).exec();
  try {
    const funfactIndex = req.body.index - 1;
    if (mongoState.funfacts.length < funfactIndex || funfactIndex < 0) {
      console.log(`No Fun Fact found at that index for ${state[0].state}`);
      return res.status(204).json({ 'message': `No Fun Fact found at that index for ${state[0].state}` });
    }
    
    const funfactArr = mongoState.funfacts.filter((element, index) => { return index != funfactIndex });
    mongoState.funfacts = funfactArr;
    
    const result = await mongoState.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(`No Fun Facts found for ${state[0].state}`);
    return res.status(204).json({ 'message': `No Fun Facts found for ${state[0].state}` });
  }
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
