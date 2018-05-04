import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import {
    Route,
    Link
} from 'react-router-dom';
import {Layout, Menu, Breadcrumb, Icon, Avatar, Badge} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const {Header, Content, Sider} = Layout;

import UserView from '../../../pages/framework/user/UserView.jsx';
import RoleView from '../../../pages/framework/role/RoleView.jsx';
import PermissionView from '../../../pages/framework/permission/PermissionView.jsx';
import WrappedRegistrationForm from '../../../pages/modules/cms/style/EditorStyle.jsx';
import CustomContentView from '../../../pages/modules/cms/content/CustomContentView.jsx';

import style from './layout.css'
import logo from '../../images/logo.png'

@inject('mainStore', 'mainLayoutStore')
@observer
class MainLayout extends Component {
    constructor(props) {
        super(props);
        this.props.mainLayoutStore.queryUserInfo(this.props.mainStore);
    }

    renderTreeNodes = (data, parentBre) => {
        return data.map((item) => {
            //组合面包屑
            let breadcrumb = [];
            if (parentBre) {
                breadcrumb = breadcrumb.concat(parentBre);
            }
            if (item.children) {
                breadcrumb.push({name: item.name, key: item.id});
                return (
                    <SubMenu key={item.id}
                             title={
                                 <span>
                                    {item.menuIcon ?
                                        <Icon style={{fontSize: 15}} type={item.menuIcon}/> : ''}{item.name}
                                 </span>
                             }>
                        {this.renderTreeNodes(item.children, breadcrumb)}
                    </SubMenu>
                );
            }
            breadcrumb.push({name: item.name, key: item.id});
            item.breadcrumb = breadcrumb;
            return (<Menu.Item key={item.id} {...item} dataRef={item}>
                <Link to={item.url}>
                    {item.name}
                </Link>
            </Menu.Item>);
        });
    };

    breadcrumbView = (data) => {
        return data.map((item) => {
            return (<Breadcrumb.Item key={item.key}>{item.name}</Breadcrumb.Item>)
        });
    };

    render() {
        const {roleMenu, menuOnClick, breadcrumb, headMenuOnClick} = this.props.mainLayoutStore;
        const {userInfo} = this.props.mainStore;
        return (
            <Layout>
                <Header className="header">
                    <div className={style.logo}>
                        <img src={logo}/>
                        <strong>管理系统</strong>
                    </div>
                    <Menu
                        onClick={headMenuOnClick}
                        className={style.head_menu}
                        mode="horizontal"
                    >
                        <Menu.Item key="message">
                            <Icon style={{color: 'white', fontSize: 16}} type="message"/>
                            <strong style={{
                                fontSize: '14px',
                                marginLeft: '-5px',
                                color: 'white'
                            }}>消息通知</strong>
                            <Badge count={109} style={{marginBottom: 5, marginLeft: 5}}/>
                        </Menu.Item>
                        <SubMenu title={<div>
                            <Avatar style={{marginBottom: '-10px'}}
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                            <strong style={{
                                fontSize: '14px',
                                color: 'white',
                                marginLeft: '5px'
                            }}>{userInfo ? userInfo.nickName : ''}</strong>
                        </div>}>
                            <MenuItemGroup title="用户中心">
                                <Menu.Item key="setting:2">个人信息</Menu.Item>
                                <Menu.Item key="logout">
                                    <span style={{color: 'red'}}>退出登录</span>
                                </Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                    </Menu>
                </Header>

                <Layout>
                    <Sider width={200} style={{background: '#fff'}}>
                        <Menu
                            mode="inline"
                            style={{height: '100%', borderRight: 0}}
                            onClick={menuOnClick}
                        >
                            {this.renderTreeNodes(roleMenu.slice())}
                        </Menu>
                    </Sider>
                    <Layout style={{padding: '0px 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            {this.breadcrumbView(breadcrumb.slice())}
                        </Breadcrumb>
                        <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                            <Route path={'/main/UserView'} component={UserView}/>
                            <Route path={'/main/RoleView'} component={RoleView}/>
                            <Route path={'/main/PermissionView'} component={PermissionView}/>
                            <Route path={'/main/TestView'} component={WrappedRegistrationForm}/>
                            <Route path={'/main/CustomContentView'} component={CustomContentView}/>
                            <Route exact path={'/main'} render={() => (
                                <h3>欢迎使用</h3>
                            )}/>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default MainLayout;
