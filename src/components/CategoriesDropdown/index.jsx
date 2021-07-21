import { Select } from 'antd';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../pages/ProductListing/ProductAdd/index.module.scss';
import { categoriesSelector } from '../../redux/categories/selectors';

const { Option } = Select;
const CategoriesDropdown = (props) => {
  const { type, ...args } = props;
  const categories = useSelector(categoriesSelector)?.list;
  
  const renderOptions = useMemo(() => {
    return categories
      .filter((category) => category.product_type.includes(type) )
      .map((category) => (
        <Option key={category.id} value={category.id}>
          {category.category_name}
        </Option>
      ));
  }, [categories, type]);

  return (
    <Select {...args} bordered={false} className="rounded" placeholder="Choose Category">
      {renderOptions}
    </Select>
  );
};

export default CategoriesDropdown;
