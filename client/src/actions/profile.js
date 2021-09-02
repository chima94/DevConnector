import axios from "axios";
import { setAlert } from "./alert";

import { 
    ACCOUNT_DELETED, 
    CLEAR_PROFILE, 
    GET_PROFILE,
    GET_PROFILES, 
    PROFILE_ERROR,
    GET_REPOS, 
    UPDATE_PROFILE } from "./types";

export const getCurrentProfile = () => async (dispatch) =>{
    try {
        const res = await axios.get('/api/profiles/me')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}




//get all profile
export const getAllProfiles = () => async (dispatch) =>{
    dispatch({type: CLEAR_PROFILE})
    try {
        const res = await axios.get('/api/profiles')
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}


//get profile by userId
export const getProfileById = userId => async (dispatch) =>{
    try {
        const res = await axios.get(`/api/profiles/user/${userId}`)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}




//get github repos
export const getGithubRepos = username => async (dispatch) =>{

    try {
        const res = axios.get(`/api/profiles/github/${username}`)
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}


//create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch =>{
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profiles', formData, config)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))
        if(!edit){
            history.push('/dashboard')
        }
    } catch (err) {
        const errors = err.response.data.errors
        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}   

//Add experience
export const addExperience = (formData, history) => async dispatch =>{
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profiles/experience', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience added', 'success'))

        history.push('/dashboard')

    } catch (err) {
        const errors = err.response.data.errors

        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add education
export const addEducation = (formData, history) => async dispatch =>{
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        
        const res = await axios.put('/api/profiles/education', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education added', 'success'))

        history.push('/dashboard')

    } catch (err) {
        const errors = err.response.data.errors

        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}


//delete experience
export const deleteExperience = id => async dispatch => {
    
    try {
        const res = await axios.delete(`/api/profiles/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience Removed', 'success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}


//delete education
export const deleteEducation = id => async dispatch => {
    
    try {
        const res = await axios.delete(`/api/profiles/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Removed', 'success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}


//delete account
export const deleteAccount = () => async dispatch => {

    if(window.confirm('Are you sure? This can not be undone')){
        try {
             await axios.delete("/api/profiles")
            dispatch({type: CLEAR_PROFILE,})
            dispatch({type: ACCOUNT_DELETED})
            dispatch(setAlert('Your account has permanently been deleted'))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            })
        }

    }
}
