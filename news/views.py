# news/views.py
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse 
from .models import Article, Category

def index(request):
    # Get articles for the carousel (the 5 most recent featured articles)
    carousel_articles = Article.objects.filter(is_featured=True).order_by('-published_at')[:5]

    # Get the single latest post
    latest_post = Article.objects.order_by('-published_at').first()

    # Get the next 4 latest posts for the "Recent View" section
    recent_articles = Article.objects.order_by('-published_at')[1:5]

    # Get all categories and the articles within them
    categories = Category.objects.all()
    categorized_articles = {}
    for category in categories:
        articles_in_category = Article.objects.filter(category=category).order_by('-published_at')[:4]
         # Only add the category to the dictionary if it has articles
        if articles_in_category.exists():
            categorized_articles[category.name] = {
                'articles': articles_in_category[:4],
                'latest_posts': articles_in_category[:5]
            }

    context = {
        'carousel_articles': carousel_articles,
        'latest_post': latest_post,
        'recent_articles': recent_articles,
        'categorized_articles': categorized_articles,
    }
    print(categorized_articles)
    return render(request, 'news/index.html', context)

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