import yargs, { boolean } from 'yargs';
import { Controller } from './control';


interface Arguments {
    [x: string]: unknown;
    all: boolean;
    _: string[];
    $0: string;
    symbols: Array<string>;
}

const argv: Arguments = <Arguments>yargs
    .command("update", "Update the database, rss feed and mp3 files.")
    .command("list", "List all mp3 files.")
    .usage('Usage: node $0 <command>')
    .argv;


//console.log(argv);
async function processArgs(argv: Arguments) {
    let ctl = new Controller();
    if (argv._.includes("update")) {
        await ctl.updateAll();
    }
    else if (argv._.includes("list")) {
        console.log("Listing symbols...");
        await ctl.list();
    }
    else {
        console.log("No command given.");
    }
}

processArgs(argv);