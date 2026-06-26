// Uses global fetch (Node 18+, available in Netlify Functions by default)

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

async function netlifyApi(path, token) {
  const res = await fetch(`https://api.netlify.com/api/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Netlify API ${res.status}: ${path}`);
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS };
  }

  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: 'NETLIFY_AUTH_TOKEN לא מוגדר בסביבה' })
    };
  }

  try {
    // שלב 1: משוך את כל האתרים
    const sites = await netlifyApi('/sites?per_page=100', token);

    // שלב 2: עבור כל אתר — נסה למשוך analytics (דורש Netlify Analytics מופעל)
    const siteStats = await Promise.all(
      sites.map(async (site) => {
        const base = {
          id: site.id,
          name: site.name,
          url: site.ssl_url || site.url,
          repo: site.build_settings?.repo_url || null,
          updated: site.updated_at,
          deploy_status: site.published_deploy?.state || 'unknown'
        };

        try {
          const traffic = await netlifyApi(
            `/sites/${site.id}/analytics/visitors?from=${thirtyDaysAgo()}&to=${today()}&timezone=Asia/Jerusalem`,
            token
          );
          return {
            ...base,
            pageviews: traffic.data?.reduce((s, d) => s + (d.count || 0), 0) ?? null,
            unique_visitors: traffic.data?.length ?? null,
            analytics_enabled: true
          };
        } catch {
          // Analytics לא מופעל לאתר הזה — מחזיר רק מידע בסיסי
          return { ...base, analytics_enabled: false };
        }
      })
    );

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        total_sites: sites.length,
        sites: siteStats.sort((a, b) => new Date(b.updated) - new Date(a.updated))
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function today() {
  return new Date().toISOString().split('T')[0];
}

function thirtyDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
}
