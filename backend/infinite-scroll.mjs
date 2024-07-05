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
router.get('/infinite-scroll', async (req, res, next) => {

    try {

        if (Number.isNaN(parseInt(req?.query?.page, 10))) {
            res.status(403).send({
                message: 'REQUIRED_PARAMETER_MISSING',
            });
            return;
        }

        const pageValue = parseInt(req.query.page, 10);

        if (Number.isNaN(pageValue)) {
            res.status(403).send({
                message: 'REQUIRED_PARAMETER_MISSING',
            });
            return;
        }

        const users = await userModel.find({})
            .skip(pageValue)
            .limit(25)
            .exec()

        res.send({
            message: 'infinite scroll users',
            data: users,
        });


    }
    catch (error) {
        console.error('error: ', error);
        res.status(500).send({
            message: `UNKNOWN_SERVER_ERROR: ${error?.message}`,
        });
    }
})

// server
app.use('/api/v1', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});