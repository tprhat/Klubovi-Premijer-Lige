const express = require('express');
const router = express.Router();
const db = require('../db/index')

router.get('/', async function(req, res, next){
    let rows = (await db.query('SELECT * FROM clubs ORDER BY imekluba', [])).rows;

    res.render('datatable', {
        rows: rows
    });
})


module.exports = router;