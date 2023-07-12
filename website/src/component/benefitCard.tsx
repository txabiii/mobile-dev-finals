import styles from './benefitCard.module.scss'

import Image from 'next/image';

interface BenefitCardProps {
  iconUrl: string;
  iconName: string
  title: string;
  content: string;
}

export default function BenefitCard({ iconUrl, iconName, title, content }: BenefitCardProps) {
  
  const imageLoader = () => {
    return `/${iconUrl}?w=${60}&q=${75}`
  }

  return (
    <div className={styles.card}>
      <Image
        loader={imageLoader}
        src={iconUrl}
        alt={iconName}
        width={60}
        height={60}
      ></Image>
      <h3>{ title }</h3>
      <p>{ content }</p>
    </div>
  )
}