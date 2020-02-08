const initialState = {};

// Sets the state based on action.id.  If action.payload is a function, then it is called with the previous props as a parameter
function updateState(state, action) {
  const data = typeof action.payload === 'function' ? action.payload(state[action.id]) : action.payload;
  var newState = { ...state };
  newState[action.id] = data;
  if (state && state[action.id]) {
    newState[action.id] = data;
  }
  return newState;
}

export default function dialogReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DATABASE':
      return action.payload;
    case 'UPDATE_DATABASE':
      return updateState(state, action);
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}
