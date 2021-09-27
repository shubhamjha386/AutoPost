const express = require("express");
const app = express();
const path = require("path");
const puppeteer = require("puppeteer");
const clipboardy = require("clipboardy");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/post", async (req, res) => {
  const { text } = req.body;
  await automate(text);
  res.redirect("/");
});

const groups = require("./data/groups");
const width = 1024;
const height = 1600;

const automate = async (text) => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    args: ["--start-maximized"],
  });
  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://m.facebook.com/", [
    "geolocation",
    "notifications",
  ]);

  const page = await browser.newPage();
  await page.setViewport({ width: width, height: height });
  await page.setUserAgent("UA-TEST");
  await page.goto("https://m.facebook.com/");
  await page.waitForSelector("#m_login_email");
  await page.type("#m_login_email", process.env.email);
  await page.type('[type="password"]', process.env.password);
  await page.click(`input[type="submit"]`);
  await clipboardy.write(text);

  for (let group of groups) {
    try {
      await page.goto(
        `https://m.facebook.com/groups/${group}/?ref=group_browse`,
        { waitUntil: "networkidle0" }
      );
      await page.waitForTimeout(2000);
      const textbox = await page.$(`textarea[placeholder="What's on your mind?"]`)
      if(!textbox)  
        continue;
      else
        {
          await textbox.focus();
          await page.keyboard.down("Control");
          await page.keyboard.press(String.fromCharCode(86));
          await page.keyboard.up("Control");
          await page.click(`input[value="Post"]`);
          await page.waitForTimeout(2000);
        }
     
    } catch (error) {
      console.log(error);
    }
  }
  await browser.close();
};

app.listen(5000, () => console.log("On Port 5000"));
