
import { useState } from "react";

export const useOrderSelection = () => {
  const [selected, setSelected] = useState<number[]>([]);
  
  return {
    selected,
    setSelected
  };
};
