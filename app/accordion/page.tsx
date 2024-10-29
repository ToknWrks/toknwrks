// accordion/index.tsx

"use client";
import Accordion from '/components/Accordion';

const IndexPage = () => {
  const accordionItems: AccordionItem[] = [
    {
      title: 'Item 1',
      content: 'This is the content for item 1.',
    },
    {
      title: 'Item 2 with JSX Content',
      content: <p>This is JSX content for item 2.</p>,
    },
    {
      title: 'Item 3',
      content: 'Content for the third item.',
    },
  ];

  return (
    <div>
    
      <Accordion items={accordionItems} multiple={true} />
    </div>
  );
};

export default IndexPage;