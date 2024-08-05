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
    <ul className="flex text-14 text-stone-700 font-medium gap-20">
      {menus.map((menu, index) => (
        <li key={index}>
          <button onClick={() => handleMenuClick(menu.type)}>
            {menu.title}
          </button>
        </li>
      ))}
    </ul>
  );
};

export { ScrollMenu };
