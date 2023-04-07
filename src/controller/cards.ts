import { IncomingMessage, ServerResponse } from 'http';
import cards from '../data/cards.json';
import * as url from 'url';

export default class Cards {
  getCards(req: IncomingMessage, res: ServerResponse) {
    const query = url.parse(req.url, true).query

    const { q } = query;
    const data = typeof q === 'string' ? cards.filter((card) => {
      const fields = [card.name, card.time, card.price]
      for (const field of fields) {
        if (field.toString().toLowerCase().includes(q.toLowerCase())) {
          return true
        }
      }
      return false
    }) : cards

    const result = data.map((card) => ({ ...card, image: process.env.BASE_URL + card.image}))

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

    const card = cards.find(({ id: cardId }) => cardId === idNum)
    if (!card) {
      res.writeHead(404)
      res.end();
      return
    }

    const result = { ...card, image: process.env.BASE_URL + card.image}

    res.writeHead(200);
    res.end(JSON.stringify(result));
  }
}
