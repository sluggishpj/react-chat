// 合并所有reducer 并且返回
import { combineReducers } from 'redux';
import { user } from './user.redux.js';
import {chatuser} from './chatuser.redux.js';
import {chat} from './chat.redux.js';

export default combineReducers({user, chatuser, chat});
