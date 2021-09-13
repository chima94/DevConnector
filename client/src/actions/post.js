import axios from "axios";
import { setAlert } from "./alert";
import{
    ADD_POST,
    DELETE_POST,
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types'


//Get Posts
export const getPosts = () => async dispatch =>{
    try {

        const res =  await axios.get('/api/posts')

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}




//get post

//Get Posts
export const getPost = (id) => async dispatch =>{
    try {

        const res =  await axios.get(`/api/posts/${id}`)

        dispatch({
            type: GET_POST,
            payload: res.data
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}


//Add likes
export const addLike = id => async dispatch =>{
    try {

        const res =  await axios.put(`/api/posts/likes/${id}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}


//Remove likes
export const removeLike = id => async dispatch =>{
    try {

        const res =  await axios.put(`/api/posts/unlikes/${id}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}


//delete post
//Remove likes
export const deletePost = id => async dispatch =>{
    try {

        const res =  await axios.delete(`api/posts/${id}`)

        dispatch({
            type: DELETE_POST,
            payload: id
        })

        dispatch(setAlert('Post Removed', 'success'))

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}


//add post
export const addPost = formData => async dispatch =>{

    const config = {
        header: {
            'Content-type': 'application/json'
        }
    }
    try {

        const res =  await axios.post("api/posts/", formData, config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post created', 'success'))

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}


//add comment
export const addComment = (postId, formData) => async dispatch =>{
    

    const config = {
        header: {
            'Content-type': 'application/json'
        }
    }
    try {

        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('comment added', 'success'))

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}


//delete comment
export const deleteComment = (postId, commentId) => async dispatch =>{

    try {

       await axios.delete(`/api/posts/comment/${postId}/${commentId}`)

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        dispatch(setAlert('comment removed', 'success'))

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg : error.response.statusText, status: error.response.status}
        })
    }
}