# Maternity Leave in the US
#### Demo: https://mandicai.github.io/maternity-leave/
Currently, the United States is the only developed nation that has no federal policy for paid maternity leave. As a result, many new mothers in the US must rely heavily on their employers to grant them paid maternity leave and benefits. I was curious to know how many US employers granted their employees maternity leave, and to what extent compared to other countries that have federal policies mandating maternity leave.

## How it works
Data is from [Fairygodboss's Maternity Resource Center](https://fairygodboss.com/maternity-leave-resource-center). I wrote an HTML web scraper in Python that loads a page from Fairygodboss, gets the data from the table, and stores it in a JSON object. The web scraper is available in the `/assets` folder and can be run using Jupyter Notebook.

The data is visualized using [d3.js](https://d3js.org/).

Special thank you to Jim Valladingham for his [scroll tutorial](http://vallandingham.me/scroller.html), and to Susie Lu for her [d3-annotation](http://d3-annotation.susielu.com/) library.

## Run it
To run, `git clone` the repo, `cd` into the project, and run `http-server -c-1 -p 8000` (or any local server of your choice) to view the project at `localhost:8000`.

## Resources
Making a bubble chart:
- https://observablehq.com/@d3/bubble-chart
- https://github.com/d3/d3-force
- https://medium.com/@sxywu/understanding-the-force-ef1237017d5

Building a web scraper with Python and Jupyter Notebook
- https://docs.python-guide.org/scenarios/scrape/
