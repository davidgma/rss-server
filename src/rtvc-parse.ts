import { get } from 'http';
import { stringify } from 'querystring';
import { parse as htmlParse, HTMLElement as parsedElement } from 'node-html-parser';
import { writeFile, createWriteStream } from 'fs';

export interface IEpisodeLink {
  episodeDate: string;
  episodeLink: string;
  downloadLink: string;
}

export class RtvcParser {

  constructor() { }

  public async getEpisodeLinks(showName: string, maxToGet: number = 0) {
    return new Promise<Array<IEpisodeLink>>((resolve, reject) => {

      const options = {};
      let content = "";
      let results = new Array<IEpisodeLink>();
      let counter = 0;

      const req = get("http://www.rtvc.es/canariasradio/multimedia/" + showName + ".aspx", options, (res) => {
        //console.log(`STATUS: ${res.statusCode}`);
        //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          //console.log(`BODY: ${chunk}`);
          content += chunk;
        });
        res.on('end', () => {
          // console.log(content);
          writeFile("./data/tmp_getEpisodeLinks_html.txt", content, (err) => {
            if (err)
              console.log("Error: " + err);
            // else
            //   console.log('Hello World > helloworld.txt');
          });
          const root: parsedElement = htmlParse(content);
          let broadcasts: parsedElement = root.querySelector('.lastBroadcastsList');
          let files: parsedElement[] = broadcasts.querySelectorAll('.filteredList');
          for (let file of files) {
            // console.log(file.innerHTML);
            let anchor: parsedElement = file.querySelector("a");
            // console.log("text: " + anchor.text);
            // console.log("innerText: " + anchor.innerText);
            // console.log("outerHTML: " + anchor.outerHTML);
            // console.log("innerHTML: " + anchor.innerHTML);
            // console.log("attributes: " + JSON.stringify(anchor.attributes));
            // console.log("href: " + anchor.attributes["href"]);
            let dt: parsedElement = anchor.querySelector('.fecha');
            // console.log("date: " + dt.text);
            results.push({
              "episodeDate": dt.text, "episodeLink": anchor.attributes["href"],
              "downloadLink": ""
            });
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


  public async getDownloadLink(episodeLink: string) {
    return new Promise<string>((resolve, reject) => {

      const options = {};
      let content = "";

      const req = get(episodeLink, options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          content += chunk;
        });
        res.on('end', () => {
          // console.log(content);
          writeFile("./data/tmp_getDownloadLink_html.txt", content, (err) => {
            if (err)
              console.log("Error: " + err);
          });
          const root: parsedElement = htmlParse(content);
          let reproductor: parsedElement = root.querySelector('#ctl00_content_reproductor');
          // console.log(reproductor.innerHTML);
          let source: parsedElement = reproductor.querySelector('source');
          // console.log(source.attributes["src"]);
          resolve(source.attributes["src"]);
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        reject("Error getting download link");
      });
      req.end();
    });
  }

  public async downloadMp3(downloadLink: string, filePath: string) {
    return new Promise<void>((resolve, reject) => {

      console.log("Downloading '" + downloadLink + "' to '" + filePath + "'...");

      const file = createWriteStream(filePath);
      const req = get(downloadLink, (res) => {
        res.pipe(file);
        res.on('end', () => { 
          console.log("Finished downloading.");
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        reject("Error download file.");
      });
      req.end();
    });
  }

}