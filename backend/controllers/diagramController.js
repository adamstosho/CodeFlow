const Diagram = require('../models/diagramModel');
const puppeteer = require('puppeteer');

// POST /api/diagrams
exports.createDiagram = async (req, res, next) => {
  try {
    const { code, language, mermaid } = req.body;
    if (!code || !language || !mermaid) {
      return res.status(400).json({ success: false, message: 'Code, language, and mermaid are required.' });
    }
    const diagram = await Diagram.create({
      user: req.user._id,
      code,
      language,
      mermaid,
    });
    res.status(201).json({ success: true, diagram });
  } catch (error) {
    next(error);
  }
};

// GET /api/diagrams
exports.getDiagrams = async (req, res, next) => {
  try {
    const diagrams = await Diagram.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, diagrams });
  } catch (error) {
    next(error);
  }
};

// GET /api/diagrams/:id
exports.getDiagramById = async (req, res, next) => {
  try {
    const diagram = await Diagram.findOne({ _id: req.params.id, user: req.user._id });
    if (!diagram) {
      return res.status(404).json({ success: false, message: 'Diagram not found.' });
    }
    res.status(200).json({ success: true, diagram });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/diagrams/:id
exports.deleteDiagram = async (req, res, next) => {
  try {
    const diagram = await Diagram.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!diagram) {
      return res.status(404).json({ success: false, message: 'Diagram not found.' });
    }
    res.status(200).json({ success: true, message: 'Diagram deleted.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/diagrams/export
exports.exportDiagram = async (req, res, next) => {
  const { mermaid } = req.body;
  if (!mermaid) {
    return res.status(400).json({ success: false, message: 'Mermaid code is required.' });
  }
  try {
    const browser = await puppeteer.launch({ 
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ],
      headless: true
    });
    
    const page = await browser.newPage();
    
    // Set a reasonable viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Create a more robust HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Mermaid Diagram</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .mermaid { text-align: center; }
          </style>
        </head>
        <body>
          <div class="mermaid">
            ${mermaid}
          </div>
          <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
          <script>
            mermaid.initialize({ 
              startOnLoad: true,
              theme: 'default',
              securityLevel: 'loose',
              fontFamily: 'Arial, sans-serif'
            });
          </script>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Wait for Mermaid to render with a timeout
    await page.waitForSelector('.mermaid svg', { timeout: 10000 });
    
    // Get the SVG content
    const svg = await page.$eval('.mermaid svg', el => el.outerHTML);
    
    await browser.close();
    
    // Set proper headers
    res.set({
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': 'attachment; filename="diagram.svg"'
    });
    
    res.send(svg);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to export diagram',
      error: error.message 
    });
  }
};

// GET /api/diagrams/share/:id (public)
exports.getSharedDiagram = async (req, res, next) => {
  try {
    const diagram = await Diagram.findById(req.params.id);
    if (!diagram || !diagram.shared) {
      return res.status(404).json({ success: false, message: 'Diagram not found or not shared.' });
    }
    // Only return public fields
    res.status(200).json({
      success: true,
      diagram: {
        code: diagram.code,
        language: diagram.language,
        mermaid: diagram.mermaid,
        createdAt: diagram.createdAt,
        _id: diagram._id,
        shared: diagram.shared,
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/diagrams/:id/share (toggle sharing)
exports.toggleShareDiagram = async (req, res, next) => {
  try {
    const { shared } = req.body;
    if (typeof shared !== 'boolean') {
      return res.status(400).json({ success: false, message: 'shared must be a boolean.' });
    }
    const diagram = await Diagram.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { shared },
      { new: true }
    );
    if (!diagram) {
      return res.status(404).json({ success: false, message: 'Diagram not found.' });
    }
    res.status(200).json({ success: true, diagram });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/diagrams/:id (update diagram)
exports.updateDiagram = async (req, res, next) => {
  try {
    const { code, language, shared } = req.body;
    
    // Validate required fields
    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required.' });
    }

    // Find the existing diagram
    const existingDiagram = await Diagram.findOne({ _id: req.params.id, user: req.user._id });
    if (!existingDiagram) {
      return res.status(404).json({ success: false, message: 'Diagram not found.' });
    }

    // Convert the new code to mermaid
    let mermaid;
    if (language === 'javascript') {
      const { parseJavaScript } = require('../utils/astParser');
      const astToMermaid = require('../utils/astToMermaid');
      
      let ast;
      try {
        ast = parseJavaScript(code);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid JavaScript code.' });
      }
      mermaid = astToMermaid(ast);
    } else if (language === 'python') {
      const { convertToMermaid } = require('../utils/pythonService');
      mermaid = await convertToMermaid(code);
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported language.' });
    }

    // Update the diagram
    const diagram = await Diagram.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        code, 
        language, 
        mermaid,
        ...(typeof shared === 'boolean' && { shared })
      },
      { new: true }
    );

    res.status(200).json({ success: true, diagram });
  } catch (error) {
    next(error);
  }
}; 