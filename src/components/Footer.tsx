import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 font-sans">
      <div className="max-w-7xl mx-auto text-center px-4">
        <div className="flex flex-wrap justify-between gap-8 mb-8">
          {/* Quick Links Section */}
          <div className="flex-1 min-w-[250px] text-left">
            <h4 className="text-lg font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2">
              {["About Us", "FAQs", "Privacy Policy", "Contact Us"].map((link, index) => (
                <li key={index}>
                  <a
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-indigo-500 hover:text-white hover:opacity-80 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="flex-0.5 text-center sm:text-left">
            <h4 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h4>
            <div className="flex flex-col gap-4 items-center sm:items-start">
              {/* Input field */}
              <input
                type="email"
                placeholder="Enter your email"
                className="p-4 rounded-lg w-full sm:w-[300px] text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Subscribe to our newsletter"
              />
              {/* Button */}
              <button className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-[300px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-sm text-gray-400 pt-4 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} TOBI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
