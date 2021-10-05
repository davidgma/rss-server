// Program for updating the rss file

import { Feed } from "feed";
import {RadioUruguayFeed } from './radiouruguay-feed';
import {EspectadorFeed} from './espectador-feed';
import {SpanishlandFeed} from './spanishland-feed';

export class Controller {

    public async updateAll() {

        // let radioUruguayFeed = new RadioUruguayFeed();
        // await radioUruguayFeed.updateFeed();

        // let espectadorFeed = new EspectadorFeed();
        // await espectadorFeed.updateFeed();

        let spanishlandFeed = new SpanishlandFeed();
        await spanishlandFeed.updateFeed();
    }

} // end of class controller





