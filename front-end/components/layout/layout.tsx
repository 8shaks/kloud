import React from "react";
import PropTypes from "prop-types";
import layoutStyles from "./layout.module.scss";
import Navbar from  "../navbar/index";

export interface layoutProps  { 
    children: React.ReactNode
 }

const Layout = ( props : layoutProps) => {
    return (
        <div className={layoutStyles.page}>
            <Navbar/>
        <main className={layoutStyles.main}>{props.children}</main>
        </div>
    )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
