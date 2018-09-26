# maternity-leave
Currently, the United States is the only developed nation that has no federal policy for paid maternity leave. As a result, many new mothers in the US must rely heavily on their employers to grant them paid maternity leave and benefits. I was curious to know how many US employers granted their employees maternity leave, and to what extent compared to other countries that have federal policies mandating maternity leave.

## how it works
Data is from FairyGodBoss's Maternity Resource Center. I wrote an HTML web scraper in Python that loads a page from FairyGodBoss, gets the data from the table, and stores it in a JSON object. The web scraper is available in the `/assets` folder and can be run using Jupyter Notebook.

The data is visualized using [d3.js](https://d3js.org/). 

Special thank you to Jim Valladingham for his [scroll tutorial(http://vallandingham.me/scroller.html), and to Susie Lu for her [d3-annotation](http://d3-annotation.susielu.com/) library.
