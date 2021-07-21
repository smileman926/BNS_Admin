import React, { useCallback, useEffect, useMemo, useRef, useState, Fragment } from 'react';

import { Divider, Dropdown, Menu, Button, DatePicker, notification, Select } from 'antd';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import moment from 'moment-timezone';
import styles from './index.module.scss';
import PageHeaderWithButton from '../../../components/PageHeaderWithButton';
import {
  productsSelector,
  selectedProductImgsSelector,
  selectedProductsSelector,
} from '../../../redux/products/Selectors';
import { categoriesSelector } from '../../../redux/categories/selectors';
import { getCategoriesRequest } from '../../../redux/categories/categoriesActions';
import withAuth from '../../../utils/HOC/withAuth';
import { downloadImage, generateImgNameForAwsUpload } from '../../../utils/services/S3';
import {
  changeProductStatus,
  clearSelectedProduct,
  getAllProductImgs,
  getSelectedProduct,
  updateProduct,
} from '../../../redux/products/Actions';
import ImagesContainer from '../../../components/ImagesContainer';
import router from '../../../router';
import { parseFromTimeZone } from 'date-fns-timezone';
import { settingsSelector } from '../../../redux/setting/Selectors';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';
import { apiSaveWebinar, apiGetProducts, apiSaveProduct  } from '../../../utils/api/api';
import uploadImages from '../../../helpers/uploadImage';

const { Option } = Select;

