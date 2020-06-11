import Head from 'next/head';
import loginStyles from"./login.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";

const Home = () => {
  return (
    <Layout>
      <div className={loginStyles.page}>
          <h1 className={loginStyles.heading}>Sign In</h1>
        <form  className={loginStyles.form}>
            <input placeholder="Username"/>
            <input placeholder="Password" />
            <div><button className={loginStyles.loginButton} type="submit">Login</button><Link href="/register" ><a className={loginStyles.registerButton}>Register</a></Link></div>
        </form>
      </div>
    </Layout>
  )
}

export default Home