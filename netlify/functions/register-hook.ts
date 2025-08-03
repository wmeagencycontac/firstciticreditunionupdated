import { Handler } from '@netlify/functions';
import { NetlifyWebhookPayload } from '../../shared/api';

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming webhook payload
    const payload: NetlifyWebhookPayload = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!payload.name || !payload.email || !payload.registered_at) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, or registered_at' 
        }),
      };
    }

    // Log the registration data (in production, you might want to store this in a database)
    console.log('New user registration received:', {
      name: payload.name,
      email: payload.email,
      bio: payload.bio,
      picture: payload.picture,
      registered_at: payload.registered_at,
      timestamp: new Date().toISOString(),
    });

    // Here you could:
    // 1. Store the user data in a database
    // 2. Send to analytics services
    // 3. Trigger marketing automation
    // 4. Send to CRM systems
    // 5. Notify administrators
    
    // Example: Send notification to admin (you could integrate with Slack, Discord, etc.)
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `🎉 New user registered: ${payload.name} (${payload.email})`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*New User Registration*\n*Name:* ${payload.name}\n*Email:* ${payload.email}\n*Bio:* ${payload.bio || 'Not provided'}\n*Profile Picture:* ${payload.picture ? 'Yes' : 'No'}\n*Registered:* ${new Date(payload.registered_at).toLocaleString()}`,
                },
              },
            ],
          }),
        });

        if (!response.ok) {
          console.error('Failed to send Slack notification:', response.statusText);
        }
      } catch (slackError) {
        console.error('Error sending Slack notification:', slackError);
      }
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        message: 'Registration webhook processed successfully',
        received_at: new Date().toISOString(),
        user: {
          name: payload.name,
          email: payload.email,
        },
      }),
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error processing webhook',
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
