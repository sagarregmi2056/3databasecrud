const express = require('express');

const router = express.Router();
const multer = require('multer');
const fs = require('fs')



const { db1, db2 } = require('../db');


const createUserModel = require('../models/userModel');
const createAdminModel = require('../models/imageModel');


const contactFormService = require('../servicefile/contactFormService');



// image upload

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads')
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

const User = createUserModel(db1);
const Admin = createAdminModel(db2);


var upload = multer({
    storage: storage,

}).single("image");





router.get('/', async (req, res) => {
    try {
        // Fetch all users from db1 (assuming db1 is for users)
        const users = await User.find({}, { __v: 0 }); // Exclude _id and __v fields

        // Fetch all images from db2 (assuming db2 is for images)
        const images = await Admin.find({}, {  __v: 0 }); // Exclude _id and __v fields

        // Combine user data with image data
        const userData = users.map((user, index) => ({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: images[index] ? images[index].image : null,
        }));

        // Send the combined data as a JSON response
        res.render("index",{
            title:"Home page",
            users:userData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while processing the request' });
    }
});


// POST route to handle form submission
router.post('/add', upload, async (req, res) => {
    try {
        // Create a user in db1 (assuming db1 is for users)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        });

        // Save the user document to the database
        await user.save();

        // Create an image in db2 (assuming db2 is for images)
        const admin = new Admin({
            image: req.file.filename,
        });

        // Save the image document to the database
        await admin.save();

        req.session.message = {
            type:'success',
            message:'user and image added successfully'
        };

        // res.status(200).json({ type:'success', message: 'User and image added successfully' });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.session.message = {
            type:'danger',
            message:error.message
        };
        res.redirect('/');
    }
});


router.get('/add',(req,res)=>{
    res.render('add_users',{title:'Add users'})
})
router.get('/contact',(req,res)=>{
    res.render('contactForm',{title:'contact'})
})

// router.get('/allcontacts',(req,res)=>{
//     res.render('allContacts',{title:'allcontacts'})
// })

// router.get('/edit/:id', async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const user = await User.findById(userId);

//         if (!user) {
//             req.session.message = {
//                 type: 'danger',
//                 message: 'User not found',
//             };
//             return res.redirect('/');
//         }

//         res.render('edit_users', { title: 'Edit User', user });
//     } catch (error) {
//         console.error(error);
//         req.session.message = {
//             type: 'danger',
//             message: 'Error while processing the request',
//         };
//         res.redirect('/');
//     }
// });


router.get('/edit/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch user details from db1 (assuming db1 is for users)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch image details from db2 (assuming db2 is for images)
        const image = await Admin.findOne({ _id: user._id }, { _id: 0, __v: 0 });
        
        // Render the edit page with user and image data
        res.render("edit_users", {
            title: "Edit User",
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            image: image ? image.image : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while processing the request' });
    }
});



// router.post('/update/:id',upload,(req,res)=>{
//     let id 
// })


// router.post('/update/:id', upload, async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Fetch the user from db1 (User model)
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Update user data with the submitted form data
//         user.name = req.body.name;
//         user.email = req.body.email;
//         user.phone = req.body.phone;

//         // If a new image is uploaded, update the image path
//         if (req.file) {
//             user.image = req.file.filename;
//         }

//         // Save the updated user data
//         await user.save();

//         // Redirect or send a success message
//         req.session.message = {
//             type: 'success',
//             message: 'User updated successfully',
//         };
//         res.redirect('/'); // Redirect to the home page or the updated user's profile page
//     } catch (error) {
//         console.error(error);
//         req.session.message = {
//             type: 'danger',
//             message: 'Error updating user',
//         };
//         res.redirect('/'); // Redirect to the home page with an error message





// ...
// router.post('/update/:id', upload, async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Fetch the user from db1 (User model)
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Update user data with the submitted form data
//         user.name = req.body.name;
//         user.email = req.body.email;
//         user.phone = req.body.phone;

//         // If a new image is uploaded, update the image path
//         if (req.file) {
//             user.image = req.file.filename;
//         }

//         // Save the updated user data
//         await user.save();

//         // Redirect or send a success message
//         req.session.message = {
//             type: 'success',
//             message: 'User updated successfully',
//         };
//         res.redirect('/'); // Redirect to the home page or the updated user's profile page
//     } catch (error) {
//         console.error(error);
//         req.session.message = {
//             type: 'danger',
//             message: 'Error updating user',
//         };
//         res.redirect('/'); // Redirect to the home page with an error message
//     }
// });
router.post('/update/:id', upload, async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the user from db1 (User model)
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user data with the submitted form data
        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;

        // If a new image is uploaded, update the image path in the Admin collection
        if (req.file) {
            // Fetch the corresponding Admin record
            const admin = await Admin.findOne({ _id: userId });

            if (admin) {
                // Update the image path
                admin.image = req.file.filename;
                // Save the updated Admin record
                await admin.save();
            } else {
                console.error('Admin record not found for the user.');
            }
        }

        // Save the updated user data
        await user.save();

        // Redirect or send a success message
        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };
        res.redirect('/'); // Redirect to the home page or the updated user's profile page
    } catch (error) {
        console.error(error);
        req.session.message = {
            type: 'danger',
            message: 'Error updating user',
        };
        res.redirect('/'); // Redirect to the home page with an error message
    }
});



