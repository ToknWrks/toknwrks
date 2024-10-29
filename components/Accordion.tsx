// components/Accordion.tsx
import { useState } from 'react';
import './accordion.css';

interface AccordionItem {
  title: string;
  content: string | JSX.Element;
}

interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean; // Allow multiple expanded items at once
}

const Accordion: React.FC<AccordionProps> = ({ items, multiple = false }) => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    if (multiple) {
      setActiveIndices((prevIndices) =>
        prevIndices.includes(index)
          ? prevIndices.filter((i) => i !== index)
          : [...prevIndices, index]
      );
    } else {
      setActiveIndices((prevIndices) =>
        prevIndices.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <div
            className={`accordion-title ${
              activeIndices.includes(index) ? 'active' : ''
            }`}
            onClick={() => handleToggle(index)}
          >
            <span>{item.title}</span>
            <span className="accordion-icon">
              {activeIndices.includes(index) ? '-' : '+'}
            </span>
          </div>
          {activeIndices.includes(index) && (
            <div className="accordion-content">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;