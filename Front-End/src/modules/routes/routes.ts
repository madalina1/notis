import Home from '../index';
import { IRoutes } from './IRoutes';


export const routes:IRoutes[] = [
    {
      path: "/",
      component: Home,
      exact: true
    },
    {
      path: "/notaries",
      component: Home,
      exact: true
    },
    {
      path: "/translators",
      component: Home,
      exact: true
    }
];