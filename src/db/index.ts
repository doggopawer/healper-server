import mongoose from "mongoose";
import { config } from "../config";
const connectDB = () =>
    mongoose
        .connect(
            `mongodb+srv://${config.db.user}:${config.db.password}@healper-db.akgt9.mongodb.net/healper-db`
        )
        .catch((err) => console.log(err));

export default connectDB;
