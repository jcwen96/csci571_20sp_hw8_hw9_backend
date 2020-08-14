const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const port = process.env.PORT || 8080;

app.use(cors());

app.listen(port, () => console.log(`Homework8/9后端应用，侦听端口${port}`));

app.get('/', (req, res) => {
  console.log(`${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
  res.send("Hello, this is the RESTful API for backend of Homework8 of CSCI 571 in USC.");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Sorry, something inside the server broke.`);
});

// Routing
app.get('/:source/:section', (req, res) => {
  console.log(`${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
  let isSupportSection = ["Home", "World", "Politics", "Business", "Technology", "Sports"].includes(req.params.section);
  if (!isSupportSection) 
    res.status(404).send(`This section [${req.params.section}] is not supported.`);
  else req.params.source === "Guardian" ? 
    callGuardian(req.params.section, res) : req.params.source === "NYTimes" ?
    callNYTimes(req.params.section, res) :
    res.status(404).send(`This news source [${req.params.source}] is not supported.`);
});

app.get('/article/:source/:id', (req, res) => {
  console.log(`${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
  req.params.source === "Guardian" ?
    callNewsDetail(true, req.params.id, res): req.params.source === "NYTimes" ? 
    callNewsDetail(false, req.params.id, res) :
    res.status(404).send(`This news source [${req.params.source}] is not supported.`);
});

app.get('/search/:source/:keyword', (req, res) => {
  console.log(`${req.method} from [${req.hostname}] for [${req.originalUrl}]`);
  req.params.source === "Guardian" ? 
    callGuardianSearch(req.params.keyword, res) : req.params.source === "NYTimes" ?
    callNYTimesSearch(req.params.keyword, res) :
    res.status(404).send(`This news source [${req.params.source}] is not supported.`);
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, no support for this API endpoint.")
})

// Server make external api call
callGuardianSearch = (keyword, res) => {
  let url = `https://content.guardianapis.com/search?q=${keyword}&api-key=a1c3590a-2c8e-40cd-b2d0-dee84a0e157b&show-blocks=all&page-size=15`;
  console.log(`Server makes a call to ${url}`);
  fetch(url).then(res => res.json()).then(myJSON => {
    res.json(getNews(myJSON.response.results, true).slice(0, 15));
    console.log(`Server responds with json.`);
    console.log("");
  }, e => {
    console.log(`Server fails to call search from The Guardian`);
    console.error(e);
  });
}

callNYTimesSearch = (keyword, res) => {
  let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=GzxoHW8cZYj7aIBH4b3NGwpSBaSBcOJW`;
  console.log(`Server makes a call to ${url}`);
  fetch(url).then(res => res.json()).then(myJSON => {
    res.json(getNYTimesSearch(myJSON.response.docs).slice(0, 15));
    console.log(`Server responds with json.`);
    console.log("");
  }, e => {
    console.log(`Server fails to call search from The NYTimes`);
    console.error(e);
  });
}

getNYTimesSearch = (NewsJSON) => {
  let News = [];
  for (let i = 0; i < NewsJSON.length; i++) {
    let result = getNewsDetail(NewsJSON[i], false);
    if (result !== "skip") News.push(result);
  }
  return News;
}

callNewsDetail = (isGuardian, id, res) => {
  let url = isGuardian ? `https://content.guardianapis.com/${id}?api-key=a1c3590a-2c8e-40cd-b2d0-dee84a0e157b&show-blocks=all` : `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("${id}")&api-key=GzxoHW8cZYj7aIBH4b3NGwpSBaSBcOJW`;
  fetch(url).then(res => res.json()).then(myJSON => {
    isGuardian ? 
      res.json(getNewsDetail(myJSON.response.content, true)) :
      res.json(getNewsDetail(myJSON.response.docs[0], false));
    console.log(`Server respond with json.`);
    console.log("");
  }, e => {
    console.log(`Server fail to make a call to ${url}`);
    console.error(e);
  });
}

getNewsDetail = (NewsDetail, isGuardian) => {
  try {
    let ImageLink = isGuardian ? "" : filterNYTimesImage(NewsDetail.multimedia);
    if (ImageLink !== "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg")
      ImageLink = "https://static01.nyt.com/" + ImageLink;
    let result = isGuardian ? getGuardianNew(NewsDetail) : {
      id: NewsDetail.web_url,
      URL: NewsDetail.web_url,
      Title: NewsDetail.headline.main,
      Image: ImageLink,
      Section: NewsDetail.news_desk,
      Date: convertDate(NewsDetail.pub_date),
      Description: NewsDetail.abstract
    };
    if (result === "skip") throw e
    return result;
  } catch (e) {
    console.log(`Server fail to get News detail`);
    console.error(e);
    return e;
  }
}

callGuardian = (section, res) => {
  if (section === "Sports") section = "sport";
  let url = section === "Home" ?
    `https://content.guardianapis.com/search?api-key=a1c3590a-2c8e-40cd-b2d0-dee84a0e157b&section=(sport|business|technology|politics)&show-blocks=all&page-size=15` :
    `https://content.guardianapis.com/${section.toLowerCase()}?api-key=a1c3590a-2c8e-40cd-b2d0-dee84a0e157b&show-blocks=all&page-size=15`;
  console.log(`Server make a call to ${url}`);
  fetch(url).then(res => res.json()).then(myJSON => {
    res.json(getNews(myJSON.response.results, true).slice(0, 15));
    console.log(`Server respond with json.`);
    console.log("");
  }, e => {
    console.log(`Server fail to call The Guardian`);
    console.error(e);
  });
}

callNYTimes = (section, res) => {
  let url = section === "Home" ?
    `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=GzxoHW8cZYj7aIBH4b3NGwpSBaSBcOJW` :
    `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=GzxoHW8cZYj7aIBH4b3NGwpSBaSBcOJW`;
  console.log(`Server make a call to ${url}`);
  fetch(url).then(res => res.json()).then(myJSON => {
    res.json(getNews(myJSON.results, false).slice(0, 15));
    console.log(`Server respond with json.`);
    console.log("");
  }, e => {
    console.log(`Server fail to call New York Times`);
    console.error(e)
  });
}

// @paraType: NewsJSON is an array; isGuardian is a boolean
getNews = (NewsJSON, isGuardian) => {
  let News = [];
  for (let i = 0; i < NewsJSON.length; i++) {
    let result = isGuardian ? getGuardianNew(NewsJSON[i]) : getNYTimesNew(NewsJSON[i]);
    if (result !== "skip") News.push(result);
  }
  return News;
}

// @paraType: NewJSON is an object (myJSON.response.results[i])
getGuardianNew = (NewJSON) => {
  try {
    return {
      id: NewJSON.id,
      URL: NewJSON.webUrl,
      Title: NewJSON.webTitle,
      Image: filterGuardianImage(NewJSON.blocks.main.elements[0].assets),
      Section: NewJSON.sectionId,
      Date: convertDate(NewJSON.webPublicationDate),
      Description: NewJSON.blocks.body[0].bodyTextSummary
    }
  } catch (e) {
    console.log(`This piece of news from Guardian miss some fields, skip it`);
    console.log(e);
    return "skip";
  }
}

filterGuardianImage = (images) => {
  if (images.length === 0) return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
  return images.slice(-1)[0].file;
}

// @paraType: NewJSON is an object
getNYTimesNew = (NewJSON) => {
  try {
    return {
      id: NewJSON.url,
      URL: NewJSON.url,
      Title: NewJSON.title,
      Image: filterNYTimesImage(NewJSON.multimedia),
      Section: NewJSON.section,
      Date: convertDate(NewJSON.published_date),
      Description: NewJSON.abstract
    }
  } catch (e) {
    console.log(`This piece of news from NY Times miss some fields, skip it`);
    console.log(e);
    return "skip";
  }
}

// @paraType: images is an array
filterNYTimesImage = (images) => {
  for (let i = 0; i < images.length; i++)
    if (images[i].width > 1999) return images[i].url;
  return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
}

// @paraType: str is a string
convertDate = (str) => {
  let date = new Date(str);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
}