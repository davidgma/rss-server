// Program for updating the rss file

import { Feed } from "feed";
import {RadioUruguayFeed } from './radiouruguay-feed';
import {EspectadorFeed} from './espectador-feed';

export class Controller {

    public async updateAll() {

        let radioUruguayFeed = new RadioUruguayFeed();
        await radioUruguayFeed.updateFeed();

        let espectadorFeed = new EspectadorFeed();
        await espectadorFeed.updateFeed();

    }

} // end of class controller





