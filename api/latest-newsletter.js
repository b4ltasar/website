// api/latest-newsletter.js
export default async function handler(req, res) {
  try {
    const response = await fetch(`https://us1.api.mailchimp.com/3.0/campaigns?status=sent&sort_field=send_time&sort_dir=DESC&count=1`, {
      headers: {
        'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    const latest = data.campaigns[0];
    
    if (latest) {
      res.status(200).json({
        title: latest.settings.subject_line,
        url: latest.archive_url,
        send_time: latest.send_time,
        preview_text: latest.settings.preview_text
      });
    } else {
      res.status(404).json({ error: 'No newsletters found' });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch newsletter' });
  }
}