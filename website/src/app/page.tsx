"use client"

import Image from 'next/image'
import styles from './page.module.scss'

import logo from '@/assets/logo.png'
import android from '@/assets/icons/android.svg'
import gitHub from '@/assets/icons/gitHub.svg'
import homePage from '@/assets/home.png'
import notification from '@/assets/notification.png'
import reminderCard from '@/assets/reminder-card.png'
import step1 from '@/assets/Step 1.png'
import step2 from '@/assets/Step 2.png'
import step3 from '@/assets/Step 3.png'
import step4 from '@/assets/Step 4.png'

import BenefitCard from '@/component/benefitCard/benefitCard'
import ProcessOption from '@/component/processOption/processOption'

import { useState } from 'react'

import cx from 'classnames'

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

  const [processNumber, setProcessNumber] = useState(1);

  const processes = [
    {
      step: 1,
      title: "Create an account and login",
      content: "Begin your plant parenting journey by creating a personal account."
    },
    {
      step: 2,
      title: "Browse and add your plant",
      content: "Explore the plant library, then add your plants to keep track of their progress."
    },
    {
      step: 3,
      title: "Learn to grow your plant",
      content: "Browse detailed guides on how to take care of your plant as well as tips and troubleshoots."
    },
    {
      step: 4,
      title: "Watch out for watering reminders",
      content: "Stay on top of your plant care routine with timely watering reminders."
    },
  ]

  const stepImages = [step1, step2, step3, step4]

  const [displayMenu, setDisplayMenu] = useState(false);

  return (
    <body>
      <nav className={styles.navbar}>
        <Image src={logo} alt='logo' height={50} width={50}></Image>

        <div className={styles.flexFiller}></div>

        <h2 
          className={styles.menu}
          onClick={() => {
            setDisplayMenu(prev => !prev)
          }}
        >&#9776;</h2>

        <ul className={cx({ [styles.shown] : displayMenu })}>
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
                <a href="/plant-parenthood.apk" download>
                  <Image src={android} alt='Android' width={36} height={20.62}></Image>
                  Download <span>APK</span>
                </a>
              </button>
              <button>
                <a href="https://github.com/txabiii/mobile-dev-finals">
                  <Image src={gitHub} alt='GitHub' width={36} height={36}></Image>
                  View on <span>GitHub</span>
                </a>
              </button>
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

        <div className={styles.processWrapper}>
          <div className={styles.image}>
            <Image
              src={stepImages[processNumber-1]}
              alt='Process Image'
              width={562}
              height={1144}
            ></Image>
          </div>

          <div className={styles.processList}>
            {
              processes.map((process, index) => {
                return (
                  <div key={index} onClick={() => setProcessNumber(index+1)}>
                    {
                      ProcessOption(process, processNumber)
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <h1>Download Plant Parenthood Now</h1>
        
        <p>Transform your plant care experience with the Plant Parenthood app, empowering you to effortlessly nurture your plants, expand your knowledge, and join a thriving community of passionate plant enthusiasts - download now and embark on a rewarding journey of green thumb greatness.</p>
        
        <div className={styles.buttonGroup}>
          <button>
            <a href="/plant-parenthood.apk" download>
              <Image src={android} alt='Android' width={36} height={20.62}></Image>
              Download <span>APK</span>
            </a>
          </button>
          <button>
            <a href="https://github.com/txabiii/mobile-dev-finals">
              <Image src={gitHub} alt='GitHub' width={36} height={36}></Image>
              View on <span>GitHub</span>
            </a>
          </button>
        </div>

        <div className={styles.line}></div>

        <p>Website Design by Txabi Guerrero | Plant Parenthood designed and developed by Brian Kyle Regacho, Jastine Laplano, John Michael Espiritu and Txabi Guerrero</p>
      </footer>
    </body>
  )
}
