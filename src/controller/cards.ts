import { IncomingMessage, ServerResponse } from 'http';
import data from '../data/cards.json'
import * as url from 'url';

export default class Cards {
  getCards(req: IncomingMessage, res: ServerResponse) {
    const query = url.parse(req.url, true).query

    const { q } = query;
    const result = typeof q === 'string' ? data.filter((card) => card.name.toLowerCase().includes(q.toLowerCase())) : data

    res.writeHead(200);
    res.end(JSON.stringify(result));
  }
}
