require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./db/dbConnect");
const userRouter = require("./routes/UserRouter");
const photoRouter = require("./routes/PhotoRouter");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/photosOfUser", photoRouter);

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend dang chay tai http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Khong the khoi dong backend:", error.message);
    process.exit(1);
  }
}

start();
