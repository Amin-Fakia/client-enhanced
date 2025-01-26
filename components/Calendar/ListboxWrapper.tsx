// components/Calendar/ListboxWrapper.tsx
import React from 'react';

const ListboxWrapper = ({ children }) => (
  <div className="w-full mb-5 max-w border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export default ListboxWrapper;