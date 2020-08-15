let guardianAPIKey = "a1c3590a-2c8e-40cd-b2d0-dee84a0e157b";
let nytAPIKey = "GzxoHW8cZYj7aIBH4b3NGwpSBaSBcOJW";

guardianSearchURL = keyword => 
  `https://content.guardianapis.com/search?q=${keyword}&api-key=${guardianAPIKey}&show-blocks=all&page-size=15`;

nytSearchURL = keyword => 
  `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${nytAPIKey}`

guardianDetailURL = id => 
  `https://content.guardianapis.com/${id}?api-key=${guardianAPIKey}&show-blocks=all`

nytDetailURL = id => 
  `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("${id}")&api-key=${nytAPIKey}`

guardianURL = section => 
  section === "Home" ?
    `https://content.guardianapis.com/search?api-key=${guardianAPIKey}&section=(sport|business|technology|politics)&show-blocks=all&page-size=15` :
    `https://content.guardianapis.com/${section.toLowerCase()}?api-key=${guardianAPIKey}&show-blocks=all&page-size=15`

nytURL = section => 
  section === "Home" ?
    `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${nytAPIKey}` :
    `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${nytAPIKey}`

defaultGuardianImageURL = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"

defaultNYTImageURL = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"

exports.guardianSearchURL = guardianSearchURL;
exports.nytSearchURL = nytSearchURL;
exports.guardianDetailURL = guardianDetailURL;
exports.nytDetailURL = nytDetailURL;
exports.guardianURL = guardianURL
exports.nytURL = nytURL;
exports.defaultGuardianImageURL = defaultGuardianImageURL;
exports.defaultNYTImageURL = defaultNYTImageURL;