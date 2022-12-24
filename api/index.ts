import axios from 'axios';
import { ICreateComment } from '../types/comment';
import { ICreateProduct, IUpdateProduct, SortByType } from '../types/product';
import { ISale } from '../types/sale';
import { ILogin, ISingUp } from '../types/user'
import { ICreateFeedback } from '../types/rate';

let baseURL = 'http://localhost:3000/api'
let ISSERVER = typeof window === "undefined";

if (process.env.NODE_ENV === "production" && !ISSERVER) baseURL = `https://${window.location.host}/api`;

const API = axios.create({ baseURL: baseURL })

export const singUp = async (data: ISingUp) => await API.post("/auth/sign-up", data)

export const login = async (data: ILogin) => await API.post("/auth/login", data)

export const Logout = async () => await API.get("/auth/logout")

export const createProduct = async (data: ICreateProduct) => await API.post("/admin/product", data)

export const getCategoriesAndTags = async () => await API.get("/admin/product")

export const getProducts = async (skip: number, take: number, filter: string | null, sortBy: SortByType) =>
 await API.get(`/product?sortBy=${sortBy}&skip=${skip}&take=${take}&filter=${filter}`)

export const GetProductsLength = async (filter: string | null) => await API.get(`/product?filter=${filter}&get-length=${true}`)

export const getLikes = async (productId: number) => await API.get(`/like/?id=${productId}`);

export const likeProduct = async (productId: number) => await API.patch(`/like/?id=${productId}`);

export const getCartProducts = async (productsIds: number[]) => await API.post(`/cart`, { ids: productsIds });

export const getHistoryOrders = async (skip: number, take: number) => await API.get(`history-orders/?skip=${skip}&take=${take}`)

export const getProductsTable = async (skip: number, take: number) => await API.get(`products/?skip=${skip}&take=${take}`)

export const getUsers = async (skip: number, take: number) => await API.get(`users/?skip=${skip}&take=${take}`)

export const getProductToUpdate = async (id: number) => await API.get(`admin/product?id=${id}`)

export const deleteProduct = async (id: number) => await API.delete(`admin/product?id=${id}`)

export const updateProduct = async (id: number, data: IUpdateProduct) => await API.patch(`admin/product?id=${id}`, data)

export const checkoutSessions = async (data: ISale[]) => await API.post("checkout_sessions", data)

export const generalSearch = async (search: string, skip: number, take: number) => await API.get(`/search?search=${search}&skip=${skip}&take=${take}`)

export const SearchByTag = async (tag: string, skip: number, take: number) => await API.get(`/search?tag=${tag}&skip=${skip}&take=${take}`)

export const SearchByCategory = async (category: string, skip: number, take: number) => await API.get(`/search?category=${category}&skip=${skip}&take=${take}`)

export const GetSearchLength = async (type: "category" | "tag" | "search", value: string) => await API.get(`/search?${type}=${value}&get-length=${true}`)

export const getStatus = async () => await API.get("/admin/dashboard/status")

export const getUsersPayers = async () => await API.get("/admin/dashboard/users-payments-chart")

export const getProductsAverageRate = async () => await API.get("/admin/dashboard/products-rate")

export const getFeedBacks = async (productId: number) => await API.get(`/rate/?id=${productId}`);

export const createFeedBack = async (productId: number, data: ICreateFeedback) => await API.post(`/feed-back/?id=${productId}`, data)

export const updateFeedBack = async (feedBackId: number, data: ICreateFeedback) => await API.patch(`/feed-back/?id=${feedBackId}`, data)

export const deleteFeedBack = async (feedBackId: number) => await API.delete(`/feed-back/?id=${feedBackId}`)