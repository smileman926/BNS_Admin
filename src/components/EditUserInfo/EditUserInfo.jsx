import { Button, Form, Input, notification, Select } from 'antd';
import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mailPattern } from '../../helpers/regExps';
import { apiUpdateUsersManagement } from '../../utils/api/api';
import AddressInput from '../AddressInput/AddressInput';
import { getRoles } from '../../redux/roles/Actions';
import { useEffect } from 'react';
import AuthService from '../../utils/services/AuthService';

const { REACT_APP_PATTERN_EMAIL } = process.env;

const { Option } = Select;

function EditUserInfo({ user }) {

  const [userAddress, setUserAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    zipcode: "",
  })

  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const listRole = useSelector((state) => state.roles.list);

  useEffect(() => {
    setUserAddress({
      street_address: user.street_address || "",
      city: user.city || "",
      state: user.state || "",
      zipcode: user.zipcode || "",
    })
    dispatch(getRoles({filterString: ''}));    
  }, []);

  const userID = useSelector((state) => state.auth.user)?.id;
  const userRoleID = useSelector((state) => state.auth.user)?.role_id;

  const sendNewParams = 
    (value) => {
      setLoading(true);    
      const {
        street_address,
        city,
        state,
        zipcode
      } = userAddress;

      let tempPhone = value.phone_number.replace('+', '');
      if (Number(tempPhone[0]) !== 1)
        tempPhone = "1"+tempPhone
      apiUpdateUsersManagement({
        ...value,
        id: user.id,
        phone_number: `+${tempPhone}`,
        address: street_address + ', ' + city + ', ' + state + " " + zipcode + ", USA",
        street_address,
        city,
        state,
        zipcode,
      })
        .then((res) => {
          notification.success({
            message: 'Saved!',
          });
          if ((userRoleID !== value.role_id) && (userID === user.id)) {
            AuthService.logOut();
          }
        })
        .catch((err) => {
          notification.error({ message: err.response.data.message });
        })
        .finally(() => {
          setLoading(false);
        });
    }

  const checkNewValue = useCallback((value, allValue) => {
    const convert = Object.entries(allValue);
    const result = convert.every((el) => user[el[0]] === el[1]);
    setIsNew(result);
  }, []);

  const getAddressFunc = place => {
    console.log(place);
    const newArray = place.split(", ");
    console.log(newArray);
    let tempStreet = "";
    let tempCity = "";
    let tempState = "";
    let tempZip = "";
    if (newArray.length === 4) {
        tempStreet =  newArray[newArray.length - 4];
        tempCity = newArray[newArray.length - 3];
        tempState = newArray[newArray.length - 2].split(" ")[0];
        tempZip = newArray[newArray.length - 2].split(" ")[1] ? newArray[newArray.length - 2].split(" ")[1] : "";
       
    }
    else {
        tempStreet =  newArray[0];

    }
    setUserAddress({
        street_address: tempStreet,
        city: tempCity,
        state: tempState,
        zipcode: tempZip
    });
  } 

  return (
    <Form
      initialValues={user}
      onFinish={sendNewParams}
      labelAlign="left"
      hideRequiredMark={true}
      // onValuesChange={checkNewValue}
    >
      <Form.Item
        label="First Name"
        name="first_name"
        rules={[
          {
            required: true,
            message: 'Please input first name',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
          {
            required: true,
            message: 'Please input last name',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone_number"
        label="Phone number"
        normalize={(v, pV) => {
          return v.replace(/\D/g, '');
        }}
        rules={[
          {
            required: true,
            message: 'Please input contact phone',
          },
          //   {
          //     pattern: '^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$',
          //     message: 'Please input contact phone',
          //   },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="role_id" label="Role">
        <Select className="selectInForm" placeholder="Select role">
          {listRole?.map((el) => (
            <Option key={el.id} value={el.id}>
              {el.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            message: 'Please input email',
          },
          {
            pattern: mailPattern,
            message: 'Please input contact email',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        // name="address"
        label="Street Address"
        rules={[
          {
            required: true,
            message: 'Please input the address',
          },
        ]}
      >
        <AddressInput 
          placeholder="Street Address"
          value={userAddress.street_address}
          onChange={getAddressFunc}
          data-field="street_address"
          required
        />
      </Form.Item>
      <Form.Item
        label="City"
        rules={[
          {
            required: true,
            message: 'Please input the city name',
          }
        ]}
      >
        <Input 
          placeholder="City Name"
          value={userAddress.city}
          onChange={e => setUserAddress({...userAddress, city: e.target.value})}
        />
      </Form.Item>
      <Form.Item
        label="State"
        rules={[
          {
            required: true,
            message: 'Please input the state name',
          }
        ]}
      >
        <Input 
          placeholder="State Name"
          value={userAddress.state}
          onChange={e => setUserAddress({...userAddress, state: e.target.value})}
        />
      </Form.Item>
      <Form.Item
        label="Zipcode"
        rules={[
          {
            required: true,
            message: 'Please input the zipcode',
          }
        ]}
      >
        <Input 
          placeholder="Zip Code"
          value={userAddress.zipcode}
          onChange={e => setUserAddress({...userAddress, zipcode: e.target.value})}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="bns" loading={loading}>
          save now
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EditUserInfo;
