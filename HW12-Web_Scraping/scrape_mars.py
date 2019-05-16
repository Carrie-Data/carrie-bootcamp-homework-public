from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import time


def init_browser():
    import os
    print(os.getcwd())
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=False)

def scrape():

    # Create an empty dictionary to put all the scrapped data.
    mars = {}

    # NASA Mars News
    browser = init_browser()

    mars_news_url = 'https://mars.nasa.gov/news/'
    browser.visit(mars_news_url)
    time.sleep(2)

    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    
    news_title = soup.select('.content_title')[0].text
    news_p = soup.select('.article_teaser_body')[0].text
    print(news_p)
    print(news_title)

    mars['news_title'] = news_title
    mars['news_teaser'] = news_p

    # JPL Mars Space Images- Featured Image
    mars_image_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(mars_image_url)
    time.sleep(1)

    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    footer = soup.select('footer')[0]   
    featured_image = footer.a['data-fancybox-href']
    base_url = 'https://www.jpl.nasa.gov'
    featured_image_url = base_url + featured_image
    print(featured_image_url)

    mars['featured_image'] = featured_image_url

    # Mars Weather
    mars_twitter_url = 'https://twitter.com/marswxreport'
    browser.visit(mars_twitter_url)
    time.sleep(1)

    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    tweet = soup.find('div', attrs = {'class':'tweet', 'data-name':'Mars Weather'})
    mars_weather = tweet.select('.TweetTextSize')[0].text
    print(mars_weather)

    mars['weather'] = mars_weather

    # Mars Facts
    mars_facts_url = 'https://space-facts.com/mars/'
    mars_tables = pd.read_html(mars_facts_url)
    mars_facts_df = mars_tables[0]
    mars_facts_df.columns = ['description', 'value']
    mars_facts_df.set_index('description', inplace=True)
    print(mars_facts_df)

    mars_facts_html = mars_facts_df.to_html()

    mars['table'] = mars_facts_html

    # Mars Hemispheres
    hemispheres_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemispheres_url)
    hemi_url = 'https://astrogeology.usgs.gov'
    time.sleep(1)

    #Cerberus
    browser.click_link_by_partial_text('Cerberus')
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    cerberus_title = soup.select('h2.title')[0].text
    cerberus_jpg = soup.select('img.wide-image')[0]['src']

    cerberus_url = hemi_url + cerberus_jpg

    print(cerberus_title)
    print(cerberus_url)

    #Schiaparelli
    browser.back()
    browser.click_link_by_partial_text('Schiaparelli')
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    schiaparelli_title = soup.select('h2.title')[0].text
    schiaparelli_jpg = soup.select('img.wide-image')[0]['src']

    schiaparelli_url = hemi_url + schiaparelli_jpg

    print(schiaparelli_title)
    print(schiaparelli_url)

    #Syrtis
    browser.back()
    browser.click_link_by_partial_text('Syrtis')
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    syrtis_title = soup.select('h2.title')[0].text
    syrtis_jpg = soup.select('img.wide-image')[0]['src']

    syrtis_url = hemi_url + syrtis_jpg

    print(syrtis_title)
    print(syrtis_url)

    #Valles
    browser.back()
    browser.click_link_by_partial_text('Valles')
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    valles_title = soup.select('h2.title')[0].text
    valles_jpg = soup.select('img.wide-image')[0]['src']

    valles_url = hemi_url + valles_jpg

    print(valles_title)
    print(valles_url)

    #Combined Dictionary
    hemisphere_image_urls = [{'title': cerberus_title, 'img_url': cerberus_url},
                            {'title': schiaparelli_title, 'img_url': schiaparelli_url},
                            {'title': syrtis_title, 'img_url': syrtis_url},
                            {'title': valles_title, 'img_url': valles_url}]
    print(hemisphere_image_urls)

    mars['hemisphere'] = hemisphere_image_urls

    browser.quit()
    
    return (mars)

