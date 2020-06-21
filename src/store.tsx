import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'

const configureStore = (initialState = {}) =>
  createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  )

export default configureStore