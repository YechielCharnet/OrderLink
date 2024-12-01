const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const providerOrdersRouter = require("./routers/providerOrders");


app.get("/", (req, res) => res.send(`Hello from server local host ${PORT}!`));

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/provider_orders", providerOrdersRouter);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
