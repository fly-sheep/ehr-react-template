import React from 'react';
import { withRouter } from 'react-router-dom';
import { isInteger } from '@/utils/index.jsx';
import './index.less';

console.log(isInteger(123));
function Home(props) {
    return <div className="m-home">首页</div>;
}

export default withRouter(Home);
