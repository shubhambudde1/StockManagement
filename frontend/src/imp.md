  <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 backdrop-blur bg-white/70 dark:bg-gray-900/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white font-bold">L</div>
            <span className="hidden sm:block font-semibold tracking-wide">Logo</span>
          </div>

          {/* Search */}
          <div className="flex-1" />
          <label className="relative w-full max-w-xl sm:flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stocks, news, IPOs..."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          {/* Mode toggle */}
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="ml-3 h-10 w-10 rounded-2xl grid place-items-center border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* User */}
          <div className="ml-2 h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 grid place-items-center">
            <User2 className="h-5 w-5" />
          </div>
        </div>
      </header>
