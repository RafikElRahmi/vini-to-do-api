"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const events_1 = __importDefault(require("./routes/events"));
const cron_1 = __importDefault(require("./utils/cron/cron"));
const db_1 = __importDefault(require("./libs/db"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
    exposedHeaders: "Authorization,Expiration,Refresh-Expiration,authentication",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//running cron procces
(0, cron_1.default)();
//DB connection
(0, db_1.default)();
// Define routes
app.use("/api/v1-0-0", routes_1.default);
app.use("/api/v1-0-0", user_1.default);
app.use("/api/v1-0-0", events_1.default);
// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running ${port}`);
});
//tsc --project tsconfig.json && tsc-alias -p tsconfig.json
