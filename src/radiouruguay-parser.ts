//import { get } from 'https';
import { parse as htmlParse, HTMLElement as parsedElement } from 'node-html-parser';
import { writeFile, createWriteStream } from 'fs';
import { homedir } from 'os';
import { WebUtils } from './webutils';

export interface IEpisodeLink {
  episodeDate: string;
  title: string;
  description: string;
  downloadLink: string;
}

interface IProgram {
  name: string;
  link: string;
}

interface IEpisode {
  name: string;
  link: string;
}

interface IEpisodeInfo {
  date: string,
  link: string;
}

export class Parser {

  private webUtils: WebUtils;

  constructor() {
    this.webUtils = new WebUtils();
  }

  public async getEpisodeLinks(maxToGet: number = 0) {
    let results = new Array<IEpisodeLink>();

    let url = "https://mediospublicos.uy/category/radio/radio-uruguay/";
    let content = await this.webUtils.get(url);
    const root: parsedElement = htmlParse(content);

    // Get the list of programs available 
    let subMenu: parsedElement = root.querySelector('div.sub-menu');
    let programAnchors: Array<parsedElement>
      = subMenu.querySelectorAll('a');
    // console.log(subMenu.innerHTML);
    let programs: Array<IProgram> = new Array<IProgram>();
    for (let programAnchor of programAnchors) {
      // console.log("innerText: " + anchor.innerText);
      // console.log("outerHTML: " + anchor.outerHTML);
      // console.log("innerHTML: " + anchor.innerHTML);
      // console.log("attributes: " + JSON.stringify(anchor.attributes));
      // console.log("href: " + anchor.attributes["href"]);
      let programUrl = url + programAnchor.attributes["href"];
      if (!programUrl.endsWith("/"))
        programUrl += "/";
      programs.push({
        "name": programAnchor.innerText,
        "link": programUrl
      });
    }

    // Get the list of episodes for each program
    for (let program of programs) {
      let episodes: Array<IEpisode> =
        await this.getEpisodes(program.link);
      console.log("GetEpisodes completed: " + program.name + ": " + episodes.length);

      // Get the information for each episode
      for (let episode of episodes) {
        console.log("Episode: " + episode.name);
        let info = await this.getEpisodeInfo(episode.link);
        if (info.link != "not found") {
          const result: IEpisodeLink = {
            "title": program.name + ": " + episode.name,
            "description": program.name + ": " + episode.name,
            "episodeDate": info.date,
            "downloadLink": info.link
          };
          console.log(result);
          results.push(result);
        }
      }
    }


    return results;

  }

  private async getEpisodes(url: string): Promise<Array<IEpisode>> {

    let episodes: Array<IEpisode> = new Array<IEpisode>();
    console.log(url);

    // First look for the title episode (h2 inside an a)
    let content = await this.webUtils.get(url);
    // console.log("content: " + content); 
    const root: parsedElement = htmlParse(content);
    let anchors = root.querySelectorAll('a');
    for (let anchor of anchors) {
      // console.log(anchor.innerHTML);
      let h2 = anchor.querySelector('h2');
      if (h2 != null) {
        let episode: IEpisode = {
          "name": h2.innerText,
          "link": anchor.attributes["href"]
        };
        console.log(episode);
        episodes.push(episode);
      }
    }

    // Next look for the other episodes (a inside an h3)
    let h3s = root.querySelectorAll("h3");
    // console.log("h3s: " + h3s.length);
    for (let h3 of h3s) {
      let anchor2 = h3.querySelector("a");
      if (anchor2 != null) {
        const link = anchor2.attributes["href"];
        if (link != null) {
          let episode: IEpisode = {
            "name": anchor2.innerText,
            "link": link
          }
          console.log(episode);
          episodes.push(episode);

        }
      }
    }
    return episodes;
  }

  private async getEpisodeInfo(url: string): Promise<IEpisodeInfo> {
    // console.log(url);
    let content = await this.webUtils.get(url);
    const root: parsedElement = htmlParse(content);
    const audio: parsedElement = root.querySelector('audio');
    if (audio != null) {
      const source: parsedElement = audio.querySelector('source');
      if (source != null) {
        const link = source.attributes["src"];

        // Get the date of the episode
        const ps = root.querySelectorAll('p');
        for (let p of ps) {
          const span = p.querySelector('.span-reading-time');
          if (span != null) {
            // console.log(p.innerText.substring(0,10));
            // console.log(link);
            let info: IEpisodeInfo = {
              date: p.innerText.substring(0, 10),
              link: link
            };
            return info;
          }
        }
      }
    }
    let info: IEpisodeInfo = {
      date: "not found",
      link: "not found"
    };
    return info;
  }



}
