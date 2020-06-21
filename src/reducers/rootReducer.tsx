import { combineReducers } from 'redux'
import { canvas } from './canvasReducer'
import { matrix } from './matrixReducer'
import { configuration } from './configurationReducer'
import { transformation } from './transformationReducer'

const reducers = combineReducers({
  canvas,
  configuration,
  matrix,
  transformation
});

export type State = ReturnType<typeof reducers>

export default reducers