import React from 'react';

interface ScrollMenuProp {
  menus: {
    title: string;
    type: string;
  }[];
  handleMenuClick: (menuType: string) => void;
}

const ScrollMenu = ({ menus, handleMenuClick }: ScrollMenuProp) => {
  return (
    <div
      className="sticky top-56 w-full bg-white py-16 border-b border-solid border-gray-200"
      style={{ zIndex: 2, boxShadow: '1px 1px #ffffff' }}
    >
      <ul className="flex text-14 text-stone-700 font-medium gap-20">
        {menus.map((menu, index) => (
          <li key={index}>
            <button onClick={() => handleMenuClick(menu.type)}>
              {menu.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ScrollMenu };
