# news/views.py
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.core.paginator import Paginator
from django.template.loader import render_to_string
from .models import Article, Category
from django.db.models import Q
import json


def index(request):
    # Get articles for the carousel (the 5 most recent featured articles)
    carousel_articles = Article.objects.filter(is_featured=True).order_by('-published_at')[:5]
    
    # If no featured articles, use the 5 most recent articles as fallback
    if not carousel_articles.exists():
        
        carousel_articles = Article.objects.order_by('-published_at')[:5]

    # Get the single latest post
    latest_post = Article.objects.order_by('-published_at').first()

    # Get the next 4 latest posts for the "Recent View" section
    recent_articles = Article.objects.order_by('-published_at')[1:10]

    # Get all categories and the articles within them
    categories = Category.objects.all()
    categorized_articles = {}
    for category in categories:
        articles_in_category = Article.objects.filter(category=category).order_by('-published_at')[:10]
         # Only add the category to the dictionary if it has articles
        if articles_in_category.exists():
            categorized_articles[category.name] = {
                'articles': articles_in_category[:9],
                'latest_posts': articles_in_category[:12]
            }

    context = {
        'carousel_articles': carousel_articles,
        'latest_post': latest_post,
        'recent_articles': recent_articles,
        'categorized_articles': categorized_articles,
    }
    
    # Debug information
    print(f"Carousel articles count: {carousel_articles.count()}")
    print(f"Categories count: {len(categorized_articles)}")
    print(f"Recent articles count: {recent_articles.count()}")
    print(f"Latest post: {latest_post}")
    return render(request, 'news/index.html', context)



def load_more_articles(request):
    """AJAX endpoint to load more articles for a specific category"""
    if request.method == 'GET':
        category_name = request.GET.get('category')
        page = int(request.GET.get('page', 1))
        articles_per_page = 5  # Number of articles to load per request
        
        try:
            # Get the category (support both plain names and hyphenated slugs)
            lookup_value = (category_name or '').strip()
            alt_value = lookup_value.replace('-', ' ')
            category = Category.objects.filter(Q(name__iexact=lookup_value) | Q(name__iexact=alt_value)).first()
            if not category:
                raise Exception('No Category matches the given query.')
            
            # Get all articles for this category
            all_articles = Article.objects.filter(category=category).order_by('-published_at')
            
            # Paginate the articles
            paginator = Paginator(all_articles, articles_per_page)
            page_obj = paginator.get_page(page)
            
            # Check if there are more pages
            has_next = page_obj.has_next()
            
            # Render the articles as HTML
            articles_html = render_to_string('news/partials/article_cards.html', {
                'articles': page_obj,
                'category_name': category_name
            }, request=request)

            
            return JsonResponse({
                'success': True,
                'html': articles_html,
                'has_next': has_next,
                'next_page': page + 1 if has_next else None,
                'total_pages': paginator.num_pages,
                'current_page': page
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})
    print(f"Categories count: {len(categorized_articles)}")
    print(f"Recent articles count: {recent_articles.count()}")
    print(f"Latest post: {latest_post}")
    return render(request, 'news/index.html', context)

# # Keep the article_detail view as it is
# def article_detail(request, article_id):
#     article = get_object_or_404(Article, pk=article_id)
#     context = {'article': article}
#     return render(request, 'news/article_detail.html', context)
    
# Add these placeholder views
def most_viewed_list(request):
    return HttpResponse("This is the list of most viewed articles.")

def category_list(request, category_name):
    return HttpResponse(f"This is the list of articles for the {category_name} category.")

# Keep the article_detail view as it is
def article_detail(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    context = {'article': article}
    return render(request, 'news/article_detail.html', context)
    
# Add these placeholder views
def most_viewed_list(request):
    return HttpResponse("This is the list of most viewed articles.")

def category_list(request, category_name):
    return HttpResponse(f"This is the list of articles for the {category_name} category.")

