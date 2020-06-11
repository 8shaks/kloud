import Head from 'next/head';
import registerStyles from"./register.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";

const Home = () => {
  return (
    <Layout>
      <div className={registerStyles.page}>
          <h1 className={registerStyles.heading}>Register</h1>
        <form  className={registerStyles.form}>
            <input placeholder="Email" />
            <input placeholder="Username"/>
            <input placeholder="Password" />
            <input placeholder="Reenter Password" />
            <div><button className={registerStyles.registerButton} type="submit">Register</button><Link href="/register" ><a className={registerStyles.loginButton}>Login</a></Link></div>
        </form>
      </div>
    </Layout>
  )
}

export default Home