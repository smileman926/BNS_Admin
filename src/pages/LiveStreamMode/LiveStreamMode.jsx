import { Button, Table, Select, notification, Switch } from "antd";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../../components/Filter";
import { GunIcon, TrophyIcon } from "../../helpers/customIcon";
import * as style from "./LiveStreamMode.module.scss";
import { getListUserWebinarsRequest } from "./../../redux/soldOutWebinars/soldOutWebinarsActions";
import { apiGetListUsersWebinars } from '../../utils/api/api';
import withAuth from "../../utils/HOC/withAuth";
import { apiSetWinners } from "../../utils/api/api";
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';

const { Option } = Select;
const { Column } = Table;

function LiveStreamMode({ location, history }) {
  const [filter, setFilter] = useState({
    limit: "10",
    page: 1,
    query: "",
  });

  const { webinar } = location.state;
  const [selectUser, setSelectUser] = useState([]);

  const dispatch = useDispatch();

  const data = useSelector((state) => state.soldOutWebinars.listUser.list);
  // const list = data?.users?.rows.map((el) => ({ ...el, ...el.user, seatNo: el.seatNo + 1 }));
  const [list, setList] = useState([]);

  const loading = useSelector((state) => state.soldOutWebinars.listUser.loading);

  const [gifts, setGifts] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);

  const [isManul, setIsManual] = useState(true);

  useEffect(() => {
    if (data.won_item) {
      setGifts(data.won_item.map((el) => ({ ...el[webinar.webinar_type], select_place: null, position: el.position })));
    }

    if (data.available_seats) {
      setAvailableSeats(data.available_seats.map((seat, i) => ({ id: i, giftSeatNo: seat, prodSeatNo: null })));
    }
  }, [data]);

  const handlerSelects = (value, record) => {
    console.log(value, record);
    if (!value)
      setAvailableSeats(availableSeats.map(
        el => {
          if(el.prodSeatNo === record.seatNo)
            el.prodSeatNo = null;
          return el;          
        }
      ));

    setGifts(
      gifts.map((gift) => {
        let { select_place, user_id } = gift;

        if (gift.select_place === record.seatNo) {
          select_place = null;
          user_id = null;
        }
        if (gift.id === value) {
          select_place = value ? record.seatNo : null;
          user_id = value ? record.user.id : null;
        }

        return { ...gift, select_place, user_id };
      })
    );
  };

  const setGiftSeatNo = (value, record) => {
    setAvailableSeats(
      availableSeats.map(seat => {
        let { prodSeatNo } = seat;

        if (prodSeatNo === record.seatNo)
          prodSeatNo = null;

        if (seat.id === value) {
          prodSeatNo = record.seatNo;
        }

        return { ...seat, prodSeatNo };
      })
    );
  }

  useEffect(() => {
    dispatch(getListUserWebinarsRequest(webinar));
    async function loadList() {
      const result = await apiGetListUsersWebinars(webinar);
      setList(result?.users?.rows.map((el) => ({ ...el, ...el.user, seatNo: el.seatNo + 1 })))
    }
    loadList();    
  }, []);

  const [sendWinnerLoading, setSendWinnerLoading] = useState(false);

  const sendWinners = () => {
    const { webinar_type, id } = webinar;
    const body = {
      gifts: gifts.map(
        el => (
          {
            ...el,
            seatNo: el.select_place - 1,
            product_seat_no:
              (webinar.webinar_type === 'seats') && isManul ?
                availableSeats.find(seat => seat.prodSeatNo === el.select_place)?.giftSeatNo
                :
                null
          }
        )
      ),
      webinar_type,
      webinar_id: id,
      is_manual: (webinar.webinar_type === 'seats') && isManul
    };

    if (body.gifts.some(el => typeof (el.product_seat_no) === 'undefined') && isManul && (webinar.webinar_type === 'seats')) {
      notification.error({
        message: "Select gift seat(s) for Winner(s)",
      });
      return;
    }

    setSendWinnerLoading(true);
    apiSetWinners(body)
      .then((res) => {
        notification.success({
          message: "Success",
        });
        setSendWinnerLoading(false);
        history.go(-1);
      })
      .catch((err) => {
        setSendWinnerLoading(false);
        notification.error({
          message: err.message,
        });
      });
  };
  return (
    <div className={style.box}>
      <div className={style.header}>
        <h2 className={style.title}>Sold Out Webinars</h2>
        {
          webinar.webinar_type === 'seats' && <div className={style.manual}>
            <p>Assign manually</p>
            <Switch
              className={style.switch}
              checked={isManul}
              onClick={() => setIsManual(!isManul)}
            />
          </div>
        }
        <p className={style.webinarName}>
          <GunIcon className={style.icon} />
          {webinar.name}
        </p>
      </div>
      <div className={clsx("box", style.container)}>
        {/* <Filter change={setFilter} /> */}
        <Table
          loading={loading}
          title={false}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={false}
        >
          <Column title="Seats No." dataIndex="seatNo" align="center" />
          <Column title="User Name" dataIndex="username" align="center" />
          <Column
            title="Winner No."
            align="center"
            // title="User Email"
            render={(text, record) => (
              <Select
                // defaultValue={gifts.find((el) => el.select_place === record.id)?.id}
                style={{ width: "150px" }}
                allowClear
                onChange={(value) => handlerSelects(value, record)}
              >
                {gifts.map((gift) => (
                  <Option
                    key={gift.id}
                    value={gift.id}
                    title={gift.description}
                    disabled={!!gift.select_place}
                  >
                    {gift.position}
                  </Option>
                ))}
              </Select>
            )}
          /> 
          {
            webinar.webinar_type === 'seats' && isManul && <Column
              title="Available Seats"
              align="center"
              render={(text, record) => {              
                return(
                <Select              
                  disabled={!gifts.find(el => el.select_place === record.seatNo)}
                  style={{ width: "150px" }}
                  value={availableSeats.find(el => el.prodSeatNo === record.seatNo)?.id}
                  allowClear
                  onChange={(value) => setGiftSeatNo(value, record)}
                >

                  {!availableSeats.length && <Option selected disabled> No seats remaining </Option> ||
                    availableSeats.map((seat) => (
                    <Option
                      key={seat.id}
                      value={seat.id}
                      disabled={seat.prodSeatNo}
                    >
                      {seat.giftSeatNo + 1}
                    </Option>
                  ))}
                </Select>
              )}}
            />
          }
        </Table>
        <Button
          type="bns"
          disabled={gifts.some((gift) => !gift.select_place)}
          onClick={sendWinners}
          loading={sendWinnerLoading}
          className={style.btn}
        >
          <TrophyIcon /> select as winners
        </Button>
      </div>
    </div>
  );
}


export default withAuth(withPermissionChecking(LiveStreamMode));
