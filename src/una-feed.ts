import { GoogleFeed } from "./google-feed";

export class UnaMasUnoFeed extends GoogleFeed {

    private nameCode: string;

    public constructor() {
        let nameCode = "unamasuno";
        super({
            title: "Una Más Uno",
            description: "Daily news and chat show with Kiko Barroso.",
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
        super.updateFeed("una-mas-uno-14330",
        this.options.title + " ", this.nameCode, 5);
    }
}