import './styles/global.scss';
import {Provider} from 'react-redux';
import React from 'react';
import App from 'next/app';
import {  NextPageContext, NextComponentType } from 'next';
import withRedux from "next-redux-wrapper";
import store from '../redux/store';


interface test {
  Component: NextComponentType,
  ctx:NextPageContext
}
class MyApp extends App {
  static async getInitialProps({Component, ctx}:test) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return {pageProps: pageProps};
  }

  render(){
    const {Component, pageProps} = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    )
    }
}
const makeStore = () => store;
export default withRedux(makeStore)(MyApp);