
import { createSignal } from 'sig';
import { Link } from 'sig/router';
import Menu from '/assets/icons/menu.svg';
import X from '/assets/icons/x.svg';
import UtensilsCrossed from '/assets/icons/utensils-crossed.svg';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                {UtensilsCrossed({className: "h-8 w-8 text-indigo-600"})}
                <span className="ml-2 text-xl font-bold text-gray-900">RecipeHub</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <Link
                to="/categories"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Categories
              </Link>
              <Link
                to="/recipes"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Recipes
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex sm:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen((curr) => !curr)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {X({ className: "block h-6 w-6" })}
                {/* <If
                  condition={isMenuOpen} 
                  then={X({ className: "block h-6 w-6" }) as any}
                  fallback={Menu({ className: "block h-6 w-6" }) as any}
                /> */}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/categories"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/recipes"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Recipes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet />
      </main>
    </div>
  );
}