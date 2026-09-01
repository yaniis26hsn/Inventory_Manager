import "dotenv/config";
import express from "express";
import productsRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";
import transactionsRouter from "./routes/transactions.js";
import providesRouter from "./routes/provides.js";

const app = express();

app.use(express.json());

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);
app.use("/provides", providesRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
