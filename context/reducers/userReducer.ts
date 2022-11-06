import * as api from '../../api'
import { ILogin, ISingUp } from "../../types/user";
import { Dispatch } from '@reduxjs/toolkit'
import { SING_UP_USER, LOGIN_USER, LOGOUT_USER, ERROR } from '../slices/userSlice'
import Router from 'next/router'

export const singUp = (data: ISingUp) => async (dispatch: Dispatch) => {
  try {
    await api.singUp(data).then(({ data }) => dispatch(SING_UP_USER(data))).catch((err: any) => dispatch(ERROR(err.error)));
  } catch (err: any) {
    dispatch(ERROR(err.massage));
  }
};


export const login = (data: ILogin) => async (dispatch: Dispatch) => {
  try {
    await api.login(data).then(({ data }) => dispatch(LOGIN_USER(data))).catch((err: any) => dispatch(ERROR(err.error)));
  } catch (err: any) {
    dispatch(ERROR(err.massage));
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  try {
    await api.Logout().then(({ data }) => dispatch(LOGOUT_USER(data))).catch((err: any) => dispatch(ERROR(err.error)));
    localStorage.removeItem("user")
    Router.push("/login");
  } catch (err: any) {
    dispatch(ERROR(err.massage));
  }
};