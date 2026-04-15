import React, { useState } from "react";
import { User2, MoreVertical, LogOut, Settings, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [suggestions, setSuggestions] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    setShowDropdown(false);
  }
};
  const handleSearch = async (value) => {
  setQuery(value);

  if (value.length < 1) {
    setSuggestions([]);
    setShowDropdown(false);
    return;
  }

  try {
    const res = await fetch(
`${API_BASE_URL}/api/watchlists/1/stocks/search?q=${encodeURIComponent(value)}`    );
    const data = await res.json();

    setSuggestions(data);
    setShowDropdown(true);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 backdrop-blur bg-white/70 dark:bg-gray-900/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3 relative">
        {/* Logo */}
        <div className="flex items-center gap-2"   onClick={() => {
                    navigate("/");
                    
                  }}>
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white font-bold">
            L
          </div>
          <span className="hidden sm:block font-semibold tracking-wide">Logo</span>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <label className="relative w-full max-w-xl sm:flex-1">
        <input
  value={query}
  onChange={(e) => handleSearch(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Search stocks, news, IPOs..."
  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 pl-3 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
/>
{showDropdown && suggestions.length > 0 && (
  <div className="absolute top-12 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
    {suggestions.map((item, index) => (
      <div
        key={index}
        onClick={() => {
          navigate(`/stock/${item[0]}`);
          setQuery("");
          setShowDropdown(false);
        }}
        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        <div className="font-semibold">{item[0]}</div>
        <div className="text-xs text-gray-500">{item[1]}</div>
      </div>
    ))}
  </div>
)}
        </label>

        {/* Auth button */}
        <div
          onClick={() => navigate("/auth")}
          className="ml-2 h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 grid place-items-center cursor-pointer"
        >
          <User2 className="h-5 w-5" />
        </div>

        {/* Options Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="ml-2 h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 grid place-items-center"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
              <ul className="text-sm">
                <li
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                  className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-t-xl"
                >
                  <Settings className="h-4 w-4" /> Settings
                </li>
                <li
                  onClick={() => {
                    navigate("/help");
                    setOpen(false);
                  }}
                  className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4" /> Help
                </li>
                <li
                  onClick={() => {
                    navigate("/");
                    setOpen(false);
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-b-xl text-red-500"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </li>
                {currentUser && (
                  <li
                    onClick={() => {
                      navigate("/Watchlist");
                      setOpen(false);
                    }}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4" /> Wachlist
                  </li>
                )}
                  {currentUser && (
                  <li
                    onClick={() => {
                      navigate("/Actions");
                      setOpen(false);
                    }}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4" /> Actions
                  </li>
                )}
                {currentUser && (
                  <li
                    onClick={() => {
                      navigate("/account");
                      setOpen(false);
                    }}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4" /> account
                  </li>
                )}

                 {currentUser && (
                  <li
                    onClick={() => {
                      navigate("/compare");
                      setOpen(false);
                    }}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4" /> compare
                  </li>
                
                )}


                {!currentUser && (
                  <li
                    onClick={() => {
                      navigate("/auth");
                      setOpen(false);
                    }}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4" /> Login<br/> <span>(features)</span>
                  </li>
                )}
                


              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
