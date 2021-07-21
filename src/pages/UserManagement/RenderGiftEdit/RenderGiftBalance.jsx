import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { giftCardsSelector } from '../../../redux/giftCards/Selectors';
import { editGiftCard } from '../../../redux/giftCards/Actions';
import { Modal, Button, Form, Tag } from 'antd';

const RenderGiftBalance = ({balance, userID}) => {

  const dispatch = useDispatch();

  const [handleGift, setHandleGift] = useState({
    userId: userID,
    amount: balance ? balance.total : 0
  });
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const loading = useSelector(giftCardsSelector)?.loading;

  useEffect(() => {
    !loading && setIsOpenConfirm(false);
  }, [loading]);

  const editCurrentFFL = async () => {
    dispatch(editGiftCard({
      user_id: handleGift.userId,
      amount: handleGift.amount
    }));    
  };

  return (
    <Fragment>
      {
        isOpenConfirm && <div className={styles.confirmDiv}>
          <h1>Are you sure to edit?</h1>
          <div className={styles.btnWrapper}>
            <Button loading={loading} type="bns" onClick={editCurrentFFL}>
              SURE
            </Button>
            <Button type="bns" onClick={() => setIsOpenConfirm(false)}>
              CANCEL
            </Button>
          </div>          
        </div>
      }
      <div className={styles.balanceWrapper}>
        <input 
          type='number' 
          value={handleGift.amount} 
          onChange={ e => setHandleGift({...handleGift, amount: e.target.value})}
        />
        <button onClick={()=>setIsOpenConfirm(true)}>  
          <img alt="" src="/assets/icons/create.svg"/>           
        </button>             
      </div>
    </Fragment>    
  )
}

export default RenderGiftBalance;