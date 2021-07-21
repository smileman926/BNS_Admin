import { Col, DatePicker, Divider, notification, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import * as styles from './index.module.scss';
import SwitchWithTextRaw from '../../../components/SwitchWithTextRaw';
import BackgroundImageSelect from './BackgroundImageSelect';
import { 
  apiGetBackgroundImgs, 
  apiAddBackgroundImgs, 
  apiDeleteBackgroundImgs, 
  apiEditBackgroundImgs } from "../../../utils/api/api";
import clsx from 'clsx';
import { Storage } from 'aws-amplify'; 
import { useDropzone } from 'react-dropzone';
import { result } from 'lodash';


const BackgroundSettings = ({ disabled }) => {

  const [btnLoading, setBtnLoading] = useState({
    add: false, delete: false, edit: false
  })

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const setBackImgStartTime = useCallback((value) => {
    console.log(value);
    if (!value) return setStartDate(null);

      const d = value.unix() === moment().unix() ? moment(value) : value;
      const newDate = new Date(
        d.year(),
        d.month(),
        d.date(),
        d.hours(),
        d.minutes(),
        d.seconds(),
        d.milliseconds(),
      );
      newDate.setHours(0);
      newDate.setMinutes(0);
      setStartDate(moment(newDate));
    }
  );

  const setBackImgEndTime = useCallback((value) => {
    if (!value) return setEndDate(null);

      const d = value.unix() === moment().unix() ? moment(value) : value;
      const newDate = new Date(
        d.year(),
        d.month(),
        d.date(),
        d.hours(),
        d.minutes(),
        d.seconds(),
        d.milliseconds(),
      );
      newDate.setHours(23);
      newDate.setMinutes(59);
      setEndDate(moment(newDate));
    }
  );

  // for background image pick with drag and drop file

  const [backgroundImage, setBackgroundImage] = useState(null);

  const [backgroundImageList, setBackgroundImageList] = useState([]);

  const [selectedBackImg, setSelectedBackImg] = useState(null);
  const [activeIndex, setActiveIndex] = useState();

  const {getRootProps, getInputProps} = useDropzone({
      accept: '.jpg, .jpeg, .png, .webp, .tiff, .tif, .gif, .svg',
      multiple : false,
      onDrop: acceptedFiles => {
              setActiveIndex(null);
              setSelectedBackImg(null);
              setStartDate(null);
              setEndDate(null);      
              setBackgroundImage(Object.assign(acceptedFiles[0], {
                      preview: URL.createObjectURL(acceptedFiles[0])
                  }));
              }
  });

  const backgoundImageUpload = async file => {
      const stored = await Storage.put("background-image-"+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+"-"+file.name, file, {
          contentType: file.type,
          cacheControl: 'max-age=31536000'
      });
      return stored.key;
  }

  const getBackgroundImages = async () => {
    apiGetBackgroundImgs()
      .then( async (result) => {
        const backImgList = result.data;
        if ( backImgList && backImgList.length > 0) {
          console.log("BackImageList", backImgList);
          const galleryImgs = [];
          for (let i=0; i<backImgList.length; i++) {
              galleryImgs.push({
                  id: backImgList[i].id,
                  origin_url: backImgList[i].image_url,
                  url: await Storage.get(backImgList[i].image_url),
                  start: backImgList[i].start_from && backImgList[i].start_from.toString(),
                  end: backImgList[i].end_to && backImgList[i].end_to.toString()
              });
          }
          setBackgroundImageList([...galleryImgs]);
        }  
        else
          setBackgroundImageList([]);        
      })
      .catch((err) => {
        notification.error({
          message: err.response.data.message
        });
      });
  }

  useEffect(() => {
    async function loadBackImgs() {
      await getBackgroundImages();
    }
    loadBackImgs();
  }, []);

  const addBackgroundImgFunc = async () => {

      if(!startDate || !endDate || (startDate > endDate)) {
          notification.error({
            message: "Invalid Date Range"
          });
          return;
      }

      if(!backgroundImage) {
          notification.error({
            message: "Please select the file"
          });
          return;
      }
      
      const obj ={
          image_url: backgroundImage,
          start_from: startDate.toISOString(),
          end_to: endDate.toISOString()
      }

      console.log("OBJ===", obj);
      setBtnLoading({...btnLoading, add: true});

      if (backgroundImage){
          const imgUrl = await backgoundImageUpload(backgroundImage);
          obj.image_url = imgUrl;
      }
      apiAddBackgroundImgs(obj)
        .then((result) => {
          if (result.message === "success") {
            setBtnLoading({...btnLoading, add: false});
            notification.success({
              message: "Added successfully"
            });
            getBackgroundImages();
          }
          else
            notification.error({
              message: result.message
            });
        })
        .catch((err) => {
          setBtnLoading({...btnLoading, add: false});
          notification.error({
            message: err.response.data.message
          });
        });

  }

  const deleteBackImgFunc = async () => {
      setBtnLoading({...btnLoading, delete: true});
      apiDeleteBackgroundImgs({
        id: selectedBackImg.id
      })
      .then(
        result => {
          setBtnLoading({...btnLoading, delete: false});
          if (result.message === "success") {
            notification.success({
              message: "Removed successfully"
            });
            getBackgroundImages();
            setSelectedBackImg(null);
            setStartDate(null);
            setEndDate(null);  
          }
          else
            notification.error({
              message: result.message
            });
          }
      )
      .catch((err) => {
        setBtnLoading({...btnLoading, delete: false});
        notification.error({
          message: err.response.data.message
        });
      });
  }

  const editBackImgFunc = async () => {      

      if(!startDate || !endDate || (startDate > endDate)) {
          notification.error({
            message: "Invalid Date Range"
          });
          return;
      }

      const obj = {
          start_from: startDate.toISOString(),
          end_to: endDate.toISOString()
      }
      obj.id = selectedBackImg.id;
      console.log(obj);

      setBtnLoading({...btnLoading, edit: true});
      apiEditBackgroundImgs(obj)
      .then( result => {
        setBtnLoading({...btnLoading, edit: false});
        if (result.message === "success") {
          notification.success({
            message: "Edited successfully"
          });
          getBackgroundImages();
      }
      else
          notification.error({
            message: result.message
          });
      })
      .catch( err => {
        setBtnLoading({...btnLoading, edit: false});
        notification.error({
          message: err.response.data.message
        });
      });
  }

  return (
  <Col className={styles.wrapper}>
    <Divider />
    <SwitchWithTextRaw
      title='Change website background'
      text={'Allow the admin to change the background image with a temporary background and\n put a start and end date'}
    />  
    {/* <BackgroundImageSelect
    disabled={disabled}
    /> */}
      <div className={styles.sbiw}>
        <div {...getRootProps({className: styles.dropzone})}>
            <input {...getInputProps()}/>
            <div className={styles.sui}>
                <div>
                    {
                        backgroundImage ? 
                            <Fragment>
                                <label><CheckCircleOutlined style={{color: '#99ffee'}}/></label>
                                <label className="text-center">{backgroundImage.name && backgroundImage.name.length > 10 ? backgroundImage.name.slice(0,10) + "..." : backgroundImage.name}</label>
                            </Fragment>
                        :    
                            <Fragment>
                                <label>+</label>
                                <label className="text-center">Select File</label>
                            </Fragment>
                    }
                </div>
            </div>
        </div>
        {
            backgroundImageList && backgroundImageList.length > 0 ? backgroundImageList.map(
                (image,i) => <div className={clsx(activeIndex === i+1 && styles.active, styles.prebackimg)} key={i} onClick={()=> {
                    setActiveIndex(i+1);
                    setSelectedBackImg({
                            id: image.id,
                            origin_url: image.origin_url,
                            url: image.url,
                            start: image.start,
                            end: image.end
                        });
                    setBackImgStartTime(moment(image.start));
                    setBackImgEndTime(moment(image.end));
                    }}>
                        <img src={image.url} alt="background image"/>
                    </div>
            )
            :
            null
        }
    </div>

    <div className={styles.cnt}>
      <div className={styles.datePicker}>
        <DatePicker placeholder='Start Date ' value={startDate} onChange={setBackImgStartTime} suffixIcon className={styles.dp} disabled={disabled}/>
        <Divider type='vertical' className={styles.divider} />
        <img alt='' className={styles.calendarIcon} src='/assets/icons/calendar.svg' />
      </div>
      <div className={styles.datePicker}>
        <DatePicker placeholder='End Date ' value={endDate} onChange={setBackImgEndTime} suffixIcon className={styles.dp} disabled={disabled} />
        <Divider type='vertical' className={styles.divider} />
        <img alt='' className={styles.calendarIcon} src='/assets/icons/calendar.svg' />
      </div>
      {
          selectedBackImg ? <Fragment> 
            <Button className={styles.btn} loading={btnLoading.edit} onClick={()=>editBackImgFunc()} disabled={disabled}>EDIT</Button>
            <Button className={styles.btn} loading={btnLoading.delete} onClick={()=>deleteBackImgFunc()} disabled={disabled}>DELETE</Button>
          </Fragment>
          :
          <Button className={styles.btn} loading={btnLoading.add} disabled={disabled} onClick={()=>addBackgroundImgFunc()}>ADD</Button>
      }
    </div>
  </Col>
)};

export default BackgroundSettings;
