// netlify/functions/latest-newsletter.js
exports.handler = async (event, context) => {
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
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          title: latest.settings.subject_line,
          url: latest.archive_url,
          send_time: latest.send_time,
          preview_text: latest.settings.preview_text
        })
      };
    }
    
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'No newsletters found' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch newsletter' })
    };
  }
};