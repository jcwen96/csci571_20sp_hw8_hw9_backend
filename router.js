const handler = require("./handler");
const handler_ios = require("./handler_ios");


function route(app) {

  app.get('/', (req, res) => {
    console.log(`INFO: ${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
    res.send("Hello, this is the RESTful API for backend of Homework8 of CSCI 571 in USC.");
  });
  
  // Routing
  app.get('/:source/:section', (req, res, next) => {
    console.log(`INFO: ${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
    let supportSection = ["Home", "World", "Politics", "Business", "Technology", "Sports"]
    if (supportSection.includes(req.params.section)) {
      switch(req.params.source) {
        case "Guardian":
          handler.callGuardian(req.params.section, res);
          break;
        case "NYTimes":
          handler.callNYTimes(req.params.section, res);
          break;
        default:
          next();
      }
    } else
      next();
  });
  
  app.get('/article/:source/:id', (req, res, next) => {
    console.log(`INFO: ${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
    switch(req.params.source) {
      case "Guardian":
        handler.callNewsDetail(true, req.params.id, res);
        break;
      case "NYTimes":
        handler.callNewsDetail(false, req.params.id, res);
        break;
      default:
        next();
    }
  });
  
  app.get('/search/:source/:keyword', (req, res, next) => {
    console.log(`INFO: ${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
    switch(req.params.source) {
      case "Guardian":
        handler.callGuardianSearch(req.params.keyword, res);
        break;
      case "NYTimes":
        handler.callNYTimesSearch(req.params.keyword, res);
        break;
      default:
        next()
    }
  });

  // MARK: for iOS
  app.get("/ios/home", (req, res) => {
    console.log(`INFO: ${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
    handler_ios.callGuardian(res)
  });

  app.get("/ios/:section", (req, res) => {
    res.send("Section " + req.params.section)
  });

  app.get("/ios/article/:id");

  app.get("ios/search/:keyword");

  app.get("ios/trend");

  
  app.use((req, res, next) => {
    res.status(404).send("Sorry, no support for this API endpoint.")
  });
  
}

exports.route = route