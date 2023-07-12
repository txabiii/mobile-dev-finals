import styles from './processOption.module.scss'

import cx from 'classnames'

interface ProcessDetails { 
  step: number,
  title: string,
  content: string
}

export default function ProcessOption({ step, title, content}: ProcessDetails, processNumber: number) {
  return (
    <div className={styles.processWrapper}>
      <div className={cx(styles.stepWrapper, {[styles.active] : step === processNumber })}>
        <h1>{ step }</h1>
      </div>
      <div className={styles.processDetails}>
        <h4>{ title }</h4>
        <p>{ content }</p>
      </div>
    </div>
  )
}