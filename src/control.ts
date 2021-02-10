// Program for updating rss file, mp3 files and
// the database.

import { DatabaseService } from './db-service';
import { RtvcParser } from './rtvc-parse';
//import { Feed } from "feed";
import { GoogleFeed } from './google-feed';
import { writeFile } from 'fs'; 
import { homedir } from 'os';

export class Controller {
    #dbs = new DatabaseService("files.db");
    #parser = new RtvcParser();
    #feed: GoogleFeed;

    constructor() { 
        this.#feed = this.setUpFeed();
    }

    public async list() {

        await this.createTableIfNotExist();
        let sql = 'select * from t_prices;'
        let result = await this.#dbs.sendSql(sql);
        if (result != null) {
            console.log(result);
        }
    }

    private async createTableIfNotExist() {
        let result: string;
        let sql = 'create table if not exists t_files (filename text primary key, postdate datetime,'
            + 'description text);'
        result = await this.#dbs.sendSql(sql);
        if (result != null) {
            console.log(result);
        }
    }

    public async updateAll() {
        await this.createTableIfNotExist();
        await this.updateFeed("una-mas-uno-14330",
        "Una Más Uno ", "unamasuno", 10);

        // writeFile(homedir + "/local/dev/rss-server/data/unamasuno2.rss", 
        // this.#feed.rss2(), (err) => {
        //     if (err) {
        //         console.log("Error writing rss file: " + err.message);
        //     }
        // });

        
    }

    private async updateFeed(showName: string, title: string, 
        fileName: string, count: number) {
        //let showName = "una-mas-uno-14330";
        let episodes = await this.#parser.getEpisodeLinks(showName, count);
            //console.log("here");
        for (let episode of episodes) {
            episode.downloadLink = await this.#parser.getDownloadLink(episode.episodeLink);
            console.log(JSON.stringify(episode));
            let year: number = Number.parseInt(episode.episodeDate.substring(6,10));
            let month: number = Number.parseInt(episode.episodeDate.substring(3,5)) - 1;
            let day: number = Number.parseInt(episode.episodeDate.substring(0,2));
            let ed = new Date(year, month, day);
            this.#feed.addItem({
              title: title + episode.episodeDate,
              link: episode.downloadLink,
              date: ed  
            });
        }


        writeFile(homedir + "/local/dev/rss-server/data/" + fileName + ".rss", 
        this.#feed.rss2(), (err) => {
            if (err) {
                console.log("Error writing rss file: " + err.message);
            }
        });
    }

    private setUpFeed(): GoogleFeed {
        return new GoogleFeed({
            title: "Una Más Uno",
            description: "Daily news and chat show with Kiko Barroso.",
            id: "http://rss.davidgma.com/unamasuno.rss",
            link: "http://rss.davidgma.com/unamasuno.rss",
            language: "en", 
            // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "http://rss.davidgma.com/unamasuno.png",
            // favicon: "http://example.com/favicon.ico",
            copyright: "Canarias Radio RTVC",
            // updated: new Date(2013, 6, 14), // optional, default = today
            // generator: "awesome", // optional, default = 'Feed for Node.js'
            // feedLinks: {
            //     json: "http://rss.davidgma.com/unamasuno.json",
            //     atom: "http://rss.davidgma.com/unamasuno.atom"
            // },
            // author: {
            //     name: "John Doe",
            //     email: "johndoe@example.com",
            //     link: "https://example.com/johndoe"
            // }
        });
    }

    // public async remove(symbol: string) {
    //     console.log("Removing symbol: " + symbol);
    //     await this.createTableIfNotExist();
    //     let sql = 'delete from t_prices where symbol = "' + symbol
    //         + '";'
    //     let result = await this.#dbs.sendSql(sql);
    //     if (result != null) {
    //         console.log(result);
    //     }
    // }


} // end of class controller





