import React, { Component } from 'react'
import './smtp.css'

module.exports = function (options) {

  const SmtpComponent = () => (<form id="smtplogin" action="/api/user/login_by_token" method="POST">
    <input type="text" placeholder="Email" name="email" className="ant-input" />
    <input type="password" placeholder="Password" name="password" className="ant-input" />
    <button type="submit" className="btn-home btn-home-normal" >邮箱 登录</button>
    </form>
  )

  this.bindHook('third_login', SmtpComponent);
};










