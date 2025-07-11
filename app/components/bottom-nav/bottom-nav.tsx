import { Link } from 'react-router';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';

export default function BottomNav() {
  return (
    <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-slate-200 rounded-full bottom-4 left-1/2 shadow-lg">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <Link
          to="/"
          data-tooltip-target="tooltip-home"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-slate-50 group"
        >
          <svg
            className="w-5 h-5 mb-1 text-slate-500 group-hover:text-amber-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="sr-only">Home</span>
        </Link>
        <Link
          to="/recipes"
          data-tooltip-target="tooltip-wallet"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-slate-50 group"
        >
          <ClipboardDocumentListIcon
            className="w-5 h-5 mb-1 text-slate-500 group-hover:text-amber-600"
            aria-hidden="true"
          />
          <span className="sr-only">Recipes</span>
        </Link>
        <div className="flex items-center justify-center">
          <Link
            to="/add-recipe"
            data-tooltip-target="tooltip-new"
            className="inline-flex items-center justify-center w-10 h-10 font-medium bg-amber-600 rounded-full hover:bg-amber-700 group focus:ring-4 focus:ring-amber-300 focus:outline-none"
          >
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 1v16M1 9h16"
              />
            </svg>
            <span className="sr-only">New item</span>
          </Link>
        </div>
        <button
          data-tooltip-target="tooltip-settings"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-slate-50 group"
        >
          <MagnifyingGlassIcon
            className="w-5 h-5 mb-1 text-slate-500 group-hover:text-amber-600"
            aria-hidden="true"
          />
          <span className="sr-only">Search</span>
        </button>
        <button
          data-tooltip-target="tooltip-profile"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-slate-50 group"
        >
          <svg
            className="w-5 h-5 mb-1 text-slate-500 group-hover:text-amber-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
          <span className="sr-only">Profile</span>
        </button>
      </div>
    </div>
  );
}
