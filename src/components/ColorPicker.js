import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ color, setColor }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [recentColors, setRecentColors] = useState(['#F08080', '#000000', '#CCCCFF', '#ff0000', '#FFFF00']);

  const handleColorChange = (color) => {
    setColor(color.hex);
    setRecentColors((prevColors) => {
      const updatedColors = [color.hex, ...prevColors.filter(c => c !== color.hex)];
      return updatedColors.slice(0, 5);
    });
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleRecentColorClick = (color) => {
    setColor(color);
  };

  return (
    <div className="color-picker">
      <div style={{display: 'flex', justifyContent: 'space-between', width: "200px"}} className="recent-colors">
        {recentColors.map((col, index) => (
          <div
            key={index}
            className="color-swatch"
            style={{ backgroundColor: col, padding: '15px', borderRadius: '50%' }}
            onClick={() => handleRecentColorClick(col)}
          />
        ))}
        <button className="color-picker-button" onClick={handleClick}>+</button>
      </div>
      {displayColorPicker ? (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker color={color} onChangeComplete={handleColorChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;