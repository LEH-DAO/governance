/* eslint-disable @typescript-eslint/no-explicit-any */
// import { HealthType } from '@blockworks-foundation/mango-v4'
// import { Disclosure, Popover, Transition } from '@headlessui/react'
import {
  ArrowTopRightOnSquareIcon,
  // ArrowTrendingUpIcon,
  // ArrowsRightLeftIcon,
  // ChartBarIcon,
  // ChevronDownIcon,
  // CurrencyDollarIcon,
} from '@heroicons/react/20/solid'
import { createTransferInstruction } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import mangoStore from '@store/mangoStore'
import useLocalStorageState from 'hooks/useLocalStorageState'
import { useViewport } from 'hooks/useViewport'
import { useTranslation } from 'next-i18next'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, ReactNode, useEffect, useMemo } from 'react'
import { NFT } from 'types'
import { SIDEBAR_COLLAPSE_KEY } from 'utils/constants'
import { CUSTOM_SKINS, breakpoints } from 'utils/theme'
// import { sideBarAnimationDuration } from './Layout'
// import HealthHeart from './account/HealthHeart'
// import MangoAccountSummary from './account/MangoAccountSummary'
// import CoinIcon from './icons/CoinIcon'
import Tooltip from './shared/Tooltip'
//import { useIsWhiteListed } from 'hooks/useIsWhiteListed'

const set = mangoStore.getState().set

