const app = require("./server.js");
const mysql = require("mysql");
const supertest = require("supertest")
const dbconfig = {
    host: "mscsdb.uwstout.edu",
    user: "academicSelect",
    password: "mergeSort45!",
    database: "academicrequirements",
};
let connection;

beforeEach(async () => {
    connection = mysql.createConnection(dbconfig);
});

afterEach(async () => {
    connection.end();
});

it('test /major endpoint', async () => {
    await supertest(app).get("/major")
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });
});

it('test /concentration endpoint', async() => {
    await supertest(app).get("/concentration?majid=2")
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });
});

it('test /courses/major endpoint', async() => {
    await supertest(app).get("courses/major?majid=2")
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });
});

it('test /courses/concentration endpoint', async() => {
    await supertest(app).get("courses/concentration?conid=3")
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });
});