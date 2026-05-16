import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-tiko-outline-variant last:border-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-4 text-left group"
    >
      <span className="font-outfit font-bold text-base text-tiko-on-surface group-hover:text-tiko-primary transition-colors uppercase tracking-wider">
        {title}
      </span>
      <span className={`transform transition-transform duration-300 text-tiko-outline group-hover:text-tiko-primary ${isOpen ? 'rotate-180' : ''}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
      <div className="text-sm text-tiko-on-surface-variant leading-relaxed font-dm-sans">
        {children}
      </div>
    </div>
  </div>
);

interface ProductAccordionsProps {
  details: string;
  composition: string[];
  shipping: string;
  returns: string;
}

const ProductAccordions: React.FC<ProductAccordionsProps> = ({ details, composition, shipping, returns }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="flex flex-col">
      <AccordionItem 
        title="Details & Composition" 
        isOpen={openIndex === 0} 
        onToggle={() => toggle(0)}
      >
        <div className="space-y-4">
          <p>{details}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {composition.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tiko-primary/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </AccordionItem>

      <AccordionItem 
        title="Shipping & Returns" 
        isOpen={openIndex === 1} 
        onToggle={() => toggle(1)}
      >
        <div className="space-y-3">
          <div>
            <p className="font-bold text-tiko-on-surface text-[10px] uppercase tracking-widest mb-1">Shipping</p>
            <p>{shipping}</p>
          </div>
          <div>
            <p className="font-bold text-tiko-on-surface text-[10px] uppercase tracking-widest mb-1">Returns</p>
            <p>{returns}</p>
          </div>
        </div>
      </AccordionItem>
    </div>
  );
};

export default ProductAccordions;
