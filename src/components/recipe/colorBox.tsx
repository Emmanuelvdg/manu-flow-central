
import React from "react";

interface ColorBoxProps {
  color: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${color}`}></span>
);

export default ColorBox;
