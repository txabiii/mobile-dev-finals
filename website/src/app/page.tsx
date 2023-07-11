import Image from 'next/image'
import styles from './page.module.scss'

import logo from '../assets/logo.png'

export default function Home() {
  return (
    <body>
      <nav className={styles.navbar}>
        <Image src={logo} alt='logo' height={50} width={50}></Image>

        <div className={styles.flexFiller}></div>

        <ul>
          <li>Home</li>
          <li>About</li>
          <li>How to use</li>
          <li>
            <button>Download Now</button>
          </li>
        </ul>
      </nav>

      <main>
        <section className={styles.heroSection}></section>
      </main>
    </body>
  )
}