// router.get('/delete/:id', async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Fetch the user from db1 (User model)
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         // Delete the user from db1
//         await user.remove();

//         // Fetch the image from db2 (Admin model)
//         const image = await Admin.findOne({ _id: user._id });

//         // If an image is found, delete it from the uploads folder and from db2
//         if (image) {
//             try {
//                 fs.unlinkSync('./uploads/' + image.image);
//                 await image.remove();
//             } catch (err) {
//                 console.error(err);
//             }
//         }

//         // Redirect or send a success message
//         req.session.message = {
//             type: 'success',
//             message: 'User deleted successfully',
//         };
//         res.redirect('/'); // Redirect to the home page
//     } catch (error) {
//         console.error(error);
//         req.session.message = {
//             type: 'danger',
//             message: 'Error deleting user',
//         };
//         res.redirect('/'); // Redirect to the home page with an error message
//     }
// });

router.get('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user in db1 (assuming db1 is for users)
        const user = await User.findById(userId);

        if (!user) {
            // If the user is not found, redirect to the home page with an error message
            req.session.message = {
                type: 'danger',
                message: 'User not found',
            };
            return res.redirect('/');
        }

        // Delete the user from db1
        await User.findByIdAndDelete(userId);

        // Find the corresponding image in db2 (assuming db2 is for images)
        const image = await Admin.findOne({ _id: user._id });

        if (image) {
            // If an image is found, delete it from db2 and from the uploads folder
            await Admin.findByIdAndDelete(user._id);
            try {
                fs.unlinkSync('./uploads/' + image.image);
            } catch (err) {
                console.log(err);
            }
        }

        // Redirect to the home page with a success message
        req.session.message = {
            type: 'success',
            message: 'User deleted successfully',
        };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        // If an error occurs, redirect to the home page with an error message
        req.session.message = {
            type: 'danger',
            message: 'Error while processing the request',
        };
        res.redirect('/');
    }
});





router.post('/submit', async (req, res) => {
  try {
    const formData = req.body;
    const result = await contactFormService.submitContactForm(formData);
    // res.json('data submitted successfully to back to home');
    req.session.message = {
        type: 'success',
        message: 'Data saved on neo4j db',
    };
    res.redirect('/');
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});



router.get('/allcontacts', async (req, res) => {
    try {
      const allContacts = await contactFormService.getAllContacts();
      res.render('allcontacts', { contacts: allContacts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// ...

module.exports = router;