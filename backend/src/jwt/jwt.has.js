import jwt from "jsonwebtoken"
const verify = (token,secret) => {
    return jwt.verify(token,secret)
}
const sign = (token,secret,exp) => {
    
   // console.log("++++++")
    return jwt.sign(token,secret,exp)}

export default {sign,verify}