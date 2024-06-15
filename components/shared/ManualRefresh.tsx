import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import mangoStore from '@store/mangoStore';
import useMangoAccount from 'hooks/useMangoAccount';
import Tooltip from './Tooltip';
import { IconButton } from './Button';
import { ArrowPathIcon } from '@heroicons/react/20/solid';

const ManualRefresh = ({
  classNames,
  hideBg = false,
  size,
}: {
  classNames?: string;
  hideBg?: boolean;
  size?: 'small' | 'medium' | 'large';
}) => {
  const { t } = useTranslation('common');
  const [spin, setSpin] = useState(false);
  const actions = mangoStore((s) => s.actions);
  const { mangoAccountAddress } = useMangoAccount();

  const handleRefreshData = async () => {
    setSpin(true);
    await actions.fetchGroup();
    if (mangoAccountAddress) {
      await actions.reloadMangoAccount();
      actions.fetchOpenOrders();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (spin) {
      timer = setTimeout(() => setSpin(false), 1000); // Reduced spin duration for better user experience
    }

    return () => {
      clearTimeout(timer);
    };
  }, [spin]);

  return (
    <div className={`${classNames} rounded-full fixed bottom-6 flex items-center`}>
      <Tooltip content={t('refresh-data')} className="flex flex-row items-center py-1 text-xs">
        <IconButton
          hideBg={hideBg}
          onClick={handleRefreshData}
          disabled={spin}
          size={size}
        >
          <ArrowPathIcon
            className={`h-4 w-4 ${spin ? 'animate-spin' : ''}`}
          />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ManualRefresh;
