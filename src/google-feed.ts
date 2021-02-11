import { Feed } from "feed";
import { RtvcParser } from './rtvc-parse';
import { writeFile } from 'fs';
import { homedir } from 'os';

export class GoogleFeed extends Feed {

    #parser = new RtvcParser();
    
    public async updateFeed(showName = "Show Name not provided", 
    title = "Title not provided", 
        fileName = "notnamed", count= 0) {
        let episodes = await this.#parser.getEpisodeLinks(showName, count);
        for (let episode of episodes) {
            episode.downloadLink = await this.#parser.getDownloadLink(episode.episodeLink);
            console.log(JSON.stringify(episode));
            let year: number = Number.parseInt(episode.episodeDate.substring(6,10));
            let month: number = Number.parseInt(episode.episodeDate.substring(3,5)) - 1;
            let day: number = Number.parseInt(episode.episodeDate.substring(0,2));
            let ed = new Date(year, month, day);
            this.addItem({
              title: title + episode.episodeDate,
              link: episode.downloadLink,
              date: ed  
            });
        }


        writeFile(homedir + "/local/dev/rss-server/data/" + fileName + ".rss", 
        this.rss2(), (err) => {
            if (err) {
                console.log("Error writing rss file: " + err.message);
            }
        });
    }
}