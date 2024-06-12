const express = require('express');

const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');
const commentRouter = require('./routers/commentRouter');
const likeRouter = require('./routers/likeRouter');
require('./db/mongoose')
require('./middlewares/auth')

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);
app.use(likeRouter);

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});
