import { Feed } from "feed";
import { Parser } from './spanishland-parser';
import { writeFile } from 'fs';
import { homedir } from 'os';

export class SpanishlandFeed {

    private feed: Feed;
    private parser: Parser = new Parser();
    private nameCode = "spanishland";
    private title = "SpanishLand School";

    public constructor() {
        this.feed = new Feed({
            title: this.title,
            description: "Audio files from SpanishLand School, with the dross edited out.",
            id: "http://rss.davidgma.com/" + this.nameCode + ".rss",
            link: "http://rss.davidgma.com/" + this.nameCode + ".rss",
            language: "es", 
            // optional, used only in RSS 2.0, possible values: 
            // http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "http://rss.davidgma.com/" + this.nameCode + ".png",
            // favicon: "http://example.com/favicon.ico",
            copyright: this.title
        });
    }
    
    public async updateFeed() {
        let episodes = await this.parser.getEpisodeLinks();
        for (let episode of episodes) {
            console.log(JSON.stringify(episode));
            let year: number = Number.parseInt(episode.episodeDate.substring(12,16));
            let monthName = episode.episodeDate.substring(8,11);
            let month: number = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(monthName) / 3;
            let day: number = Number.parseInt(episode.episodeDate.substring(5,7));
            let ed = new Date(year, month, day, 3);
            let title = episode.title;
            //console.log(title);
            this.feed.addItem({
              title: title,
              link: episode.downloadLink,
              date: ed  
            });
        }


        writeFile(homedir + "/local/dev/rss-server/data/" + this.nameCode + ".rss", 
        this.feed.rss2(), (err) => {
            if (err) {
                console.log("Error writing rss file: " + err.message);
            }
        });
        writeFile(homedir + "/local/dev/rss-server/data/ru.rss", 
        this.feed.rss2(), (err) => {
            if (err) {
                console.log("Error writing rss file: " + err.message);
            }
        });
        
    }

    
}