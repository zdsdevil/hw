import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

//注册
export const signUp = (data) => {
  return axios.request({
    url: '/auth/sign-up',
    method: 'post',
    data
  })
}

//获取商品类型列表
export const getGoodsType = () => {
  return axios.request({
    url: '/goods/type',
    method: 'get'
  })
}

//上传商品
export const uploadGoods = (data) => {
  return axios.request({
    url: '/security/goods',
    method: 'post',
    data
  })
}

//查询商品
export const queryGoods = (type,goodsName, pageSize, pageNo) => {
  return axios.request({
    url: `/goods?type=${type}&goodsName=${goodsName}&pageSize=${pageSize}&pageNo=${pageNo}`,
    method: 'get'
  })
}

//商品详情
export const getGoodsDetail = (id) => {
  return axios.request({
    url: `/goods/${id}`,
    method: 'get'
  })
}

//评价商品
export const comment = (id,data) => {
  return axios.request({
    url: `/security/comment/${id}`,
    method: 'post',
    data
  })
}

//获取商品评价
export const getGoodsComment = (id) => {
  return axios.request({
    url: `/comment/${id}`,
    method: 'get'
  })
}

//租借商品
export const order = (data) => {
  return axios.request({
    url: `/security/order`,
    method: 'post',
    data
  })
}
