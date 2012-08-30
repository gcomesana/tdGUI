require 'nokogiri'
require 'open-uri'

# Get a Nokogiri::HTML:Document for the page we’re interested in...

doc = Nokogiri::HTML(open('http://www.google.com/search?q=tenderlove'))

# Do funky things with it using Nokogiri::XML::Node methods...

####
# Search for nodes by css
doc.css('h3.r a').each do |link|
  puts link.content
end

####
# Search for nodes by xpath
doc.xpath('//h3/a').each do |link|
  puts link.content
end

####
# Or mix and match.
doc.search('h3.r a.l', '//h3/a').each do |link|
  puts link.content
end