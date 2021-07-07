import { Feed } from "feed";
import { Parser } from './espectador-parser';
import { writeFile } from 'fs';
import { homedir } from 'os';

export class EspectadorFeed {

    private feed: Feed;
    private parser: Parser = new Parser();
    private nameCode = "espectador";
    private title = "El Espectador";

    public constructor() {
        this.feed = new Feed({
            title: this.title,
            description: "Programas completas from El Espectador.",
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
        //console.log("here");
        for (let episode of episodes) {
            console.log(JSON.stringify(episode));
            let mp3Path = await this.parser.getDownloadLink(episode.downloadLink);
            let year: number = Number.parseInt(episode.showDate.substring(6,10));
            let month: number = Number.parseInt(episode.showDate.substring(3,5)) - 1;
            let day: number = Number.parseInt(episode.showDate.substring(0,2));
            let ed = new Date(year, month, day);
            let title = episode.showName + " " + episode.showDate;
            console.log("title: " + title);
            this.feed.addItem({
              title: title,
              link: mp3Path,
              date: ed  
            });
        }


        writeFile(homedir + "/local/dev/rss-server/data/" + this.nameCode + ".rss", 
        this.feed.rss2(), (err) => {
            if (err) {
                console.log("Error writing rss file: " + err.message);
            }
        });
        // writeFile(homedir + "/local/dev/rss-server/data/ru.rss", 
        // this.feed.rss2(), (err) => {
        //     if (err) {
        //         console.log("Error writing rss file: " + err.message);
        //     }
        // });
        
    }

    
}