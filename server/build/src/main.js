var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import Database from 'better-sqlite3';
import data from '../data/db.json';
console.log(data);
// variables
let formsData = [];
// file pathing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// .env setup
dotenv.config({ path: path.join(__dirname, "..", ".env") });
// express setup
const app = express();
app.use(cors());
// body parser setup
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// database setup
const db = new Database(path.join(__dirname, './tracker.db'), {
    fileMustExist: false,
    readonly: false,
});
// create tables if they don't exist
db.prepare(`CREATE TABLE IF NOT EXISTS usersFormData
            (
                firstName TEXT,
                lastName  TEXT,
                email     TEXT,
                labels    TEXT,
                timestamp INTEGER
            )`).run();
function databaseUpdate(formData) {
    // destructure formData
    let { firstName, lastName, email, labels } = formData;
    // timestamp when recorded
    const timestamp = Date.now();
    // stringify labels object
    labels = JSON.stringify(labels);
    // if email already exists, update / if not, insert
    const query = db.prepare(`SELECT *
                              FROM usersFormData
                              WHERE email = ?`).get(email);
    if (query) {
        db.prepare(`UPDATE usersFormData
                    SET firstName = ?,
                        lastName  = ?,
                        labels    = ?,
                        timestamp = ?
                    WHERE email = ?`).run(firstName, lastName, labels, timestamp, email);
    }
    else {
        db.prepare(`INSERT INTO usersFormData (firstName, lastName, email, labels, timestamp)
                    VALUES (?, ?, ?, ?, ?)`).run(firstName, lastName, email, labels, timestamp);
    }
}
function databaseSearch(formData) {
    const { firstName, lastName, email } = formData;
    // check if user exists in db by name and email
    const query = db.prepare(`SELECT *
                              FROM usersFormData
                              WHERE firstName = ?
                                AND lastName = ?
                                AND email = ?`).get(firstName, lastName, email);
    if (!query) {
        return {
            status: 'failure',
        };
    }
    return {
        status: 'success',
        labels: JSON.parse(query.labels),
    };
}
// handle concurrency issues
function jsonUpdate(formData) {
    // add to array if name and email are unique
    if (formsData.find(data => data.email === formData.email)) {
        // update value if email already exists
        formsData = formsData.map(data => {
            if (data.email === formData.email) {
                return formData;
            }
            return data;
        });
    }
    else {
        // add to array if email is unique
        formsData.push(formData);
    }
    fs.writeFileSync(path.join(__dirname, '../data/db.json'), JSON.stringify(formsData, null, 2));
}
// store future form generation data
app.post('/api/form-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    // make changes to db
    databaseUpdate(req.body);
    return res.sendStatus(200);
}));
// store future form generation data
app.get('/api/view-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('view-data');
    console.log(formsData);
    return res.send(formsData);
}));
app.post('/api/form-submission', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    jsonUpdate(req.body);
    return res.sendStatus(200);
}));
// generate form catered to user
app.post('/api/sign-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    // search db for user
    const data = databaseSearch(req.body);
    console.log(data);
    return res.send(data);
}));
app.listen(process.env.PORT || 3600, () => {
    console.log(`Listening on port ${process.env.PORT || 3600}`);
});
