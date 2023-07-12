"use client"

import Image from 'next/image'
import styles from './page.module.scss'

import logo from '@/assets/logo.png'
import android from '@/assets/icons/android.svg'
import gitHub from '@/assets/icons/gitHub.svg'
import homePage from '@/assets/home.png'
import notification from '@/assets/notification.png'
import reminderCard from '@/assets/reminder-card.png'

import BenefitCard from '@/component/benefitCard'

export default function Home() {
  const benefits = [
    {
      iconUrl: 'book.svg',
      iconName: 'Book',
      title: 'Learn more',
      content: 'Gain knowledge on how to take care of your plants'
    },
    {
      iconUrl: 'notification.svg',
      iconName: 'Bell Notification',
      title: 'Reminders',
      content: "Be reminded of your plants' watering time, always."
    },
    {
      iconUrl: 'community.svg',
      iconName: 'Community',
      title: 'Community',
      content: "Share and be a part of our growing community"
    }
  ]

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
              width={1280}
              height={240}
              className={styles.notification}
            ></Image>

            <Image
              src={reminderCard}
              alt='App reminder card'
              width={1420}
              height={512}
              className={styles.reminderCard}
            ></Image>
          </div>
      </section>

      <section className={styles.benefits}>
        <h3>our app’s benefits to you</h3>

        <h2>Why choose Plant Parenthood?</h2>

        <div className={styles.cardsWrapper}>
          {
            benefits.map((benefit, index) => {
              return (
                <div key={index}>
                  { BenefitCard(benefit) }
                </div>
              )
            })
          }
        </div>
      </section>

      <section className={styles.process}>
        <h3>our app’s process</h3>

        <h2>How Does Plant Parenthood work?</h2>
      </section>
    </body>
  )
}
