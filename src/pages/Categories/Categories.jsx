import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Table, Input, Form, Checkbox } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PencilIcon } from '../../helpers/customIcon';
import {
  getCategoriesRequest,
  delCategoriesRequest,
  updateCategoriesRequest,
} from '../../redux/categories/categoriesActions';
import router from '../../router';
import withAuth from '../../utils/HOC/withAuth';
import * as style from './Categories.module.scss';
import Modal from 'antd/lib/modal/Modal';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';
import Filter from '../../components/Filter';

const { Column } = Table;

function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.list);
  const loading = useSelector((state) => state.categories.loading);
  const [edit, setEdit] = useState(false);
  const permissions = useSelector(rolesSelector);
  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'categoryEdit'));
  }, [permissions]);
  const [selectItem, setSelectItem] = useState([]);
  const [filter, setFilter] = useState({
    filterString: "",
  })
  useEffect(() => {
    if (filter){
      dispatch(getCategoriesRequest(filter));
    }
  }, [filter]);

  const deleteCategories = () => {
    dispatch(delCategoriesRequest({ list: selectItem }));
  };

  const [modal, setModal] = useState(false);

  const handlerModal = () => {
    setModal(!modal);
  };

  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  const editCategory = (record) => {
    const { id, category_name, product_type } = record;
    setEditId(id);
    setModal(true);
    form.setFieldsValue({
      category_name,
      product_type: product_type,
    });
  };

  const saveEditCategory = (e) => {
    setModal(false);
    const body = {
      id: editId,
      category_name: e.category_name,
      product_type: e.product_type,
    };
    dispatch(updateCategoriesRequest(body));
  };

  return (
    <>
      <Modal visible={modal} footer={false} onCancel={handlerModal}>
        <h2>Edit Category</h2>
        <Form form={form} onFinish={saveEditCategory}>
          <Form.Item
            name="category_name"
            rules={[
              {
                required: true,
                message: 'Please input category name',
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="product_type"
            rules={[
              {
                required: true,
                message: 'Select type',
              },
            ]}
          >
            <Checkbox.Group style={{ justifyContent: 'flex-start', display: 'flex' }}>
              <Checkbox value="physical">Physical</Checkbox>
              <Checkbox value="standard">Standard Webinar</Checkbox>
              <Checkbox value="gift">Gift</Checkbox>
              <Checkbox value="mini">Mini</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <div className={style.wrp}>
            <Button type="bns" htmlType="button" onClick={handlerModal} className={style.cancel}>
              cancel
            </Button>

            <Button type="bns" loading={loading} htmlType="submit">
              save
            </Button>
          </div>
        </Form>
      </Modal>
      <div className={style.box}>
        <div className={style.header}>
          <h2 className={style.title}>Categories</h2>
          {edit && (
            <Link to={router.addCategories.path} className={style.btnAdd}>
              add new
            </Link>
          )}
        </div>

        <div className={clsx('box', style.container)}>
          <Row justify="space-between">
            <Col>
              {edit && (
                <p>
                  Action:
                  <Button
                    icon={<DeleteOutlined />}
                    className={style.delBtn}
                    disabled={selectItem.length === 0}
                    onClick={deleteCategories}
                  />
                </p>
              )}
            </Col>
          </Row>

          <Filter change={setFilter}  
          placeholder="Search by category" 
          search
          />

          <Table
            dataSource={categories}
            loading={loading}
            title={false}
            pagination={false}
            rowKey={(record) => record.id}
            rowSelection={edit ? {
              type: 'checkbox',
              onChange: setSelectItem,
            } : false}
          >
            <Column title="Category Name" dataIndex="category_name" />
            <Column title="Product Type" dataIndex="product_type"
              render={ type => (type.length > 1 && type.includes('physical')) ? 'Both' : type.includes('physical') ? 'Product' : 'Webinar'}
             />
            {edit && (
              <Column
                title="Action"
                align="right"
                render={(text, record) => (
                  <Button
                    htmlType="button"
                    className={style.button}
                    onClick={() => editCategory(record)}
                  >
                    <PencilIcon data-id={record.id} className={style.editIcon} />
                  </Button>
                )}
              />
            )}
          </Table>
        </div>
      </div>
    </>
  );
}

export default withAuth(withPermissionChecking(Categories));
