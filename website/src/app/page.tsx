import Image from 'next/image'
import styles from './page.module.scss'

import logo from '../assets/logo.png'
import android from '../assets/icons/android.svg'
import gitHub from '../assets/icons/gitHub.svg'
import homePage from '../assets/home.png'
import notification from '../assets/notification.png'
import reminderCard from '../assets/reminder-card.png'

import { Barlow, Rajdhani } from 'next/font/google'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-barlow',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-rajdhani',
})

export default function Home() {
  return (
    <body className={`${barlow.variable} ${rajdhani.variable}`}>
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

      <section className={styles.hero}>
          <div className={styles.content}>
            <h1>Grow, Connect, and Thrive: <span>Plant Parenthood!</span></h1>

            <p>Welcome to Plant Parenthood, the ultimate mobile app for plant owners. Simplify your plant care routine, never miss a watering again, and learn how to grow your plants with ease.</p>
          
            <div className={styles.buttonGroup}>
              <button>
                <Image src={android} alt='Android' width={36} height={20.62}></Image>
                Download <span>APK</span>
              </button>
              <button>
                <Image src={gitHub} alt='GitHub' width={36} height={36}></Image>
                View on <span>GitHub</span></button>
            </div>
          </div>

          <div className={styles.image}>
            <Image 
              src={homePage} 
              alt='Home Page Screen Mockup' 
              width={374} 
              height={761.82}
              className={styles.homePage}
            ></Image>
            <Image
              src={notification}
              alt='App notification popup'
              width={320}
              height={60}
              className={styles.notification}
            ></Image>
            <Image
              src={reminderCard}
              alt='App reminder card'
              width={305}
              height={110}
              className={styles.reminderCard}
            ></Image>
          </div>
      </section>
    </body>
  )
}
