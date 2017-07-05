# Udacity's Neighborhood Map Project
## Mike and Lidija's Guide to Portland

This is a project for the Udacity Front-End Web Developer Nanodegree. The goal is to create a singe page app using the Google API and another third party API (I have chosen FourSquare). 

The app allows you to search the listings and display the locations of each place. When clicked, more information will be displayed.

On the backend, the programming also uses Knockout.js to manage the data structure.

Here is the link to the site https://duck84.github.io/map/.

To open it locally: 
1. Download the repository.
2. Download and install [ngrok](https://ngrok.com/) to the top-level of your project directory to make your local server accessible remotely.
3. Create a new localhost with python.

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```
4. Open a browser and visit localhost:8080
5. Run ngrok.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ./ngrok http 8080
  ```

6. Copy the public URL ngrok gives you and run that to have an online 

### Sources

* http://knockoutjs.com/documentation/introduction.html
* https://developers.google.com/maps/documentation/javascript/tutorial
* https://developer.foursquare.com/overview/

Special thanks to:
* The Udacity Forums and espically Karol
* Stack Overflow
