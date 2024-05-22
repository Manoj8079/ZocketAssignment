import React, { useRef, useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import ColorPicker  from './ColorPicker.js';
import design from './format.js';

const templateData = {
  caption: {
    text: "1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs",
    position: { x: 80, y: 100 },
    max_characters_per_line: 31,
    font_size: 44,
    alignment: "left",
    text_color: "#FFFFFF"
  },
  cta: {
    text: " Shop Now",
    position: { x: 90, y: 250 },
    text_color: "#000000",
    background_color: "#ffffff",
    border_radius: 5
  },
  image_mask: {
    x: 56,
    y: 442,
    width: 970,
    height: 600
  },
  urls: {
    mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
    stroke: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
    design_pattern: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png"
  }
};

class CanvasEditor {
  constructor(canvas, template) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.template = template;
  }

  updateCaptionText(text) {
    this.template.caption.text = text;
    this.drawTemplate();
  }

  drawTemplate(image) {
    this.clearCanvas();
    this.drawBackground();
    this.drawDesignPattern();
    this.drawImageMask(image);
    this.drawMaskStroke();
    this.drawCaption();
    this.drawCTA();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.ctx.fillStyle = this.backgroundColor || '#0369A1';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawDesignPattern() {
    const img = new Image();
    img.src = this.template.urls.design_pattern;
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
  }

  drawImageMask(image) {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(this.template.image_mask.x, this.template.image_mask.y, this.template.image_mask.width, this.template.image_mask.height);
      this.ctx.clip();
      this.ctx.drawImage(img, this.template.image_mask.x, this.template.image_mask.y, this.template.image_mask.width, this.template.image_mask.height);
      this.ctx.restore();
    };
  }

  drawMaskStroke() {
    const img = new Image();
    img.src = this.template.urls.stroke;
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
  }

  drawCaption() {
    const caption = this.template.caption;
    this.ctx.fillStyle = caption.text_color;
    this.ctx.font = `${caption.font_size}px Arial`;
    this.ctx.textAlign = caption.alignment;
    this.wrapText(caption.text, caption.position.x, caption.position.y, caption.max_characters_per_line);
    // this.ctx.position = caption.position;
    this.ctx.top = caption.position.x;
    this.ctx.left = caption.position.y;
  }


  drawCTA() {
    const cta = this.template.cta;
    const borderWidth = 2; // Border width
    const borderRadius = cta.border_radius || 0; // Border radius, default to 0 if not provided
  
    // Draw background with border radius
    this.ctx.fillStyle = cta.background_color;
    this.ctx.strokeStyle = "#000000"; // Black border color
    this.ctx.lineWidth = borderWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(cta.position.x + borderRadius, cta.position.y - 30); // Move to top left corner
    this.ctx.lineTo(cta.position.x + this.ctx.measureText(cta.text).width + 20 - borderRadius, cta.position.y - 30); // Top line
    this.ctx.quadraticCurveTo(cta.position.x + this.ctx.measureText(cta.text).width + 20, cta.position.y - 30, cta.position.x + this.ctx.measureText(cta.text).width + 20, cta.position.y - 30 + borderRadius); // Top right corner
    this.ctx.lineTo(cta.position.x + this.ctx.measureText(cta.text).width + 20, cta.position.y + 20); // Right line
    this.ctx.quadraticCurveTo(cta.position.x + this.ctx.measureText(cta.text).width + 20, cta.position.y + 30, cta.position.x + this.ctx.measureText(cta.text).width + 20 - borderRadius, cta.position.y + 30); // Bottom right corner
    this.ctx.lineTo(cta.position.x + borderRadius, cta.position.y + 30); // Bottom line
    this.ctx.quadraticCurveTo(cta.position.x, cta.position.y + 30, cta.position.x, cta.position.y + 30 - borderRadius); // Bottom left corner
    this.ctx.lineTo(cta.position.x, cta.position.y - 30 + borderRadius); // Left line
    this.ctx.quadraticCurveTo(cta.position.x, cta.position.y - 30, cta.position.x + borderRadius, cta.position.y - 30); // Top left corner
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  
    // Draw text
    this.ctx.fillStyle = cta.text_color;
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(cta.text, cta.position.x + this.ctx.measureText(cta.text).width / 2, cta.position.y);
  }
  


  wrapText(text, x, y, maxCharactersPerLine = 20) {
    const words = text.split(' ');
    let line = '';
    let lineHeight = this.template.caption.font_size * 1.2;
    let maxChars = maxCharactersPerLine || 20;

    for (let word of words) {
      let testLine = line + word + ' ';
      if (testLine.length > maxChars) {
        this.ctx.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }

    this.ctx.fillText(line, x, y);
  }



  setBackgroundColor(color) {
    this.backgroundColor = color;
  }
}

const CanvasEditorComponent = () => {
  const canvasRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [captionText, setCaptionText] = useState(templateData.caption.text);
  const [backgroundColor, setBackgroundColor] = useState('#0369A1');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasEditor = new CanvasEditor(canvas, templateData);
    setEditor(canvasEditor);
  }, []);

  useEffect(() => {
    if (editor) {
      editor.setBackgroundColor(backgroundColor);
      editor.drawTemplate(selectedImage);
    }
  }, [editor, selectedImage, captionText, backgroundColor]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1, border: '1px solid black', padding: '10px' }}>
        <canvas ref={canvasRef} width="1080" height="1080" style={{ width: 400, height: 400 }} />
      </div>
      <div style={{ flex: 1, border: '1px solid black', padding: '10px' }}>
        <div className="mb-4">
          {/* <SketchPicker
            color={backgroundColor}
            onChangeComplete={(color) => setBackgroundColor(color.hex)}
          /> */}
          <ColorPicker 
          color={backgroundColor}
          setColor={setBackgroundColor}
          />
        </div>
        <div className="mb-4">
          <input type="file" onChange={handleImageChange} />
        </div>
        <div>
          <input
            type="text"
            style={{ border: '1px solid black' }}
            value={captionText}
            onChange={(e) => {
              setCaptionText(e.target.value);
              if (editor) {
                editor.updateCaptionText(e.target.value);
              }
            }}
            placeholder="Caption Text"
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasEditorComponent;
