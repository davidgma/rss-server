import { Feed } from "feed";
import { Parser } from './radiouruguay-parser';
import { writeFile } from 'fs';
import { homedir } from 'os';

export class RadioUruguayFeed {

    private feed: Feed;
    private parser: Parser = new Parser();
    private nameCode = "radiouruguay";
    private title = "Radio Uruguay";

    public constructor() {
        this.feed = new Feed({
            title: this.title,
            description: "Audio files from Radio Uruguay.",
            id: "http://rss.davidgma.com/" + this.nameCode + ".rss",
            link: "http://rss.davidgma.com/" + this.nameCode + ".rss",
            language: "es", 
            // optional, used only in RSS 2.0, possible values: 
            // http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "http://rss.davidgma.com/" + this.nameCode + "2.png",
            // favicon: "http://example.com/favicon.ico",
            copyright: this.title
        });
    }
    
    public async updateFeed() {
        let episodes = await this.parser.getEpisodeLinks();
        for (let episode of episodes) {
            console.log(JSON.stringify(episode));
            let year: number = Number.parseInt(episode.episodeDate.substring(6,10));
            let month: number = Number.parseInt(episode.episodeDate.substring(3,5)) - 1;
            let day: number = Number.parseInt(episode.episodeDate.substring(0,2));
            let ed = new Date(year, month, day);
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