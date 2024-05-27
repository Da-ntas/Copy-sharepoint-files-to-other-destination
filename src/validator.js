import { ZodError } from "zod";

function validateSchema (schema) {
    return (req, res, next) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ errors: error.errors });
        }
        next(error);
      }
    };
};
  
export {
  validateSchema
}