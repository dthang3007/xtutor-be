const models = require("../models");
const { signupValid, siginValid } = require("../helpers/validation_schema");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const user = {
    ...req.body,
  };
  //validate
  const { error } = signupValid(user);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: error?.details[0]?.message });
  }

  //checking email exists
  try {
    const emailExists = await models.User.findOne({
      where: { email: user.email },
    });
    if (emailExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    //add data
    await models.User.create({ ...user, password: hashPassword, dcm: "dcmmm" });
    res.status(StatusCodes.OK).send({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: error });
  }
};

const signin = async (req, res) => {
  const accountLogin = {
    ...req.body,
  };
  const { error } = siginValid(accountLogin);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
  }

  const user = await models.User.findOne({ where: { email: accountLogin.email } });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Email does not exists" });
  }
  const validPass = await bcrypt.compare(accountLogin?.password, user.password);
  if (!validPass) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Passwords is not valid" });
  }
  const token = jwt.sign({id: user.id},process.env.TOKEN_SECRET)
  res.header('auth-token',token).send(token);
};
module.exports = { signup, signin };
