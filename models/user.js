import database from "infra/database.js";
import password from "./password";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueUserName(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);
  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(user) {
    const results = await database.query({
      text: `INSERT INTO users 
            (username, email, password) 
           VALUES 
            ($1,$2,$3) 
           RETURNING
             *;`,
      values: [user.username, user.email, user.password],
    });

    return results.rows[0];
  }
}
async function findOnebyUsername(username) {
  const foundUser = await runSelectQuery(username);
  return foundUser;

  async function runSelectQuery(name) {
    const results = await database.query({
      text: `SELECT 
              *
             FROM
              users
             WHERE
              LOWER(username) = LOWER($1)
              ;`,
      values: [name],
    });
    if (results.rowCount === 0) {
      const publicError = new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "verifique se o username está digitado corretamente.",
      });
      throw publicError;
    }
    return results.rows[0];
  }
}
async function update(username, userInputValues) {
  const currentUser = await findOnebyUsername(username);
  if ("username" in userInputValues) {
    await validateUniqueUserName(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }
  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  console.log(userWithNewValues);
  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: ` UPDATE
                users
              SET
                username = $2,
                email = $3,
                password = $4,
                updated_at = timezone('utc', now())
              WHERE 
                id = $1
              RETURNING
                *;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });
    return results.rows[0];
  }
}
async function validateUniqueUserName(name) {
  const results = await database.query({
    text: `SELECT 
              username
             FROM
              users
             WHERE
              LOWER(username) = LOWER($1)
              ;`,
    values: [name],
  });
  if (results.rowCount > 0) {
    const publicError = new ValidationError({
      message: "O userName informado já está sendo utilizado.",
      action: "Utilize outro userName para esta operação.",
      cause: "Duplicação de userName no banco de dados.",
    });
    throw publicError;
  }
}
async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `SELECT 
              email
             FROM
              users
             WHERE
              LOWER(email) = LOWER($1)
              ;`,
    values: [email],
  });
  if (results.rowCount > 0) {
    const publicError = new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
      cause: "Duplicação de email no banco de dados.",
    });
    throw publicError;
  }
}
async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
  console.log(userInputValues.password);
}

const user = {
  create,
  findOnebyUsername,
  update,
};

export default user;
