const express = require('express');
const db = require('./db/index');
const app = express();
//get sve
app.get('/', async function (req, res, next) {
    var query = (await db.query('SELECT * FROM clubs ORDER BY imekluba', [])).rows;
    links = [
        {
            href: '/igraci',
            rel: 'players',
            type: 'GET'
        },
        {
            href: '/nadimci',
            rel: 'club nicknames',
            type: 'GET'
        },
        {
            href: '/:imekluba',
            rel: 'specified club',
            type: 'GET'
        },
        {
            href: '/',
            rel: 'Adding club',
            type: 'POST'
        },
        {
            href: '/:imekluba',
            rel: 'Deleting specified club',
            type: 'DELETE'
        },
        {
            href: '/:imekluba/:newkapacitet',
            rel: 'Update specified club capacity',
            type: 'PUT'
        }
    ]
    if (query.length != 0) {
        res.status(200);
        res.json({
            status: 'OK',
            message: 'Fetched everything',
            response: query,
            links: links
        });
    }
    else {
        res.status(500);
        res.json({
            status: 'Error',
            message: 'Server error',
            response: null
        })
    }
});
//get igraci
app.get('/igraci', async function (req, res, next) {
    var query = (await db.query('SELECT ime, prezime, datumrodenja from clubs ORDER BY prezime', [])).rows;
    links = [
        {
            href: '/',
            rel: 'All data',
            type: 'GET'
        }
    ]
    if (query.length != 0) {
        res.status(200);
        res.json({
            status: 'OK',
            message: 'Fetched all players',
            response: query,
            links: links
        });
    }
    else {
        res.status(500);
        res.json({
            status: 'Error',
            message: 'Server error',
            response: null
        });
    }
});
//get klubovi i njihovi nadimci
app.get('/nadimci', async function (req, res, next) {
    var query = (await db.query('SELECT DISTINCT imekluba, nadimak from clubs ORDER BY imekluba', [])).rows;
    links = [
        {
            href: '/',
            rel: 'All data',
            type: 'GET'
        }
    ]
    if (query.length != 0) {
        res.status(200);
        res.json({
            status: 'OK',
            message: 'Fetched all clubs and their nicknames',
            response: query,
            links: links
        });
    }
    else {
        res.status(500);
        res.json({
            status: 'Error',
            message: 'Server error',
            response: null
        });
    }
});
app.get('/:imekluba', async function (req, res, next) {
    var query = (await db.query(`SELECT DISTINCT imekluba, godinaosnivanja, mjestokluba,kapacitet, brojtitula, nadimak, imetrenera, wikipedijaurl FROM clubs WHERE imekluba = '${req.params.imekluba}'`, [])).rows;
    links = [
        {
            href: `/${req.params.imekluba}/wiki`,
            rel: "club's wiki handle",
            type: 'GET'
        }
    ]
    if (query.length != 0) {
        res.status(200);
        res.json({
            status: 'OK',
            message: 'Fetched a club',
            response: query,
            links: links
        });
    }
    else {
        res.status(404);
        res.json({
            status: 'Not OK',
            message: 'Club with this name does not exist',
            response: null
        });
    }
});
app.get('/:imekluba/wiki', async function (req, res, next) {
    var query = (await db.query(`SELECT DISTINCT wikipedijaurl FROM clubs WHERE imekluba = '${req.params.imekluba}'`, [])).rows;
    links = [
        {
            href: `/${req.params.imekluba}`,
            rel: 'specified club',
            type: 'GET'
        }
    ]
    if(query.length != 0){
        res.status(200);
        res.json({
            status: 'OK',
            message: "Fetched club's wiki handle",
            response: query,
            links: links
        });
    }
    else{
        res.status(404);
        res.json({
            status: 'Not OK',
            message: 'Club with this name does not exist',
            response: null
        });
    }
});

//add klub
app.post('/', async function (req, res, next) {
    links = [
        {
            href: '/igraci',
            rel: 'players',
            type: 'GET'
        },
        {
            href: '/nadimci',
            rel: 'club nicknames',
            type: 'GET'
        },
        {
            href: '/:imekluba',
            rel: 'specified club',
            type: 'GET'
        },
        {
            href: '/',
            rel: 'Adding club',
            type: 'GET'
        },
        {
            href: '/:imekluba',
            rel: 'Deleting specified club',
            type: 'DELETE'
        },
        {
            href: '/:imekluba/:newkapacitet',
            rel: 'Update specified club capacity',
            type: 'PUT'
        }
    ]
    try {
        var query = (await db.query(`INSERT INTO clubs 
        (imekluba, godinaosnivanja, mjestokluba, kapacitet, prvasezonaepl, brojtitula, nadimak, nazivstadiona, imetrenera, wikipedijaurl, ime, prezime, datumrodenja)           
        VALUES ('${req.query.imekluba}', ${req.query.godinaosnivanja}, '${req.query.mjestokluba}', ${req.query.kapacitet}, ${req.query.prvasezonaepl}, ${req.query.brojtitula}, '${req.query.nadimak}', '${req.query.nazivstadiona}', '${req.query.imetrenera}', '${req.query.wikipedijaurl}', '${req.query.ime}', '${req.query.prezime}', '${req.query.datumrodenja}')`, []));
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: 'Not OK',
            message: 'Bad request',
            response: null
        });
    }

    res.status(200);
    res.json({
        status: 'OK',
        message: 'Added a club',
        response: 'INSERT',
        links: links
    });
});

//delete klub
app.delete('/:imekluba', async function (req, res, next) {
    links = [
        {
            href: '/',
            rel: 'All data',
            type: 'GET'
        }
    ] 
    try {
        var query = (await db.query(`DELETE FROM clubs WHERE imekluba = '${req.params.imekluba}'`, [])).rows;
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: 'Not OK',
            message: 'Club with that name does not exist',
            response: null
        });
    }
    res.status(200);
    res.json({
        status: 'OK',
        message: 'Deleted a club',
        response: 'DELETE',
        links: links
    });
});
//update kapacitet kluba
app.put('/:imekluba/:newkapacitet', async function (req, res, next) {
    links = [
        {
            href: `/${req.params.imekluba}`,
            rel: 'Specified club',
            type: 'GET'
        }
    ]
    try{
    var query = (await db.query(`UPDATE clubs SET kapacitet=${req.params.newkapacitet} WHERE imekluba = '${req.params.imekluba}'`, [])).rows;
    }
    catch(error){
        console.log(error)
        res.status(404).json({
            status: 'Not OK',
            message: 'Club with that name does not exist',
            response: null
        })
    }
    res.status(200);
    res.json({
        status: 'OK',
        message: 'Updated clubs capacity',
        response: 'UPDATE'
    })
});

app.use((req, res, next) => {
    res.status(501)
    res.json({
        status: 'Not Implemented',
        message: 'Method not implemented for requested resource',
        response: null
    });
});

const port = 8080;


app.listen(port, (err) => {
    if (!err) {
        console.log(`API started on port ${port}`);
    } else {
        console.log(err);
    }
});

module.exports = app; 