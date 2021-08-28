const express = require('express')
const request = require('request')
const config = require('config')
const{body, validationResult} = require('express-validator')
const Profile = require('../../models/Profile')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const router = express()

//@route GET api/Profile/me
//desc  Get current user profile
//Access Private
router.get('/me', auth, async (req, res) =>{
    try{
        const profile = await Profile.findOne({user: req.user.id})
            .populate('user', ['name', 'avatar'])
        
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'})
        }

        res.json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send("server error")
    }
})


//@route POST api/profile
//desc  Create or update user profile
//Access Private
router.post(
    '/',
    [auth, [
        body('status', 'status is required').not().isEmpty(),
        body('skills', 'skills is required').not().isEmpty()
    ]],
    async (req, res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body

        //build profile object
        const profileFields = {}
        profileFields.user = req.user.id
        if(company) profileFields.company = company
        if(website) profileFields.website = website
        if(location) profileFields.location = location
        if(bio) profileFields.bio = bio
        if(status) profileFields.status = status
        if(githubusername) profileFields.githubusername = githubusername
        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        //build social object
        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube
        if(facebook) profileFields.social.facebook = facebook
        if(twitter) profileFields.social.twitter = twitter
        if(instagram) profileFields.social.instagram = instagram
        if(linkedin) profileFields.social.linkedin = linkedin
        
        try{
            let profile = await Profile.findOne({user: req.user.id})

            if(profile){
                //update profile
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id}, 
                    {$set: profileFields},
                    {new: true}
                )
                return res.json(profile)
            }

            //create profile
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)
        }catch(err){
            console.log(err)
            res.status(500).send('Server Error')
        }
    }
)

//@route GET api/Profile/
//desc  get all profiles
//Access Public
router.get('/', async (req, res) =>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})


//@route GET api/Profile/user/:user_id
//desc  get all profile by user ID
//Access Public
router.get('/user/:user_id', async (req, res) =>{
    try {

        const profile = await Profile.findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar'])

        if(!profile){
            res.status(400).json({msg: 'Profile not found'})
        }

        res.json(profile)
    } catch (error) {
        if(error.kind == 'ObjectId'){
            res.status(400).json({msg: 'Profile not found'})
        }
        console.log(error)
        res.status(500).send('server error')
    }
})


//@route DELETE api/Profile/
//desc  delete profile, user and posts
//Access Private
router.delete('/', auth, async (req, res) =>{
    try {
        //delete user post
        await Post.deleteMany({user: req.user.id})

        //delete user profile
        await Profile.findOneAndRemove({user: req.user.id})

        //delete user
        await User.findOneAndRemove({_id: req.user.id})
        res.json({msg: 'User deleted'}) 
    } catch (error) {
        res.status(500).send('Server Error')
    }
})


//@route Put api/Profile/experience
//desc  Add user experience
//Access Private
router.put(
    '/experience',
     [auth,[
         body('title', 'Title is required').not().isEmpty(),
         body('company', 'Company is required').not().isEmpty(),
         body('from', 'from date is required').not().isEmpty()
     ]], 
     async (req, res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const{
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({user: req.user.id})
            profile.experience.unshift(newExp)
            await profile.save()
            res.json(profile)
        } catch (error) {
            console.log(error)
            res.status(500).send('server error')
        }
})


//@route DELETE api/Profile/experience/:exp_id
//desc  delete user experience
//Access Private
router.delete('/experience/:exp_id', auth, async (req, res) =>{
    try {
        const profile = await Profile.findOne({user: req.user.id})

        const removeIndex = profile.experience.map(item => item.id)
            .indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)
        
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})




//@route Put api/Profile/education
//desc  Add user education
//Access Private
router.put(
    '/education',
     [auth,[
         body('school', 'school is required').not().isEmpty(),
         body('degree', 'degree is required').not().isEmpty(),
         body('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
         body('from', 'from date is required').not().isEmpty()
     ]], 
     async (req, res) =>{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const{
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({user: req.user.id})
            profile.education.unshift(newEdu)
            await profile.save()
            res.json(profile)
        } catch (error) {
            console.log(error)
            res.status(500).send('server error')
        }
})


//@route DELETE api/Profile/education/:edu_id
//desc  delete user education
//Access Private
router.delete('/education/:edu_id', auth, async (req, res) =>{
    try {
        const profile = await Profile.findOne({user: req.user.id})

        const removeIndex = profile.education.map(item => item.id)
            .indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)
        
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})


//@route DELETE api/Profile/github/:username
//desc  get user repos from github
//Access Public
router.get('/github/:username', async (req, res) =>{
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5
            &sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=
            ${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }
        request(options, (error, response, body) =>{

            if(error)console.log(error)
            if(response.statusCode !== 200){
                return res.status(404).json({msg: 'No Github profit found'})
            }

            res.json(JSON.parse(body))
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})

module.exports = router