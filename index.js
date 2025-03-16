const fs = require ('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');


/////////////////////////////////
// FILES

//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// //Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written');
//       })
//     });
//   });
// });


/////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// function replaceTemplate(temp, product) {   //temp is the template and product is the object  
//   let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = output.replace(/{%IMAGE%}/g, product.image);
//   output = output.replace(/{%PRICE%}/g, product.price);
//   output = output.replace(/{%FROM%}/g, product.from);
//   output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//   output = output.replace(/{%QUANTITY%}/g, product.quantity);
//   output = output.replace(/{%DESCRIPTION%}/g, product.description);
//   output = output.replace(/{%ID%}/g, product.id);
  
//   if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//   return output;
// }

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);    //dataObj holds all of the products details in the form of an array of objects

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url, true));  //url.parse() method returns an object containing the url's individual components and we mention true to get the query string as an object
    // const pathname = req.url;

    const { query, pathname } = url.parse(req.url, true);  //destructuring the object returned by url.parse() method. pathname is only the path without the query string like ?id=0
    
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    else if (pathname === '/product') {
      res.writeHead(200, {
        'Content-type': 'text/html'
      });
      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    }

    else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    }
    else {
        res.writeHead(404, {
                  'Content-type': 'text/html',
                  'my-own-header': 'hello-world'
                });
                res.end('<h1>Page not found!</h1>');
              }
            })
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
  });
