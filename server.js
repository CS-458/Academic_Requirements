const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.port || 5000;
const dbconfig = {
  host: "mscsdb.uwstout.edu",
  user: "academicSelect",
  password: "mergeSort45!",
  database: "academicrequirements",
};

let connection = mysql.createConnection(dbconfig);

function checkConnection() {
  connection.query("SELECT 1", [], function (err, result) {
    if (err) {
      console.log("Database lost connection, reconnecting");
      connectDatabase();
      return;
    }
  });
}

function connectDatabase() {
  connection = mysql.createConnection(dbconfig);
}

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/major", (req, res) => {
  checkConnection();
  connection.query("SELECT * FROM Major", [], function (err, result) {
    if (err) {
      res.send(err);
      return;
    }
    res.send(result);
  });
});

app.get("/concentration", (req, res) => {
  checkConnection();
  connection.query(
    "SELECT * FROM Concentration WHERE Concentration.majorid = ?",
    [req.query.majid],
    function (err, result) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(result);
    }
  );
});

//TODO delete the UNION here!
app.get("/courses/major", (req, res) => {
  checkConnection();
  connection.query(
    `SELECT co.subject, co.number, co.name, co.credits, co.preReq
	FROM major m
	JOIN majorcategory mc ON m.idMajor = mc.majorId
	JOIN category c ON mc.categoryId = c.idCategory
	JOIN coursecategory cc ON c.idCategory = cc.categoryId
	JOIN course co ON cc.courseId = co.idCourse
	WHERE m.idMajor = ?
  UNION 
  SELECT "CS", "144", "Computer Science I", "4", "" FROM major m`,
    [req.query.majid],
    function (err, result) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(result);
    }
  );
});

app.get("/courses/concentration", (req, res) => {
  checkConnection();
  connection.query(
    `SELECT co.subject, co.number, co.credits, co.semesters, co.name, co.preReq
	FROM concentration c
	JOIN concentrationcategory cc ON c.idConcentration = cc.concentrationId
	JOIN category ca ON cc.categoryId = ca.idCategory
	JOIN coursecategory coc ON ca.idCategory = coc.categoryId
	JOIN course co ON coc.courseId = co.idCourse
	WHERE c.idConcentration = ?`,
    [req.query.conid],
    function (err, result) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(result);
    }
  );
});

/* Gets the Requirements FOR ALL Things, so gets it for the MAJOR CONCENTRATION and all "GEN-EDS" 
   Since there is a union, if there is an update to any ofthe columns we are trying to return
   EVERY "Block" needs to be  modified as well
*/
app.get("/requirements", (req, res) => {
  checkConnection();
  connection.query(
    `# Get all "major" categories and respective requirements
    SELECT c.idCategory, c.name, c.parentCategory, cr.creditCount, cr.courseCount, cr.courseReqs
    FROM category c
    JOIN majorCategory mc ON mc.categoryId = c.idCategory
    JOIN concentration co ON co.majorId = mc.majorId
    JOIN categoryrequirements cr ON cr.categoryId = c.idCategory
    WHERE co.idConcentration = ?
    UNION
    # Get all "concentration" categories and respective requirements
    SELECT c.idCategory, c.name, c.parentCategory, cr.creditCount, cr.courseCount, cr.courseReqs
    FROM category c
    JOIN concentrationCategory cc ON cc.categoryId = c.idCategory
    JOIN categoryrequirements cr ON cr.categoryId = c.idCategory
    WHERE cc.concentrationId = ?
    UNION
    # Get all "gen-ed" categories and respective requirements
    SELECT c.idCategory, c.name, c.parentCategory, cr.creditCount, cr.courseCount, cr.courseReqs
    FROM category c
    JOIN categoryrequirements cr ON cr.categoryId = c.idCategory
    WHERE c.idCategory NOT IN (SELECT categoryId FROM majorCategory) AND c.idCategory NOT IN (SELECT categoryId FROM concentrationCategory)`,
    [req.query.conid, req.query.conid],
    function (err, result) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(result);
    }
  );
});

module.exports = app;
