require("dotenv").config();
const dns = require("dns");
const randomInt = require("./logic");
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urlPost = app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  try {
    new URL(url);
  } catch (error) {
    res.json({ error: "invalid url" });
  }
  const hostname = new URL(url).hostname;

  dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      const short_url = randomInt();
      res.json({ original_url: url, short_url: short_url });
      app.get(`/api/shorturl/${short_url}`, (req, res) => {
        console.log(url);
        res.redirect(url);
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
