// Program for updating the rss file

import { Feed } from "feed";
import {RadioUruguayFeed } from './radiouruguay-feed';
import {EspectadorFeed} from './espectador-feed';
import {SpanishlandFeed} from './spanishland-feed';
import {VillarrazaFeed} from './villarraza-feed';

export class Controller {

    public async updateAll() {

        let radioUruguayFeed = new RadioUruguayFeed();
        await radioUruguayFeed.updateFeed();

        let espectadorFeed = new EspectadorFeed();
        await espectadorFeed.updateFeed();

        let spanishlandFeed = new SpanishlandFeed();
        await spanishlandFeed.updateFeed();

        let villarrazaFeed = new VillarrazaFeed();
        await villarrazaFeed.updateFeed();
    }

} // end of class controller





