const axios = require('axios');
const assemble = require('assemble');
const app = assemble();
const fs = require('fs');

// Define the path to your templates
app.layouts('proxy-server/templates/layout.hbs');
app.pages('proxy-server/templates/page.hbs');

// Fetch content from the external website
axios.get('https://withjoy.com/andrew-and-emma-aug-25/registry')  // The URL of the external website
  .then(response => {
    const externalContent = response.data;  // The HTML content of the external site

    // Inject the external content into the page template
    app.pages(['proxy-server/templates/page.hbs'])
      .data({ externalContent: externalContent })
      // .toArray()
      .forEach(page => {
        page.render(function(err, content) {
          if (err) return console.error(err);
          // Save generated HTML to build directory
          const outputPath = `build/${page.path}`;
          fs.writeFileSync(`build/${page.path}`, { recursive: true });
          fs.writeFileSync(outputPath, content);
        });
      });

    console.log('Assemble build complete!');
  })
  .catch(error => {
    console.error('Error fetching external content:', error);
  });






// 'use strict';

// var assemble = require('assemble');
// var app = assemble();

// app.task('default', function() {
//   app.pages('templates/*.hbs');
//   return app.toStream('pages')
//     .pipe(app.renderFile())
//     .pipe(app.dest('dist'));
// });

// module.exports = app;
