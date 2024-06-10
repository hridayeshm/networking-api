const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String
    },
    picture: {
        type: Buffer
    }
},
{
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

