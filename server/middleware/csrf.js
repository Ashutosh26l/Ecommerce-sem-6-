import crypto from "crypto";

const CSRF_COOKIE = "csrfToken";

const isUnsafeMethod = (method) => ["POST", "PUT", "PATCH", "DELETE"].includes(method);

export const ensureCsrfToken = (req, res, next) => {
  let token = req.cookies?.[CSRF_COOKIE];

  if (!token) {
    token = crypto.randomBytes(32).toString("hex");
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  res.locals.csrfToken = token;
  next();
};

export const verifyCsrfToken = (req, res, next) => {
  if (!isUnsafeMethod(req.method)) return next();

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const formToken = req.body?._csrf;
  const headerToken = req.headers["x-csrf-token"];
  const requestToken = formToken || headerToken;

  if (!cookieToken || !requestToken || cookieToken !== requestToken) {
    return res.status(403).send("Invalid CSRF token");
  }

  next();
};
