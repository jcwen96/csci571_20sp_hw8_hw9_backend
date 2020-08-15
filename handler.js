const fetch = require('node-fetch');
const network = require('./network');

// Server make external api call
callGuardianSearch = (keyword, res) => {
  let url = network.guardianSearchURL(keyword);
  console.log("");
  console.log(`INFO: Server makes a call to ${url}`);
  fetch(url)
    .then(res => res.json())
    .then(myJSON => {
      res.json(getNews(myJSON.response.results, true).slice(0, 15));
      console.log(`INFO: Server responds with json.`);
      }, err => {
        console.log(`ERROR: Server fails to call search from The Guardian`);
        console.error(err);
      });
}

callNYTimesSearch = (keyword, res) => {
  let url = network.nytSearchURL(keyword);
  console.log("");
  console.log(`INFO: Server makes a call to ${url}`);
  fetch(url)
    .then(res => res.json())
    .then(myJSON => {
      res.json(getNYTimesSearch(myJSON.response.docs).slice(0, 15));
      console.log(`Server responds with json.`);
      console.log("");
      }, err => {
        console.log(`Server fails to call search from The NYTimes`);
        console.error(err);
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
  let url = isGuardian ? network.guardianDetailURL : network.nytDetailURL;
  console.log("");
  console.log(`INFO: Server makes a call to ${url}`);
  fetch(url)
    .then(res => res.json())
    .then(myJSON => {
      isGuardian ? 
        res.json(getNewsDetail(myJSON.response.content, true)) :
        res.json(getNewsDetail(myJSON.response.docs[0], false));
      console.log(`INFO: Server respond with json.`);
    }, err => {
      console.log(`ERROR: Server fail to make a call to ${url}`);
      console.error(err);
    });
}

getNewsDetail = (NewsDetail, isGuardian) => {
  try {
    let ImageLink = isGuardian ? "" : filterNYTimesImage(NewsDetail.multimedia);
    if (ImageLink !== "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg")
      ImageLink = "https://static01.nyt.com/" + ImageLink;
    let result = isGuardian ? 
      getGuardianNew(NewsDetail) : 
      {
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
    console.log(`ERROR: Server fail to get News detail`);
    console.error(e);
    return e;
  }
}

callGuardian = (section, res) => {
  if (section === "Sports") section = "sport";
  let url = network.guardianURL(section);
  console.log("");
  console.log(`INFO: Server make a call to ${url}`);
  fetch(url)
    .then(res => res.json())
    .then(myJSON => {
      res.json(getNews(myJSON.response.results, true).slice(0, 15));
      console.log(`INFO: Server respond with json.`);
    }, e => {
      console.log(`ERROR: Server fail to call The Guardian`);
      console.error(e);
    });
}

callNYTimes = (section, res) => {
  let url = network.nytURL(section);
  console.log("");
  console.log(`INFO: Server make a call to ${url}`);
  fetch(url)
    .then(res => res.json())
    .then(myJSON => {
      res.json(getNews(myJSON.results, false).slice(0, 15));
      console.log(`INFO: Server respond with json.`);
    }, e => {
      console.log(`ERROR: Server fail to call New York Times`);
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
    console.log(`  INFO: This piece of news from Guardian miss some fields, skip it`);
    console.log(e);
    return "skip";
  }
}

filterGuardianImage = (images) => {
  if (images.length === 0) return network.defaultGuardianImageURL;
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
    console.log(`  INFO: This piece of news from NY Times miss some fields, skip it`);
    console.log(e);
    return "skip";
  }
}

// @paraType: images is an array
filterNYTimesImage = (images) => {
  for (let i = 0; i < images.length; i++)
    if (images[i].width > 1999) return images[i].url;
  return network.defaultNYTImageURL;
}

// @paraType: str is a string
convertDate = (str) => {
  let date = new Date(str);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
}

exports.callGuardian = callGuardian;
exports.callGuardianSearch = callGuardianSearch
exports.callNYTimes = callNYTimes
exports.callNYTimesSearch = callNYTimesSearch
exports.callNewsDetail = callNewsDetail