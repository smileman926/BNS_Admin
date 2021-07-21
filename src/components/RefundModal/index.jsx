import React, { useState } from 'react';
import styles from './index.module.scss';
import GiftCardIcon from '../../assets/iconsComponents/GiftCardIcon';
import CreditCardIcon from '../../assets/iconsComponents/CrediCardIcon';

const RefundModal = ({
  close, handlePaymentRefund, handleGiftRefund, disabled,
}) => {
  const greyColor = '#a3a3a3';
  const greenColor = '#01f404';
  const [active, setActive] = useState({});

  return (
    <div className={styles.container}>
      <div className={styles.panelCont}>
        <div className={styles.panel}>
          <div className={styles.imgCont} onClick={close} role='presentation'>
            <img className={styles.img} alt='' src='/assets/icons/delete.svg' />
          </div>
          <h3> Refund process</h3>
          <div className={styles.btnsCont}>
            <button
              disabled={disabled}
              className={styles.btn}
              onClick={() => handlePaymentRefund()}
              onMouseOver={() => setActive({ ...active, card: true })}
              onMouseLeave={() => setActive({ ...active, card: false })}
            >
              <CreditCardIcon
                width={20}
                height={20}
                color={active.card ? greenColor : greyColor}

              />
              <span>Payment Method</span>
            </button>
            <button
              disabled={disabled}
              className={styles.btn}
              onClick={() => handleGiftRefund()}
              onMouseOver={() => setActive({ ...active, gift: true })}
              onMouseLeave={() => setActive({ ...active, gift: false })}
            >
              <GiftCardIcon width={20} height={20} color={active.gift ? greenColor : greyColor} />
              {' '}
              <span>Gift Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RefundModal;
