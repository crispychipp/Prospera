const http = require('http');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.url === "/products" && req.method === "GET") {
    const products = [
      { name: "Produk A", stock: 5 },
      { name: "Produk B", stock: 20 }
    ];

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(products));
  }

  if (req.url === "/inventory" && req.method === "GET") {
    const items = [
      { name: "Produk A", stock: 5 },
      { name: "Produk B", stock: 20 }
    ];

    const lowStock = items.filter(i => i.stock < 10);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(lowStock));
  }

  if (req.url === "/login" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = body ? JSON.parse(body) : {};

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Login success", data }));

      } catch (err) {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});