/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from 'react';
import AltTabButtons from '../shared/AltTabButtons';
import TokenList from '../TokenList';
import UnsettledTrades from '@components/trade/UnsettledTrades';
import { useUnsettledSpotBalances } from 'hooks/useUnsettledSpotBalances';
import { useViewport } from 'hooks/useViewport';
import useUnsettledPerpPositions from 'hooks/useUnsettledPerpPositions';
import mangoStore from '@store/mangoStore';
import PerpPositions from '@components/trade/PerpPositions';
import useOpenPerpPositions from 'hooks/useOpenPerpPositions';
import HistoryTabs from './HistoryTabs';
// import ManualRefresh from '@components/shared/ManualRefresh';
import useMangoAccount from 'hooks/useMangoAccount';
import AccountOverview from './AccountOverview';
import AccountOrders from './AccountOrders';

const AccountTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { mangoAccount } = useMangoAccount();
  const { isMobile } = useViewport();
  const unsettledSpotBalances = useUnsettledSpotBalances();
  const unsettledPerpPositions = useUnsettledPerpPositions();
  const { openPerpPositions } = useOpenPerpPositions();
  const openOrders = mangoStore((s) => s.mangoAccount.openOrders);
  
  const tabsWithCount: [string, number][] = useMemo(() => {
    const unsettledTradeCount =
      Object.values(unsettledSpotBalances).flat().length +
      unsettledPerpPositions?.length

    const stopOrdersCount =
      mangoAccount?.tokenConditionalSwaps.filter((tcs) => tcs.isConfigured)
        ?.length || 0

    const tabs: [string, number][] = [
      ['overview', 0],
      ['balances', 0],
      ['trade:positions', openPerpPositions.length],
      [
        'trade:orders',
        Object.values(openOrders).flat().length + stopOrdersCount,
      ],
      ['trade:unsettled', unsettledTradeCount],
      ['history', 0],
    ]
    return tabs
  }, [mangoAccount, openPerpPositions, unsettledPerpPositions, unsettledSpotBalances, openOrders]);

  if (isMobile) {
    return (
      <div className="flex flex-row w-full h-full">
        {/* Tab Content */}
        <div className="flex-row w-full max-w-screen">
          <TabContent activeTab={activeTab} />
        </div>
        {/* Tab Buttons fixed at the bottom for mobile */}
        <div className="fixed bottom-2 left-0 right-0 z-10">
          <AltTabButtons
            activeValue={activeTab}
            onChange={(v) => setActiveTab(v)}
            values={tabsWithCount}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex">
        {/* Tab Buttons on the left for desktop */}
        <div className="flex h-screen sticky top-2 flex-col w-[150px]">
          <AltTabButtons
            activeValue={activeTab}
            onChange={(v) => setActiveTab(v)}
            values={tabsWithCount}
          />
        </div>
        {/* Tab Content on the right for desktop */}
        <div className="flex-grow h-auto border-l border-th-bkg-3">
          <TabContent activeTab={activeTab} />
        </div>
      </div>
    );
  }
};

const TabContent = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case 'overview':
      return <AccountOverview />
    case 'balances':
      return <TokenList />
    case 'trade:positions':
      return <PerpPositions />
    case 'trade:orders':
      return <AccountOrders />
    case 'trade:unsettled':
      return <UnsettledTrades />
    case 'history':
      return <HistoryTabs />
    default:
      return <AccountOverview />
  }
}

export default AccountTabs
