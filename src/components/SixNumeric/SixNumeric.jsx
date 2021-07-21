import React, { createRef, useEffect, useState } from 'react';
import * as style from './SixNumeric.module.scss';

function SixNumeric({ handler }) {
  const [value, setValue] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });

  const refs = {
    0: createRef(),
    1: createRef(),
    2: createRef(),
    3: createRef(),
    4: createRef(),
    5: createRef(),
  };

  useEffect(() => {
    const code = Object.values(value).join('');
    handler(code);
  });

  const handlerNumber = ({ target }) => {
    const { id } = target.dataset;
    setValue({
      ...value,
      [id]: target.value.replace(/\D/g, '').replace(value[id], '')[0],
    });
    if (id === '5') return;

    if (target.value) refs[Number(id) + 1].current.focus();
  };

  return (
    <div className={style.fourNumber}>
      <input
        type="text"
        className={style.input}
        onChange={handlerNumber}
        value={value[0]}
        data-id="0"
        ref={refs[0]}
        required
      />
      <input
        type="text"
        className={style.input}
        onChange={handlerNumber}
        value={value[1]}
        data-id="1"
        ref={refs[1]}
        required
      />
      <input
        type="text"
        className={style.input}
        onChange={handlerNumber}
        value={value[2]}
        data-id="2"
        ref={refs[2]}
        required
      />
      <input
        type="text"
        className={style.input}
        onChange={handlerNumber}
        value={value[3]}
        data-id="3"
        ref={refs[3]}
        required
      />
      <input
        type="text"
        className={style.input}
        onChange={handlerNumber}
        value={value[4]}
        data-id="4"
        ref={refs[4]}
        required
      />
      <input
        type="text"
        className={style.input}
        onChange={handlerNumber}
        value={value[5]}
        data-id="5"
        ref={refs[5]}
        required
      />
    </div>
  );
}

export default SixNumeric;
