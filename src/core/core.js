const vision = require('@google-cloud/vision');
const {Translate} = require('@google-cloud/translate').v2;

const visionClient = new vision.ImageAnnotatorClient();
const translateClient = new Translate();

const fs = require('fs').promises;
const fetch = require('node-fetch');

const deepl_langs = ['BG','CS','DA','DE','EL','EN','ES','ET','FI','FR','HU','ID','IT','JA','LT','LV','NL','PL','PT','RO','RU','SK','SL','SV','TR','ZH'];
const core = async (img_path, from = 'JA', to = 'EN', use_lang_hint = true) => {
  console.log('starting core');

    const contents = await fs.readFile(img_path, {encoding: 'base64'}, () =>{});

    const request = {
        "requests": [
          {
            "image": {
              "content": contents
            },
            "features": [
              {
                "type": "DOCUMENT_TEXT_DETECTION"
              }
            ],
            "imageContext": {
              "languageHints": [use_lang_hint ? from : '']
            }
          }
        ]
      }
    const [result] = await visionClient.batchAnnotateImages(request)
    await fs.writeFile('ocr_out.json', JSON.stringify(result, null, 2), () => {});


    const blocks = [];
    result.responses[0].fullTextAnnotation.pages[0].blocks.forEach((block) => {
      const block_text = [];
      const block_bounds = {
        top: Number.MAX_SAFE_INTEGER,
        bottom: 0,
        left: Number.MAX_SAFE_INTEGER,
        right: 0
      };
      block.paragraphs.forEach((paragraph) => {
        paragraph.words.forEach((word) => {
          word.symbols.forEach((symbol) => {
            block_text.push(symbol.text);
            symbol.boundingBox.vertices.forEach((vertex) => {
              if (vertex.y < block_bounds.top) {
                block_bounds.top = vertex.y;
              }
              if (vertex.y > block_bounds.bottom) {
                block_bounds.bottom = vertex.y;
              }
              if (vertex.x < block_bounds.left) {
                block_bounds.left = vertex.x;
              }
              if (vertex.x > block_bounds.right) {
                block_bounds.right = vertex.x;
              }
            });
          })
        })
      })
      blocks.push({
        text: block_text.join(''),
        bbox: {
          vertices: [
            {
              x: block_bounds.left,
              y: block_bounds.top
            },
            {
              x: block_bounds.right,
              y: block_bounds.top
            },
            {
              x: block_bounds.right,
              y: block_bounds.bottom
            },
            {
              x: block_bounds.left,
              y: block_bounds.bottom
            }
          ]
        }
      })
    })

    translated_blocks = await Promise.all(blocks.map(async (block) => {
      const translations = await translateClient.translate(block.text, to);
      const translations_d = await deepl_translate(block.text, from, to);

      return {
        text_orig: block.text,
        text: translations[0],
        text_deepl: translations_d,
        bbox: block.bbox
      };
    }))
    console.log('core complete');
    return translated_blocks;
}

const deepl_translate = async (text, from, to) => {
  if (!deepl_langs.includes(from)) {
    return `Source language not supported by deepl (${from})`;
  }
  if (!deepl_langs.includes(to)) {
    return `Target language not supported by deepl (${to})`;
  }
  const response = await fetch('https://api-free.deepl.com/v2/translate',
  {
    method: 'POST',
    body: `auth_key=${process.env.deepl_api_key}&text=${text}&target_lang=${to}&source_lang=${from}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  } 
  );
  const translated = (await response.json()).translations[0].text;
  return translated;
}

module.exports = {
  core,
}

deepl_translate('hola!')
