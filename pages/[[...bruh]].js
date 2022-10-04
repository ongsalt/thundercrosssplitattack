import Image from "next/image";
import Link from "next/link"
import Head from "next/head";
import styles from './bruh.module.css'
import thunder from '../public/images/thunder.webp'

import { useState } from "react";
import { useRouter } from "next/router";



const NodeDomParser = require('dom-parser');

const Rickroll = () => {
  return (
    <iframe width="942" height="530" src={"https://www.youtube.com/embed/dQw4w9WgXcQ?&autoplay=1"} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
  )
}

const RealOne = ({ realLink }) => {
  return (
    <p>
      {'ok this is '}
      <a className={styles.link} id='real' href={realLink}>
        real one
      </a>
    </p>
  )
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}


function Meta({ meta }) {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.link} />
      <meta property="og:title" content={meta.site} />
      {/* <meta property="og:description" content="LinkFork lets you shorten, and customize how your link will appear when shared on social media, for free." /> */}
      <meta property="og:image" content={meta.image} />
    </>
  )
}

function Bruh({ link, meta }) {
  const router = useRouter()
  const [rickrolled, setRickrolled] = useState(false);
  // Make sure we're in the browser
  if ((typeof window !== 'undefined') && !rickrolled) {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
    setRickrolled(true)
    router.push('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  }

  if (!link || !meta) {
    return (
      <div className={styles.full}>
        <Head>
          <title> Thunder cross splitting attack </title>

        </Head>
        {/* <Rickroll/> */}
        <Image
          src={thunder}
          alt='You fell for it, fool! Thunder Cross Split Attack'
          layout='intrinsic'
        />
      </div>
    )
  }

  return (
    <div className={styles.full}>
      <Head>
        <title> {meta.find(item => item.property === 'og:title').content || 'Pixiv'}  </title>
        {meta.map(each => {
          console.log({ each })
          // eslint-disable-next-line react/jsx-key
          return (<meta property={each.property} content={each.content} name={each.name} key={each.property} />)
        })}
        <Meta meta={meta} />
      </Head>
      <Rickroll />

      <Image
        src={thunder}
        alt='You fell for it, fool! Thunder Cross Split Attack'
        layout='intrinsic'
      />

      <RealOne realLink={link} />
    </div>
  )
}

// https://www.pixiv.net/en/artworks/95284150

export async function getServerSideProps({ query }) {

  if (!query.bruh) return { props: {} }

  const link = 'https://' + query.bruh
    .filter(e => !e.includes('http'))
    .join('/')

  if (!isValidHttpUrl(link)) return { props: {} }

  const page = await fetch(link)
  const pageHtml = await page.text()
  console.log('Done fetching')

  const parser = new NodeDomParser();
  const doc = parser.parseFromString(pageHtml, 'text/html');

  const rawMeta = doc.getElementsByTagName('meta')

  // console.log({page, meta})
  const meta = rawMeta.map(node => {
    const out = {}
    node.attributes.forEach(attr => {
      out[attr.name] = attr.value
    })
    return out
  })
  // console.log(meta)

  //Pixiv
  const image = meta.find(p => p.property === 'og:image')
  const twitterImage = meta.find(p => p.property === 'twitter:image')
  const twitterCard = { property: 'twitter:card', content: 'summary_large_image' }

  image.content = image.content.replace('decorate', 'artwork') // pixiv hate bot
  twitterImage.content = twitterImage.content.replace('decorate', 'artwork') // same

  const title = meta.find(p => p.property === 'og:title')
  const decsription = meta.find(p => p.name === 'description')
  const site_name = meta.find(p => p.property === 'og:site_name')

  const usableMeta = [
    image,
    title,
    decsription,
    site_name,
    twitterCard,
    twitterImage
  ]
  console.log({ usableMeta })

  // console.log('Done printing og')

  return {
    props: {
      link,
      meta: usableMeta
    },
    redirect: {
      destination: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      permanent: true
    }
  }
}

export default Bruh