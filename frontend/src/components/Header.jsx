import React from "react";

const Header = () => {
  return (
    <header className="bg-pink-900 fixed top-0 right-0 left-0 text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* Logo */}
      <h1 className="text-2xl font-bold">EzyReply</h1>

      {/* Navigation Links */}
      <nav className="flex gap-6">
        <a
          href="https://github.com/sangam5756"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition"
        >
          GitHub
        </a>
        <a
          href="https://sangammundhe.site"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition"
        >
          Portfolio
        </a>
      </nav>
    </header>
  );
};

export default Header;
