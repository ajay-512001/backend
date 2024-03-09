const testRouter = require('express');
const pool = require("../backend/db");
const testrouter = testRouter();


testrouter.get("/test", async (req,res) => {
    //let info = await pool.query("select * from excelcheck");
    // res.status(200).json(info.rows);
    // let info = await pool.query("insert into excelcheck (name, age) VALUES ('sonal', 38)");
    // res.status(200).json(info.rowCount);
})

module.exports = testrouter;