import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer'; //发邮件
import User from '../dbs/models/users';
import Passport from './utils/passport';
import Email from '../dbs/config';
import axios from './utils/axios'

let router = new Router({
  prefix: './users'
})

let Store = new Redis().client;