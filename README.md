Welcome to OpenPhacts - Target Dossier GUI Application
======================================================
The Target Dossier (TD) goal is to provide a comprehensive view of pharmacologically relevant targets to answer questions regarding druggability, tissue expression profiles and implications in pathways, disease states and physiological mechanisms. 
As the name indicates TD is mainly focused on drug targets allowing users to explore target relevant data that is gathered from very different resources. However it could be argued that several systems and databases sharing the same goal already exist (see for example (Gaulton et al., 2012) (Wu et al., 2009)), the complexity of this integration process justifies the co-existence of different tools/approaches. Particularly this integration entails two main challenges: the information technology challenge (how to combine the data in term of software, APIs, etc.) and the scientific challenge (which data should be taken into account and which methodologies must be followed to integrate the data and extract new knowledge).

Despite the fact that TD meets the requirements for open-source software products developed in the academia, the major goal during the TD development has been to find meaningful ways to combine bioactivity data with resources describing the target’s functional role in the cell. 

To guarantee the coordination within the project several resources have ben established including: a Wiki site that is continuously updated by the consortium members, a GitHub project to store the application source code, weekly telephone conferences, etc.

# Application overview

TD is a Web application built using state of the art standard compliant technologies. The application implements the MVC software design pattern and is mainly coded in Ruby on Rails and JavaScript. Sencha ExtJS (http://www.sencha.com/products/extjs/), an advanced JavaScript framework, has been used for the construction of the views and components. ExtJS supports all modern Web browsers and offer a smoothly interactive experience to the users. TD application can be deployed in almost any Web server having Ruby installed just by following the standard procedures for the deployment of Ruby on Rails applications. A live version is currently hosted in CNIO and is freely available at http://td.inab.es.

The TD app essentially provides tools to satisfy two general use cases. In the first case users can discover targets by entering keywords in the semantic search engine or by exploring the target interaction network. This process will be enhanced through the different versions allowing users to search targets by complex queries including filters or by browsing metabolic pathways. In the second use case the information about a list of targets is presented to the user in a compacted report. Through these two general uses cases the TD app attempts to provide answers to the research questions defined by the EFPIA partners at the beginning of the project.

# Getting Started with TD webapp

In the case you want to play around with the application located at http://td.inab.es/, you just can start using the default examples, although the best deal is to try the Semantic Search. Through it, a concept-related search is performed via ConceptWiki (http://www.conceptwiki.org/) API and results are returned based on the concept. The results are a set of drug targets, which are strongly related to the input term.

Automatic results can be checked and added to the targets list (upon clicking the 'Add' button just beside). 

Upon clicking the 'Search' button, information about the items in the list are retrieved from different sources and displayed as a table. Double-clicking on any row (target) will display on a new tab detailed information about the target the row represents. 

Depending on the available data for the target there will be buttons can retrieve more information about the target:
* Pharmacology button will retrieve compounds which have some relation with the target. The compounds will be displayed on a new tab in a tabular way
* Interactions button will retrieve interactions with another targets and it will be displayed as a graph representing the interactions.

# Notes
### Documentaion building
As the differences between documentation tools and doc-comments for ruby and javascript, documentation for the application looks different and is built using different tools for RoR and ExtJs 4. 
The tool to build server documentation is yard (http://yardoc.org/), and the docs can be got by typing on the application root 

    $ yardoc --no-cache –title "RoR server documentaion for TDGUI" \
        -r README -o <path/to/docs/dir> \
        --exclude thrash --exclude home \
        app/**/*.rb lib/*.rb

To build the ExtJs docs, their own documentation tool, jsduck (https://github.com/senchalabs/jsduck/), which yields a cool documentation. It can be used by typing, always from the application root, 

    $ jsduck --output=doc/extjs-app/ --builtin-classes \
        public/javascripts/extjs4.0.7/ext-all-debug-w-comments.js \
        public/javascripts/extjs4.0.7/ux/  public/javascripts/app/view/ \
        public/javascripts/app/model public/javascripts/app/store \
        public/javascripts/app/controller
      
The documentation is generated in html and can be dropped in any web server for later access.