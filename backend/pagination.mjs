import express from 'express'
import mongoose from 'mongoose'

const app = express();
const router = express.Router();

// schema
const userModel = mongoose.model('users', new mongoose.Schema({
    userName: { String },
    email: { String },
    password: { String },
    profilePhoto: { String }
}));

// api
router.get('/pagination', async (req, res) => {

    try {

        const page = parseInt(req.query.page, 10) || 0;
        const limit = parseInt(req.query['page-size'], 10) || 70;

        if (Number.isNaN(page) || page < 0) {
            return res.status(400).send({ message: 'page should be a non-negative number' });
        }

        if (limit <= 0 || Number.isNaN(limit)) {
            return res.status(400).send({ message: 'page-size should be a positive number greater than zero' });
        }

        const totalDocuments = await userModel.countDocuments();

        const users = await userModel.find({})
            .skip(page)
            .limit(limit)

        res.status(200).send({
            message: 'paginated users',
            data: users,
            totalDocuments: totalDocuments,
            currentPage: page,
        });

    } catch (error) {
        console.error('error: ', error);
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error?.message}`,
        });
    }
    
});

// server
app.use('/api/v1', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});