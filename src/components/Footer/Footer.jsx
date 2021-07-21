import React from "react";
import * as style from "./Footer.module.scss";
import { FacebookIcon, InstagramIcon } from "../../helpers/customIcon";

function Footer() {

  return (
    <footer className={style.footer}>
      <p className={style.copyright}>© The BM Revolution {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;
