const repo = require("../repo/auth");


const { root, jwt: jwtConf } =  require("../config.load");


const errExep = require("../errExep");
const jwt = require("jsonwebtoken");

exports.create_root = async () => {
  try {
    
   const result =  await repo.create_by_id(-1, root.username, root.password, 0);
    console.log(result);
  } catch (error) {
   // console.log("Root user already exists");
  }
};



exports.create = async (username, password, role) => {
  if (!(role == 2 || role == 1)) {
    throw new Error(errExep.ROLE_INVALID);
  }
  const userCheck = await repo.get_by_username(username); 
    if (userCheck.length > 0) {
      throw new Error(errExep.USER_USED);
    }

  let auth_id;
  try {
    auth_id = await repo.create(username, password, role);
    console.log(auth_id);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error(errExep.USER_USED);
    }
  }
  return { id: auth_id, username: username, role };
};

exports.login = async (username, password) => {
 

    const userDB = await repo.get_by_username(username);

    if (userDB.length == 0) {
      throw new Error(errExep.USER_NOT_FOUND);
    }
    if (password != userDB[0].password) {
      throw new Error(errExep.PASSWORD_INVALID);
    }
  const payload = { id: userDB[0].id, username: username, role: userDB[0].role };
  

  const secret = jwt.sign(payload, jwtConf.secret, { expiresIn: "1d" });

  return { payload, token: secret };
};

exports.me = async (token) => {
  let decode;
  try {
    decode = jwt.verify(token, jwtConf.secret);
  } catch (error) {
    console.log(error);

    throw new Error(errExep.TOKEN_INVALID);
  }

  if (decode.username != root.username) {
    const userDB = await repo.get_by_id(decode.id);

    if (userDB.length == 0) {
      throw new Error(errExep.USER_NOT_FOUND);
    }
  }
  return decode;
};

exports.listing = async (page, per_page) => {
  return await repo.listing(page, per_page);
};

exports.remove = async (auth_id) => {
  return await repo.remove_by_id(auth_id);
};

exports.update = async (auth_id, username, password, role) => {
  if (!(role == 2 || role == 1)) {
    throw new Error(errExep.ROLE_INVALID);
  }
    const userCheck = await repo.get_by_username(username); 
    console.log(userCheck)
    if (userCheck.length > 0 && userCheck[0].id != auth_id) {
      throw new Error(errExep.USER_USED);
    }



  return await repo.update( auth_id, username, password, role);
};