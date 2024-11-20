import React from 'react';

const CustomTable = ({ children }) => (
  <div className="overflow-x-auto border-zinc-500 border mt-4 mb-4 rounded-2xl">
    <table className="table-auto w-full">
      {children}
    </table>
  </div>
);

const CustomTableHead = ({ children }) => (
  <thead className="bg-zinc-800 border-b border-black">
    {children}
  </thead>
);

const CustomTableRow = ({ children, isFirst }) => {
  const rowClass = isFirst
    ? ''
    : `bg-zinc-200 even:bg-zinc-300 border-b border-zinc-500 last:border-b-0`;
  return (
    <tr className={rowClass}>
      {children}
    </tr>
  );
};

const CustomTableCell = ({ children, isHeader }) => {
  const baseClass = "px-6 py-3 text-left text-sm border-r border-zinc-500";
  const headerClass = "font-medium text-black uppercase tracking-wider bg-zinc-400";
  const cellClass = "text-zinc-900";
  const CellTag = isHeader ? 'th' : 'td';

  return (
    <CellTag className={`${baseClass} ${isHeader ? headerClass : cellClass}`}>
      {children}
    </CellTag>
  );
};


const CustomList = ({ children, ordered }) => {
  const listClass = ordered ? 'list-decimal' : 'list-disc';
  return (
    <ul className={`${listClass} pl-5`}>
      {children}
    </ul>
  );
};

const CustomHeading = ({ level, children }) => {
  const sizes = {
    1: 'text-2xl font-bold',
    2: 'text-xl font-semibold',
    3: 'text-lg font-semibold',
    4: 'text-md font-medium',
    5: 'text-sm font-medium',
    6: 'text-xs font-medium',
  };
  const Tag = `h${level}`;
  return (
    <Tag className={`${sizes[level]} mt-4 mb-2`}>
      {children}
    </Tag>
  );
};

const CustomLink = ({ href, children }) => (
  <a href={href} target='_blank' className="text-blue-500 hover:underline">
    {children}
  </a>
);

export {
  CustomTable,
  CustomTableHead,
  CustomTableRow,
  CustomTableCell,
  CustomList,
  CustomHeading,
  CustomLink,
};
