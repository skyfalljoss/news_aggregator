# 📰 News Aggregator

[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, Django-based news aggregator that automatically scrapes articles from various news sources, categorizes them, and displays them on a beautiful, responsive website. Built with Django, MySQL, and modern frontend technologies.

## ✨ Features

### 🔄 **Automated News Scraping**
- **Multi-source aggregation** from various news websites
- **Intelligent categorization** (Sports, Politics, Technology, etc.)
- **Scheduled scraping** with custom management commands
- **Duplicate detection** and content filtering

### 🎨 **Modern Web Interface**
- **Tailwind CSS CDN** for modern, utility-first styling (no build process required)
- **Responsive design** that works on all devices
- **Interactive carousel** for featured articles
- **Category-based navigation** with dynamic content loading
- **Real-time search** functionality
- **Social sharing** capabilities
- **Custom component library** with consistent design system

### 🗄️ **Robust Backend**
- **Django REST API** for data management
- **MySQL database** for reliable data storage
- **Admin interface** for content management
- **Custom management commands** for automation

## 🚀 Quick Start

### Prerequisites

### 📥 Installation

#### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd news_aggregator
```

#### 2. **Set Up Virtual Environment**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

#### 4. **Configure Database**

Open `news_aggregator/settings.py` and update the database configuration:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'news_aggregator_db',  # Database name
        'USER': 'your_mysql_username',  # Your MySQL username
        'PASSWORD': 'your_mysql_password',  # Your MySQL password
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### 5. **Create Database**
```bash
python manage.py create_db
```

#### 6. **Run Migrations**
```bash
python manage.py migrate
```

#### 7. **Create Superuser**
```bash
python manage.py createsuperuser
```

#### 8. **Start Development Server**
```bash
python manage.py runserver
```

🎉 **Your news aggregator is now running at** `http://127.0.0.1:8000/`

## 📖 Usage Guide

### 🗞️ **Adding News Sources**

1. **Access Admin Panel**
   - Navigate to `http://127.0.0.1:8000/admin/`
   - Log in with your superuser credentials

2. **Add News Sources**
   - Go to the "Sources" section
   - Click "Add Source"
   - Enter the website URL and configuration details

### 🔄 **Scraping News Articles**

Run the scraping command to fetch latest articles:

```bash
python manage.py scrape_news
```

### 🎯 **Managing Content**

- **View Articles**: Browse through categorized news on the homepage
- **Search**: Use the search functionality to find specific articles
- **Categories**: Navigate between different news categories
- **Admin Panel**: Manage sources, articles, and settings

## 🏗️ Project Structure

```
news_aggregator/
├── 📁 news/                          # Main Django app
│   ├── 📁 templates/news/            # HTML templates
│   │   ├── base.html                # Base template
│   │   ├── index.html               # Homepage
│   │   └── detail.html              # Article detail page
│   ├── 📁 static/                   # Static files
│   │   ├── 📁 css/                  # Stylesheets
│   │   └── 📁 js/                   # JavaScript files
│   ├── 📁 management/commands/       # Custom commands
│   └── models.py                    # Database models
├── 📁 news_aggregator/              # Project settings
│   ├── settings.py                  # Django settings
│   └── urls.py                      # URL configuration
├── manage.py                        # Django management script
└── requirements.txt                 # Python dependencies
```

## 🛠️ Configuration

### **Environment Variables**
Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=mysql://user:password@localhost:3306/dbname
```

### **Scraping Configuration**
Customize scraping settings in `news/settings.py`:

```python
SCRAPING_SETTINGS = {
    'USER_AGENT': 'News Aggregator Bot 1.0',
    'DELAY_BETWEEN_REQUESTS': 2,  # seconds
    'MAX_ARTICLES_PER_SOURCE': 50,
    'SCRAPING_INTERVAL': 3600,  # seconds
}
```

## 🔧 Customization

### **Adding New Categories**
1. Update the category choices in `news/models.py`
2. Add corresponding CSS styles in `static/css/styles.css`
3. Update the JavaScript category handling in `static/js/categories.js`

### **Modifying the UI**
- **Colors**: Update CSS variables in `styles.css`
- **Layout**: Modify HTML templates in `templates/news/`
- **Interactions**: Customize JavaScript in `static/js/`

### **Adding New Scrapers**
1. Create a new scraper class in `news/scrapers.py`
2. Add the scraper to the scraping command
3. Update the source configuration in admin panel

## 📊 API Endpoints

The application provides REST API endpoints for data access:

```python
# Get all articles
GET /api/articles/

# Get articles by category
GET /api/articles/?category=sports

# Get article details
GET /api/articles/{id}/

# Search articles
GET /api/articles/?search=keyword
```

## 🚀 Deployment

### **Production Setup**

1. **Configure Production Settings**
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['yourdomain.com']
   ```

2. **Set Up Static Files**
   ```bash
   python manage.py collectstatic
   ```

3. **Configure Web Server**
   - Use Nginx as reverse proxy
   - Configure Gunicorn as WSGI server

4. **Database Optimization**
   - Set up MySQL with proper indexing
   - Configure connection pooling

### **Docker Deployment**
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "news_aggregator.wsgi"]
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### **Development Guidelines**
- Follow PEP 8 style guidelines
- Write comprehensive tests
- Update documentation
- Ensure responsive design

## 🐛 Troubleshooting

### **Common Issues**

**Database Connection Error**
```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials in settings.py
# Ensure database exists
```

**Static Files Not Loading**
```bash
# Collect static files
python manage.py collectstatic

# Check STATIC_URL in settings.py
```

**Scraping Issues**
```bash
# Check internet connection
# Verify source URLs are accessible
# Check rate limiting settings
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Django** - The web framework
- **BeautifulSoup** - Web scraping library
- **MySQL** - Database management
- **Unsplash** - Sample images

## 📞 Support

Need help? Here's how to get support:

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers

---

<div align="center">
  <p>Built with ❤️ using Django and modern web technologies</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>