import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AccountPage from '../components/account/AccountPage'
import Head from 'next/head'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'account',
        'activity',
        'close-account',
        'common',
        'explore',
        'governance',
        'notifications',
        'onboarding',
        'onboarding-tours',
        'profile',
        'search',
        'settings',
        'swap',
        'stats',
        'token',
        'trade',
      ])),
    },
  }
}


const metaDescription =
  'Margin trade your favorite crypto assets on-chain. Groundbreaking risk management to keep your funds safe. A powerful DEX, powered by Solana.'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>LEH Terminal</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content="LEH Terminal" />
        <meta name="og:description" content={metaDescription} />
        <meta name="og:image" content="./images/1200x600-share.png" />
        <meta name="twitter:title" content="LEH Terminal" />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="./images/1200x600-share.png" /> 
      </Head>
      <div className="min-h-[100vh]">
        <AccountPage />
      </div>
    </>
  )
}

export default Index