const ProductEdit = ({location}) => {

  const product = useSelector(selectedProductsSelector);

  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const loading = useSelector(productsSelector)?.loading;
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector(categoriesSelector)?.list;
  const webinarCategories = categories.filter((category) => !category?.product_type.includes('physical')); 
  const productCategories = categories.filter((category) => category?.product_type.includes('physical'));
  const gallery = useSelector(selectedProductImgsSelector)?.gallery;
  const [category, setCategory] = useState();
  const [description, setDescription] = useState(product?.shortDescription);
  const [shippingPrice, setShippingPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [publishMethod, setPublishMethod] = useState('instant');
  const [scheduledDateNTime, setScheduledDateNTime] = useState();
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;
  const [meta, setMeta] = useState({
    files: [],
    deletedImages: [],
    mainImg: null,
    uploadedImages: [],
  });

  // for mini's prize select
  const [webinarsList, setWebinarsList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [prizeWebinarID, setPrizeWebinarID] = useState();
  const [prizeSeatsNum, setPrizeSeatsNum] = useState();

  // for gifts' prize
  const [giftWinners, setGiftWinners] = useState([]);

  const scheduled_time = useMemo(() => {
    return scheduledDateNTime
      ? parseFromTimeZone(scheduledDateNTime, { timeZone: timezone }).toISOString()
      : null;
  }, [scheduledDateNTime]);

  const history = useHistory();
  const dispatch = useDispatch();
  const [primaryImg, setPrimaryImg] = useState();

  const inputRef = useRef();
  const handleMainImg = useCallback(
    (mainImg) => {
      mainImg.active = true;
      setMeta({
        ...meta,
        mainImg,
      });
    },
    [meta],
  );
  useEffect(() => {
    if (gallery?.length && meta.mainImg) {
      setPrimaryImg(gallery.filter((item) => item?.image_url === meta?.mainImg));
    } else {
      setPrimaryImg(gallery && [gallery[0]]);
    }
    // eslint-disable-next-line
  }, [meta, gallery]);

  useEffect(() => {
    if (location?.state?.duplicate && product?.webinar_type === 'gifts' && product?.winners?.length > 0) {
      let temp = [];
      product.winners.map( item => temp.push({
        place: item.position,
        amount: item.gifts.amount
      }));
      temp.sort((a, b) => (a.place > b.place) ? 1 : -1);
      setGiftWinners(temp);
    }

    if (product?.pictures?.length) {
      setMeta({
        ...meta,
        files: product.pictures,
        mainImg: product.pictures.find(
          ({ image_url }) => image_url === product?.main_image?.image_url,
        ),
      });
    }

    product?.scheduled_time && setScheduledDateNTime(moment(product.scheduled_time));
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (product) {
      if (product.product_type === 'webinar') {
        setTitle(product.name);
        setPrice(product.price_per_seats);
        setQuantity(product.seats);
        setDescription(product.shortDescription);
        setCategory(categories.find((item) => item?.id === product.category_id));
        setPublishMethod(product.publish_method);
      } else {
        setTitle(product.productName);
        setPrice(product.pricePerItem);
        setQuantity(product.amount);
        setShippingPrice(product?.shipping_price);
        setDescription(product.shortDescription);
        setPublishMethod(product.publish_method);
        setCategory(categories.find((item) => item?.id === product.category_id));
      }
    }
    // eslint-disable-next-line
  }, [product, categories]);

  useEffect(() => {
    if (product?.id) {
      dispatch(
        getAllProductImgs({
          id: product.id,
          type: product.product_type,
        }),
      );
    }
    // eslint-disable-next-line
  }, [product?.id, product?.product_type, product?.productcImageWasUpdated]);

  useEffect(() => {
    setLoadingList(true);
    apiGetProducts({
      limit: Number.MAX_SAFE_INTEGER,
      filter: 'webinar',
      status: 'all',
    })
    .then((res) => {
      setWebinarsList(res.rows);
    })
    .catch((err) => console.log('err', err))
    .finally(() => {
      setLoadingList(false);
    });
    
    if (!categories.length) {
      dispatch(getCategoriesRequest());
    }
    return () => {
      dispatch(clearSelectedProduct());
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (location?.state?.id && location?.state?.type) {
      dispatch(
        getSelectedProduct({
          id: location.state.id,
          type: location.state.type,
        }),
      );
    }
    // eslint-disable-next-line
  }, [location]);
  

  const handleListNowClick = () => {
    setPublishMethod('instant');
  };
  const handleListLaterClick = () => {
    setPublishMethod('scheduled');
  };

  const handleAddToQueueClick = () => {
    setPublishMethod('queued');
  };

  const handleShippingPrice = useCallback((e) => {
    const count = e.target.value;
    if ((count < 1 && count !== '') || count > 1000) {
      return;
    }
    setShippingPrice(count);
  }, []);

  const handleQuantity = useCallback((e) => {
    const count = e.target.value;
    if ((count < 1 && count !== '') || count > 1000) {
      return;
    }
    setQuantity(count);
  }, []);

  const handleGiftWinner = useCallback((e, pl) => {
    const count = e.target.value;
    if ((count < 1 && count !== '') || count > 1000) {
      return;
    }
    let temp = [];
    giftWinners.map( item => {
      if (item.place === pl)
        temp.push({
          place: pl,
          amount: Number(count)
        });
      else
        temp.push({
          place: item.place,
          amount: item.amount
        })
    })
    setGiftWinners(temp);
  }, [giftWinners]);

  const handlePrizeSeats = useCallback((e) => {
    const count = e.target.value;
    if ((count < 1 && count !== '') || count > 1000) {
      return;
    }
    setPrizeSeatsNum(count);
  }, []);

  const handleUpdateEntity = useCallback(
    (onSuccess) => {     
      if (product.product_type === 'webinar') {
        dispatch(
          updateProduct(
            {
              name: title,
              product_id: product.id,
              price_per_seats: price,
              seats: quantity,
              product_type: product.product_type,
              shortDescription: description,
              category_id: category?.id,
              publish_method: publishMethod,
              primary_image_id: primaryImg.id,
              scheduled_time,
            },
            {
              localState: meta,
              onSuccess,
            },
          ),
        );
      } else {
        dispatch(
          updateProduct(
            {
              product_id: product.id,
              product_type: product.product_type,
              shortDescription: description,
              category_id: category?.id,
              productName: title,
              shipping_price: shippingPrice,
              pricePerItem: price,
              amount: quantity,
              publish_method: publishMethod,
              primary_image_id: primaryImg.id,
              scheduled_time,
            },
            {
              localState: meta,
              onSuccess,
            },
          ),
        );
      }
      // eslint-disable-next-line
    },
    [
      product,
      scheduledDateNTime,
      publishMethod,
      history,
      category,
      description,
      dispatch,
      price,
      product?.id,
      product,
      quantity,
      title,
      shippingPrice,
      primaryImg,
      meta,
    ],
  );

  const handleUpdate = useCallback(async () => {
    if (location?.state?.duplicate){
      if (!meta.mainImg.image_url) {
        notification.error({
          message: 'Upload a picture!',
        });
        return;
      }
      if (product?.webinar_type === 'seats' && prizeSeatsNum > quantity) {
        notification.error({
          message: 'Prize seats number should be less than webinar seats.',
        });
        return;
      }
      if (product?.webinar_type === 'seats' && !prizeWebinarID) {
        notification.error({
          message: 'You should select prize webinar.',
        });
        return;
      }

      try {

        setIsLoading(true);

        let body = {
          scheduled_time
        }

        const oldImgList = meta.files.filter( item => item.id);
        const imgList = meta.files.filter( item => !item.id);
        
        if (imgList.length > 0) {
          if (!meta.mainImg.id) {
            const picture = await uploadImages({ type: product?.product_type ? product.product_type : 'physical', mainImage: meta.mainImg, listImages: imgList });
            picture?.imageLists && oldImgList.map(item => picture.imageLists.push(item.image_url));
           
            body.mainImage = picture.mainImage;
            body.imageLists = picture.imageLists;
          }
          else {
            const picture = await uploadImages({ type: product?.product_type ? product.product_type : 'physical', mainImage: imgList[0], listImages: imgList });
            picture?.imageLists && oldImgList.map(item => picture.imageLists.push(item.image_url));
           
            body.mainImage = meta.mainImg.image_url;
            body.imageLists = picture.imageLists;
          }
        }
        else {
          let imgLists = [];
          meta.files.map( item => imgLists.push(item.image_url));

          body.mainImage = meta.mainImg.image_url;
          body.imageLists = imgLists;
        }
        

        if (product?.product_type === 'webinar') {
          body.category_id = category?.id;
          body.name = title;
          body.price_per_seats = price;
          body.publish_method = publishMethod;
          body.seats = quantity;
          body.shortDescription = description;
          body.webinar_type = product?.webinar_type; 
          
          if (product?.webinar_type === 'seats') {
            body.prize = {
              seats: prizeSeatsNum,
              webinar_id: prizeWebinarID
            }
          }

          if (product?.webinar_type === 'gifts' && giftWinners?.length > 0)
          {
            let temp = [];
            giftWinners.map( item => temp.push({amount: item.amount}));
            body.prize = temp;
          }
          
          await apiSaveWebinar(body);
          notification.success({
            message: 'Duplicated',
          });
        }
        else{
          body.amount = quantity;
          body.category_id = category?.id;
          body.productName = title;
          body.pricePerItem = price;
          body.publish_method = publishMethod;        
          body.shortDescription = description;
          body.shipping_price = shippingPrice;

          await apiSaveProduct(body);
          notification.success({
            message: 'Duplicated',
          });
        }
        
        history.push(router.productListingOptions.path);
      } catch (err) {
        notification.error({
          message: err.response?.data?.message || err.message,
        });
      } finally {
        setIsLoading(false);
      }      
    }
    else
      handleUpdateEntity(() => {
        history.push(router.productListingOptions.path);
      });
    // eslint-disable-next-line
  }, [
    product,
    scheduledDateNTime,
    history,
    category,
    description,
    dispatch,
    price,
    product?.id,
    product,
    quantity,
    title,
    shippingPrice,
    primaryImg,
    publishMethod,
    meta,
    prizeSeatsNum,
    prizeWebinarID,
    giftWinners
  ]);

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        file.image_url = generateImgNameForAwsUpload(file, product?.product_type);

        setMeta({
          ...meta,
          files: [...meta.files, file],
        });
      }
      // eslint-disable-next-line
    },
    [product, meta],
  );
  const setScheduledTime = useCallback(
    (date) => {
      if (date) {
        const d = date.unix() === moment().unix() ? moment(date).tz(timezone) : date;
        const newDate = new Date(
          d.year(),
          d.month(),
          d.date(),
          d.hours(),
          d.minutes(),
          d.seconds(),
          d.milliseconds(),
        );
        return setScheduledDateNTime(moment(newDate));
      }
      setScheduledDateNTime(date);
    },
    [setScheduledDateNTime, timezone],
  );
  const handleDeleteImage = (image) => {
    if (image !== meta.mainImg) {
      setMeta({
        ...meta,
        files: meta.files.filter((item) => item.image_url !== image.image_url),
        deletedImages: [...meta.deletedImages, image.id],
      });
    }
  };
  const handleChooseFileClick = useCallback(() => {
    inputRef.current.click();
  }, [inputRef]);

  const handleTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);
  const handleDescription = useCallback((e) => {
    setDescription(e.target.value);
  }, []);
  const handleCategoryClick = useCallback((item) => {
    setCategory(item);
  }, []);
  const handlePrice = useCallback((e) => {
    setPrice(e.target.value);
  }, []);

  const handleActivateClick = useCallback(() => {
    if (product) {
      if (product?.product_status === 'active') {
        if (product?.product_type === 'webinar') {
          dispatch(
            changeProductStatus(
              {
                product_id: product.id,
                product_status: 'hold',
                product_type: product.product_type,
              },
              {
                id: product.id,
                type: product.product_type,
              },
            ),
          );
        } else {
          dispatch(
            changeProductStatus(
              {
                product_id: product.id,
                product_status: 'hold',
                product_type: product.product_type,
              },
              {
                id: product.id,
                type: product.product_type,
              },
            ),
          );
        }
      } else if (product?.product_type === 'webinar') {
        dispatch(
          changeProductStatus(
            {
              product_id: product.id,
              publish_method: 'instant',
              product_type: product.product_type,
              scheduled_time: parseFromTimeZone(moment(), { timeZone: timezone }).toISOString(),
              product_status: 'active',
            },
            {
              id: product.id,
              type: product.product_type,
            },
          ),
        );
      } else {
        dispatch(
          changeProductStatus(
            {
              product_id: product.id,
              publish_method: 'instant',
              product_type: product.product_type,
              scheduled_time: parseFromTimeZone(moment(), { timeZone: timezone }).toISOString(),
            },
            {
              id: product.id,
              type: product.product_type,
            },
          ),
        );
      }
    }
  }, [dispatch, product]);

  const renderProductsCategories = useMemo(
    () =>
      productCategories.map((category) => (
        <Menu key={category.id} className={styles.menuItem}>
          <Menu.Item
            className={styles.menuItem}
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            onItemHover={() => void null}
          >
            <div className={styles.menuItemCont}>
              <span className={styles.spanMenu}>{category.category_name}</span>
            </div>
          </Menu.Item>
        </Menu>
      )),
    [handleCategoryClick, productCategories],
  );

  const renderWebinarCategories = useMemo(
    () =>
      webinarCategories.map((category) => (
        <Menu key={category.id} className={styles.menuItem}>
          <Menu.Item
            className={styles.menuItem}
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            onItemHover={() => void null}
          >
            <div className={styles.menuItemCont}>
              <span className={styles.spanMenu}>{category.category_name}</span>
            </div>
          </Menu.Item>
        </Menu>
      )),
    [handleCategoryClick, webinarCategories],
  );
  const categoriesMenu = (
    <Menu className={styles.menuCont}>
      {product?.product_type === 'physical' ? renderProductsCategories : renderWebinarCategories}
    </Menu>
  );

  return (
    <Fragment>
      { product && 
      <div className={styles.container}>
        <div className={styles.updatehand}>
          <PageHeaderWithButton title={ location?.state?.duplicate ? 'Duplicate Product' : 'Edit Product' }/>
          <Button className={styles.btn} onClick={handleUpdate} loading={loading || isLoading}>
            { location?.state?.duplicate ? 'Duplicate' : 'Update' }
          </Button>
        </div>
        <div className={styles.productCont}>
          <div className={styles.formCont}>
            {
              !location.state.duplicate &&
              <Fragment>
                <div className={styles.updatehand}>
                  <PageHeaderWithButton title="Status" />
                  <button
                    className={clsx(
                      styles.btn,
                      product.product_status === 'hold' && styles.inAcitve,
                      product.amount === 0 && styles.greyedButton,
                    )}
                    onClick={handleActivateClick}
                    disabled={product.amount === 0}                  
                  >
                    {product?.product_status}
                  </button>
                </div>
                <Divider />
              </Fragment>
            }
            <h3 className={styles.h3Text}>Product Details</h3>
            <div className={styles.cont}>
              <span className={styles.span}>Product title</span>
              <input className={styles.inpt} value={title} onChange={(e) => handleTitle(e)} />
            </div>
            <div className={styles.cont}>
              <Dropdown overlay={categoriesMenu} trigger={['click']} className={styles.categoryMenu}>
                <a onClick={(e) => e.preventDefault()}>
                  <div className={styles.categorySpan}>
                    {category?.category_name ? category.category_name : 'Choose category'}
                  </div>{' '}
                  <DownOutlined />
                </a>
              </Dropdown>
            </div>
            <div className={styles.cont}>
              <span className={styles.span}>Product Description</span>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => handleDescription(e)}
                className={styles.textArea}
              />
            </div>
            <div className={styles.productCont}>
              <div className={clsx(styles.cont, styles.price)}>
                <span className={styles.span}>
                  {product?.product_type === 'webinar' ? 'Price per Seat' : 'Price per Unit'}{' '}
                </span>
                <input
                  className={styles.inpt}
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => handlePrice(e)}
                />
              </div>
              {product?.product_type !== 'webinar' && (
                <div className={clsx(styles.cont, styles.ava)}>
                  <span className={styles.span}>Shipping Price</span>
                  <input
                    className={styles.inpt}
                    type="number"
                    value={shippingPrice}
                    onChange={(e) => handleShippingPrice(e)}
                  />
                </div>
              )}

              <div className={clsx(styles.cont, styles.ava)}>
                <span className={styles.span}>
                  {product?.product_type === 'physical' ? 'Inventory' : 'Seats'}
                </span>
                <input
                  className={styles.inpt}
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantity(e)}
                />
              </div>
            </div>
            {
              giftWinners?.length > 0 &&
              <div className={styles.productCont}>
                { giftWinners.map( item => 
                  <div className={clsx(styles.cont, styles.price)}>
                  <span className={styles.span}>Prize {item.place}</span>
                  <input
                    className={styles.inpt}
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleGiftWinner(e, item.place)}
                  />
                </div>)}
              </div>              
            }
            {
              location?.state?.duplicate && product?.webinar_type === 'seats' && 
              <div className={styles.productCont}>
                <div className={clsx(styles.cont, styles.price)}>
                  <span className={styles.span}>
                    Prize Webinar
                  </span>
                  <Select
                    loading={loadingList}
                    placeholder="Choose prize webinar"
                    style={{padding: '0'}}
                    onChange={setPrizeWebinarID}
                  >
                    {webinarsList.length &&
                      webinarsList.map((elem) => (
                        <Option key={elem.id} value={elem.id}>
                          {elem.product_name}
                        </Option>
                      ))}
                  </Select>
                </div>               

                <div className={clsx(styles.cont, styles.ava)}>
                  <span className={styles.span}>
                    Number of Seats
                  </span>
                  <input
                    className={clsx(styles.inpt, styles.custom)}
                    type="number"
                    value={prizeSeatsNum}
                    onChange={(e) => handlePrizeSeats(e)}
                  />
                </div>
              </div>              
            }
            <div className={styles.timeBtnsCont}>
              <Button
                className={publishMethod === 'instant' ? styles.btn : styles.greyedButton}
                onClick={handleListNowClick}
              >
                LIST NOW
              </Button>
              <Button
                className={publishMethod === 'scheduled' ? styles.btn : styles.greyedButton}
                onClick={handleListLaterClick}
              >
                LIST LATER
              </Button>
              {product?.product_type === 'webinar' && (
                <Button
                  className={publishMethod === 'queued' ? styles.btn : styles.greyedButton}
                  onClick={handleAddToQueueClick}
                >
                  ADD TO QUEUE
                </Button>
              )}
            </div>
            {publishMethod === 'scheduled' && (
              <DatePicker
                className={styles.datePicker}
                showTime
                value={scheduledDateNTime}
                onChange={setScheduledTime}
                disabledDate={(current) => current && current < moment().subtract(1, 'days')}
                showNow={false}
              />
            )}
          </div>
          <div className={styles.imgCont}>
            <div className={styles.productImage}>
              <img className={styles.mainImg} src={downloadImage(product?.main_image?.image_url)} />
            </div>
            <div className={styles.productGalery}>
              <span className={styles.spanProductGallery}>Product Gallery</span>
              <ImagesContainer
                files={meta.files}
                showUploadedImages
                handleDeleteImage={(image) => handleDeleteImage(image)}
                selectedImage={meta.mainImg}
                handleSelectImage={(files) => handleMainImg(files)}
              />
              <input
                type="file"
                ref={inputRef}
                onChange={handleChange}
                accept="image/*"
                className={styles.inptImg}
              />
              <span className={styles.spanAddImg} onClick={handleChooseFileClick}>
                Add Product Gallery Images
              </span>
            </div>
          </div>
        </div>
      </div>
    }
    </Fragment>
  );
};
export default withAuth(withPermissionChecking(ProductEdit));
