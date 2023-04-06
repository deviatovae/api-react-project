import { createServer, IncomingMessage, ServerResponse } from 'http'
import Cards from './controller/cards';
import url from 'url';

const host = process.env.HOST || 'localhost'
const port = parseInt(process.env.PORT) || 8080;
const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  const cards = new Cards()
  const reqUrl = url.parse(req.url, false).pathname

  if (reqUrl === '/cards') {
    cards.getCards(req, res)
    return
  }

  const cardRoute = '/cards/'
  const cardIdStart = reqUrl.indexOf(cardRoute)
  if (cardIdStart >= 0) {
    const id = reqUrl.substring(cardRoute.length)
    cards.getCard(id, res)
    return
  }

  res.writeHead(404)
  res.end('Not found')
};

const server = createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
