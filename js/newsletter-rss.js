// RSS-based Newsletter Fetcher (CORS-friendly)
class NewsletterRSSFetcher {
    constructor(rssUrl) {
        this.rssUrl = rssUrl;
    }

    async fetchLatestNewsletter() {
        try {
            // Use RSS2JSON service to parse RSS feed
            const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(this.rssUrl)}`;
            
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status !== 'ok' || !data.items || data.items.length === 0) {
                throw new Error('No newsletter items found');
            }

            return this.parseLatestItem(data.items[0]);
        } catch (error) {
            console.error('Error fetching newsletter:', error);
            return null;
        }
    }

    parseLatestItem(item) {
        // Extract thumbnail from content
        const thumbnail = this.extractThumbnail(item.description || item.content);
        
        return {
            title: item.title,
            url: item.link,
            date: item.pubDate,
            description: this.cleanDescription(item.description || item.content),
            thumbnail: thumbnail
        };
    }

    extractThumbnail(htmlContent) {
        // Create a temporary element to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        const images = tempDiv.querySelectorAll('img');
        
        for (let img of images) {
            const src = img.src;
            if (src && !src.includes('track') && !src.includes('pixel') && !src.includes('spacer')) {
                return {
                    src: src,
                    alt: img.alt || 'Newsletter thumbnail'
                };
            }
        }
        
        return {
            src: '/images/newsletter-default.png',
            alt: 'Newsletter'
        };
    }

    cleanDescription(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Remove images and get text content
        const images = tempDiv.querySelectorAll('img');
        images.forEach(img => img.remove());
        
        let text = tempDiv.textContent || tempDiv.innerText || '';
        
        // Limit to first 150 characters
        if (text.length > 150) {
            text = text.substring(0, 150) + '...';
        }
        
        return text.trim();
    }
}

// Alternative: Direct Mailchimp Archive URL fetcher
class MailchimpArchiveFetcher {
    constructor(archiveUrl) {
        this.archiveUrl = archiveUrl; // e.g., "https://your-username.campaign-archive.com"
    }

    async fetchLatestFromArchive() {
        try {
            // This would require a CORS proxy or server-side implementation
            // For now, return a placeholder that you can manually update
            return {
                title: "Latest Newsletter",
                url: this.archiveUrl,
                date: new Date().toISOString(),
                description: "Check out our latest newsletter!",
                thumbnail: {
                    src: "/images/newsletter-default.png",
                    alt: "Newsletter"
                }
            };
        } catch (error) {
            console.error('Error fetching from archive:', error);
            return null;
        }
    }
}

// Newsletter Display Class
class NewsletterDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async displayNewsletter(fetcher) {
        if (!this.container) {
            console.error('Newsletter container not found');
            return;
        }

        try {
            // Show loading state
            this.showLoading();

            let newsletterData;
            
            if (fetcher instanceof NewsletterRSSFetcher) {
                newsletterData = await fetcher.fetchLatestNewsletter();
            } else if (fetcher instanceof MailchimpArchiveFetcher) {
                newsletterData = await fetcher.fetchLatestFromArchive();
            }
            
            if (!newsletterData) {
                this.showError('Unable to load newsletter');
                return;
            }

            this.renderNewsletter(newsletterData);
        } catch (error) {
            console.error('Error displaying newsletter:', error);
            this.showError('Failed to load newsletter');
        }
    }

    showLoading() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="newsletter-loading">
                <div class="loading-spinner"></div>
                <p>Loading latest newsletter...</p>
            </div>
        `;
    }

    renderNewsletter(data) {
        if (!this.container) return;

        const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const html = `
            <div class="newsletter-card">
                <div class="newsletter-thumbnail">
                    <img src="${data.thumbnail.src}" 
                         alt="${data.thumbnail.alt}" 
                         loading="lazy"
                         onerror="this.src='/images/newsletter-default.png'">
                </div>
                <div class="newsletter-content">
                    <h3 class="newsletter-title">${data.title}</h3>
                    <p class="newsletter-description">${data.description}</p>
                    <div class="newsletter-meta">
                        <span class="newsletter-date">${formattedDate}</span>
                        <a href="${data.url}" target="_blank" rel="noopener" class="newsletter-link">
                            Read Full Newsletter
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    showError(message) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="newsletter-error">
                <p>${message}</p>
                <small>Please check your RSS feed URL or try again later.</small>
            </div>
        `;
    }
}

// Configuration and Initialization
document.addEventListener('DOMContentLoaded', function() {
    // CONFIGURATION - Update these values
    const CONFIG = {
        // Option 1: Use RSS feed URL (recommended)
        rssUrl: 'https://your-username.campaign-archive.com/feed?u=USER_ID&id=LIST_ID',
        
        // Option 2: Use archive URL for manual updates
        archiveUrl: 'https://your-username.campaign-archive.com'
    };

    // Choose your fetcher method
    let fetcher;
    
    if (CONFIG.rssUrl && CONFIG.rssUrl.includes('campaign-archive.com')) {
        // Use RSS fetcher
        fetcher = new NewsletterRSSFetcher(CONFIG.rssUrl);
    } else {
        // Use archive fetcher (fallback)
        fetcher = new MailchimpArchiveFetcher(CONFIG.archiveUrl);
    }

    // Initialize display
    const display = new NewsletterDisplay('newsletter-container');
    display.displayNewsletter(fetcher);

    // Optional: Auto-refresh every 30 minutes
    setInterval(() => {
        display.displayNewsletter(fetcher);
    }, 30 * 60 * 1000);
});