import React from 'react';
import { Route } from 'react-router-dom';
import { IRoutes } from './IRoutes';

export const RouteWithSubRoutes = (route: IRoutes) => 
    <Route
        path={route.path}
        render={props => 
            <route.component {...props} />
        }
    />