import { GoogleFeed } from "./google-feed";

export class TardeFeed extends GoogleFeed {

    private nameCode: string;

    public constructor() {
        let nameCode = "tardeotemprano";
        super({
            title: "Tarde O Temprano",
            description: "Afternoon news and chat show.",
            id: "http://rss.davidgma.com/" + nameCode + ".rss",
            link: "http://rss.davidgma.com/" + nameCode + ".rss",
            language: "es", 
            // optional, used only in RSS 2.0, possible values: 
            // http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "http://rss.davidgma.com/" + nameCode + ".png",
            // favicon: "http://example.com/favicon.ico",
            copyright: "Canarias Radio RTVC",
            
        });
        this.nameCode = nameCode;
    }

    public async updateFeed() {
        super.updateFeed("tarde-o-temprano-14331",
        this.options.title + " ", this.nameCode, 5);
    }
}