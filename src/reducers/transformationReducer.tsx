import {
  // ADD_RULE,
  ADD_TRANSFORMATION,
  // DELETE_RULE,
  DISTANCE,
  // EDIT_RULE,
  SET_INDEX_BASED,
  INDEX_BASED,
  TRANSFORMATIONS,
  SET_DISTANCE
} from '../constants'

import { TRANSFORMATION_PRESETS } from '../components/Transformations'
import { Action } from '../types'

export const transformation = <T extends unknown>(state = {
  [DISTANCE]: 10,
  [TRANSFORMATIONS]: TRANSFORMATION_PRESETS
}, action: Action<T>) => {
  switch (action.type) {
    case SET_INDEX_BASED:
      return {
        ...state,
        [INDEX_BASED]: action[INDEX_BASED]
      }
    case ADD_TRANSFORMATION:
      return {
        ...state,
        [INDEX_BASED]: action[INDEX_BASED]
      }
    case SET_DISTANCE:
      return {
        ...state,
        [DISTANCE]: action[DISTANCE]
      }
    // case ADD_RULE:
    //   return {
    //     ...state,
    //   }
    // case DELETE_RULE:
    //   return {
    //     ...state,
    //   }
    // case EDIT_RULE:
    //   return {
    //     ...state,
    //   }
    default:
      return state
  }
}