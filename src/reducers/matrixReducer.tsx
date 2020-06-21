import {
  M, N,
  SET_M,
  SET_N
} from '../constants'
import { Action } from '../types'

export const matrix = <T extends unknown>(state = {
  [M]: 3,
  [N]: 3
}, action: Action<T>) => {
  switch (action.type) {
    case SET_M:
      return {
        ...state,
        [M]: action[M]
      }
    case SET_N:
      return {
        ...state,
        [N]: action[N]
      }
    default:
      return state
  }
}