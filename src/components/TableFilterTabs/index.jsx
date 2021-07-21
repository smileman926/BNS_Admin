import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';

import styles from './index.module.scss'
import {
  filterHiddenProducts,
  filterOutOfStockProducts,
  filterVisibleProducts,
  getProducts
} from '../../redux/products/Actions';

const TableFilterTabs = () => {

const dispatch = useDispatch();

const showAllProducts = useCallback(()=>{
  // dispatch(getProducts());
},[dispatch]);
const showVisibleProducts = useCallback(async()=>{
 // await  dispatch(getProducts());
 //  dispatch(filterVisibleProducts());
},[dispatch]);
const showHiddenProducts = useCallback(()=>{
  // dispatch(filterHiddenProducts());
},[dispatch]);
const showProductsOutOfStock = useCallback(()=>{
  // dispatch(filterOutOfStockProducts());
},[dispatch]);
//There should be a filter for Physical/Webinar/All and a filter for Active/Pending/Close
  const [filters, setFilters] = useState( [{
    id:'1',
    title:'All',
    active: true,
    method:  showAllProducts,
  },{
    id:'2',
    title: 'Physical',
    active: false,
    // method: showPhysicalProducts,
  },{
    id:'3',
    title: 'Webinar',
    active: false,
    // method: showWebinar,
  },{
    id:'4',
    title: 'Active',
    active: false,
    // method: showActive,
  },{
    id:'5',
    title: 'Pending',
    active: false,
    // method: showPending,
  },{
    id:'6',
    title: 'Close',
    active: false,
    // method: showClose,
  }]);
  const handleCLick = useCallback((id, method) => {
  const filtersCopy =   filters.map((item) => {
        if(item.id === id) {
            item.active = true
          return item
        }
         item.active= false
         return item
      }
    )
    setFilters(filtersCopy)
    // method()
    return filters
  });
const renderFilterTabs = useMemo(()=>(
    <div className={styles.container}>
      {filters.map((item) =>(
        <span key={item.id} className={clsx(styles.text, item.active && styles.textActive)} onClick={() =>handleCLick(item?.id, item?.method)}>{item.title}</span>))
      }
    </div>
  ),[filters])
  return(
  renderFilterTabs
  )}
export default TableFilterTabs;
