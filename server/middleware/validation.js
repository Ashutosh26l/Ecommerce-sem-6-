import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  description: Joi.string().allow("").default(""),
  dateCreated: Joi.number().required(),
  warranty: Joi.number().min(0).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).default(0),
  image: Joi.string().allow("").optional(),
});

export const reviewSchema = Joi.object({
  userName: Joi.string().trim().min(2).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().min(2).required(),
});

const buildMessage = (details) => details.map((item) => item.message).join(", ");

export const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false, convert: true });
  if (error) {
    return res.status(400).render("error", {
      statusCode: 400,
      message: buildMessage(error.details),
    });
  }
  return next();
};

export const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false, convert: true });
  if (error) {
    return res.status(400).render("error", {
      statusCode: 400,
      message: buildMessage(error.details),
    });
  }
  return next();
};
