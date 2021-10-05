import { get } from 'https';
import { stringify } from 'querystring';
import { parse as htmlParse, HTMLElement as parsedElement } from 'node-html-parser';
import { writeFile, createWriteStream } from 'fs';
import { homedir } from 'os';

export interface IEpisodeLink {
    showDate: string;
    showName: string;
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

            let url = "https://espectador.com/";
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
                    writeFile(homedir + "/local/dev/rss-server/data/tmp_getEpisodeLinksES_html.txt", content, (err) => {
                        if (err)
                            console.log("Error: " + err);
                        // else
                        //   console.log('Hello World > helloworld.txt');
                    });
                    const root: parsedElement = htmlParse(content);
                    let mainSection: parsedElement = root.querySelector('#main-relacionadas');
                    let shows: parsedElement[] =
                        mainSection.querySelectorAll('.relacionada--box');
                    for (let show of shows) {
                        // console.log(file.innerHTML);
                        // console.log("innerText: " + anchor.innerText);
                        // console.log("outerHTML: " + anchor.outerHTML);
                        // console.log("innerHTML: " + anchor.innerHTML);
                        // console.log("attributes: " + JSON.stringify(anchor.attributes));
                        // console.log("href: " + anchor.attributes["href"]);
                        // console.log("href: " + anchor.text);
                        let showName =
                            show.querySelector(".relacionada--titulo-nombre").text;
                        let anchors = show.querySelectorAll('.notita--go');
                        for (let anchor of anchors) {
                            if (anchor.attributes["title"] != null
                                && anchor.attributes["title"].startsWith("Programa completo del ")) {
                                let showDate
                                    = anchor.attributes["title"]
                                        .substring(anchor.attributes["title"].length - 10);
                                let mp3Url = anchor.attributes["href"];

                                console.log("showName: " + showName);
                                console.log("showDate: " + showDate);
                                console.log("downloadLink: " + mp3Url);
                                results.push({
                                    "showDate": showDate,
                                    "showName": showName,
                                    "downloadLink": mp3Url
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

    public async getDownloadLink(url: string) {
        return new Promise<string>((resolve, reject) => {
            let content = "";
            const req = get(url, {}, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    // console.log(`BODY: ${chunk}`);
                    content += chunk;
                });
                res.on('end', () => {
                    const root: parsedElement = htmlParse(content);
                    let sources = root.querySelectorAll("source");
                    for (let source of sources) {
                        if (source.attributes["type"] != null
                            && source.attributes["type"] == "audio/mpeg") {
                            resolve(source.rawAttributes["src"]);
                        }
                    }
                });
                req.on('error', (e) => {
                    console.error(`problem with request: ${e.message}`);
                    reject("Error getting download link");
                });
                req.end();
            });
        });
    }

}
