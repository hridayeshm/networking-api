const express = require('express');
require('./db/mongoose')
const userRouter = require('./routers/userRouter');
require('./middlewares/auth')
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(userRouter);

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});
