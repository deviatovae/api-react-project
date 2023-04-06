import { IncomingMessage, ServerResponse } from 'http';
import data from '../data/cards.json';
import * as url from 'url';

export default class Cards {
  getCards(req: IncomingMessage, res: ServerResponse) {
    const query = url.parse(req.url, true).query

    const { q } = query;
    const result = typeof q === 'string' ? data.filter((card) => {
      const fields = [card.name, card.time, card.price, card.description]
      for (const field of fields) {
        if (field.toString().toLowerCase().includes(q.toLowerCase())) {
          return true
        }
      }
      return false
    }) : data

    res.writeHead(200);
    res.end(JSON.stringify(result));
  }
  getCard(id: string, res: ServerResponse) {
    const idNum = parseInt(id)
    if (isNaN(idNum)) {
      res.writeHead(404)
      res.end();
      return
    }

    const card = data.find(({ id: cardId }) => cardId === idNum)
    if (!card) {
      res.writeHead(404)
      res.end();
      return
    }
    res.writeHead(200);
    res.end(JSON.stringify(card));
  }
}
