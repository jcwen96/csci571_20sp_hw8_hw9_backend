const fetch = require('node-fetch');
const network = require('./network');

callGuardian = res => {
  let url = network.guardianURL_ios;
  console.log("");
  console.log(`INFO: Server make a call to ${url}`);
  fetch(url)
    .then(res => res.json())
    .then(myJSON => {
      res.json(getHomeNews(myJSON.response.results));
      console.log(`INFO: Server respond with json.`);
    }, err => {
      console.log(`ERROR: Server fail to call The Guardian`);
      console.error(err);
    });
}

getHomeNews = NewsJSON => {
  let news = [];
  for (let i = 0; i < NewsJSON.length; i++) {
    try {
      news.push({
        id: NewsJSON[i].id,
        url: NewsJSON[i].webUrl,
        title: NewsJSON[i].webTitle,
        image: NewsJSON[i].fields.thumbnail,
        section: NewsJSON[i].sectionName,
        time: formatTime(NewsJSON[i].webPublicationDate),
      });
    } catch (e) {
      console.log(`  INFO: This piece of news from Guardian miss some fields, skip it`);
      console.log(e);
      continue;
    }
  }
  return news;
}

formatTime = str => {
  var currentTime = new Date();
  var publishTime = new Date(str);
  var diff = (currentTime.getTime() - publishTime.getTime()) / 1000;
  if (diff < 60) {
    diff = Math.round(diff) + "s ago";
  } else if (diff < 3600) {
    diff = Math.round(diff / 60) + "m ago";
  } else if (diff < 24 * 3600) {
    diff = Math.round(diff / 3600) + "h ago";
  } else {
    diff = Math.round(diff / (3600 * 24)) + "d ago";
  }
  return diff;
}

callSection = (section, res) => {
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

exports.callGuardian = callGuardian;