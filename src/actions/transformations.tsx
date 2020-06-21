import {
    SET_INDEX_BASED,
    ADD_TRANSFORMATION,
    SET_TRANSFORMATION,
    SET_DISTANCE,
} from '../constants'

export const addTransformation = () => ({
    type: ADD_TRANSFORMATION
})

export const setTransformation = () => ({
    type: SET_TRANSFORMATION
})

export const setDistance = () => ({
    type: SET_DISTANCE
})

export const setIndexBased = () => ({
    type: SET_INDEX_BASED
})