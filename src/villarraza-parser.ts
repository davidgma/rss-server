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



export class Parser {

  private webUtils: WebUtils;

  constructor() {
    this.webUtils = new WebUtils();
  }

  public async getEpisodeLinks(maxToGet: number = 0) {
    let results = new Array<IEpisodeLink>();

    let url = "https://filedn.com/l8l3tmJlFBQbibudQ3R2XYu/VictorVillarraza/";
    let content = await this.webUtils.get(url);

    let directLinkDataStart = content.indexOf("var directLinkData") + 19;
    let directLinkDataEnd = content.indexOf("</script>", directLinkDataStart) - 2;
    let directLinkDataText = content.substring(directLinkDataStart, directLinkDataEnd);
    //console.log(directLinkDataText);
    let directLinkData = JSON.parse(directLinkDataText);
    let episodes = directLinkData.content;
    for (let episode of episodes) {
      if (episode.name.endsWith("mp3")) {
        const episodeLink: IEpisodeLink = {
          "episodeDate": episode.modified,
          "title": episode.name,
          "description": "Episode " + episode.name
            + " from Librivox, edited to quieten the louder parts.",
          "downloadLink": url + episode.urlencodedname
        };
        console.log(episodeLink);
        results.push(episodeLink);
        // console.log(episode.name);
        // console.log(episode.urlencodedname);
        // console.log(episode.modified);

      }
    }

    return results.sort(this.compareEpisodes);

  }

  private compareEpisodes(a: IEpisodeLink, b: IEpisodeLink): number {
    if (a.title < b.title)
      return 1;
    if (a.title > b.title)
      return -1;
    return 0;

  }



}
