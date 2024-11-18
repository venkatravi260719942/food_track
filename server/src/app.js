import cors from "cors";
import express from "express";

import routes from "./api/routes/index.js";

const app = express();

app.enable("json spaces");
app.enable("strict routing");
app.use(cors({ origin: "http://localhost:5500", credentials: true }));
app.use(express.json());
app.use(routes);

export default app;
