// Program for updating the rss file

import { Feed } from "feed";
import {RadioUruguayFeed } from './radiouruguay-feed';

export class Controller {

    public async updateAll() {

        let radioUruguayFeed = new RadioUruguayFeed();
        await radioUruguayFeed.updateFeed();

    }

} // end of class controller





