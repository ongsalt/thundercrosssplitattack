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
    <p>
      {'By the way here the '}
      <a
        id='brhuh'
        className={styles.link}
        onClick={() => {
          window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")
          setDidRickroll(true)
        }}
      >
        link
      </a>
    </p>
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

function Meta(link, image, site, description) {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={link} />
      <meta property="og:title" content={site} />
      {/* <meta property="og:description" content="LinkFork lets you shorten, and customize how your link will appear when shared on social media, for free." /> */}
      <meta property="og:image" content={image} />
    </>
  )
}

function Bruh({ link, meta }) {

  console.log({ link, meta })

  return (
    <div className={styles.full}>
      <Head>
        <title> Thunder cross splitting attack </title>
        {meta.map(each => {
          // eslint-disable-next-line react/jsx-key
          return (<meta property={each.property} content={each.content} name={each.name}/>)
        })}
        <Meta />
      </Head>
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

  const link = 'https://' + query.bruh
    .filter(e => !e.includes('http'))
    .join('/')

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
  console.log(meta)

  const image = meta.find(p => p.property === 'og:image')
  const title = meta.find(p => p.property === 'og:title')
  const decsription = meta.find(p => p.name === 'description')
  const site_name = meta.find(p => p.property === 'og:site_name')

  const usableMeta = [
    image,
    title,
    decsription,
    site_name
  ]

  // console.log('Done printing og')

  return {
    props: {
      link,
      meta: usableMeta
    }
  }
}

export default Bruh