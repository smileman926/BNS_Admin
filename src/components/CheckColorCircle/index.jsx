import React, {useState, useEffect, Fragment} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Radio } from 'antd';
import fromStyles from './index.module.scss';
import clsx from 'clsx';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import { updateSettingInfoRequest } from '../../redux/setting/settingActions';

const CheckColorCircle = ({type, isLoad}) => {

  const dispatch = useDispatch();
  const settingInfo = useSelector((state) => state.setting.settingInfo);

  const [headerCase, setHeaderCase] = useState("color");

  const [colorPicker, setColorPicker] = useState({
    show: false,
    color: {
      r: 255,
      g: 255,
      b: 255,
      a: 1
    }
  });

  useEffect(() => {
    if (type === "header") {
      JSON.parse(settingInfo.header_background_color) ? setColorPicker({...colorPicker, color: JSON.parse(settingInfo.header_background_color)}) : setHeaderCase("img")
    }
    else
      JSON.parse(settingInfo.footer_background_color) && setColorPicker({...colorPicker, color: JSON.parse(settingInfo.footer_background_color)});    
  }, []);

  const styles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${colorPicker.color.r}, ${colorPicker.color.g}, ${colorPicker.color.b}, ${colorPicker.color.a})`
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'none',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        marginTop: '-280px',
        marginLeft: '0px',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  const changeColorFunc = (val) => {

    const color = {};

    type === "header" ?
      color.header_background_color = JSON.stringify(val === "col" ? colorPicker.color : null)
    :
      color.footer_background_color = JSON.stringify(colorPicker.color);
   
    dispatch(updateSettingInfoRequest(color));
  }

  return(
    <div className={fromStyles.circleCont} >
      {
        type === "header" && <Radio.Group onChange={event => setHeaderCase(event.target.value)} value={headerCase}>
          <Radio value={"img"}><span style={{color: 'white'}}>Use Default Image</span></Radio>
          <Radio value={"color"}><span style={{color: 'white'}}>Use Color</span></Radio>
        </Radio.Group>
      }
      {
        headerCase === "color" && <Fragment>
          <button className={fromStyles.Circle} style={
                { background: `rgba(${colorPicker.color.r}, ${colorPicker.color.g}, ${colorPicker.color.b}, ${colorPicker.color.a})` }
              } onClick={() => {
                console.log(colorPicker.color);
                setColorPicker({ ...colorPicker, show: !colorPicker.show });
          }}></button>
          <div>
            <div style={styles.swatch} onClick={() => setColorPicker({ ...colorPicker, show: !colorPicker.show })}>
              <div style={styles.color} />
            </div>
            {colorPicker.show ? <div style={styles.popover}>
              <div style={styles.cover} onClick={() => setColorPicker({ ...colorPicker, show: false })} />
              <SketchPicker color={colorPicker.color} onChange={col => setColorPicker({ ...colorPicker, color: col.rgb })} />
            </div> : null}

          </div>
        </Fragment>
      }
      {/* <div className={clsx(styles.Circle,styles.whiteCircle )} /> */}
      {/* <div className={clsx(styles.Circle,styles.greyCircle )} />
      <div className={clsx(styles.Circle,styles.greenCircle )}/>
      <div className={clsx(styles.Circle,styles.brownCircle )}/>
      <div className={clsx(styles.Circle,styles.orangeCircle )}/>
      <div className={styles.Circle}>
        <img className={styles.colorCircle} alt='' src='/assets/img/colorCircle.png'/>
      </div> */}
      
      {
        headerCase === "color" ? <Button type="bns" onClick={()=> changeColorFunc("col")} loading={isLoad} className={fromStyles.change_btn}>
          Change
        </Button>
        :
        <Button type="bns" onClick={()=> changeColorFunc("img")} loading={isLoad} className={fromStyles.change_btn}>
          Use Image
        </Button>
      }
    </div>
  )
};

export default CheckColorCircle;
