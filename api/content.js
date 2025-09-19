// Vercel Edge Function for Content Management via GitHub API

export const config = {
  runtime: 'edge',
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_API_BASE = 'https://api.github.com';

// Verify JWT token (simplified)
function verifyToken(request) {
  const auth = request.headers.get('authorization');
  const token = auth?.replace('Bearer ', '');

  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

// GitHub API helper
async function githubRequest(path, options = {}) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

// List files in repository
async function listFiles() {
  try {
    const files = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/pages`
    );

    return files
      .filter(file => file.type === 'file' && file.name.endsWith('.md'))
      .map(file => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
        size: file.size,
      }));
  } catch (e) {
    return [];
  }
}

// Get file content
async function getFileContent(path) {
  try {
    const file = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`
    );

    const content = atob(file.content);

    return {
      content,
      sha: file.sha,
      name: file.name,
      path: file.path,
    };
  } catch (e) {
    return null;
  }
}

// Create or update file
async function saveFile(path, content, message, sha = null) {
  const body = {
    message,
    content: btoa(content),
    branch: 'main',
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await githubRequest(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  return response;
}

export default async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/content', '');

  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Verify authentication
  if (!verifyToken(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // List files
    if (request.method === 'GET' && !path) {
      const files = await listFiles();
      return new Response(JSON.stringify({ files }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get specific file
    if (request.method === 'GET' && path) {
      const filePath = path.startsWith('/') ? path.substring(1) : path;
      const content = await getFileContent(filePath);

      if (!content) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(content), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Save file
    if (request.method === 'POST' || request.method === 'PUT') {
      const body = await request.json();
      const { path: filePath, content, message } = body;

      if (!filePath || !content) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Try to get existing file SHA
      let sha = null;
      const existing = await getFileContent(filePath);
      if (existing) {
        sha = existing.sha;
      }

      const result = await saveFile(
        filePath,
        content,
        message || 'Update via admin panel',
        sha
      );

      return new Response(JSON.stringify({
        success: true,
        path: result.content.path,
        sha: result.content.sha,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Server error',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}