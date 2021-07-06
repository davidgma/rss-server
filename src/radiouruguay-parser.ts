import { get } from 'http';
import { stringify } from 'querystring';
import { parse as htmlParse, HTMLElement as parsedElement } from 'node-html-parser';
import { writeFile, createWriteStream } from 'fs';
import { homedir } from 'os';

export interface IEpisodeLink {
  episodeDate: string;
  episodeLink: string;
  downloadLink: string;
}

export class Parser {

  constructor() { }

  public async getEpisodeLinks(maxToGet: number = 0) {
    return new Promise<Array<IEpisodeLink>>((resolve, reject) => {

      const options = {};
      let content = "";
      let results = new Array<IEpisodeLink>();
      let counter = 0;

      const now = new Date();
      let year = now.getFullYear().toFixed();
      let monthN = now.getUTCMonth() + 1;
      let month = monthN.toFixed();
      if (monthN < 10) 
      month = "0" + month;

      let url = "http://radiouruguay.uy/wp-content/uploads/" + year 
      + "/" + month + "/";
      console.log(url);
      
      const req = get(url, options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          // console.log(`BODY: ${chunk}`);
          content += chunk;
        });
        res.on('end', () => {
          //console.log("content: " + content);
          writeFile(homedir + "/local/dev/rss-server/data/tmp_getEpisodeLinks_html.txt", content, (err) => {
            if (err)
              console.log("Error: " + err);
            // else
            //   console.log('Hello World > helloworld.txt');
          });
          const root: parsedElement = htmlParse(content);
          let fileListing: parsedElement = root.querySelector('table');
          let files: parsedElement[] = fileListing.querySelectorAll('td');
          let mostRecentFileName = "";
          for (let file of files) {
            // console.log(file.innerHTML);
            let anchor: parsedElement = file.querySelector("a");
            // console.log("innerText: " + anchor.innerText);
            // console.log("outerHTML: " + anchor.outerHTML);
            // console.log("innerHTML: " + anchor.innerHTML);
            // console.log("attributes: " + JSON.stringify(anchor.attributes));
            // console.log("href: " + anchor.attributes["href"]);
            if (anchor != null) {
                //console.log("text: " + anchor.text);
                let href = anchor.attributes["href"];
                if (href != null) {
                    mostRecentFileName = href;
                }
            }
            let fileDate: string = "Not known";
            let align = file.attributes["align"];
            if (align != null) {
                fileDate = file.text;
                if (fileDate.startsWith(year) 
                && mostRecentFileName.endsWith("mp3")) {
                    //console.log("date: " + fileDate);
                    results.push({
                      "episodeDate": fileDate, "episodeLink": mostRecentFileName,
                      "downloadLink": url + mostRecentFileName
                    });
                }
            }
            counter++;
            if (maxToGet > 0 && counter >= maxToGet) break;
          }
          resolve(results);
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        reject("Error getting episodes");
      });
      req.end();
    });
  }



}
