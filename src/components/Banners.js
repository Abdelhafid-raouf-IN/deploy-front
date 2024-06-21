import { XMarkIcon } from '@heroicons/react/20/solid';

export default function Banners() {
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-red-500 px-6 py-0.1 sm:px-5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-5 text-white ">
          <strong className="font-semibold">Pilot V2.0.0</strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx={1} cy={1} r={1} />
          </svg>
          Start Testing Api And Check It Up Or Down
        </p>
      </div>
      <div className="flex flex-1 justify-end">
      </div>
    </div>
  );
}
