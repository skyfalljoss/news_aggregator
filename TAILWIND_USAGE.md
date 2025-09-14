# Tailwind CSS Usage Guide

This project uses Tailwind CSS via CDN for modern, utility-first styling with zero build process required.

## 🚀 Quick Start

No installation needed! Tailwind CSS is loaded via CDN in the base template.

## 🎨 Using Tailwind Classes

### Basic Examples

```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Article Title</h3>
        <p class="text-gray-600">Article description...</p>
    </div>
</div>

<!-- Buttons -->
<button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
    Click me
</button>

<!-- Forms -->
<input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
       placeholder="Enter text">
```

### Custom Colors

The project includes custom colors defined in the Tailwind config:

```html
<!-- Primary colors -->
<div class="bg-primary-black text-primary-white">Black background</div>
<div class="bg-primary-white text-primary-black">White background</div>

<!-- Gray scale -->
<div class="bg-gray-50 text-gray-900">Light gray</div>
<div class="bg-gray-100 text-gray-800">Medium gray</div>
<div class="bg-gray-900 text-gray-100">Dark gray</div>
```

### Responsive Design

```html
<!-- Mobile-first responsive design -->
<div class="text-sm md:text-base lg:text-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Content -->
    </div>
</div>

<!-- Responsive spacing -->
<div class="p-4 md:p-6 lg:p-8">
    <!-- Content with responsive padding -->
</div>
```

### Custom Spacing

The project includes custom spacing scale:

```html
<!-- Custom spacing -->
<div class="p-xs">Extra small padding (4px)</div>
<div class="p-sm">Small padding (8px)</div>
<div class="p-md">Medium padding (16px)</div>
<div class="p-lg">Large padding (24px)</div>
<div class="p-xl">Extra large padding (32px)</div>
```

## 🎯 Common Patterns

### Cards
```html
<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 class="text-xl font-bold text-gray-900 mb-2">Card Title</h3>
    <p class="text-gray-600 mb-4">Card description</p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Action
    </button>
</div>
```

### Forms
```html
<form class="space-y-4">
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
               type="text" placeholder="Enter your name">
    </div>
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
               type="email" placeholder="Enter your email">
    </div>
    <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        Submit
    </button>
</form>
```

### Navigation
```html
<nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
                <a href="/" class="text-xl font-bold text-gray-900">Logo</a>
            </div>
            <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                    <a href="#" class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                    <a href="#" class="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
                    <a href="#" class="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                </div>
            </div>
        </div>
    </div>
</nav>
```

## 📱 Responsive Breakpoints

- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

## 🎨 Custom Configuration

The Tailwind configuration is defined in the base template and includes:

- **Custom Colors**: Primary black/white, gray scale
- **Custom Fonts**: Inter font family
- **Custom Spacing**: 8px grid system
- **Custom Animations**: Fade-in, slide-up effects

## 🔧 Integration with Existing CSS

The project maintains compatibility with existing CSS:

1. **Tailwind CSS** loads first (via CDN)
2. **Custom CSS** loads second (`styles.css`)
3. **Custom styles** override Tailwind when needed

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)
- [Tailwind UI Components](https://tailwindui.com/)

## 🚀 Benefits

- **Zero Build Process**: No Node.js or build tools required
- **CDN Delivery**: Fast loading via CDN
- **Utility-First**: Rapid prototyping with utility classes
- **Responsive**: Mobile-first responsive design
- **Customizable**: Easy theme customization
- **Production Ready**: Works in all environments

---

**Happy coding with Tailwind CSS! 🎨**
