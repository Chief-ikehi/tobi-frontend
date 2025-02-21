import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!theme) {
      setTheme('system');
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <button
      aria-label="theme toggler"
      onClick={toggleTheme}
      className="bg-gray-2 dark:bg-dark-bg absolute right-17 mr-1.5 flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white lg:static"
    >
      {/* Light mode icon */}
      <Image
        src="/images/icon/icon-moon.svg"
        alt="moon icon"
        width={21}
        height={21}
        className={theme === 'light' ? 'block' : 'hidden'}
      />

      {/* Dark mode icon */}
      <Image
        src="/images/icon/icon-sun.svg"
        alt="sun icon"
        width={22}
        height={22}
        className={theme === 'dark' ? 'block' : 'hidden'}
      />

      {/* System/Auto mode icon */}
      <Image
        src="/images/icon/icon-auto.png"
        alt="auto theme icon"
        width={22}
        height={22}
        className={theme === 'system' ? 'block' : 'hidden'}
      />
    </button>
  );
};

export default ThemeToggler;