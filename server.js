import express from 'express';
import { marked } from 'marked';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text());

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