const SideNav = ({ collapsed = false }: { collapsed?: boolean }) => {
  const { t } = useTranslation(['common', 'search'])
  const { publicKey } = useWallet()
  const { theme } = useTheme()
  // const group = mangoStore.getState().group
  const themeData = mangoStore((s) => s.themeData)
  const nfts = mangoStore((s) => s.wallet.nfts.data)
  // const { mangoAccount } = useMangoAccount()
  //const { data: isWhiteListed } = useIsWhiteListed()
  const setPrependedGlobalAdditionalInstructions = mangoStore(
    (s) => s.actions.setPrependedGlobalAdditionalInstructions,
  )

  const router = useRouter()
  const { pathname, query } = router

  const { width } = useViewport()
  const [isCollapsed, setIsCollapsed] = useLocalStorageState(SIDEBAR_COLLAPSE_KEY, false); // Starts as not collapsed by default

  useEffect(() => {
    // Automatically collapse the sidebar on mobile devices
    if (width < breakpoints.md) {
      setIsCollapsed(true);
    } else {
      // Ensure it's expanded on desktop
      setIsCollapsed(false);
    }
  }, [width]);

  const playAnimation = () => {
    const set = mangoStore.getState().set
    set((s) => {
      s.successAnimation.theme = true
    })
  }

  // fetch nfts when pk changes
  useEffect(() => {
    if (publicKey) {
      set((state) => {
        state.wallet.nfts.initialLoad = true
      })
      const actions = mangoStore.getState().actions
      const connection = mangoStore.getState().connection
      actions.fetchNfts(connection, publicKey)
    }
  }, [publicKey])

  // find all mango skin nfts
  const mangoNfts = useMemo(() => {
    if (!nfts.length) return []
    const mangoNfts: NFT[] = []
    for (const nft of nfts) {
      const collectionAddress = nft?.collectionAddress
      for (const themeKey in CUSTOM_SKINS) {
        if (CUSTOM_SKINS[themeKey] === collectionAddress) {
          mangoNfts.push(nft)
        }
      }
    }
    return mangoNfts
  }, [nfts])

  //mark transactions with used nfts
  useEffect(() => {
    let newInstruction: TransactionInstruction[] = []
    if (mangoNfts.length && theme) {
      const collectionAddress = CUSTOM_SKINS[theme.toLowerCase()]
      const usedNft = mangoNfts.find(
        (nft) => nft.collectionAddress === collectionAddress,
      )
      if (usedNft && publicKey && collectionAddress) {
        newInstruction = [
          createTransferInstruction(
            new PublicKey(usedNft.tokenAccount),
            new PublicKey(usedNft.tokenAccount),
            publicKey,
            1,
          ),
        ]
      }
    }
    setPrependedGlobalAdditionalInstructions(newInstruction)
  }, [mangoNfts, theme, themeData])

  // find sidebar image url from skin nft for theme
  const sidebarImageUrl = useMemo(() => {
    if (!theme) return themeData.sideImagePath
    const collectionAddress = CUSTOM_SKINS[theme.toLowerCase()]
    if (collectionAddress && mangoNfts.length) {
      const attributes = mangoNfts.find(
        (nft) => nft.collectionAddress === collectionAddress,
      )?.json?.attributes
      const sidebarImageUrl = attributes
        ? attributes[0].value || themeData.sideImagePath
        : ''
      return sidebarImageUrl
    }
    return themeData.sideImagePath
  }, [mangoNfts, theme, themeData])

  return (
    <>
      <div className="pl-4"> 
        {sidebarImageUrl && !collapsed ? (
          <img
            className={`h-auto w-full shrink-0`}
            onClick={() => playAnimation()}
            src={sidebarImageUrl}
            alt="next"
          />
        ) : null}
        <div className="flex flex-row  items-center justify-between">
          <div className=" flex flex-row  items-center">
                
            <div className="items-center flex flex-row">
            <div
                  className={`flex h-16 shrink-0 cursor-pointer items-center`}
                >
                  <img
                    className={`h-9 w-9 shrink-0`}
                    src={themeData.logoPath}
                    alt="logo"
                  />
                </div>
              <MenuItem
                active={pathname === '/'}
                collapsed={isCollapsed}
                title={t('account')}
                pagePath="/"
              />
              <MenuItem
                active={pathname === '/swap'}
                collapsed={isCollapsed}
                title={t('swap')}
                pagePath="/swap"
              />
                {/* <MenuItem
                  active={
                    pathname === '/trade' &&
                    ((!!query?.name && query.name.includes('PERP')) ||
                      !query?.name)
                  }
                  collapsed={false}
                  icon={<PerpIcon className="h-5 w-5" />}
                  title={t('perp')}
                  pagePath="/trade?name=SOL-PERP"
                  hideIconBg
                  showTooltip={false}
                /> */}
                <MenuItem
                  active={
                    pathname === '/trade' &&
                    !!query?.name &&
                    !query.name.includes('PERP')
                  }
                  collapsed={isCollapsed}
                  title={t('spot')}
                  pagePath="/trade?name=SOL/USDC"
                  hideIconBg
                  showTooltip={false}
                />
              {/* <MenuItem
                active={pathname === '/borrow'}
                collapsed={collapsed}
                icon={<BanknotesIcon className="h-5 w-5" />}
                title={t('borrow')}
                pagePath="/borrow"
              /> */}
              <MenuItem
                active={pathname === '/stats'}
                collapsed={isCollapsed}
                title={t('stats')}
                pagePath="/stats"
              />
              {/* <MenuItem
                active={pathname === '/leaderboard'}
                collapsed={collapsed}
                icon={<LeaderboardIcon className="h-5 w-5" />}
                title={t('leaderboard')}
                pagePath="/leaderboard"
              /> */}
              {/* {isWhiteListed ? (
              <MenuItem
                active={pathname === '/nft'}
                collapsed={collapsed}
                icon={<PhotoIcon className="h-5 w-5" />}
                title={t('nft-market')}
                pagePath="/nft"
              />
            ) : null} */}
              {/* <ExpandableMenuItem
                collapsed={collapsed}
                icon={<EllipsisHorizontalIcon className="h-5 w-5" />}
                title={t('more')}
              >
                <MenuItem
                  active={pathname === '/search'}
                  collapsed={false}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  title={t('search:search-accounts')}
                  pagePath="/search"
                  hideIconBg
                  showTooltip={false}
                />
                {/* <MenuItem
                  active={pathname === '/governance/list'}
                  collapsed={false}
                  icon={<PlusCircleIcon className="h-5 w-5" />}
                  title={t('common:list-market-token')}
                  pagePath="/governance/list"
                  hideIconBg
                  showTooltip={false}
                /> */}
                {/* <MenuItem
                  active={pathname === '/governance/vote'}
                  collapsed={false}
                  icon={<ArchiveBoxArrowDownIcon className="h-5 w-5" />}
                  title={t('common:vote')}
                  pagePath="/governance/vote"
                  hideIconBg
                  showTooltip={false}
                /> */}
                {/* <MenuItem
                  collapsed={false}
                  icon={<DocumentTextIcon className="h-5 w-5" />}
                  title={t('documentation')}
                  pagePath="https://docs.mango.markets"
                  hideIconBg
                  isExternal
                  showTooltip={false}
                /> */}
                {/* <MenuItem
                  collapsed={false}
                  icon={<BuildingLibraryIcon className="h-5 w-5" />}
                  title={t('governance')}
                  pagePath="https://dao.mango.markets"
                  hideIconBg
                  isExternal
                  showTooltip={false}
                /> 
                {/* <MenuItem
                collapsed={false}
                icon={<ClipboardDocumentIcon className="h-5 w-5" />}
                title={t('feedback-survey')}
                pagePath="https://forms.gle/JgV4w7SJ2kPH89mq7"
                hideIconBg
                isExternal
                showTooltip={false}
              /> 
                />
              </ExpandableMenuItem> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideNav

type MenuItemProps = {
  active?: boolean;
  collapsed: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  title: string;
  pagePath: string;
  hideIconBg?: boolean;
  isExternal?: boolean;
  showTooltip?: boolean;
};

const MenuItem = ({
  active,
  collapsed,
  icon,
  onClick,
  title,
  pagePath,
  hideIconBg,
  isExternal,
  showTooltip = true,
}: MenuItemProps) => {
  const { theme } = useTheme();
  return (
    <Tooltip content={title} placement="right" show={collapsed && showTooltip}>
      {/* Check for external link to decide wrapping with <a> tag or not */}
      {isExternal ? (
        <a
          href={pagePath}
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex cursor-pointer pl-4 focus:outline-none focus-visible:text-th-active md:hover:text-th-active ${
            active ? 'text-th-active' : theme === 'Light' ? 'text-th-fgd-3' : 'text-th-fgd-2'
          } ${hideIconBg ? 'py-1' : 'py-1.5 xl:py-2'} text-base`}
        >
          {icon && (
            <div
              className={`${hideIconBg ? '' : `flex h-8 w-8 items-center justify-center rounded-full ${
                theme === 'Light' ? 'bg-th-bkg-2' : 'bg-th-bkg-3'
              }`}`}
            >
              {icon}
            </div>
          )}
          {!collapsed && (
            <span className="ml-3 whitespace-nowrap font-black text-[.95rem]">
              {title}
            </span>
          )}
          <ArrowTopRightOnSquareIcon className="ml-2 h-3 w-3" />
        </a>
      ) : (
        <Link href={pagePath} passHref>
          <div
            onClick={onClick}
            className={`flex cursor-pointer pl-4 focus:outline-none focus-visible:text-th-active md:hover:text-th-active ${
              active ? 'text-th-active' : theme === 'Light' ? 'text-th-fgd-3' : 'text-th-fgd-2'
            } ${hideIconBg ? 'py-1' : 'py-1.5 xl:py-2'} text-base`}
          >
            {icon && (
              <div
                className={`${hideIconBg ? '' : `flex h-8 w-8 items-center justify-center rounded-full ${
                  theme === 'Light' ? 'bg-th-bkg-2' : 'bg-th-bkg-3'
                }`}`}
              >
                {icon}
              </div>
            )}
            {!collapsed && (
              <span className="ml-3 whitespace-nowrap font-black text-[.95rem]">
                {title}
              </span>
            )}
            {isExternal && <ArrowTopRightOnSquareIcon className="ml-2 h-3 w-3" />}
          </div>
        </Link>
      )}
    </Tooltip>
  );
};


