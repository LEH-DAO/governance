import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

type Values = string;

interface AltTabButtonsProps<T extends Values> {
  activeValue: T;
  onChange: (x: T) => void;
  values: [T, number][];
}

const AltTabButtons = <T extends Values>({
  activeValue,
  values,
  onChange,
}: AltTabButtonsProps<T>) => {
  const { t } = useTranslation(['common', 'swap', 'token', 'trade', 'borrow']);
  const [isMobile, setIsMobile] = useState(false);
  const activeLabel = values.find(([label, _]) => label === activeValue)?.[0];

  const checkViewportWidth = () => {
    const viewportWidth = window.innerWidth;
    setIsMobile(viewportWidth < 768); // TailwindCSS 'md' breakpoint
  };

  useEffect(() => {
    checkViewportWidth();
    window.addEventListener('resize', checkViewportWidth);
    return () => {
      window.removeEventListener('resize', checkViewportWidth);
    };
  }, []);

  // Desktop view (expanded tabs)
  const renderDesktopTabs = () => (
    <div className="sticky top-2 flex flex-col gap-2 m-2">
      {values.map(([label, count], i) => (
        <button
          key={`${label}-${i}`}
          className={`flex items-center justify-between px-4 py-2 rounded-md text-th-fgd-1 hover:bg-th-bkg-3 ${
            label === activeValue ? 'bg-th-bkg-2' : ''
          }`}
          onClick={() => onChange(label)}
        >
          <span className="whitespace-nowrap font-bold">{t(label)}</span>
          {count > 0 && <span className="ml-2 rounded-full bg-th-bkg-3 px-2 py-0.5 text-xs font-mono">{count}</span>}
          {label === 'trade:trigger-order' && (
            <span className="ml-2 rounded-full bg-th-active px-2 py-0.5 text-xs font-bold text-th-bkg-1">beta</span>
          )}
        </button>
      ))}
    </div>
  );

  // Mobile view (collapsible menu)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const renderMobileMenu = () => (
    <div className={`fixed bottom-12 left-0 right-0 z-10 bg-th-bkg-2 p-4 ${isMobile ? '' : 'hidden'}`}>
      <div className="flex justify-center items-center w-full">
        <button className="w-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span>{isMenuOpen ? 'Close Menu' : (activeLabel ? t(activeLabel) : 'Select Tab')}</span>
        </button>
      </div>
      {isMenuOpen && (
        <div className="mt-4 grid grid-cols-1 gap-2">
          {values.map(([label, count], i) => (
            <button
              key={`${label}-${i}`}
              className={`flex items-center justify-between w-full px-4 py-2 rounded-md text-th-fgd-1 hover:bg-th-bkg-3 ${
                label === activeValue ? 'bg-th-bkg-2' : ''
              }`}
              onClick={() => {
                onChange(label);
                setIsMenuOpen(false); // Close menu on selection
              }}
            >
              <span className="whitespace-nowrap font-bold">{t(label)}</span>
              {count > 0 && <span className="ml-2 rounded-full bg-th-bkg-3 px-2 py-0.5 text-xs font-mono">{count}</span>}
              {label === 'trade:trigger-order' && (
                <span className="ml-2 rounded-full bg-th-active px-2 py-0.5 text-xs font-bold text-th-bkg-1">beta</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return isMobile ? renderMobileMenu() : renderDesktopTabs();
};

export default AltTabButtons;
