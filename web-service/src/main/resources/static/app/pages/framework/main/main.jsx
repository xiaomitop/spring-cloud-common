import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react'
import {
    BrowserRouter,
    Route
} from 'react-router-dom';

import MainLayout from '../layout/MainLayout.jsx';

import mainStore from './MainStore';
import mainLayoutStore from '../layout/MainLayoutStore';
import userStore from '../user/UserStore';
import roleStore from '../role/RoleStore';
import permissionStore from '../permission/PermissionStore';
import customContentStore from '../../modules/cms/content/CustomContentStore';

const stores = {mainStore, mainLayoutStore, userStore, roleStore, permissionStore, customContentStore};
const RouterList = () => (
    <Provider {...stores}>
        <BrowserRouter>
            <div>
                <Route path="/main" component={MainLayout}/>
            </div>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(
    (<RouterList/>),
    document.getElementById('root')
);