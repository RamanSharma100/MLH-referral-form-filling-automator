import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import morgan from "morgan";
import cors from "cors";
import xlsx from "xlsx";
import puppeteer from "puppeteer";
import multer from "multer";

const app = express();

app.set("view engine", "ejs");
app.use(expressEjsLayouts);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/start", upload.single("file"), async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await page.goto(
    "https://majorleaguehacking.typeform.com/to/nFXeE5HQ?event=Global+Hack+Week&referrer_email=tech.smani%40gmail.com&referrer_name=Suraj+Mani&skip_intro=true&typeform-source=majorleaguehacking.typeform.com"
  );

  for (let i = 0; i < data.length; i++) {
    await page.waitForSelector("input");
    // type on input with name as "email"
    await page.type("input[name=given-name]", data[i].Fname);
    await page.type("input[name=family-name]", data[i].Lname);
    await page.type("input[name=email]", data[i].Email);
    await page.keyboard.down("Control");
    await page.keyboard.press("Enter");
    await page.keyboard.up("Control", { delay: 1000 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
  }

  await browser.close();

  // await page.waitForSelector("input");
  // // type on input with name as "email"
  // await page.type("input[name=given-name]", data[0].Fname);
  // await page.type("input[name=family-name]", data[0].Lname);
  // await page.type("input[name=email]", data[0].Email);

  // await page.keyboard.down("Control");
  // await page.keyboard.press("Enter");
  // await page.keyboard.up("Control");
  // await page.waitForSelector("button");
  // await page.keyboard.press("Enter");

  res.send(data);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
