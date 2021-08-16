const express = require('express')
const{body, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const router = express()

//@route Post api/Posts
//desc  create post
//Access Private
router.post(
    '/',
    [auth,[
        body('text', 'Text is required').not().isEmpty()
    ]],
    async (req, res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

       try {

        const user = await User.findById(req.user.id).select('-password')

        const newPost = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        }

        const post = new Post(newPost)
        await post.save()
        res.json(post)
       } catch (error) {
           console.log(error)
           res.status(500).send('server error')
       }
})


//@route get api/Posts
//desc  get all posts
//Access Private
router.get('/', auth, async (req, res) =>{
    try {
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})


//@route get api/Posts/:id
//desc  get post by ID
//Access Private
router.get('/:id', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg: 'post not found'})
        }
        res.json(post)
    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'post not found'})
        }
        res.status(500).send('server error')
    }
})

//@route DELETE api/Posts/:id
//desc  delete a post
//Access Private
router.delete('/:id', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({msg: 'post not found'}) 
        }

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'user not authorized'})
        }

        await post.remove()
        res.json('post deleted')
    } catch (error) {
        console.log(error)
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'post not found'})
        }
        res.status(500).send('server error')
    }
})

//@route PUT api/Posts/likes/:id
//desc  like a post
//Access Private
router.put('/likes/:id', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)

        //check if post has already been liked by this user
        if(post.likes.some((like) => like.user.toString() === req.user.id)){
            return res.status(400).json({msg: 'Post already been liked'})
        }
        post.likes.unshift({user: req.user.id}) 
        await post.save()
        res.json(post.likes)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('server error')
    }
})


//@route PUT api/Posts/unlikes/:id
//desc  unlike a post
//Access Private
router.put('/unlikes/:id', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)

        //check if post has already been liked by this user
        if(!post.likes.some((like) => like.user.toString() === req.user.id)){
            return res.status(400).json({msg: 'This post has not been liked'})
        }
        //remove like
        post.likes = post.likes.filter(
            ({user}) => user.toString() !== req.user.id
        )

        await post.save()
        return res.json(post.likes)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('server error')
    }
})


//@route Post api/Posts/comment/:id
//desc  comment on a post
//Access Private
router.post(
    '/comment/:id',
    [auth,[
        body('text', 'Text is required').not().isEmpty()
    ]],
    async (req, res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

       try {

        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)


        const newComment = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        }

        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)

       } catch (error) {
           console.log(error)
           res.status(500).send('server error')
       }
})


//@route DELETE api/Posts/comment/:id/comment_id
//desc  delete comment on a post
//Access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)
        const comment = post.comments.find(comment => comment.id == req.params.comment_id)
        
        if(!comment){
            return res.status(404).json({msg : 'comment does not exist'})
        }

        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg : 'User not authorized'})
        }

        post.comments = post.comments.filter(
            ({id}) => id !== req.params.comment_id
        )

        await post.save()
        return res.json(post.comments)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})
module.exports = router