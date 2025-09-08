// Mailchimp API Integration for Latest Newsletter
class MailchimpNewsletterFetcher {
    constructor(apiKey, serverPrefix, audienceId) {
        this.apiKey = apiKey;
        this.serverPrefix = serverPrefix; // e.g., 'us1', 'us2', etc.
        this.audienceId = audienceId;
        this.baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
    }

    // Fetch latest campaigns (newsletters)
    async getLatestCampaigns(count = 5) {
        try {
            const response = await fetch(`${this.baseUrl}/campaigns?count=${count}&status=sent&sort_field=send_time&sort_dir=DESC`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(`anystring:${this.apiKey}`)}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.campaigns;
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            return [];
        }
    }

    // Get campaign content including images
    async getCampaignContent(campaignId) {
        try {
            const response = await fetch(`${this.baseUrl}/campaigns/${campaignId}/content`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(`anystring:${this.apiKey}`)}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching campaign content:', error);
            return null;
        }
    }

    // Extract thumbnail from campaign content
    extractThumbnail(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        const images = doc.querySelectorAll('img');
        
        for (let img of images) {
            const src = img.src;
            if (src && !src.includes('track') && !src.includes('pixel')) {
                const width = img.width || img.getAttribute('width');
                const height = img.height || img.getAttribute('height');
                
                if (!width || !height || (parseInt(width) > 100 && parseInt(height) > 100)) {
                    return {
                        src: src,
                        alt: img.alt || 'Newsletter thumbnail',
                        width: width,
                        height: height
                    };
                }
            }
        }
        
        return {
            src: '/images/newsletter-default.png',
            alt: 'Newsletter',
            width: '300',
            height: '200'
        };
    }

    // Main function to get latest newsletter with thumbnail
    async getLatestNewsletterData() {
        const campaigns = await this.getLatestCampaigns(1);
        
        if (campaigns.length === 0) {
            return null;
        }

        const latestCampaign = campaigns[0];
        const content = await this.getCampaignContent(latestCampaign.id);
        
        let thumbnail = null;
        if (content && content.html) {
            thumbnail = this.extractThumbnail(content.html);
        }

        return {
            id: latestCampaign.id,
            title: latestCampaign.settings.subject_line,
            url: latestCampaign.archive_url,
            sendTime: latestCampaign.send_time,
            thumbnail: thumbnail,
            excerpt: latestCampaign.settings.preview_text || ''
        };
    }
}

// Newsletter display manager
class NewsletterDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async displayLatestNewsletter(mailchimpFetcher) {
        try {
            const newsletterData = await mailchimpFetcher.getLatestNewsletterData();
            
            if (!newsletterData) {
                this.showError('No newsletters found');
                return;
            }

            this.renderNewsletter(newsletterData);
        } catch (error) {
            console.error('Error displaying newsletter:', error);
            this.showError('Failed to load newsletter');
        }
    }

    renderNewsletter(data) {
        if (!this.container) return;

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
                    <p class="newsletter-excerpt">${data.excerpt}</p>
                    <div class="newsletter-meta">
                        <span class="newsletter-date">${new Date(data.sendTime).toLocaleDateString()}</span>
                        <a href="${data.url}" target="_blank" class="newsletter-link">Read Newsletter</a>
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
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Configuration - Replace with your actual values
    const MAILCHIMP_CONFIG = {
        apiKey: 'YOUR_API_KEY_HERE', // Replace with your Mailchimp API key
        serverPrefix: 'us1', // Replace with your server prefix (us1, us2, etc.)
        audienceId: 'YOUR_AUDIENCE_ID' // Replace with your audience ID
    };

    // Initialize the newsletter fetcher and display
    const fetcher = new MailchimpNewsletterFetcher(
        MAILCHIMP_CONFIG.apiKey,
        MAILCHIMP_CONFIG.serverPrefix,
        MAILCHIMP_CONFIG.audienceId
    );

    const display = new NewsletterDisplay('newsletter-container');
    
    // Load and display the latest newsletter
    display.displayLatestNewsletter(fetcher);
});