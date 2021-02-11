// Program for updating the rss file

//import { DatabaseService } from './db-service';
import { GoogleFeed } from './google-feed';
import { TardeFeed } from './tarde-feed';
import { UnaMasUnoFeed } from './una-feed';

export class Controller {
    //#dbs = new DatabaseService("files.db");    
    #feeds: GoogleFeed[] = new Array<GoogleFeed>();

    constructor() { 
        this.#feeds.push(new UnaMasUnoFeed());
        this.#feeds.push(new TardeFeed());
    }

    // public async list() {

    //     await this.createTableIfNotExist();
    //     let sql = 'select * from t_prices;'
    //     let result = await this.#dbs.sendSql(sql);
    //     if (result != null) {
    //         console.log(result);
    //     }
    // }

    // private async createTableIfNotExist() {
    //     let result: string;
    //     let sql = 'create table if not exists t_files (filename text primary key, postdate datetime,'
    //         + 'description text);'
    //     result = await this.#dbs.sendSql(sql);
    //     if (result != null) {
    //         console.log(result);
    //     }
    // }

    public async updateAll() {

        //await this.createTableIfNotExist();

        for (let feed of this.#feeds) {
            await feed.updateFeed();
        }

        // writeFile(homedir + "/local/dev/rss-server/data/unamasuno2.rss", 
        // this.#feed.rss2(), (err) => {
        //     if (err) {
        //         console.log("Error writing rss file: " + err.message);
        //     }
        // });

        
    }

    

    


} // end of class controller





