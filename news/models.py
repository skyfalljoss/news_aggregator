from django.db import models

# Create your models here.
class Source(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField()

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Article(models.Model):
    title = models.CharField(max_length=200)
    summary = models.TextField(blank=True)
    # description = models.TextField()
    content = models.TextField()
    source_url  = models.URLField()
    image_url = models.URLField(max_length=500, null=True, blank=True)
    published_at = models.DateTimeField()
    # Add a relationship to the Category model
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    # Add a field for the carousel
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title