import React, { useState } from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { BellIcon } from './icons/BellIcon';
import { MessageIcon } from './icons/MessageIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import salamanderLogo from './assets/lip.jpeg';

const Header: React.FC = () => {
    const [isLight, setIsLight] = useState(false);
    const toggleTheme = () => {
        setIsLight((prev) => !prev);
        document.documentElement.classList.toggle('light-theme', !isLight);
    };

    return (
        <header className="flex-shrink-0 bg-brand-gray border-b border-brand-gray-light">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3">
                    <img src={salamanderLogo} alt="Salamander logo" className="h-8 hidden sm:block" />
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search with filters..."
                            className="w-full bg-brand-ink border border-brand-gray-light rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow text-gray-200"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full bg-brand-ink text-brand-yellow hover:bg-brand-yellow hover:text-brand-ink transition-colors">
                        {isLight ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                    </button>
                    <button className="p-2 rounded-full bg-brand-ink text-brand-yellow hover:bg-brand-yellow hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-yellow">
                        <BellIcon className="h-6 w-6" />
                    </button>
                    <button className="p-2 rounded-full bg-brand-ink text-brand-yellow hover:bg-brand-yellow hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-yellow">
                        <MessageIcon className="h-6 w-6" />
                    </button>
                    <img
                        className="h-9 w-9 rounded-full"
                        src="https://i.pravatar.cc/150?img=12"
                        alt="User avatar"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
