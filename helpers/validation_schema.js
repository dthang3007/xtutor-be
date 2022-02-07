const Joi = require("joi");

const siginValid = (data) => {
  const authSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  return authSchema.validate(data);
};

const signupValid=(data)=>{
  const authSchema = Joi.object({
    last_name:Joi.string().required(),
    first_name:Joi.string().required(),
    email:Joi.string().required().email(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phone_number:Joi.string().pattern(new RegExp('(84|0[3|5|7|8|9])+([0-9]{8})')).required(),
    roles_id:Joi.required()
  })
  return authSchema.validate(data)
}

module.exports = { siginValid,signupValid };
