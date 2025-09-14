# news/management/commands/scrape_news.py

import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from news.models import Article, Category
from datetime import datetime
from urllib.parse import urljoin
import dateutil.parser
import random

# --- User-Agent Rotation ---
# Using a list of user-agents helps avoid getting blocked by websites
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
]

def get_random_user_agent():
    """Returns a random user-agent from the list."""
    return random.choice(USER_AGENTS)

class Command(BaseCommand):
    help = 'Scrapes news articles from multiple sources'

    def handle(self, *args, **kwargs):
        """
        Main handler for the command. It calls the scraping function for each source.
        """
        self.stdout.write(self.style.SUCCESS("Starting the scraping process..."))
        
        # --- Define Your News Sources Here ---
        # Each source is a dictionary with the necessary details for scraping.
        sources = [
            {
                'name': 'ESPN',
                'url': 'https://www.espn.com/',
                'category': 'ESPN Sports',
                'parser': self.parse_espn
            },
            {
                'name': 'BBC Sports',
                'url': 'https://www.bbc.com/sport',
                'category': 'BBC Sports',
                'parser': self.parse_bbc_sports
            },
        ]

        for source in sources:
            self.scrape_source(source)

        self.stdout.write(self.style.SUCCESS("Scraping process finished."))

    def scrape_source(self, source):
        """
        Scrapes a single news source.
        
        Args:
            source (dict): A dictionary containing the source's details.
        """
        self.stdout.write(f"Scraping {source['name']}...")
        headers = {'User-Agent': get_random_user_agent()}
        
        try:
            response = requests.get(source['url'], headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Call the specific parser for this source
            source['parser'](soup, source)
            
        except requests.RequestException as e:
            self.stdout.write(self.style.ERROR(f"Could not fetch {source['url']}. Error: {e}"))

    def save_article(self, article_data):
        """
        Saves a single article to the database after checking for duplicates.
        
        Args:
            article_data (dict): A dictionary containing the article's details.
        """
        # Check if an article with the same source URL already exists
        if Article.objects.filter(source_url=article_data['source_url']).exists():
            self.stdout.write(self.style.WARNING(f"Skipping existing article: {article_data['title']}"))
            return

        try:
            category, _ = Category.objects.get_or_create(name=article_data['category'])
            
            Article.objects.create(
                title=article_data['title'],
                summary=article_data['summary'],
                content=article_data.get('content', ''), # Content is optional
                source_url=article_data['source_url'],
                image_url=article_data.get('image_url'),
                published_at=article_data['published_at'],
                category=category,
                is_featured=article_data.get('is_featured', False)
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully saved: {article_data['title']}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error saving article '{article_data['title']}'. Error: {e}"))

    # --- Parsers for Each News Source ---

    def parse_espn(self, soup, source):
        """
        Parses the HTML from ESPN's latest news page.
        """

        # # Correct way to select elements with multiple classes
        # image_tag = soup.select_one('img.media-wrapper_image')
        
        # # Then get the image URL - check both possible attributes
        # if image_tag:
        #     image_url = image_tag.get('src') or image_tag.get('data-default-src')
        # print(image_url)

        articles = soup.select('section.contentItem--collection')
        for article in articles:
            title_tag = article.select_one('h2.contentItem__title')
            summary_tag = article.select_one('h2.contentItem__title')
            link_tag = article.select_one('a.contentItem__padding')
            image_tag = article.select_one('img.media-wrapper_image')
            
            if not all([title_tag, summary_tag, link_tag]):
                continue

            article_data = {
                'title': title_tag.get_text(strip=True),
                'summary': summary_tag.get_text(strip=True),
                'source_url': urljoin(source['url'], link_tag['href']),
                'image_url': image_tag.get('src') or image_tag.get('data-default-src') if image_tag else None,
                'published_at': datetime.now(), # ESPN does not provide a clear timestamp on this page
                'category': source['category'],
            }
            self.save_article(article_data)
            print(article_data)


    def parse_bbc_sports(self, soup, source):
        """
        Parses the HTML from the BBC Sports homepage.
        """
        # Select all article promo elements
        articles = soup.select('div[data-testid="promo"][type="article"]')
        
        for article in articles:
            # Extract title
            title_tag = article.select_one('h3 a span')
            if not title_tag:
                continue
            title = title_tag.get_text(strip=True)

            # Extract link
            link_tag = article.select_one('h3 a')
            if not link_tag or 'href' not in link_tag.attrs:
                continue
            article_url = urljoin(source['url'], link_tag['href'])

            # Extract summary
            summary_tag = article.select_one('p.ssrcss-1q0x1qg-Paragraph')
            summary = summary_tag.get_text(strip=True) if summary_tag else title

            # Extract image
            image_tag = article.select_one('img')
            image_url = image_tag['src'] if image_tag and 'src' in image_tag.attrs else None

            # # Extract published time
            # time_tag = article.select_one('span.ssrcss-61mhsj-MetadataText')
            # published_at = None
            # if time_tag:
            #     time_text = time_tag.get_text(strip=True)
            #     # Convert relative time like "5h", "2h" to datetime
            #     if time_text.endswith('h'):
            #         hours_ago = int(time_text[:-1])
            #         published_at = datetime.now() - timedelta(hours=hours_ago)
            #     else:
            #         try:
            #             published_at = dateutil.parser.parse(time_text)
            #         except:
            #             published_at = datetime.now()

            # # Use current time if no time found
            # if not published_at:
            #     published_at = datetime.now()

            published_at = datetime.now()


            article_data = {
                'title': title,
                'summary': summary,
                'source_url': article_url,
                'image_url': image_url,
                'published_at': published_at,
                'category':  source['category'],
            }
            
            self.save_article(article_data)