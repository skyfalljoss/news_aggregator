from django.urls import path
from . import views



# Add app_name to set the application namespace
app_name = 'news'

urlpatterns = [
    path('', views.index, name='index'),
    # Add the following lines
    path('most-viewed/', views.most_viewed_list, name='most_viewed_list'),
    path('category/<str:category_name>/', views.category_list, name='category_list'),
    path('load-more-articles/', views.load_more_articles, name='load_more_articles'),
]