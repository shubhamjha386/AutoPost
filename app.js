const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const clipboardy = require('clipboardy');
require('dotenv').config();

app.set('view engine','ejs');
app.use(express.urlencoded({ extended:true }));
app.use(express.json())
app.set('views',path.join(__dirname,'/views'));

app.get('/',(req,res)=>{
    res.render('index');
})
app.post('/post', async (req,res)=>{
   const {text} = req.body;
   await automate(text);
   res.send("Successfully posted");
})

const groups = [
    "525853335484484",
    "udemycoupons100",
    "1858168261178187",
    "233605007217186",
    "1528436204114835",
    "1858168261178187",
    "1705441936336011",
    "vircourses",
    "306743116962482",
    "985110011935899",
    "sirdevitzone",
    "335187064618467",
    "928759187188339",
    "213060555729990",
    "dailyfreecourse",
    "claydesk",
    "347513582671431",
    "491576574833287",
    "252432499320404",
    "941431915975266",
    "onlinecouponcourses",
    "198478481360875",
    "892013841635214",
    "freeudemycouponandcourses",
    "2715863415329693",
    "FreeOnlineCoursesWithCoupon",
    "1489302821099883",
    "UdemyFreeCoursesGroup",
    "427365844137526",
    "366854487897884",
    "548558866554350",
    "2137289883230865",
    "couponera",
    "3465950190148775",
    "2032587143439984",
    "Upto100PercentOff",
    "1496231454013332",
    "udemyten",
    "onlinecourses365",
    "272114583127399"
]
const width = 1024;
const height = 1600;
const automate = async (text)=>{
  const browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      args:[
        '--start-maximized' 
     ]
  });
  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://m.facebook.com/", ["geolocation", "notifications"]);
  const page = await browser.newPage();
  await page.setViewport({'width' : width, 'height' : height});
  await page.setUserAgent( 'UA-TEST' );
  await page.goto('https://m.facebook.com/');
  await page.waitForSelector('#m_login_email');
  await page.type('#m_login_email', process.env.email);
  await page.type('[type="password"]', process.env.password);
  await page.click(`input[type="submit"]`);
  await clipboardy.write(text);
  for(let group of groups)
  {
    try{
    await page.goto(`https://m.facebook.com/groups/${group}/?ref=group_browse`, {waitUntil: 'networkidle0'}); 
    await page.waitForTimeout(2000); 
    await page.focus(`textarea[placeholder="What's on your mind?"]`);
    await page.keyboard.down('Control');
    await page.keyboard.press(String.fromCharCode(86));
    await page.keyboard.up('Control');
    await page.click(`input[value="Post"]`);
    await page.waitForTimeout(2000);
      }
    catch(error)
      {
        continue;
      }
      
  }
  await browser.close();

}

app.listen(5000,()=>console.log("On Port 5000"));