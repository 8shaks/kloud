
import React, { useState } from "react";
import PropTypes from "prop-types";
import navbarStyles from "./navbar.module.scss";
import Link from "next/link";
import { connect } from "react-redux";
import { logoutUser } from '../../redux/actions/authActions'

interface Props{
    auth: {isAuthenticated: boolean, user:{ user:{id:string, username: string}}},
    logoutUser:any
}
const Navbar = (props:Props) => {
    const [navbarClass, setNavbarClass] = useState("");
    const toggleNavbar = () => {
        if (navbarClass === ""){
            setNavbarClass(navbarStyles.active);
        }else{
            setNavbarClass("");
        }
    }
    let navbarOptions;
    if(props.auth.isAuthenticated){
        navbarOptions = (
            <ul className={navbarStyles.linksList}>
                <li className={navbarStyles.logo + " " + navbarClass} ><Link href="/"><a><img className={navbarStyles.logo} src="/images/logo.png"/>Kloud</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><Link href="/about-us"><a>About Us</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><Link href="/explore"><a>Explore</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><Link href="/my-collabs"><a>Collabs</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass} ><Link href="/create-post"><a>Make a post</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><Link  href={`/profiles/me`} ><a>Profile</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><a onClick={props.logoutUser}>Sign Out</a></li>
                <li className={navbarStyles.toggle}> <a onClick={toggleNavbar} >Toggle</a></li>
            </ul>
        )
    }else{
        navbarOptions = (
            <ul className={navbarStyles.linksList}>
                <li className={navbarStyles.logo + " " + navbarClass} ><Link href="/"><a><img className={navbarStyles.logo} src="/images/logo.png"/>Kloud</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><Link href="/about-us"><a>About Us</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><Link href="/explore"><a>Explore</a></Link></li>
                <li className={navbarStyles.item + " " + navbarClass}><Link href="/login"><a>Sign In</a></Link></li>
                <li className={navbarStyles.item + " " + navbarStyles.getKloudButton + " " + navbarClass}><Link href="/register"><a className={""}>Register Today</a></Link></li>
                <li className={navbarStyles.toggle}> <a onClick={toggleNavbar} >Toggle</a></li>
            </ul>
        )
    }
    return (
        <nav className={navbarStyles.navbar}>
            {navbarOptions}
        </nav>
    )
}


const mapStateToProps = (state: Props) => ({
    auth: state.auth,
  });
  
  export default connect(
    mapStateToProps,
    {logoutUser}
  )(Navbar);
