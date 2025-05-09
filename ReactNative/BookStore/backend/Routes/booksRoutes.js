import express from 'express';
import protectRoute from '../middleware/auth.middleware.js';
import Book from '../models/Book.js';
import clou from '../lib/coudinary.js';
const router = express.Router();

router.post('/', protectRoute, async (req, res) =>{
    
    try{
        const {title, caption, image, rating} = req.body;

        if(!title || !caption || !image || !rating){
            return res.status(400).json({message: 'All fields are required'});
        }

        const uploadResponse = await clou.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        });
        await newBook.save();

        res.status(201).json(newBook);

    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
});


router.get("/", protectRoute, async (req, res) =>{
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit || 3;
        const skip = (page - 1) * limit;

        const books = await Book.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");
        
        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

router.get("/user", protectRoute, async (req, res) =>{
    try{
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        res.json(books);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


router.delete("/:id", protectRoute, async (req, res) =>{
    try{
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({message: 'Book not found'});
        console.log(req.user._id);
        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: 'Unauthorized'});
        }

        if(book.image && book.image.includes("cloudinary")){
            try{
                const publicId = book.image.split("/").pop().split(".")[0];
                await clou.uploader.destroy(publicId);
            }
            catch(deleteError){
                console.log("Error deleting image from cloudinary", deleteError);
            }
        }

        await book.deleteOne();
        res.status(200).json({message: 'Book deleted'});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

export default router;