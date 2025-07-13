const { parseJavaScript } = require('../utils/astParser');
const astToMermaid = require('../utils/astToMermaid');
const { convertToMermaid } = require('../utils/pythonService');
const Diagram = require('../models/diagramModel');

// POST /api/convert
exports.convert = async (req, res, next) => {
  const { code, language, shared = false } = req.body;
  try {
    let mermaid;
    if (language === 'javascript') {
      let ast;
      try {
        ast = parseJavaScript(code);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid JavaScript code.' });
      }
      mermaid = astToMermaid(ast);
    } else if (language === 'python') {
      mermaid = await convertToMermaid(code);
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported language.' });
    }
    // Save diagram if user is authenticated
    let diagramId = null;
    if (req.user) {
      const diagram = await Diagram.create({
        user: req.user._id,
        code,
        language,
        mermaid,
        shared,
      });
      diagramId = diagram._id;
    }
    return res.status(200).json({ 
      success: true, 
      mermaid,
      diagramId 
    });
  } catch (error) {
    next(error);
  }
}; 