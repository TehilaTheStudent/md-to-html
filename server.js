import express from 'express';
import { marked } from 'marked';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/extract-id', (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'No url provided' });
  }

  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/folders\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return res.json({ id: match[1] });
    }
  }

  res.status(400).json({ error: 'Could not extract ID from URL' });
});

app.post('/base64', (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];

  const updatedItems = items.map((item) => {
    const rawValue = item?.text_bash_history;
    const safeString = rawValue !== undefined && rawValue !== null
      ? String(rawValue)
      : "";

    const base64BashHistory = Buffer.from(safeString).toString("base64");
    item.base64_bash_history = base64BashHistory;

    return item;
  });

  res.json(updatedItems);
});

app.post('/convert', (req, res) => {
  const markdown = typeof req.body === 'string' ? req.body : req.body.markdown;
  
  if (!markdown) {
    return res.status(400).json({ error: 'No markdown provided' });
  }

  const html = marked(markdown);
  res.type('html').send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
