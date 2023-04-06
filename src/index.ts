import { createServer, IncomingMessage, ServerResponse } from 'http'
import Cards from './controller/cards';
import url from 'url';
import * as fs from 'fs';
import mime from 'mime';
import dotenv from 'dotenv';

dotenv.config()

const host = process.env.HOST || 'localhost'
const port = parseInt(process.env.PORT) || 8080;
const requestListener = async function (req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

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


  if (reqUrl.includes('/assets/')) {
    try {
      const filePath = __dirname + reqUrl
      const content = await fs.promises.readFile(__dirname + reqUrl)

      res.setHeader("Content-Type", mime.getType(filePath));
      res.writeHead(200);
      res.end(content);
    } catch (e) {
      res.writeHead(404);
      res.end();
    }

    return
  }

  res.writeHead(404)
  res.end('Not found')
};

const server = createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
