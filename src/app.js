import express from "express"
import routerSetup from "./utils/routerSetup.js";
const PORT = 3000;

const app = express();

app.use(express.json());

app.use(routerSetup);

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});
