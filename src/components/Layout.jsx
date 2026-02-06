import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <>
            <div className="crt-overlay"></div>
            <div className="pixel-container">
                {children || <Outlet />}
            </div>
        </>
    );
};

export default Layout;
