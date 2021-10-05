// Runs server to provide prices and periodically
// update them.
import express from 'express';
import bodyparser from 'body-parser';
import { FileUtils as futils } from './fileutils';
//import { Controller } from './control';

//let ctl = new Controller();

// Create a new express app instance
const app: express.Application = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
let port = process.env.PORT || 4222;
const router = express.Router();
router.get('/', function (req, res) {
    console.log(req.params);
    //res.json({ message: 'API is Online!' });   
    res.json(14.5);
});
app.use('/rss', router);
router.use(function (req, res, next) {
    console.log("We've got something.");
    next() //calls next middleware in the application.
});

// call with http://localhost:4222/rss/kiko
router.route('/kiko').get((req, res) => {
    console.log("pwd: " + process.cwd());
    console.log("__dirname: " + __dirname);

    // also works: res.sendFile(__dirname + '/rssfeed.xml');

    futils.readFile(process.cwd() + '/data/rssfeed.xml').then((lines) => {
        res.send(lines.join("\n"));
    });

    // ctl.getPrice(req.params.symbol).then((price) => {
    //     console.log("price in route: " + price);
    //     res.json(price);
    // });
    //let parser = new FtParser();
    //res.json(parser.getPrice(req.params.symbol));
    //res.json(15.666);

});

app.listen(port, function () { console.log("App is listening on port " + port + "!"); });



