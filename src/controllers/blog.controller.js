const express = require("express");
const blogModel = require("../models/blog.model");
const auth = require("../../middlewares/auth");
const checkAccess = require("../../middlewares/CheckAccess");
const ROLES = require("../../constants/roles");
const blogRouter = express.Router()

//getting all the blogs no need of any auth here 
blogRouter.get("/", async (req, res) => {
    try {
        // we need the info about the blog that who has created it so we are population authod id and getting username from that
        const blogData = await blogModel.find().populate("author", "userName");
        res.status(200).json({ msg: blogData })

    } catch (err) {
        res.status(500).send(err)
    }
})

blogRouter.post("/create", auth, checkAccess([ROLES.AUTHOR]), async (req, res) => {
    const { title, content } = req.body;
    try {
        const blog = new blogModel({ title, content, author: req.user._id })
        const savedBlog = await blog.save();
        res.json(savedBlog);
    } catch (error) {
        res.status(400).send(err)
    }
})


blogRouter.patch("/update/:id", auth, checkAccess([ROLES.AUTHOR]), async (req, res) => {
    try {

        //we are sending blog id through params to edit the blog
        const blogId = req.params.id;

        //searcg for that particular blogId 
        const blog = await blogModel.findById(blogId);

        //if not found then return
        if (!blog) {
            //when blogId is not valid
            return res.status(404).json({ message: "Not Found" })
        }
        //when user is trying to delete somone else's blogs

        //blog is obj and author is key 
        // we are checking if the blog's author id !== user _id from request and req.user we getting from auth
        //we are aslo checking if the role !== admin
        //if any one of them is false then return err
        if (blog.author.tostring() !== req.user._id.tostring()) {
            return res.status(403).json({ message: "Access Denied" })
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(blogId, req.body, { new: true })
        res.json(updatedBlog);

        // await blogModel.findByIdAndDelete(blogId)
        // res.json(updatedBlog);
    } catch (error) {
        res.status(400).send(err)
    }
})

blogRouter.delete("/delete/:id", auth, checkAccess([ROLES.AUTHOR]), async (req, res) => {
    const blogId = req.params.id;
    const blog = await blogModel.findById(blogId);
    console.log(blogId)
    // console.log(blog.author, req.user._id)
    try {

        if (!blog) {
            //when blogId is not valid
            return res.status(404).json({ message: "Not Found" })
        }

        //when user is trying to update somone's blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied" })
        }

        await blogModel.findByIdAndDelete(blogId)
        res.json({ message: "Deleted successfully!" });
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = blogRouter
