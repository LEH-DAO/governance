import { Popover, Transition } from '@headlessui/react'
import {
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import { Fragment, useCallback, useEffect, useState } from 'react'
import mangoStore from '@store/mangoStore'
import { notify } from '../../utils/notifications'
import ProfileImage from '../profile/ProfileImage'
// import { abbreviateAddress } from '../../utils/formatting'
// import { useViewport } from 'hooks/useViewport'
import EditProfileModal from '@components/modals/EditProfileModal'
import MangoAccountsListModal from '@components/modals/MangoAccountsListModal'
import { TV_USER_ID_KEY } from 'utils/constants'
import useLocalStorageState from 'hooks/useLocalStorageState'
import Loading from '@components/shared/Loading'
// import SheenLoader from '@components/shared/SheenLoader'
// import useProfileDetails from 'hooks/useProfileDetails'

const set = mangoStore.getState().set
const actions = mangoStore.getState().actions

const ConnectedMenu = () => {
  const { t } = useTranslation('common')
  const { publicKey, disconnect, wallet } = useWallet()
  const [tvUserId, setTvUserId] = useLocalStorageState(TV_USER_ID_KEY, '')
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showMangoAccountsModal, setShowMangoAccountsModal] = useState(false)
  // const {
  //   data: profileDetails,
  //   isInitialLoading: loadProfileDetails,
  //   refetch: refetchProfileDetails,
  // } = useProfileDetails()
  const groupLoaded = mangoStore((s) => s.groupLoaded)
  const mangoAccountLoading = mangoStore((s) => s.mangoAccount.initialLoad)

  const handleDisconnect = useCallback(() => {
    set((state) => {
      state.activityFeed.feed = []
      state.mangoAccount.current = undefined
      state.mangoAccounts = []
      state.mangoAccount.initialLoad = true
      state.mangoAccount.openOrders = {}
    })
    disconnect()
    notify({
      type: 'info',
      title: t('wallet-disconnected'),
    })
  }, [t, disconnect])

  useEffect(() => {
    if (publicKey && wallet && groupLoaded) {
      actions.connectMangoClientWithWallet(wallet)
      actions.fetchMangoAccounts(publicKey)
      // refetchProfileDetails()
      actions.fetchWalletTokens(publicKey)
      if (!tvUserId) {
        setTvUserId(publicKey.toString())
      }
    }
  }, [publicKey, wallet, groupLoaded, tvUserId, setTvUserId])

  return (
    <>
      <Popover>
        <Popover.Button
          className="default-transition h-16 w-16 focus:outline-none focus-visible:bg-th-bkg-1"
        >
          <div className="flex items-center justify-center">
            {!mangoAccountLoading ? (
              <ProfileImage imageSize="24" placeholderSize="24" isOwnerProfile />
            ) : (
              <Loading className="h-6 w-6" />
            )}
          </div>
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-in duration-200"
          enterFrom="opacity-0 scale-75"
          enterTo="opacity-100 scale-100"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel className="absolute right-0 top-[61px] z-20 mt-1 w-48 space-y-1.5 rounded-md bg-th-bkg-2 px-4 py-2.5 focus:outline-none">
            <button
              className="flex w-full items-center rounded-none py-0.5 focus:outline-none focus-visible:text-th-active"
              onClick={() => setShowMangoAccountsModal(true)}
            >
              <CurrencyDollarIcon className="h-4 w-4" />
              <div className="pl-2">{t('accounts')}</div>
            </button>
            <button
              className="flex w-full items-center rounded-none py-0.5 focus:outline-none focus-visible:text-th-active"
              onClick={() => setShowEditProfileModal(true)}
            >
              <UserCircleIcon className="h-4 w-4" />
              <div className="pl-2">{t('profile:edit-profile')}</div>
            </button>
            <button
              className="flex w-full items-center rounded-none py-0.5 focus:outline-none focus-visible:text-th-active"
              onClick={handleDisconnect}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <div className="pl-2">{t('disconnect')}</div>
            </button>
          </Popover.Panel>
        </Transition>
        </Popover>
      {showEditProfileModal && (
        <EditProfileModal isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} />
      )}
      {showMangoAccountsModal && (
        <MangoAccountsListModal isOpen={showMangoAccountsModal} onClose={() => setShowMangoAccountsModal(false)} />
      )}
    </>
  );
};

export default ConnectedMenu
