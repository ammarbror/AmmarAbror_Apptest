import {combineReducers} from 'redux';

const initialState = {
  name: 'Ammar Abror',
};

const InitialReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    default:
      return state;
  }
};

const homeState = {
  dataContact: [],
  addUser: {
    firstName: '',
    lastName: '',
    age: '',
    photo: '',
  },
};

const HomeReducer = (state = homeState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        dataContact: [...action.value],
      };
    case 'SET_ADDUSER':
      return {
        ...state,
        addUser: {
          ...state.addUser,
          [action.typeInput]: action.value,
        },
      };
    case 'CLEAR_USER':
      return {
        ...state,
        addUser: {
          firstName: '',
          lastName: '',
          age: '',
          photo: '',
        },
      };
    default:
      return state;
  }
};

const reducer = combineReducers({
  InitialReducer,
  HomeReducer,
});

export default reducer;
